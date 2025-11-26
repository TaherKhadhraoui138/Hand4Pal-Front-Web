import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-content">
        <a routerLink="/" class="logo">
          Hand<span class="text-gradient">4Pal</span>
        </a>
        
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/campaigns" routerLinkActive="active">Campaigns</a>
          <a routerLink="/login" class="btn btn-outline btn-sm">Login</a>
          <a routerLink="/register" class="btn btn-primary btn-sm">Start Fundraising</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 1rem 0;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a:not(.btn) {
      font-weight: 500;
      color: var(--light-text);
      position: relative;
    }

    .nav-links a:not(.btn):hover,
    .nav-links a.active {
      color: var(--primary-color);
    }

    .btn-sm {
      padding: 0.5rem 1.25rem;
      font-size: 0.9rem;
    }
  `]
})
export class NavbarComponent {}
