import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, finalize } from 'rxjs';
import { DonationService } from '../services/donation.service';
import { CampaignService } from '../services/campaign.service';
import { 
    Donation, 
    DonationRequest, 
    CampaignDonationStats,
    getDonorName 
} from '../models/donation.models';
import { Campaign } from '../models/campaign.models';

@Injectable({
    providedIn: 'root'
})
export class DonationViewModel {
    // ============================================
    // State Subjects
    // ============================================

    // Loading state
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    // Error state
    private errorSubject = new BehaviorSubject<string | null>(null);
    public error$ = this.errorSubject.asObservable();

    // Success message state
    private successSubject = new BehaviorSubject<string | null>(null);
    public success$ = this.successSubject.asObservable();

    // User's donations (for citizen profile)
    private myDonationsSubject = new BehaviorSubject<Donation[]>([]);
    public myDonations$ = this.myDonationsSubject.asObservable();

    // Total amount donated by user
    private totalDonatedSubject = new BehaviorSubject<number>(0);
    public totalDonated$ = this.totalDonatedSubject.asObservable();

    // Donations received by association's campaigns
    private receivedDonationsSubject = new BehaviorSubject<Donation[]>([]);
    public receivedDonations$ = this.receivedDonationsSubject.asObservable();

    // Total amount received by association
    private totalReceivedSubject = new BehaviorSubject<number>(0);
    public totalReceived$ = this.totalReceivedSubject.asObservable();

    // Donations for a specific campaign
    private campaignDonationsSubject = new BehaviorSubject<Donation[]>([]);
    public campaignDonations$ = this.campaignDonationsSubject.asObservable();

    // All donations (admin view)
    private allDonationsSubject = new BehaviorSubject<Donation[]>([]);
    public allDonations$ = this.allDonationsSubject.asObservable();

    // Track if data has been loaded
    private myDonationsLoaded = false;
    private receivedDonationsLoaded = false;

    constructor(
        private donationService: DonationService,
        private campaignService: CampaignService
    ) {}

    // ============================================
    // Donation Creation
    // ============================================

    /**
     * Créer un nouveau don
     * @param request Les détails du don (amount, currency, campaignId)
     * @returns Promise<Donation | null>
     */
    async createDonation(request: DonationRequest): Promise<Donation | null> {
        this.setLoading(true);
        this.clearMessages();

        try {
            const donation = await this.donationService.createDonation(request).toPromise();
            
            if (donation) {
                this.setSuccess(`Thank you for your generous donation of $${request.amount}!`);
                
                // Invalidate cached donations so they reload on next access
                this.myDonationsLoaded = false;
                
                this.setLoading(false);
                return donation;
            }
            
            this.setLoading(false);
            return null;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return null;
        }
    }

    // ============================================
    // User Donations (Citizen Profile)
    // ============================================

    /**
     * Charger les dons de l'utilisateur connecté
     * @param forceRefresh Forcer le rechargement même si les données existent
     */
    loadMyDonations(forceRefresh: boolean = false): void {
        if (this.myDonationsLoaded && !forceRefresh) {
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        this.donationService.getMyDonations()
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (donations) => {
                    this.myDonationsSubject.next(donations);
                    this.totalDonatedSubject.next(
                        donations.reduce((sum, d) => sum + d.amount, 0)
                    );
                    this.myDonationsLoaded = true;
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
    }

    /**
     * Vérifier si les dons de l'utilisateur sont déjà chargés
     */
    isMyDonationsLoaded(): boolean {
        return this.myDonationsLoaded;
    }

    // ============================================
    // Association Donations (Received)
    // ============================================

    /**
     * Charger les dons reçus par l'association (toutes ses campagnes)
     * @param forceRefresh Forcer le rechargement
     */
    loadReceivedDonations(forceRefresh: boolean = false): void {
        if (this.receivedDonationsLoaded && !forceRefresh) {
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        // D'abord, charger les campagnes de l'association
        this.campaignService.getMyCampaigns().subscribe({
            next: (campaigns) => {
                if (campaigns.length === 0) {
                    this.receivedDonationsSubject.next([]);
                    this.totalReceivedSubject.next(0);
                    this.setLoading(false);
                    this.receivedDonationsLoaded = true;
                    return;
                }

                // Charger les dons pour chaque campagne
                const donationRequests = campaigns.map(c => 
                    this.donationService.getDonationsByCampaign(c.id)
                );

                forkJoin(donationRequests)
                    .pipe(finalize(() => this.setLoading(false)))
                    .subscribe({
                        next: (donationArrays) => {
                            // Combiner tous les dons et ajouter les infos de campagne
                            const allDonations: Donation[] = [];
                            donationArrays.forEach((donations, index) => {
                                donations.forEach(donation => {
                                    donation.campaign = campaigns[index];
                                    allDonations.push(donation);
                                });
                            });

                            // Trier par date (plus récent en premier)
                            allDonations.sort((a, b) => 
                                new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
                            );

                            this.receivedDonationsSubject.next(allDonations);
                            this.totalReceivedSubject.next(
                                allDonations.reduce((sum, d) => sum + d.amount, 0)
                            );
                            this.receivedDonationsLoaded = true;
                        },
                        error: (error) => {
                            this.handleError(error);
                        }
                    });
            },
            error: (error) => {
                this.handleError(error);
                this.setLoading(false);
            }
        });
    }

    /**
     * Vérifier si les dons reçus sont déjà chargés
     */
    isReceivedDonationsLoaded(): boolean {
        return this.receivedDonationsLoaded;
    }

    // ============================================
    // Campaign Donations
    // ============================================

    /**
     * Charger les dons pour une campagne spécifique
     * @param campaignId L'identifiant de la campagne
     */
    loadDonationsByCampaign(campaignId: number): void {
        this.setLoading(true);
        this.clearMessages();

        this.donationService.getDonationsByCampaign(campaignId)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (donations) => {
                    this.campaignDonationsSubject.next(donations);
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
    }

    /**
     * Calculer les statistiques de dons pour une campagne
     * @param campaignId L'identifiant de la campagne
     */
    getCampaignDonationStats(campaignId: number): CampaignDonationStats {
        const donations = this.campaignDonationsSubject.value.filter(
            d => d.campaignId === campaignId
        );
        
        return {
            campaignId,
            totalDonations: donations.length,
            totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
            currency: donations[0]?.currency || 'DT'
        };
    }

    // ============================================
    // Admin Methods
    // ============================================

    /**
     * Charger tous les dons (admin seulement)
     */
    loadAllDonations(): void {
        this.setLoading(true);
        this.clearMessages();

        this.donationService.getAllDonations()
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (donations) => {
                    this.allDonationsSubject.next(donations);
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
    }

    /**
     * Charger les dons d'un utilisateur spécifique (admin seulement)
     * @param userId L'identifiant de l'utilisateur
     */
    loadDonationsByUser(userId: number): void {
        this.setLoading(true);
        this.clearMessages();

        this.donationService.getDonationsByUser(userId)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (donations) => {
                    this.allDonationsSubject.next(donations);
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
    }

    // ============================================
    // Utility Methods
    // ============================================

    /**
     * Obtenir le nom du donneur à partir d'un don
     * @param donation Le don
     */
    getDonorName(donation: Donation): string {
        return getDonorName(donation);
    }

    /**
     * Formater un montant en devise
     * @param amount Le montant
     * @param currency La devise (par défaut DT)
     */
    formatCurrency(amount: number, currency: string = 'DT'): string {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount) + ' DT';
    }

    /**
     * Réinitialiser les caches (à appeler après déconnexion par exemple)
     */
    resetCache(): void {
        this.myDonationsLoaded = false;
        this.receivedDonationsLoaded = false;
        this.myDonationsSubject.next([]);
        this.receivedDonationsSubject.next([]);
        this.campaignDonationsSubject.next([]);
        this.allDonationsSubject.next([]);
        this.totalDonatedSubject.next(0);
        this.totalReceivedSubject.next(0);
    }

    // ============================================
    // Private Methods
    // ============================================

    /**
     * Définir l'état de chargement
     */
    private setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Définir un message de succès
     */
    private setSuccess(message: string): void {
        this.successSubject.next(message);
    }

    /**
     * Définir un message d'erreur
     */
    private setError(message: string): void {
        this.errorSubject.next(message);
    }

    /**
     * Effacer les messages
     */
    private clearMessages(): void {
        this.errorSubject.next(null);
        this.successSubject.next(null);
    }

    /**
     * Gérer les erreurs HTTP
     */
    private handleError(error: any): void {
        console.error('DonationViewModel Error:', error);
        
        if (error.name === 'TimeoutError') {
            this.setError('The server took too long to respond. Please try again.');
            return;
        }

        if (error.status === 401) {
            this.setError('You must be logged in to perform this action.');
            return;
        }

        if (error.status === 403) {
            this.setError('You do not have permission to perform this action.');
            return;
        }

        if (error.status === 404) {
            this.setError('The requested resource was not found.');
            return;
        }

        const message = error.error?.message || error.message || 'An error occurred. Please try again.';
        this.setError(message);
    }
}
