import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';
import { SignupRequest } from './models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Créer un compte</h1>
          <p class="subtitle">Rejoignez la boutique de maquillage et enregistrez vos favoris.</p>
        </div>

        <form (ngSubmit)="onSubmit()" #signupForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autocomplete="username"
              [(ngModel)]="form.username"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autocomplete="email"
              [(ngModel)]="form.email"
            />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autocomplete="new-password"
              [(ngModel)]="form.password"
            />
          </div>

          <button class="primary" type="submit" [disabled]="loading || !signupForm.form.valid">
            {{ loading ? 'Création du compte...' : "S'inscrire" }}
          </button>

          <div *ngIf="error" class="error">{{ error }}</div>
          <div *ngIf="success" class="success">{{ success }}</div>

          <p class="helper">
            Vous avez déjà un compte ?
            <a routerLink="/login">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: radial-gradient(circle at top left, #ffe4f0 0, #faf5ff 40%, #ffffff 100%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      padding: 2.2rem 2.4rem;
      border-radius: 18px;
      box-shadow: 0 18px 45px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,192,203,0.4);
    }
    .auth-header h1 {
      margin: 0 0 0.5rem;
      font-size: 1.8rem;
    }
    .subtitle {
      margin-bottom: 1.8rem;
      color: #666;
      font-size: 0.95rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    label {
      font-size: 0.85rem;
      font-weight: 600;
    }
    input {
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #ddd;
      font-size: 0.95rem;
    }
    input:focus {
      outline: none;
      border-color: #c2185b;
      box-shadow: 0 0 0 1px rgba(194,24,91,0.2);
    }
    button.primary {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #f06292, #c2185b);
      color: white;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.75rem;
      transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease;
      box-shadow: 0 8px 18px rgba(194,24,91,0.35);
    }
    button.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(194,24,91,0.45);
    }
    button.primary[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .error {
      margin-top: 0.75rem;
      color: #b00020;
      font-size: 0.85rem;
    }
    .success {
      margin-top: 0.75rem;
      color: #2e7d32;
      font-size: 0.85rem;
    }
    .helper {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #666;
      text-align: center;
    }
    .helper a {
      color: #c2185b;
      font-weight: 600;
      text-decoration: none;
    }
    .helper a:hover {
      text-decoration: underline;
    }
    `
  ]
})
export class SignupComponent {
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  form: SignupRequest = {
    username: '',
    email: '',
    password: ''
  };

  loading = false;
  error: string | null = null;
  success: string | null = null;

  onSubmit(): void {
    if (!this.form.username || !this.form.email || !this.form.password) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.authApi.register(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Compte créé avec succès, vous pouvez vous connecter.';
        // Optionnel : rediriger directement vers la page de login
        // this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || "Impossible de créer le compte";
      }
    });
  }
}
