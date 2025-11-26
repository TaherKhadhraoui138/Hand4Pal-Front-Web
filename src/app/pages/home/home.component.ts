import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <h1>Make a Difference for <span class="text-gradient">Palestine</span></h1>
          <p>Join our global community in raising funds and awareness. Every donation brings hope and essential aid to those in need.</p>
          <div class="hero-actions">
            <a routerLink="/campaigns" class="btn btn-primary">Browse Campaigns</a>
            <a routerLink="/register" class="btn btn-outline">Start Fundraising</a>
          </div>
        </div>
        <div class="hero-image">
          <!-- Placeholder for hero image -->
          <div class="image-placeholder">
             <span style="font-size: 4rem;">🕊️</span>
          </div>
        </div>
      </div>
    </div>

    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Hand<span class="text-gradient">4Pal</span>?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="icon">🤝</div>
            <h3>Direct Impact</h3>
            <p>Your donations go directly to verified campaigns providing essential aid and support.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🌍</div>
            <h3>Global Community</h3>
            <p>Connect with people worldwide who share your passion for humanitarian causes.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🛡️</div>
            <h3>Secure & Transparent</h3>
            <p>We ensure every transaction is secure and every campaign is verified for authenticity.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-box">
          <h2>Ready to Create Change?</h2>
          <p>Start your own campaign today and help us build a better future.</p>
          <a routerLink="/register" class="btn btn-primary">Start a Campaign</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: var(--hero-gradient);
      padding: 6rem 0;
      min-height: 80vh;
      display: flex;
      align-items: center;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-text h1 {
      font-size: 4rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      font-weight: 800;
    }

    .hero-text p {
      font-size: 1.25rem;
      color: var(--light-text);
      margin-bottom: 2.5rem;
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .image-placeholder {
      width: 100%;
      height: 400px;
      background: white;
      border-radius: 2rem;
      box-shadow: var(--glass-shadow);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .image-placeholder::before {
        content: '';
        position: absolute;
        width: 150%;
        height: 150%;
        background: var(--primary-gradient);
        opacity: 0.1;
        border-radius: 50%;
        top: -25%;
        left: -25%;
    }

    .features {
      padding: 6rem 0;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      border-radius: var(--radius-lg);
      background: var(--off-white);
      transition: transform 0.3s ease;
      text-align: center;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card .icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: var(--light-text);
    }

    .cta {
      padding: 6rem 0;
    }

    .cta-box {
      background: var(--dark-text);
      color: white;
      border-radius: 2rem;
      padding: 4rem;
      text-align: center;
      background-image: linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('data:image/svg+xml,...'); /* Add pattern if needed */
    }

    .cta-box h2 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .cta-box p {
      font-size: 1.25rem;
      color: #cbd5e1;
      margin-bottom: 2.5rem;
    }
  `]
})
export class HomeComponent { }
