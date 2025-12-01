import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { CampaignService } from '../../core/services/campaign.service';
import { CommentService } from '../../core/services/comment.service';
import { CampaignWithDetails, Comment } from '../../core/models/comment.models';
import { User } from '../../core/models/auth.models';
import { Campaign, getCategoryDisplayName, getAssociationName } from '../../core/models/campaign.models';
import { AlertModalComponent, AlertType } from '../../shared/alert-modal/alert-modal.component';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, AlertModalComponent],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    activeTab: string = 'dashboard';
    users: any[] = [];  // Using any[] because API returns userId, not id
    pendingAssociations: any[] = [];
    activeCampaigns: Campaign[] = [];
    pendingCampaigns: Campaign[] = [];
    campaignTab: 'active' | 'pending' = 'pending';
    isLoading = false;
    isCampaignsLoading = false;
    searchQuery = '';
    
    // Comments management
    campaignsWithComments: CampaignWithDetails[] = [];
    isCommentsLoading = false;
    expandedCampaigns = new Set<number>();
    deletingCommentId: number | null = null;

    // Alert modal state
    alertModal = {
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as AlertType
    };

    // Confirmation modal state
    confirmModal = {
        isOpen: false,
        title: '',
        message: '',
        action: null as (() => void) | null
    };

    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private authService: AuthService,
        private campaignService: CampaignService,
        private commentService: CommentService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.loadPendingAssociations();
        this.loadCampaigns();
        this.loadCampaignsWithComments();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Failed to load users', error);
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        if (this.searchQuery.trim()) {
            this.isLoading = true;
            this.userService.searchUsers(this.searchQuery).subscribe({
                next: (data) => {
                    this.users = data;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Failed to search users', error);
                    this.isLoading = false;
                }
            });
        } else {
            this.loadUsers();
        }
    }

    onDeleteUser(userId: number): void {
        if (!userId) {
            console.error('User ID is undefined!');
            this.showAlert('Error', 'Cannot delete user: ID is missing', 'error');
            return;
        }
        this.showConfirm('Delete User', 'Are you sure you want to delete this user?', () => {
            this.userService.deleteUser(userId).subscribe({
                next: () => {
                    this.showAlert('Success', 'User deleted successfully!', 'success');
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('Failed to delete user', error);
                    this.showAlert('Error', 'Failed to delete user. Please try again.', 'error');
                }
            });
        });
    }

    // Association Management
    loadPendingAssociations(): void {
        this.isLoading = true;
        this.adminService.getPendingAssociations().subscribe({
            next: (data) => {
                this.pendingAssociations = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Failed to load pending associations', error);
                this.isLoading = false;
            }
        });
    }

    onApproveAssociation(id: number): void {
        this.showConfirm('Approve Association', 'Are you sure you want to approve this association?', () => {
            this.adminService.approveAssociation(id).subscribe({
                next: () => {
                    this.pendingAssociations = this.pendingAssociations.filter(a => a.id !== id);
                    this.showAlert('Success', 'Association approved successfully!', 'success');
                },
                error: (error) => {
                    console.error('Failed to approve association', error);
                    if (error.status === 403) {
                        this.showAlert('Access Denied', 'Please make sure you are logged in as an administrator.', 'error');
                    } else {
                        this.showAlert('Error', 'Failed to approve association. Please try again.', 'error');
                    }
                }
            });
        });
    }

    onRejectAssociation(id: number): void {
        this.showConfirm('Reject Association', 'Are you sure you want to reject this association?', () => {
            this.adminService.rejectAssociation(id).subscribe({
                next: () => {
                    this.pendingAssociations = this.pendingAssociations.filter(a => a.id !== id);
                    this.showAlert('Success', 'Association rejected successfully!', 'success');
                },
                error: (error) => {
                    console.error('Failed to reject association', error);
                    if (error.status === 403) {
                        this.showAlert('Access Denied', 'Please make sure you are logged in as an administrator.', 'error');
                    } else {
                        this.showAlert('Error', 'Failed to reject association. Please try again.', 'error');
                    }
                }
            });
        });
    }

    // Campaign Management
    loadCampaigns(): void {
        this.isCampaignsLoading = true;
        
        // Load active campaigns
        this.campaignService.getActiveCampaigns().subscribe({
            next: (data) => {
                this.activeCampaigns = data;
            },
            error: (error) => {
                console.error('Failed to load active campaigns', error);
            }
        });

        // Load pending campaigns
        this.campaignService.getPendingCampaigns().subscribe({
            next: (data) => {
                this.pendingCampaigns = data;
                this.isCampaignsLoading = false;
            },
            error: (error) => {
                console.error('Failed to load pending campaigns', error);
                this.isCampaignsLoading = false;
            }
        });
    }

    onApproveCampaign(id: number): void {
        this.showConfirm('Approve Campaign', 'Are you sure you want to approve this campaign?', () => {
            this.campaignService.approveCampaign(id).subscribe({
                next: (approvedCampaign) => {
                    this.pendingCampaigns = this.pendingCampaigns.filter(c => c.id !== id);
                    this.activeCampaigns.push(approvedCampaign);
                    this.showAlert('Success', 'Campaign approved successfully!', 'success');
                },
                error: (error) => {
                    console.error('Failed to approve campaign', error);
                    if (error.status === 403) {
                        this.showAlert('Access Denied', 'Please make sure you are logged in as an administrator.', 'error');
                    } else {
                        this.showAlert('Error', 'Failed to approve campaign. Please try again.', 'error');
                    }
                }
            });
        });
    }

    onRejectCampaign(id: number): void {
        this.showConfirm('Reject Campaign', 'Are you sure you want to reject this campaign?', () => {
            this.campaignService.rejectCampaign(id).subscribe({
                next: () => {
                    this.pendingCampaigns = this.pendingCampaigns.filter(c => c.id !== id);
                    this.showAlert('Success', 'Campaign rejected successfully!', 'success');
                },
                error: (error) => {
                    console.error('Failed to reject campaign', error);
                    if (error.status === 403) {
                        this.showAlert('Access Denied', 'Please make sure you are logged in as an administrator.', 'error');
                    } else {
                        this.showAlert('Error', 'Failed to reject campaign. Please try again.', 'error');
                    }
                }
            });
        });
    }

    getCategoryName(category: string): string {
        return getCategoryDisplayName(category as any);
    }

    getAssociationDisplayName(campaign: Campaign): string {
        return getAssociationName(campaign);
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Alert modal helpers
    showAlert(title: string, message: string, type: AlertType): void {
        this.alertModal = { isOpen: true, title, message, type };
    }

    closeAlert(): void {
        this.alertModal.isOpen = false;
    }

    showConfirm(title: string, message: string, action: () => void): void {
        this.confirmModal = { isOpen: true, title, message, action };
    }

    closeConfirm(): void {
        this.confirmModal.isOpen = false;
        this.confirmModal.action = null;
    }

    onConfirmAction(): void {
        if (this.confirmModal.action) {
            this.confirmModal.action();
        }
        this.closeConfirm();
    }

    // Comments Management
    loadCampaignsWithComments(): void {
        this.isCommentsLoading = true;
        
        this.commentService.getActiveCampaignsWithDetails().subscribe({
            next: (campaigns) => {
                this.campaignsWithComments = campaigns;
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

    onDeleteComment(commentId: number, campaignId: number): void {
        this.showConfirm(
            'Delete Comment',
            'Are you sure you want to delete this comment? This action cannot be undone.',
            () => {
                this.deletingCommentId = commentId;
                this.commentService.deleteComment(commentId).subscribe({
                    next: () => {
                        // Reload campaigns/comments from backend so UI reflects latest state
                        this.loadCampaignsWithComments();
                        this.deletingCommentId = null;
                        this.showAlert('Success', 'Comment deleted successfully!', 'success');
                    },
                    error: (error) => {
                        console.error('Failed to delete comment', error);
                        this.deletingCommentId = null;
                        if (error.status === 403) {
                            this.showAlert('Access Denied', 'You do not have permission to delete comments.', 'error');
                        } else {
                            this.showAlert('Error', 'Failed to delete comment. Please try again.', 'error');
                        }
                    }
                });
            }
        );
    }

    getCommentCount(campaign: Campaign): number {
        return campaign.comments ? campaign.comments.length : 0;
    }

    /**
     * Safely get the numeric ID of a comment, regardless of whether
     * the backend used "id" or "commentId" as the field name.
     */
    getCommentId(comment: Comment): number {
        const anyComment = comment as any;
        return anyComment.commentId ?? anyComment.id ?? anyComment.comment_id;
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
}
