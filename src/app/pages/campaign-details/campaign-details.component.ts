import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DonationModalComponent } from '../../shared/donation-modal/donation-modal.component';
import { CommentComponent } from '../../shared/comment/comment.component';
import { Campaign, getCategoryDisplayName, getCategoryEmoji, getAssociationName, getCampaignImageUrl } from '../../core/models/campaign.models';
import { CampaignViewModel } from '../../core/viewmodels/campaign.viewmodel';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { Comment } from '../../core/models/comment.models';
import { DonationService } from '../../core/services/donation.service';
import { Donation, getDonorName } from '../../core/models/donation.models';

@Component({
    selector: 'app-campaign-details',
    standalone: true,
    imports: [CommonModule, FormsModule, DonationModalComponent, CommentComponent],
    templateUrl: './campaign-details.component.html',
    styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private commentService = inject(CommentService);
    private authService = inject(AuthService);
    private donationService = inject(DonationService);
    public campaignViewModel = inject(CampaignViewModel);
    
    // Use observables directly with async pipe for better change detection
    campaign$ = this.campaignViewModel.currentCampaign$;
    isLoading$ = this.campaignViewModel.loading$;
    error$ = this.campaignViewModel.error$;
    
    // Local UI state
    isDonationModalOpen = false;
    activeTab: 'about' | 'updates' | 'comments' = 'about';
    
    // Comments state
    comments: Comment[] = [];
    isLoadingComments = false;
    newCommentContent = '';
    isSubmittingComment = false;
    commentError: string | null = null;
    commentSuccess: string | null = null;
    
    // Donations state
    recentDonations: Donation[] = [];
    isLoadingDonations = false;

    ngOnInit(): void {
        // Get campaign ID from route and load
        const campaignId = this.route.snapshot.paramMap.get('id');
        if (campaignId) {
            this.campaignViewModel.loadCampaignById(+campaignId);
            this.loadComments(+campaignId);
            this.loadRecentDonations(+campaignId);
        } else {
            this.router.navigate(['/campaigns']);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        // Clear current campaign when leaving the page
        this.campaignViewModel.clearCurrentCampaign();
    }

    /**
     * Get category display name
     */
    getCategoryName(campaign: Campaign): string {
        return getCategoryDisplayName(campaign.category);
    }

    /**
     * Get category emoji
     */
    getCategoryEmoji(campaign: Campaign): string {
        return getCategoryEmoji(campaign.category);
    }

    /**
     * Get campaign image URL (handles both naming conventions)
     */
    getCampaignImageUrl(campaign: Campaign): string | null {
        return getCampaignImageUrl(campaign);
    }

    /**
     * Get association name
     */
    getOrganizerName(campaign: Campaign): string {
        return getAssociationName(campaign);
    }

    /**
     * Calculate progress percentage
     */
    getProgressPercentage(campaign: Campaign): number {
        if (!campaign.targetAmount) return 0;
        return Math.min((campaign.collectedAmount / campaign.targetAmount) * 100, 100);
    }

    /**
     * Format currency
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' DT';
    }

    /**
     * Set active tab
     */
    setActiveTab(tab: 'about' | 'updates' | 'comments'): void {
        this.activeTab = tab;
        // Load comments when switching to comments tab
        if (tab === 'comments') {
            const campaignId = this.route.snapshot.paramMap.get('id');
            if (campaignId) {
                this.loadComments(+campaignId);
            }
        }
    }

    openDonationModal(): void {
        this.isDonationModalOpen = true;
    }

    closeDonationModal(): void {
        this.isDonationModalOpen = false;
    }

    /**
     * Handle donation completion - reload campaign to update collected amount
     */
    onDonationComplete(): void {
        const campaignId = this.route.snapshot.paramMap.get('id');
        if (campaignId) {
            this.campaignViewModel.loadCampaignById(+campaignId);
            this.loadRecentDonations(+campaignId);
        }
    }

    /**
     * Retry loading campaign
     */
    retryLoad(): void {
        const campaignId = this.route.snapshot.paramMap.get('id');
        if (campaignId) {
            this.campaignViewModel.loadCampaignById(+campaignId);
        }
    }

    /**
     * Get relative time string
     */
    getRelativeTime(dateStr?: string): string {
        if (!dateStr) return '';
        
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Created today';
        if (diffDays === 1) return 'Created yesterday';
        if (diffDays < 7) return `Created ${diffDays} days ago`;
        if (diffDays < 30) return `Created ${Math.floor(diffDays / 7)} weeks ago`;
        return `Created ${Math.floor(diffDays / 30)} months ago`;
    }

    /**
     * Load comments for the campaign
     */
    loadComments(campaignId: number): void {
        this.isLoadingComments = true;
        this.commentService.getCommentsByCampaign(campaignId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (comments) => {
                    this.comments = comments;
                    this.isLoadingComments = false;
                },
                error: (err) => {
                    console.error('Failed to load comments', err);
                    this.comments = [];
                    this.isLoadingComments = false;
                }
            });
    }

    /**
     * Get author name from comment
     */
    getCommentAuthor(comment: Comment): string {
        return comment.citizenName || comment.userName || 'Anonymous';
    }

    /**
     * Format time ago from publication date
     */
    getTimeAgo(dateStr: string): string {
        if (!dateStr) return '';
        
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }

    /**
     * Submit a new comment
     */
    submitComment(): void {
        if (!this.newCommentContent.trim()) {
            this.commentError = 'Please enter a comment';
            return;
        }

        const campaignId = this.route.snapshot.paramMap.get('id');
        if (!campaignId) {
            this.commentError = 'Campaign ID not found';
            return;
        }

        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            this.commentError = 'You must be logged in to comment';
            return;
        }

        const token = this.authService.tokenValue;
        if (!token) {
            this.commentError = 'Authentication token not found';
            return;
        }

        this.isSubmittingComment = true;
        this.commentError = null;
        this.commentSuccess = null;

        const commentRequest = {
            campaignId: +campaignId,
            citizenId: currentUser.id,
            content: this.newCommentContent.trim()
        };

        this.commentService.createComment(commentRequest, token)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (newComment) => {
                    this.commentSuccess = 'Comment posted successfully!';
                    this.newCommentContent = '';
                    this.isSubmittingComment = false;
                    // Reload comments to show the new one
                    this.loadComments(+campaignId);
                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        this.commentSuccess = null;
                    }, 3000);
                },
                error: (err) => {
                    console.error('Failed to submit comment', err);
                    this.commentError = 'Failed to post comment. Please try again.';
                    this.isSubmittingComment = false;
                }
            });
    }
    
    /**
     * Load recent donations for the campaign
     */
    loadRecentDonations(campaignId: number): void {
        this.isLoadingDonations = true;
        this.donationService.getDonationsByCampaign(campaignId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (donations) => {
                    // Get the 3 most recent donations
                    this.recentDonations = donations
                        .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
                        .slice(0, 3);
                    this.isLoadingDonations = false;
                },
                error: (err) => {
                    console.error('Failed to load donations', err);
                    this.recentDonations = [];
                    this.isLoadingDonations = false;
                }
            });
    }

    /**
     * Get donor display name
     */
    getDonorName(donation: Donation): string {
        return getDonorName(donation);
    }

    /**
     * Get donation time ago
     */
    getDonationTimeAgo(dateString: string): string {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return `${Math.floor(diffDays / 7)}w`;
    }

    /**
     * Reload donations after a successful donation
     */
    reloadDonations(): void {
        const campaignId = this.route.snapshot.paramMap.get('id');
        if (campaignId) {
            this.loadRecentDonations(+campaignId);
        }
    }
}
