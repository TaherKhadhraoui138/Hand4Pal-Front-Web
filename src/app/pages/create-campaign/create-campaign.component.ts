import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CampaignViewModel } from '../../core/viewmodels/campaign.viewmodel';
import { CampaignCategory, CampaignCreateRequest } from '../../core/models/campaign.models';

@Component({
    selector: 'app-create-campaign',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './create-campaign.component.html',
    styleUrl: './create-campaign.component.css',
})
export class CreateCampaign implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    
    campaignForm!: FormGroup;
    isLoading = false;
    error: string | null = null;
    success: string | null = null;

    categories: { label: string; value: CampaignCategory }[] = [
        { label: 'Health', value: 'HEALTH' },
        { label: 'Education', value: 'EDUCATION' },
        { label: 'Environment', value: 'ENVIRONMENT' },
        { label: 'Animal Welfare', value: 'ANIMAL_WELFARE' },
        { label: 'Social', value: 'SOCIAL' },
        { label: 'Emergency', value: 'EMERGENCY' },
        { label: 'Other', value: 'OTHER' }
    ];

    constructor(
        private fb: FormBuilder,
        private campaignViewModel: CampaignViewModel
    ) {}

    ngOnInit(): void {
        this.initForm();

        // Subscribe to viewmodel observables
        this.campaignViewModel.loading$
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => this.isLoading = loading);

        this.campaignViewModel.error$
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => this.error = error);

        this.campaignViewModel.success$
            .pipe(takeUntil(this.destroy$))
            .subscribe(success => this.success = success);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];

        this.campaignForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
            category: ['', Validators.required],
            targetAmount: ['', [Validators.required, Validators.min(100)]],
            endDate: ['', Validators.required],
            description: ['', [Validators.required, Validators.minLength(50)]],
            imageUrl: ['']
        });
    }

    get minEndDate(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    async onSubmit(): Promise<void> {
        if (this.campaignForm.invalid) {
            // Mark all fields as touched to show validation errors
            Object.keys(this.campaignForm.controls).forEach(key => {
                this.campaignForm.get(key)?.markAsTouched();
            });
            return;
        }

        const formValue = this.campaignForm.value;
        
        // Format endDate as ISO datetime string (backend expects LocalDateTime)
        const endDateValue = formValue.endDate;
        const endDateFormatted = endDateValue ? `${endDateValue}T23:59:59` : '';
        
        const campaignData: CampaignCreateRequest = {
            title: formValue.title,
            description: formValue.description,
            category: formValue.category,
            targetAmount: Number(formValue.targetAmount),
            endDate: endDateFormatted,
            imageURL: formValue.imageUrl && formValue.imageUrl.trim() !== '' ? formValue.imageUrl.trim() : null
        };

        await this.campaignViewModel.createCampaign(campaignData);
    }

    // Form field getters for template
    get title() { return this.campaignForm.get('title'); }
    get category() { return this.campaignForm.get('category'); }
    get targetAmount() { return this.campaignForm.get('targetAmount'); }
    get endDate() { return this.campaignForm.get('endDate'); }
    get description() { return this.campaignForm.get('description'); }
}
