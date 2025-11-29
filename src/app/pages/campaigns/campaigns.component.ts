import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampaignCardComponent } from '../../shared/campaign-card/campaign-card.component';
import { Campaign, CampaignCategory } from '../../core/models/campaign.models';

@Component({
    selector: 'app-campaigns',
    standalone: true,
    imports: [CommonModule, CampaignCardComponent],
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
    campaigns: Campaign[] = [];
    filteredCampaigns: Campaign[] = [];
    activeFilter: CampaignCategory | 'ALL' = 'ALL';

    filters: { label: string; value: CampaignCategory | 'ALL' }[] = [
        { label: 'All', value: 'ALL' },
        { label: 'Medical Aid', value: 'MEDICAL_AID' },
        { label: 'Food & Water', value: 'FOOD_WATER' },
        { label: 'Education', value: 'EDUCATION' },
        { label: 'Reconstruction', value: 'RECONSTRUCTION' }
    ];

    constructor(private router: Router) {}

    ngOnInit(): void {
        // TODO: Replace with actual API call via CampaignService
        this.loadMockCampaigns();
        this.filteredCampaigns = [...this.campaigns];
    }

    /**
     * Filter campaigns by category
     */
    filterByCategory(category: CampaignCategory | 'ALL'): void {
        this.activeFilter = category;
        
        if (category === 'ALL') {
            this.filteredCampaigns = [...this.campaigns];
        } else {
            this.filteredCampaigns = this.campaigns.filter(
                campaign => campaign.category === category
            );
        }
    }

    /**
     * Handle donate button click from campaign card
     */
    onDonate(campaign: Campaign): void {
        // Navigate to campaign details page to open donation modal
        this.router.navigate(['/campaigns', campaign.id]);
    }

    /**
     * Load mock campaigns for development
     * TODO: Replace with CampaignService.getCampaigns()
     */
    private loadMockCampaigns(): void {
        this.campaigns = [
            {
                id: 1,
                title: 'Emergency Medical Supplies for Gaza Hospitals',
                description: 'Help us provide critical medical supplies, medicines, and equipment to hospitals in need.',
                category: 'MEDICAL_AID',
                goalAmount: 100000,
                raisedAmount: 75000,
                organizerName: 'Dr. Sarah Smith',
                status: 'ACTIVE'
            },
            {
                id: 2,
                title: 'Food Distribution for Displaced Families',
                description: 'Providing essential food packages to families who have lost their homes and livelihoods.',
                category: 'FOOD_WATER',
                goalAmount: 50000,
                raisedAmount: 32000,
                organizerName: 'Aid Foundation',
                status: 'ACTIVE'
            },
            {
                id: 3,
                title: 'School Rebuilding Project',
                description: 'Help rebuild schools destroyed by conflict so children can continue their education.',
                category: 'EDUCATION',
                goalAmount: 200000,
                raisedAmount: 89000,
                organizerName: 'Education For All',
                status: 'ACTIVE'
            },
            {
                id: 4,
                title: 'Clean Water Initiative',
                description: 'Installing water purification systems to provide clean drinking water to communities.',
                category: 'FOOD_WATER',
                goalAmount: 75000,
                raisedAmount: 45000,
                organizerName: 'Water Aid',
                status: 'ACTIVE'
            },
            {
                id: 5,
                title: 'Hospital Equipment Fund',
                description: 'Purchasing essential medical equipment for understaffed and under-resourced hospitals.',
                category: 'MEDICAL_AID',
                goalAmount: 150000,
                raisedAmount: 112000,
                organizerName: 'Medical Relief Org',
                status: 'ACTIVE'
            },
            {
                id: 6,
                title: 'Housing Reconstruction Program',
                description: 'Helping families rebuild their homes and restore dignity after displacement.',
                category: 'RECONSTRUCTION',
                goalAmount: 300000,
                raisedAmount: 156000,
                organizerName: 'Shelter Now',
                status: 'ACTIVE'
            }
        ];
    }
}
