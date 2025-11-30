import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommentComponent } from '../../shared/comment/comment.component';
import { Campaign, CampaignCategory, getCategoryDisplayName, getCategoryEmoji, getAssociationName, getCampaignImageUrl } from '../../core/models/campaign.models';
import { CampaignViewModel } from '../../core/viewmodels/campaign.viewmodel';
import { CampaignService } from '../../core/services/campaign.service';
import { AlertModalComponent, AlertType } from '../../shared/alert-modal/alert-modal.component';

@Component({
    selector: 'app-association-campaign-details',
    standalone: true,
    imports: [CommonModule, CommentComponent, FormsModule, RouterLink, AlertModalComponent],
    templateUrl: './association-campaign-details.component.html',
    styleUrls: ['./association-campaign-details.component.css']
})
export class AssociationCampaignDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private campaignService = inject(CampaignService);
    public campaignViewModel = inject(CampaignViewModel);
    
    // Use observables directly with async pipe for better change detection
    campaign$ = this.campaignViewModel.currentCampaign$;
    isLoading$ = this.campaignViewModel.loading$;
    error$ = this.campaignViewModel.error$;
    
    // Local UI state
    isEditModalOpen = false;
    activeTab: 'about' | 'updates' | 'comments' = 'about';
    
    // Edit form
    editForm = {
        title: '',
        description: '',
        category: '' as CampaignCategory,
        targetAmount: 0,
        endDate: '',
        imageUrl: ''
    };

    // Alert modal state
    alertModal = {
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as AlertType
    };

    categories: { label: string; value: CampaignCategory }[] = [
        { label: 'Health', value: 'HEALTH' },
        { label: 'Education', value: 'EDUCATION' },
        { label: 'Environment', value: 'ENVIRONMENT' },
        { label: 'Animal Welfare', value: 'ANIMAL_WELFARE' },
        { label: 'Social', value: 'SOCIAL' },
        { label: 'Emergency', value: 'EMERGENCY' },
        { label: 'Other', value: 'OTHER' }
    ];

    ngOnInit(): void {
        // Get campaign ID from route and load
        const campaignId = this.route.snapshot.paramMap.get('id');
        if (campaignId) {
            this.campaignViewModel.loadCampaignById(+campaignId);
        } else {
            this.router.navigate(['/association-dashboard']);
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

    /**
     * Open edit modal with campaign data
     */
    openEditModal(campaign: Campaign): void {
        this.editForm = {
            title: campaign.title,
            description: campaign.description,
            category: campaign.category,
            targetAmount: campaign.targetAmount,
            endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
            imageUrl: getCampaignImageUrl(campaign) || ''
        };
        this.isEditModalOpen = true;
    }

    /**
     * Close edit modal
     */
    closeEditModal(): void {
        this.isEditModalOpen = false;
    }

    /**
     * Save campaign edits
     */
    saveEdit(campaignId: number): void {
        const updateData = {
            title: this.editForm.title,
            description: this.editForm.description,
            category: this.editForm.category,
            targetAmount: this.editForm.targetAmount,
            endDate: this.editForm.endDate ? `${this.editForm.endDate}T23:59:59` : undefined,
            imageUrl: this.editForm.imageUrl || undefined
        };

        this.campaignService.updateCampaign(campaignId, updateData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updated) => {
                    this.closeEditModal();
                    // Reload the campaign to get updated data
                    this.campaignViewModel.loadCampaignById(campaignId);
                    this.showAlert('Success', 'Campaign updated successfully!', 'success');
                },
                error: (err) => {
                    console.error('Failed to update campaign', err);
                    this.showAlert('Error', 'Failed to update campaign. Please try again.', 'error');
                }
            });
    }

    // Alert modal helpers
    showAlert(title: string, message: string, type: AlertType): void {
        this.alertModal = { isOpen: true, title, message, type };
    }

    closeAlert(): void {
        this.alertModal.isOpen = false;
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
     * Get days remaining until end date
     */
    getDaysRemaining(endDate?: string): string {
        if (!endDate) return 'No end date';
        const end = new Date(endDate);
        const now = new Date();
        const diffMs = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Ends today';
        if (diffDays === 1) return '1 day left';
        return `${diffDays} days left`;
    }

    /**
     * Get status class for badge
     */
    getStatusClass(campaign: Campaign): string {
        if (campaign.status === 'PENDING') return 'pending';
        if (campaign.status === 'REJECTED') return 'rejected';
        if (campaign.endDate && new Date(campaign.endDate) <= new Date()) return 'expired';
        return 'active';
    }

    /**
     * Get status label
     */
    getStatusLabel(campaign: Campaign): string {
        if (campaign.status === 'PENDING') return 'Pending Approval';
        if (campaign.status === 'REJECTED') return 'Rejected';
        if (campaign.endDate && new Date(campaign.endDate) <= new Date()) return 'Expired';
        return 'Active';
    }

    /**
     * Navigate back to dashboard
     */
    goBack(): void {
        this.router.navigate(['/association-dashboard']);
    }
}
