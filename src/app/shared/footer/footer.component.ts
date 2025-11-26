import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>Hand<span class="text-gradient">4Pal</span></h3>
            <p>Empowering change, one donation at a time. Join us in making a difference for Palestine.</p>
          </div>
          
          <div class="footer-links">
            <h4>Platform</h4>
            <a routerLink="/campaigns">Browse Campaigns</a>
            <a routerLink="/register">Start Fundraising</a>
            <a href="#">How it Works</a>
          </div>

          <div class="footer-links">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>

          <div class="footer-newsletter">
            <h4>Stay Updated</h4>
            <div class="input-group">
              <input type="email" placeholder="Enter your email">
              <button class="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 Hand4Pal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background-color: white;
      padding: 5rem 0 2rem;
      border-top: 1px solid rgba(0,0,0,0.05);
      margin-top: auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }

    .footer-brand h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .footer-brand p {
      color: var(--light-text);
      line-height: 1.6;
    }

    .footer-links h4, .footer-newsletter h4 {
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-links a {
      color: var(--light-text);
    }

    .footer-links a:hover {
      color: var(--primary-color);
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
    }

    .input-group input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-full);
      outline: none;
    }

    .input-group input:focus {
      border-color: var(--primary-color);
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;
      color: var(--light-text);
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent { }
