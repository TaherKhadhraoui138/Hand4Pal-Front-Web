import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.models';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    currentUser: User | null = null;
    isLoading = false;
    successMessage = '';
    errorMessage = '';
    activeTab = 'personal';

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            phone: ['']
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    loadProfile(): void {
        this.isLoading = true;
        this.userService.getProfile().subscribe({
            next: (profile) => {
                this.currentUser = profile;
                this.profileForm.patchValue({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    phone: profile.phone
                });
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load profile';
                this.isLoading = false;
                console.error(error);
            }
        });
    }

    onUpdateProfile(): void {
        if (this.profileForm.invalid) return;

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        const updateData = this.profileForm.value;

        this.userService.updateProfile(updateData).subscribe({
            next: (updatedProfile) => {
                this.currentUser = updatedProfile;
                this.successMessage = 'Profile updated successfully';
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to update profile';
                this.isLoading = false;
                console.error(error);
            }
        });
    }

    onChangePassword(): void {
        if (this.passwordForm.invalid) return;

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        const request = {
            currentPassword: this.passwordForm.get('currentPassword')?.value,
            newPassword: this.passwordForm.get('newPassword')?.value,
            confirmPassword: this.passwordForm.get('confirmPassword')?.value
        };

        this.userService.changePassword(request).subscribe({
            next: () => {
                this.successMessage = 'Password changed successfully';
                this.passwordForm.reset();
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to change password';
                this.isLoading = false;
                console.error(error);
            }
        });
    }

    onDeleteAccount(): void {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            this.userService.deleteAccount().subscribe({
                next: () => {
                    this.authService.logout();
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.errorMessage = 'Failed to delete account';
                    console.error(error);
                }
            });
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
        this.successMessage = '';
        this.errorMessage = '';
    }
}
