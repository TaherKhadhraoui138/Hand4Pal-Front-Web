import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.models';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    activeTab: string = 'dashboard';
    users: any[] = [];  // Using any[] because API returns userId, not id
    pendingAssociations: any[] = [];
    isLoading = false;
    searchQuery = '';

    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.loadPendingAssociations();
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
            alert('Cannot delete user: ID is missing');
            return;
        }
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(userId).subscribe({
                next: () => {
                    alert('User deleted successfully!');
                    window.location.reload();  // Refresh the whole page
                },
                error: (error) => {
                    console.error('Failed to delete user', error);
                    alert('Failed to delete user. Please try again.');
                }
            });
        }
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
        if (confirm('Are you sure you want to approve this association?')) {
            this.adminService.approveAssociation(id).subscribe({
                next: () => {
                    this.pendingAssociations = this.pendingAssociations.filter(a => a.id !== id);
                    alert('Association approved successfully!');
                },
                error: (error) => {
                    console.error('Failed to approve association', error);
                    if (error.status === 403) {
                        alert('Access denied. Please make sure you are logged in as an administrator.');
                    } else {
                        alert('Failed to approve association. Please try again.');
                    }
                }
            });
        }
    }

    onRejectAssociation(id: number): void {
        if (confirm('Are you sure you want to reject this association?')) {
            this.adminService.rejectAssociation(id).subscribe({
                next: () => {
                    this.pendingAssociations = this.pendingAssociations.filter(a => a.id !== id);
                    alert('Association rejected successfully!');
                },
                error: (error) => {
                    console.error('Failed to reject association', error);
                    if (error.status === 403) {
                        alert('Access denied. Please make sure you are logged in as an administrator.');
                    } else {
                        alert('Failed to reject association. Please try again.');
                    }
                }
            });
        }
    }
}
