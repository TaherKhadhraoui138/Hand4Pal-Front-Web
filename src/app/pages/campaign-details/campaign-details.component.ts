import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DonationModalComponent } from '../../shared/donation-modal/donation-modal.component';
import { CommentComponent } from '../../shared/comment/comment.component';
import { Campaign, getCategoryDisplayName, getCategoryEmoji } from '../../core/models/campaign.models';
import { CampaignViewModel } from '../../core/viewmodels/campaign.viewmodel';

@Component({
    selector: 'app-campaign-details',
    standalone: true,
    imports: [CommonModule, DonationModalComponent, CommentComponent],
    templateUrl: './campaign-details.component.html',
    styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    public campaignViewModel = inject(CampaignViewModel);
    
    // Use observables directly with async pipe for better change detection
    campaign$ = this.campaignViewModel.currentCampaign$;
    isLoading$ = this.campaignViewModel.loading$;
    error$ = this.campaignViewModel.error$;
    
    // Local UI state
    isDonationModalOpen = false;
    activeTab: 'about' | 'updates' | 'comments' = 'about';

    ngOnInit(): void {
        // Get campaign ID from route and load
        const campaignId = this.route.snapshot.paramMap.get('id');
        if (campaignId) {
            this.campaignViewModel.loadCampaignById(+campaignId);
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
     * Get association name
     */
    getOrganizerName(campaign: Campaign): string {
        return campaign.associationName || 'Anonymous';
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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Set active tab
     */
    setActiveTab(tab: 'about' | 'updates' | 'comments'): void {
        this.activeTab = tab;
    }

    openDonationModal(): void {
        this.isDonationModalOpen = true;
    }

    closeDonationModal(): void {
        this.isDonationModalOpen = false;
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
}
