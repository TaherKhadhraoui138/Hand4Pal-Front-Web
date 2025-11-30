import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { CampaignService } from '../services/campaign.service';
import { 
    Campaign, 
    CampaignCreateRequest, 
    CampaignUpdateRequest,
    CampaignCategory 
} from '../models/campaign.models';

@Injectable({
    providedIn: 'root'
})
export class CampaignViewModel {
    // Loading state
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    // Error state
    private errorSubject = new BehaviorSubject<string | null>(null);
    public error$ = this.errorSubject.asObservable();

    // Success message state
    private successSubject = new BehaviorSubject<string | null>(null);
    public success$ = this.successSubject.asObservable();

    // Active campaigns list
    private campaignsSubject = new BehaviorSubject<Campaign[]>([]);
    public campaigns$ = this.campaignsSubject.asObservable();

    // Filtered campaigns (by category)
    private filteredCampaignsSubject = new BehaviorSubject<Campaign[]>([]);
    public filteredCampaigns$ = this.filteredCampaignsSubject.asObservable();

    // Current campaign (for details page)
    private currentCampaignSubject = new BehaviorSubject<Campaign | null>(null);
    public currentCampaign$ = this.currentCampaignSubject.asObservable();

    // My campaigns (for association dashboard)
    private myCampaignsSubject = new BehaviorSubject<Campaign[]>([]);
    public myCampaigns$ = this.myCampaignsSubject.asObservable();

    // Pending campaigns (for admin)
    private pendingCampaignsSubject = new BehaviorSubject<Campaign[]>([]);
    public pendingCampaigns$ = this.pendingCampaignsSubject.asObservable();

    // Active filter
    private activeFilterSubject = new BehaviorSubject<CampaignCategory | 'ALL'>('ALL');
    public activeFilter$ = this.activeFilterSubject.asObservable();

    constructor(
        private campaignService: CampaignService,
        private router: Router
    ) {}

    // ============================================
    // Public Campaign Methods
    // ============================================

    /**
     * Load all active campaigns (only if not already loaded or force refresh)
     */
    loadActiveCampaignsIfNeeded(): void {
        const existingCampaigns = this.campaignsSubject.value;
        
        // If we already have campaigns, just apply the filter and skip loading
        if (existingCampaigns.length > 0) {
            this.applyFilter(this.activeFilterSubject.value);
            return;
        }

        // Otherwise, load from API
        this.loadActiveCampaigns();
    }

    /**
     * Load all active campaigns (always fetches from API)
     */
    loadActiveCampaigns(): void {
        this.setLoading(true);
        this.clearMessages();

        this.campaignService.getActiveCampaigns().subscribe({
            next: (campaigns) => {
                this.campaignsSubject.next(campaigns);
                this.applyFilter(this.activeFilterSubject.value);
                this.setLoading(false);
            },
            error: (error) => {
                this.handleError(error);
                this.setLoading(false);
            }
        });
    }

    /**
     * Load campaign by ID
     */
    loadCampaignById(campaignId: number): void {
        this.setLoading(true);
        this.clearMessages();

        this.campaignService.getCampaignById(campaignId).subscribe({
            next: (campaign) => {
                this.currentCampaignSubject.next(campaign);
                this.setLoading(false);
            },
            error: (error) => {
                this.handleError(error);
                this.setLoading(false);
                // Navigate back to campaigns if not found
                if (error.status === 404) {
                    this.router.navigate(['/campaigns']);
                }
            }
        });
    }

    /**
     * Filter campaigns by category
     */
    filterByCategory(category: CampaignCategory | 'ALL'): void {
        this.activeFilterSubject.next(category);
        this.applyFilter(category);
    }

    private applyFilter(category: CampaignCategory | 'ALL'): void {
        const campaigns = this.campaignsSubject.value;
        
        if (category === 'ALL') {
            this.filteredCampaignsSubject.next([...campaigns]);
        } else {
            this.filteredCampaignsSubject.next(
                campaigns.filter(c => c.category === category)
            );
        }
    }

    // ============================================
    // Association Campaign Methods
    // ============================================

    /**
     * Load my campaigns (for logged-in association)
     */
    loadMyCampaigns(): void {
        this.setLoading(true);
        this.clearMessages();

        this.campaignService.getMyCampaigns().subscribe({
            next: (campaigns) => {
                this.myCampaignsSubject.next(campaigns);
                this.setLoading(false);
            },
            error: (error) => {
                this.handleError(error);
                this.setLoading(false);
            }
        });
    }

    /**
     * Create a new campaign
     */
    async createCampaign(data: CampaignCreateRequest): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            await this.campaignService.createCampaign(data).toPromise();
            this.setSuccess('Campaign created successfully! It will be reviewed by an administrator.');
            this.setLoading(false);

            // Redirect to association dashboard after delay
            setTimeout(() => {
                this.router.navigate(['/association-dashboard']);
            }, 2000);

            return true;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    /**
     * Update an existing campaign
     */
    async updateCampaign(campaignId: number, data: CampaignUpdateRequest): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            const updated = await this.campaignService.updateCampaign(campaignId, data).toPromise();
            if (updated) {
                this.currentCampaignSubject.next(updated);
                // Update in my campaigns list
                const myCampaigns = this.myCampaignsSubject.value;
                const index = myCampaigns.findIndex(c => c.id === campaignId);
                if (index !== -1) {
                    myCampaigns[index] = updated;
                    this.myCampaignsSubject.next([...myCampaigns]);
                }
            }
            this.setSuccess('Campaign updated successfully!');
            this.setLoading(false);
            return true;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    // ============================================
    // Admin Campaign Methods
    // ============================================

    /**
     * Load pending campaigns (admin only)
     */
    loadPendingCampaigns(): void {
        this.setLoading(true);
        this.clearMessages();

        this.campaignService.getPendingCampaigns().subscribe({
            next: (campaigns) => {
                this.pendingCampaignsSubject.next(campaigns);
                this.setLoading(false);
            },
            error: (error) => {
                this.handleError(error);
                this.setLoading(false);
            }
        });
    }

    /**
     * Approve a campaign (admin only)
     */
    async approveCampaign(campaignId: number): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            await this.campaignService.approveCampaign(campaignId).toPromise();
            // Remove from pending list
            const pending = this.pendingCampaignsSubject.value.filter(c => c.id !== campaignId);
            this.pendingCampaignsSubject.next(pending);
            this.setSuccess('Campaign approved successfully!');
            this.setLoading(false);
            return true;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    /**
     * Reject a campaign (admin only)
     */
    async rejectCampaign(campaignId: number): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            await this.campaignService.rejectCampaign(campaignId).toPromise();
            // Remove from pending list
            const pending = this.pendingCampaignsSubject.value.filter(c => c.id !== campaignId);
            this.pendingCampaignsSubject.next(pending);
            this.setSuccess('Campaign rejected.');
            this.setLoading(false);
            return true;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Get current campaign value (synchronous)
     */
    getCurrentCampaign(): Campaign | null {
        return this.currentCampaignSubject.value;
    }

    /**
     * Clear current campaign
     */
    clearCurrentCampaign(): void {
        this.currentCampaignSubject.next(null);
    }

    private setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    private setError(message: string): void {
        this.errorSubject.next(message);
    }

    private setSuccess(message: string): void {
        this.successSubject.next(message);
    }

    private clearMessages(): void {
        this.errorSubject.next(null);
        this.successSubject.next(null);
    }

    private handleError(error: any): void {
        console.error('Campaign error:', error);
        
        if (error.status === 0) {
            this.setError('Unable to connect to the server. Please check your connection.');
        } else if (error.status === 401) {
            this.setError('You need to be logged in to perform this action.');
        } else if (error.status === 403) {
            this.setError('You do not have permission to perform this action.');
        } else if (error.status === 404) {
            this.setError('Campaign not found.');
        } else if (error.error?.message) {
            this.setError(error.error.message);
        } else {
            this.setError('An unexpected error occurred. Please try again.');
        }
    }
}
