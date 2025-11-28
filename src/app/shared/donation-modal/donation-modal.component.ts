import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-donation-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './donation-modal.component.html',
    styleUrls: ['./donation-modal.component.css']
})
export class DonationModalComponent {
    @Output() closeModal = new EventEmitter<void>();

    selectedAmount: number = 50;
    customAmount: number | null = null;

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
}
