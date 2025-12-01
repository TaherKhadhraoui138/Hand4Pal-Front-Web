import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { Comment, CommentRequestDTO, CampaignWithDetails } from '../models/comment.models';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private readonly API_URL = 'http://localhost:8084/comments';
    private readonly CAMPAIGN_API_URL = 'http://localhost:8080/api/campaigns';
    private readonly TIMEOUT_MS = 10000; // 10 second timeout

    constructor(private http: HttpClient) {}

    /**
     * Get all comments
     * GET /comments
     */
    getAllComments(): Observable<Comment[]> {
        return this.http.get<Comment[]>(this.API_URL).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get comments by campaign ID
     * GET /comments/campaign/:campaignId
     */
    getCommentsByCampaign(campaignId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.API_URL}/campaign/${campaignId}`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Create a new comment
     * POST /comments
     */
    createComment(comment: CommentRequestDTO, token: string): Observable<Comment> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<Comment>(this.API_URL, comment, { headers }).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Update a comment
     * PUT /comments/:id
     */
    updateComment(id: number, comment: CommentRequestDTO): Observable<Comment> {
        return this.http.put<Comment>(`${this.API_URL}/${id}`, comment).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Delete a comment (Admin only)
     * DELETE /comments/:id
     */
    deleteComment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleTimeout)
        );
    }

    /**
     * Get all active campaigns with comments and donations
     * Backend endpoint: GET /campaigns/active/with-details
     * Full URL: http://localhost:8080/api/campaigns/active/with-details
     * 
     * This is used by the admin dashboard comments section to show
     * each active campaign with its list of comments and donations.
     */
    getActiveCampaignsWithDetails(): Observable<CampaignWithDetails[]> {
        return this.http.get<CampaignWithDetails[]>(`${this.CAMPAIGN_API_URL}/active/with-details`).pipe(
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
