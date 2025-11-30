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
        if (!this.campaign.targetAmount || this.campaign.targetAmount === 0) {
            return 0;
        }
        const percentage = (this.campaign.collectedAmount / this.campaign.targetAmount) * 100;
        return Math.min(percentage, 100); // Cap at 100%
    }

    /**
     * Get formatted collected amount
     */
    get formattedCollectedAmount(): string {
        return this.formatCurrency(this.campaign.collectedAmount || 0);
    }

    /**
     * Get formatted target amount
     */
    get formattedTargetAmount(): string {
        return this.formatCurrency(this.campaign.targetAmount);
    }

    /**
     * Get association name
     */
    get organizerName(): string {
        return this.campaign.associationName || 'Anonymous';
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
