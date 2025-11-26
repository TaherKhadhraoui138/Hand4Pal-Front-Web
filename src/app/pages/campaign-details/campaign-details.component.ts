import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-campaign-details',
    standalone: true,
    imports: [RouterLink, CommonModule],
    template: `
    <div class="details-container">
      <div class="container">
        <div class="details-grid">
          <!-- Left Column: Content -->
          <div class="main-content">
            <div class="campaign-image">
              <div class="image-placeholder">🏥</div>
            </div>
            
            <div class="campaign-header">
              <span class="category-badge">Medical Aid</span>
              <h1>Emergency Medical Supplies for Gaza Hospitals</h1>
              <div class="campaign-meta">
                <div class="organizer">
                  <div class="avatar"></div>
                  <span>Organized by <strong>Dr. Sarah Smith</strong></span>
                </div>
                <span class="date">Created 2 days ago</span>
                <span class="location">📍 Gaza Strip</span>
              </div>
            </div>

            <div class="tabs">
              <button class="tab-btn active">About</button>
              <button class="tab-btn">Updates (3)</button>
              <button class="tab-btn">Comments</button>
            </div>

            <div class="content-body">
              <p>Hospitals in Gaza are facing critical shortages of essential medicines, surgical supplies, and fuel. This campaign aims to provide immediate relief by delivering:</p>
              <ul>
                <li>Anesthesia and surgical kits</li>
                <li>Antibiotics and painkillers</li>
                <li>Emergency trauma supplies</li>
                <li>Fuel for hospital generators</li>
              </ul>
              <p>Every donation, no matter how small, helps save lives. We are working directly with local partners to ensure aid reaches those who need it most effectively and transparently.</p>
              
              <h3>Comments</h3>
              <div class="comments-section">
                <div class="comment" *ngFor="let i of [1,2,3]">
                  <div class="avatar"></div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <strong>Anonymous Donor</strong>
                      <span class="donation-badge">$50</span>
                      <span class="time">2 hours ago</span>
                    </div>
                    <p>Praying for everyone's safety. Keep up the great work.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Donation Card -->
          <div class="sidebar">
            <div class="donation-card">
              <div class="progress-section">
                <div class="amount-display">
                  <span class="current">$75,000</span>
                  <span class="target">raised of $100,000 goal</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 75%"></div>
                </div>
                <div class="donor-count">
                  <strong>1,234</strong> donations
                </div>
              </div>

              <div class="donation-actions">
                <button class="btn btn-primary btn-lg btn-block">Donate Now</button>
                <button class="btn btn-outline btn-lg btn-block">Share Campaign</button>
              </div>

              <div class="recent-donations">
                <h4>Recent Donations</h4>
                <div class="mini-donation" *ngFor="let i of [1,2,3]">
                  <div class="icon">💚</div>
                  <div class="info">
                    <strong>$100</strong>
                    <span>Anonymous</span>
                  </div>
                  <span class="time">5m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .details-container {
      padding: 3rem 0;
      background: var(--off-white);
      min-height: 100vh;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }

    @media (max-width: 768px) {
      .details-grid {
        grid-template-columns: 1fr;
      }
    }

    .campaign-image {
      height: 400px;
      background: #cbd5e1;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
      background: white;
    }

    .campaign-header {
      margin-bottom: 2rem;
    }

    .category-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #dcfce7;
      color: var(--primary-color);
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .campaign-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .campaign-meta {
      display: flex;
      gap: 2rem;
      color: var(--light-text);
      font-size: 0.95rem;
      align-items: center;
    }

    .organizer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e2e8f0;
    }

    .tabs {
      display: flex;
      gap: 2rem;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 1rem 0;
      font-weight: 600;
      color: var(--light-text);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .tab-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .content-body {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--dark-text);
    }

    .content-body p {
      margin-bottom: 1.5rem;
    }

    .content-body ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }

    .donation-card {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 6rem;
    }

    .amount-display {
      margin-bottom: 1rem;
    }

    .current {
      display: block;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--dark-text);
    }

    .target {
      color: var(--light-text);
      font-size: 0.9rem;
    }

    .progress-bar {
      height: 10px;
      background: #f1f5f9;
      border-radius: var(--radius-full);
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-gradient);
      border-radius: var(--radius-full);
    }

    .donation-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 2rem 0;
    }

    .btn-lg {
      padding: 1rem;
      font-size: 1.1rem;
    }

    .btn-block {
      width: 100%;
    }

    .recent-donations h4 {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .mini-donation {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .mini-donation:last-child {
      border-bottom: none;
    }

    .mini-donation .icon {
      width: 32px;
      height: 32px;
      background: #dcfce7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .mini-donation .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
    }

    .mini-donation .time {
      font-size: 0.8rem;
      color: var(--light-text);
    }
    
    .comments-section {
        margin-top: 2rem;
    }
    
    .comment {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .comment-content {
        flex: 1;
    }
    
    .comment-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .donation-badge {
        background: #f1f5f9;
        padding: 0.1rem 0.5rem;
        border-radius: var(--radius-full);
        font-weight: 600;
        font-size: 0.8rem;
    }
    
    .comment p {
        margin-bottom: 0;
        font-size: 0.95rem;
    }
  `]
})
export class CampaignDetailsComponent { }
