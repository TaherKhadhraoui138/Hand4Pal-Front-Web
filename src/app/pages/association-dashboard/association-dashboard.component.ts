import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, takeUntil, finalize } from 'rxjs';
import { CampaignService } from '../../core/services/campaign.service';
import { AuthService } from '../../core/services/auth.service';
import { CommentService } from '../../core/services/comment.service';
import { Campaign, CampaignCategory, getCategoryDisplayName, getAssociationName, getCampaignImageUrl } from '../../core/models/campaign.models';
import { CampaignWithDetails } from '../../core/models/comment.models';
import { Donation, getDonorName } from '../../core/models/donation.models';
import { AlertModalComponent, AlertType } from '../../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-association-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertModalComponent],
  templateUrl: './association-dashboard.component.html',
  styleUrl: './association-dashboard.component.css',
})
export class AssociationDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);
  private commentService = inject(CommentService);
  
  protected activeTab = signal('overview');
  protected campaignTab: 'active' | 'pending' | 'expired' = 'active';
  
  // Use BehaviorSubjects for reactive state
  private allCampaignsSubject = new BehaviorSubject<Campaign[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Expose as observables for async pipe
  allCampaigns$ = this.allCampaignsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  // Computed arrays (updated when allCampaigns changes)
  activeCampaigns: Campaign[] = [];
  pendingCampaigns: Campaign[] = [];
  expiredCampaigns: Campaign[] = [];
  
  // Edit modal
  isEditModalOpen = false;
  editingCampaign: Campaign | null = null;
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
  
  // Association info
  associationName = '';
  
  // Comments management
  campaignsWithComments: CampaignWithDetails[] = [];
  isCommentsLoading = false;
  expandedCampaigns = new Set<number>();
  selectedCampaignForDetails: CampaignWithDetails | null = null;
  isLoadingCampaignDetails = false;
  
  // Donations management (reuses campaignsWithComments data)
  selectedCampaignForDonations: CampaignWithDetails | null = null;
  
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
    this.loadMyCampaigns();
    this.loadAssociationInfo();
    this.loadCampaignsWithComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAssociationInfo(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.associationName = (user as any).associationName || user.firstName || 'Association';
    }
  }

  loadMyCampaigns(): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    this.campaignService.getMyCampaigns()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingSubject.next(false))
      )
      .subscribe({
        next: (campaigns) => {
          this.allCampaignsSubject.next(campaigns);
          this.categorizeCampaigns(campaigns);
        },
        error: (err) => {
          console.error('Failed to load campaigns', err);
          this.errorSubject.next('Failed to load your campaigns. Please try again.');
          this.allCampaignsSubject.next([]);
        }
      });
  }

  categorizeCampaigns(campaigns: Campaign[]): void {
    const now = new Date();
    
    this.activeCampaigns = campaigns.filter(c => 
      (c.status === 'ACTIVE' || c.status === 'APPROVED') && 
      (!c.endDate || new Date(c.endDate) > now)
    );
    
    this.pendingCampaigns = campaigns.filter(c => 
      c.status === 'PENDING'
    );
    
    this.expiredCampaigns = campaigns.filter(c => 
      c.status === 'COMPLETED' || 
      c.status === 'REJECTED' ||
      (c.endDate && new Date(c.endDate) <= now && c.status !== 'PENDING')
    );
  }

  // Get all campaigns from BehaviorSubject
  get allCampaigns(): Campaign[] {
    return this.allCampaignsSubject.value;
  }

  // Stats calculations
  get totalRaised(): number {
    return this.allCampaigns.reduce((sum, c) => sum + (c.collectedAmount || 0), 0);
  }

  get activeCampaignsCount(): number {
    return this.activeCampaigns.length;
  }

  get pendingCampaignsCount(): number {
    return this.pendingCampaigns.length;
  }

  // Campaign display helpers
  getCategoryName(category: string): string {
    return getCategoryDisplayName(category as CampaignCategory);
  }

  getProgressPercentage(campaign: Campaign): number {
    if (!campaign.targetAmount) return 0;
    return Math.min((campaign.collectedAmount / campaign.targetAmount) * 100, 100);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getRelativeTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

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

  getStatusClass(campaign: Campaign): string {
    if (campaign.status === 'PENDING') return 'pending';
    if (campaign.status === 'REJECTED') return 'rejected';
    if (campaign.endDate && new Date(campaign.endDate) <= new Date()) return 'expired';
    return 'active';
  }

  getStatusLabel(campaign: Campaign): string {
    if (campaign.status === 'PENDING') return 'Pending Approval';
    if (campaign.status === 'REJECTED') return 'Rejected';
    if (campaign.endDate && new Date(campaign.endDate) <= new Date()) return 'Expired';
    return 'Active';
  }

  // Edit campaign
  openEditModal(campaign: Campaign): void {
    this.editingCampaign = campaign;
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

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingCampaign = null;
  }

  saveEdit(): void {
    if (!this.editingCampaign) return;

    const updateData = {
      title: this.editForm.title,
      description: this.editForm.description,
      category: this.editForm.category,
      targetAmount: this.editForm.targetAmount,
      endDate: this.editForm.endDate ? `${this.editForm.endDate}T23:59:59` : undefined,
      imageURL: this.editForm.imageUrl && this.editForm.imageUrl.trim() !== '' ? this.editForm.imageUrl.trim() : undefined
    };

    this.campaignService.updateCampaign(this.editingCampaign.id, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          // Update the campaign in the list using BehaviorSubject
          const campaigns = [...this.allCampaignsSubject.value];
          const index = campaigns.findIndex(c => c.id === updated.id);
          if (index !== -1) {
            campaigns[index] = updated;
            this.allCampaignsSubject.next(campaigns);
            this.categorizeCampaigns(campaigns);
          }
          this.closeEditModal();
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

  // Get campaign image URL (handles both naming conventions)
  getImageUrl(campaign: Campaign): string | null {
    return getCampaignImageUrl(campaign);
  }
  
  // Comments Management
  loadCampaignsWithComments(): void {
    this.isCommentsLoading = true;
    
    this.commentService.getActiveCampaignsWithDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (campaigns) => {
          // Filter to only show campaigns from this association
          const user = this.authService.currentUserValue;
          if (user && (user as any).associationId) {
            this.campaignsWithComments = campaigns.filter(c => 
              (c as any).associationId === (user as any).associationId
            );
          } else {
            this.campaignsWithComments = campaigns;
          }
          this.isCommentsLoading = false;
        },
        error: (error) => {
          console.error('Failed to load campaigns with details', error);
          this.showAlert('Error', 'Failed to load campaigns. Please try again.', 'error');
          this.isCommentsLoading = false;
        }
      });
  }

  toggleCampaignComments(campaignId: number): void {
    if (this.expandedCampaigns.has(campaignId)) {
      this.expandedCampaigns.delete(campaignId);
    } else {
      this.expandedCampaigns.add(campaignId);
    }
  }

  isCampaignExpanded(campaignId: number): boolean {
    return this.expandedCampaigns.has(campaignId);
  }

  getCommentCount(campaign: CampaignWithDetails): number {
    return campaign.comments ? campaign.comments.length : 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewCampaignDetails(campaign: Campaign | CampaignWithDetails): void {
    this.isLoadingCampaignDetails = true;
    
    // Check if we already have this campaign with details in campaignsWithComments
    const campaignWithDetails = this.campaignsWithComments.find(c => c.id === campaign.id);
    
    if (campaignWithDetails) {
      // We already have the details, use it directly
      this.selectedCampaignForDetails = campaignWithDetails;
      this.isLoadingCampaignDetails = false;
    } else {
      // If not found in campaignsWithComments, try to find it in activeCampaigns
      // and fetch its details, or just use the campaign as-is if it has comments
      const foundCampaign = this.campaignsWithComments.find(c => c.id === campaign.id);
      if (foundCampaign) {
        this.selectedCampaignForDetails = foundCampaign;
      }
      this.isLoadingCampaignDetails = false;
    }
    
    // Switch to comments tab
    this.activeTab.set('comments');
  }

  closeCampaignDetails(): void {
    this.selectedCampaignForDetails = null;
  }

  getCommentTimeAgo(dateString: string): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  }

  // Donations Management
  getDonationCount(campaign: CampaignWithDetails): number {
    return campaign.donations ? campaign.donations.length : 0;
  }

  getTotalDonationsAmount(campaign: CampaignWithDetails): number {
    if (!campaign.donations || campaign.donations.length === 0) return 0;
    return campaign.donations.reduce((sum: number, donation: any) => sum + (donation.amount || 0), 0);
  }

  formatDonationDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDonorDisplayName(donation: any): string {
    return getDonorName(donation);
  }

  viewCampaignDonations(campaign: CampaignWithDetails): void {
    this.selectedCampaignForDonations = campaign;
  }

  closeCampaignDonations(): void {
    this.selectedCampaignForDonations = null;
  }
}
