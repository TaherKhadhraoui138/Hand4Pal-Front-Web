import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.models';

@Component({
  selector: 'app-association-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './association-profile.component.html',
  styleUrl: './association-profile.component.css',
})
export class AssociationProfile implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
