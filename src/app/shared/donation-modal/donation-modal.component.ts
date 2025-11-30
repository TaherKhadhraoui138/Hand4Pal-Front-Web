import { Component, EventEmitter, Input, Output, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DonationViewModel } from '../../core/viewmodels/donation.viewmodel';
import { DonationRequest } from '../../core/models/donation.models';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
    selector: 'app-donation-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, AlertModalComponent],
    templateUrl: './donation-modal.component.html',
    styleUrls: ['./donation-modal.component.css']
})
export class DonationModalComponent implements OnDestroy {
    @Input() campaignTitle: string = 'This Campaign';
    @Input() campaignId!: number;
    @Output() closeModal = new EventEmitter<void>();
    @Output() donationComplete = new EventEmitter<void>();

    private donationViewModel = inject(DonationViewModel);
    private destroy$ = new Subject<void>();

    selectedAmount: number = 50;
    customAmount: number | null = null;
    currency: string = 'USD';
    
    // Expose ViewModel loading state
    isLoading$ = this.donationViewModel.loading$;

    // Alert modal state
    showAlert: boolean = false;
    alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
    alertTitle: string = '';
    alertMessage: string = '';

    selectAmount(amount: number) {
        this.selectedAmount = amount;
        this.customAmount = null;
    }

    getDisplayAmount(): number {
        return this.customAmount || this.selectedAmount;
    }

    close() {
        this.closeModal.emit();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async submitDonation() {
        const amount = this.getDisplayAmount();
        
        if (amount <= 0) {
            this.showAlertModal('error', 'Invalid Amount', 'Please enter a valid donation amount.');
            return;
        }

        if (!this.campaignId) {
            this.showAlertModal('error', 'Error', 'Campaign not found. Please try again.');
            return;
        }

        const donationRequest: DonationRequest = {
            amount: amount,
            currency: this.currency,
            campaignId: this.campaignId
        };

        const donation = await this.donationViewModel.createDonation(donationRequest);
        
        if (donation) {
            this.showAlertModal(
                'success', 
                'Donation Successful!', 
                `Thank you for your generous donation of $${amount} to "${this.campaignTitle}". Your support makes a difference!`
            );
        } else {
            // Get error from ViewModel
            this.donationViewModel.error$
                .pipe(takeUntil(this.destroy$))
                .subscribe(error => {
                    if (error) {
                        this.showAlertModal('error', 'Donation Failed', error);
                    }
                });
        }
    }

    private showAlertModal(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) {
        this.alertType = type;
        this.alertTitle = title;
        this.alertMessage = message;
        this.showAlert = true;
    }

    onAlertClose() {
        this.showAlert = false;
        // Si le don a réussi, fermer le modal et notifier le parent
        if (this.alertType === 'success') {
            this.donationComplete.emit();
            this.close();
        }
    }
}
