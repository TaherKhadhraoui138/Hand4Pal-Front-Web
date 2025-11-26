import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
        </div>
        
        <form class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" placeholder="name@example.com">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="••••••••">
          </div>
          
          <div class="form-actions">
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block">Sign In</button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--off-white);
    }

    .auth-card {
      background: white;
      padding: 3rem;
      border-radius: 2rem;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .auth-header h2 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .auth-header p {
      color: var(--light-text);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--dark-text);
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-md);
      transition: all 0.2s;
      outline: none;
    }

    .form-group input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 166, 81, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1.5rem;
    }

    .forgot-password {
      font-size: 0.9rem;
      color: var(--primary-color);
      font-weight: 500;
    }

    .btn-block {
      width: 100%;
    }

    .auth-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.95rem;
      color: var(--light-text);
    }

    .auth-footer a {
      color: var(--primary-color);
      font-weight: 600;
    }
  `]
})
export class LoginComponent { }
