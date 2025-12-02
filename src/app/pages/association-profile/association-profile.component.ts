import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { DonationViewModel } from '../../core/viewmodels/donation.viewmodel';
import { User } from '../../core/models/auth.models';
import { Donation } from '../../core/models/donation.models';

@Component({
  selector: 'app-association-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './association-profile.component.html',
  styleUrl: './association-profile.component.css',
})
export class AssociationProfile implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private donationViewModel = inject(DonationViewModel);
  private destroy$ = new Subject<void>();

  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  activeTab = 'info';

  // Expose ViewModel observables for donations
  donations$ = this.donationViewModel.receivedDonations$;
  isLoadingDonations$ = this.donationViewModel.loading$;
  totalReceived$ = this.donationViewModel.totalReceived$;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    
    // Subscribe to ViewModel error messages
    this.donationViewModel.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error && this.activeTab === 'donations') {
          this.errorMessage = error;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.currentUser = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName,
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';

    if (tab === 'donations' && !this.donationViewModel.isReceivedDonationsLoaded()) {
      this.donationViewModel.loadReceivedDonations();
    }
  }

  getDonorName(donation: Donation): string {
    return this.donationViewModel.getDonorName(donation);
  }

  formatCurrency(amount: number, currency: string = 'DT'): string {
    return this.donationViewModel.formatCurrency(amount, currency);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
