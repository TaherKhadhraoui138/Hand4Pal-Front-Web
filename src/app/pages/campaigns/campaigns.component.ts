import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CampaignCardComponent } from '../../shared/campaign-card/campaign-card.component';
import { Campaign, CampaignCategory } from '../../core/models/campaign.models';
import { CampaignViewModel } from '../../core/viewmodels/campaign.viewmodel';

@Component({
    selector: 'app-campaigns',
    standalone: true,
    imports: [CommonModule, CampaignCardComponent],
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private router = inject(Router);
    public campaignViewModel = inject(CampaignViewModel);
    
    // Use observables directly with async pipe for better change detection
    filteredCampaigns$ = this.campaignViewModel.filteredCampaigns$;
    activeFilter$ = this.campaignViewModel.activeFilter$;
    isLoading$ = this.campaignViewModel.loading$;
    error$ = this.campaignViewModel.error$;
    
    // Keep local copy for filter button styling
    activeFilter: CampaignCategory | 'ALL' = 'ALL';

    filters: { label: string; value: CampaignCategory | 'ALL' }[] = [
        { label: 'All', value: 'ALL' },
        { label: 'Medical Aid', value: 'MEDICAL_AID' },
        { label: 'Food & Water', value: 'FOOD_WATER' },
        { label: 'Education', value: 'EDUCATION' },
        { label: 'Reconstruction', value: 'RECONSTRUCTION' }
    ];

    ngOnInit(): void {
        // Subscribe to active filter for button styling
        this.campaignViewModel.activeFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe(filter => this.activeFilter = filter);

        // Always load campaigns from API on component init
        this.campaignViewModel.loadActiveCampaigns();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Filter campaigns by category
     */
    filterByCategory(category: CampaignCategory | 'ALL'): void {
        this.campaignViewModel.filterByCategory(category);
    }

    /**
     * Handle donate button click from campaign card
     */
    onDonate(campaign: Campaign): void {
        this.router.navigate(['/campaigns', campaign.id]);
    }
}
