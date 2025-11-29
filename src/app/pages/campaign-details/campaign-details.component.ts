import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DonationModalComponent } from '../../shared/donation-modal/donation-modal.component';
import { CommentComponent } from '../../shared/comment/comment.component';
import { Campaign, getCategoryDisplayName, getCategoryEmoji } from '../../core/models/campaign.models';

// Mock data for development
const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: 1,
        title: 'Emergency Medical Supplies for Gaza Hospitals',
        description: 'Hospitals in Gaza are facing critical shortages of essential medicines, surgical supplies, and fuel. This campaign aims to provide immediate relief by delivering anesthesia and surgical kits, antibiotics and painkillers, emergency trauma supplies, and fuel for hospital generators. Every donation, no matter how small, helps save lives. We are working directly with local partners to ensure aid reaches those who need it most effectively and transparently.',
        category: 'MEDICAL_AID',
        goalAmount: 100000,
        raisedAmount: 75000,
        organizerName: 'Dr. Sarah Smith',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
        id: 2,
        title: 'Food Distribution for Displaced Families',
        description: 'Providing essential food packages to families who have lost their homes and livelihoods. Each package contains rice, flour, cooking oil, canned goods, and other essentials to sustain a family for two weeks. We are committed to reaching the most vulnerable populations in affected areas.',
        category: 'FOOD_WATER',
        goalAmount: 50000,
        raisedAmount: 32000,
        organizerName: 'Aid Foundation',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: 3,
        title: 'School Rebuilding Project',
        description: 'Help rebuild schools destroyed by conflict so children can continue their education. Education is a fundamental right, and we are determined to restore learning spaces for thousands of children. Your support will fund construction materials, furniture, and educational supplies.',
        category: 'EDUCATION',
        goalAmount: 200000,
        raisedAmount: 89000,
        organizerName: 'Education For All',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
        id: 4,
        title: 'Clean Water Initiative',
        description: 'Installing water purification systems to provide clean drinking water to communities. Access to clean water is essential for health and survival. Our initiative focuses on sustainable solutions that will serve communities for years to come.',
        category: 'FOOD_WATER',
        goalAmount: 75000,
        raisedAmount: 45000,
        organizerName: 'Water Aid',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
        id: 5,
        title: 'Hospital Equipment Fund',
        description: 'Purchasing essential medical equipment for understaffed and under-resourced hospitals. This includes ventilators, monitoring systems, surgical tools, and diagnostic equipment that are desperately needed to save lives.',
        category: 'MEDICAL_AID',
        goalAmount: 150000,
        raisedAmount: 112000,
        organizerName: 'Medical Relief Org',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
        id: 6,
        title: 'Housing Reconstruction Program',
        description: 'Helping families rebuild their homes and restore dignity after displacement. Our program provides building materials, skilled labor support, and coordination with local authorities to ensure safe and sustainable housing solutions.',
        category: 'RECONSTRUCTION',
        goalAmount: 300000,
        raisedAmount: 156000,
        organizerName: 'Shelter Now',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
    }
];

@Component({
    selector: 'app-campaign-details',
    standalone: true,
    imports: [CommonModule, DonationModalComponent, CommentComponent],
    templateUrl: './campaign-details.component.html',
    styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
    campaign: Campaign | null = null;
    isDonationModalOpen = false;
    activeTab: 'about' | 'updates' | 'comments' = 'about';
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const campaignId = this.route.snapshot.paramMap.get('id');
        console.log('Campaign ID from route:', campaignId);
        
        if (campaignId) {
            this.loadCampaign(+campaignId);
        } else {
            this.isLoading = false;
            this.router.navigate(['/campaigns']);
        }
    }

    /**
     * Get category display name
     */
    get categoryName(): string {
        return this.campaign ? getCategoryDisplayName(this.campaign.category) : '';
    }

    /**
     * Get category emoji
     */
    get categoryEmoji(): string {
        return this.campaign ? getCategoryEmoji(this.campaign.category) : '💝';
    }

    /**
     * Calculate progress percentage
     */
    get progressPercentage(): number {
        if (!this.campaign || !this.campaign.goalAmount) return 0;
        return Math.min((this.campaign.raisedAmount / this.campaign.goalAmount) * 100, 100);
    }

    /**
     * Format currency
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Set active tab
     */
    setActiveTab(tab: 'about' | 'updates' | 'comments'): void {
        this.activeTab = tab;
    }

    openDonationModal(): void {
        this.isDonationModalOpen = true;
    }

    closeDonationModal(): void {
        this.isDonationModalOpen = false;
    }

    /**
     * Load campaign by ID
     * TODO: Replace with CampaignService.getCampaignById()
     */
    private loadCampaign(id: number): void {
        console.log('Loading campaign with ID:', id);
        
        // Find campaign from mock data (synchronously for now)
        this.campaign = MOCK_CAMPAIGNS.find(c => c.id === id) || null;
        this.isLoading = false;
        
        console.log('Campaign found:', this.campaign);

        if (!this.campaign) {
            this.router.navigate(['/campaigns']);
        }
    }

    /**
     * Get relative time string
     */
    getRelativeTime(date?: Date): string {
        if (!date) return '';
        
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Created today';
        if (diffDays === 1) return 'Created yesterday';
        if (diffDays < 7) return `Created ${diffDays} days ago`;
        if (diffDays < 30) return `Created ${Math.floor(diffDays / 7)} weeks ago`;
        return `Created ${Math.floor(diffDays / 30)} months ago`;
    }
}
