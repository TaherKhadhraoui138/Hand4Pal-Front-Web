import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Campaign, getCategoryDisplayName, getCategoryEmoji } from '../../core/models/campaign.models';

@Component({
    selector: 'app-campaign-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './campaign-card.component.html',
    styleUrls: ['./campaign-card.component.css']
})
export class CampaignCardComponent {
    @Input({ required: true }) campaign!: Campaign;
    @Output() donate = new EventEmitter<Campaign>();

    /**
     * Calculate the progress percentage
     */
    get progressPercentage(): number {
        if (!this.campaign.goalAmount || this.campaign.goalAmount === 0) {
            return 0;
        }
        const percentage = (this.campaign.raisedAmount / this.campaign.goalAmount) * 100;
        return Math.min(percentage, 100); // Cap at 100%
    }

    /**
     * Get formatted raised amount
     */
    get formattedRaisedAmount(): string {
        return this.formatCurrency(this.campaign.raisedAmount);
    }

    /**
     * Get formatted goal amount
     */
    get formattedGoalAmount(): string {
        return this.formatCurrency(this.campaign.goalAmount);
    }

    /**
     * Get category display name
     */
    get categoryName(): string {
        return getCategoryDisplayName(this.campaign.category);
    }

    /**
     * Get category emoji for placeholder
     */
    get categoryEmoji(): string {
        return getCategoryEmoji(this.campaign.category);
    }

    /**
     * Emit donate event
     */
    onDonateClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.donate.emit(this.campaign);
    }

    /**
     * Format currency value
     */
    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}
