import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Donation, DonationRequest } from '../models/donation.models';

/**
 * Service pour la gestion des donations
 * Communique avec le backend Spring Boot via le gateway
 */
@Injectable({
    providedIn: 'root'
})
export class DonationService {
    private readonly API_URL = 'http://localhost:8080/api/donations';
    private readonly TIMEOUT_MS = 10000; // 10 seconds timeout

    constructor(private http: HttpClient) {}

    /**
     * Créer un nouveau don
     * Le userId est extrait automatiquement du JWT côté backend
     * @param request Les détails du don (amount, currency, campaignId)
     */
    createDonation(request: DonationRequest): Observable<Donation> {
        return this.http.post<Donation>(this.API_URL, request).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }

    /**
     * Récupérer tous les dons (admin seulement)
     */
    getAllDonations(): Observable<Donation[]> {
        return this.http.get<Donation[]>(this.API_URL).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }

    /**
     * Récupérer un don par son ID
     * @param id L'identifiant du don
     */
    getDonationById(id: number): Observable<Donation> {
        return this.http.get<Donation>(`${this.API_URL}/${id}`).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }

    /**
     * Récupérer les dons de l'utilisateur connecté
     * Utilise le JWT pour identifier l'utilisateur
     */
    getMyDonations(): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.API_URL}/my-donations`).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }

    /**
     * Récupérer les dons d'un utilisateur spécifique (admin seulement)
     * @param userId L'identifiant de l'utilisateur
     */
    getDonationsByUser(userId: number): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.API_URL}/user/${userId}`).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }

    /**
     * Récupérer les dons pour une campagne spécifique
     * @param campaignId L'identifiant de la campagne
     */
    getDonationsByCampaign(campaignId: number): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.API_URL}/campaign/${campaignId}`).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }

    /**
     * Récupérer les dons pour toutes les campagnes de l'association connectée
     * (utilisé dans le profil association)
     */
    getMyCampaignsDonations(): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.API_URL}/my-campaigns`).pipe(
            timeout(this.TIMEOUT_MS)
        );
    }
}
