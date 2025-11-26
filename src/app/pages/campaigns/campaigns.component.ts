import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-campaigns',
    standalone: true,
    imports: [RouterLink, CommonModule],
    template: `
    <div class="page-header">
      <div class="container">
        <h1>Active Campaigns</h1>
        <p>Support these urgent causes and make a difference today.</p>
      </div>
    </div>

    <div class="container campaigns-container">
      <div class="filters">
        <button class="filter-btn active">All</button>
        <button class="filter-btn">Medical Aid</button>
        <button class="filter-btn">Food & Water</button>
        <button class="filter-btn">Education</button>
        <button class="filter-btn">Reconstruction</button>
      </div>

      <div class="campaigns-grid">
        <!-- Campaign Card 1 -->
        <div class="campaign-card" *ngFor="let i of [1,2,3,4,5,6]">
          <div class="card-image">
            <div class="category-tag">Medical Aid</div>
            <!-- Placeholder -->
            <div class="image-placeholder">🏥</div>
          </div>
          <div class="card-content">
            <h3>Emergency Medical Supplies for Gaza Hospitals</h3>
            <p class="description">Help us provide critical medical supplies, medicines, and equipment to hospitals in need.</p>
            
            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 75%"></div>
              </div>
              <div class="progress-stats">
                <span class="raised">$75,000 raised</span>
                <span class="goal">of $100,000</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="organizer">
                <div class="avatar"></div>
                <span>By Dr. Sarah Smith</span>
              </div>
              <a [routerLink]="['/campaigns', i]" class="btn btn-primary btn-sm">Donate Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-header {
      background: var(--off-white);
      padding: 4rem 0;
      text-align: center;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .page-header h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: var(--dark-text);
    }

    .page-header p {
      color: var(--light-text);
      font-size: 1.2rem;
    }

    .campaigns-container {
      padding: 4rem 1.5rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1.5rem;
      border-radius: var(--radius-full);
      border: 1px solid #e2e8f0;
      background: white;
      color: var(--light-text);
      font-weight: 500;
      transition: all 0.2s;
    }

    .filter-btn:hover, .filter-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .campaigns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .campaign-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid #f1f5f9;
    }

    .campaign-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }

    .card-image {
      height: 200px;
      background: #f1f5f9;
      position: relative;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      background: var(--off-white);
    }

    .category-tag {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255, 255, 255, 0.9);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-color);
      backdrop-filter: blur(4px);
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .description {
      color: var(--light-text);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .progress-section {
      margin-bottom: 1.5rem;
    }

    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-gradient);
      border-radius: var(--radius-full);
    }

    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }

    .raised {
      font-weight: 700;
      color: var(--primary-color);
    }

    .goal {
      color: var(--light-text);
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .organizer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--light-text);
    }

    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #cbd5e1;
    }
  `]
})
export class CampaignsComponent { }
