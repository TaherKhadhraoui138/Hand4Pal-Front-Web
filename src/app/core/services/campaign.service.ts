import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { Campaign, CampaignCreateRequest, CampaignUpdateRequest } from '../models/campaign.models';

@Injectable({
    providedIn: 'root'
})
export class CampaignService {
    private readonly API_URL = 'http://localhost:8080/api/campaigns';
    private readonly TIMEOUT_MS = 10000; // 10 second timeout

    constructor(private http: HttpClient) {}

    /**
     * Create a new campaign (Association only)
     * POST /campaigns
     */
    createCampaign(campaign: CampaignCreateRequest): Observable<Campaign> {
        return this.http.post<Campaign>(this.API_URL, campaign).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get all active campaigns with association details (public)
     * GET /campaigns/active/with-association
     */
    getActiveCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(`${this.API_URL}/active/with-association`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get campaign by ID with association details (public)
     * GET /campaigns/:id/with-association
     */
    getCampaignById(campaignId: number): Observable<Campaign> {
        return this.http.get<Campaign>(`${this.API_URL}/${campaignId}/with-association`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get campaign progress (public)
     * GET /campaigns/:id/progress
     */
    getCampaignProgress(campaignId: number): Observable<Campaign> {
        return this.http.get<Campaign>(`${this.API_URL}/${campaignId}/progress`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get campaigns by association ID (public)
     * GET /campaigns/association/:associationId
     */
    getCampaignsByAssociation(associationId: number): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(`${this.API_URL}/association/${associationId}`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get pending campaigns with association details (Admin only)
     * GET /campaigns/pending/with-association
     */
    getPendingCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(`${this.API_URL}/pending/with-association`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get my campaigns with association details (Association - current user's campaigns)
     * GET /campaigns/my-campaigns/with-association
     */
    getMyCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(`${this.API_URL}/my-campaigns/with-association`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Approve campaign (Admin only)
     * PUT /campaigns/:id/approve
     */
    approveCampaign(campaignId: number): Observable<Campaign> {
        return this.http.put<Campaign>(`${this.API_URL}/${campaignId}/approve`, {}).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Reject campaign (Admin only)
     * PUT /campaigns/:id/reject
     */
    rejectCampaign(campaignId: number): Observable<Campaign> {
        return this.http.put<Campaign>(`${this.API_URL}/${campaignId}/reject`, {}).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Update campaign
     * PUT /campaigns/:id
     */
    updateCampaign(campaignId: number, campaign: CampaignUpdateRequest): Observable<Campaign> {
        return this.http.put<Campaign>(`${this.API_URL}/${campaignId}`, campaign).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Handle timeout errors
     */
    private handleTimeout = (error: any): Observable<never> => {
        if (error.name === 'TimeoutError') {
            return throwError(() => new Error('Request timed out. Please check your connection and try again.'));
        }
        return throwError(() => error);
    };
}
