import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-page">
      <div class="account-card">
        <h1>Mon compte</h1>
        <p class="subtitle">Informations de votre profil.</p>

        <div class="info-row">
          <span class="label">Identifiant</span>
          <span class="value">{{ username || '—' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">{{ email || '—' }}</span>
        </div>

        <button class="primary" (click)="logout()">Se déconnecter</button>
      </div>
    </div>
  `,
  styles: [
    `
    .account-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: radial-gradient(circle at top left, #ffe4f0 0, #faf5ff 40%, #ffffff 100%);
    }
    .account-card {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      padding: 2rem 2.2rem;
      border-radius: 18px;
      box-shadow: 0 18px 45px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,192,203,0.4);
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.7rem;
    }
    .subtitle {
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 0.95rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }
    .label {
      color: #777;
    }
    .value {
      font-weight: 600;
    }
    .primary {
      width: 100%;
      margin-top: 1.5rem;
      padding: 0.7rem 1rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #f06292, #c2185b);
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 18px rgba(194,24,91,0.35);
    }
    `
  ]
})
export class AccountComponent {
  private auth = inject(AuthApiService);
  private router = inject(Router);

  get username(): string | null {
    return this.auth.getUsername();
  }

  get email(): string | null {
    return this.auth.getEmail();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
