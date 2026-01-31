import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="brand">
          <span>MAKEUP</span> SHOP
        </div>
        <nav class="nav-right">
          <span routerLink="/shop" routerLinkActive="active">Catalogue</span>
          <span *ngIf="!isAdmin" routerLink="/cart" routerLinkActive="active">Panier</span>
          <span *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active">Admin</span>
          <span class="account-trigger" (click)="toggleAccountMenu()" [class.active]="accountOpen">Mon compte</span>
          <div class="account-menu" *ngIf="accountOpen">
            <div class="account-header">
              <div class="avatar-circle">
                <span class="avatar-initial">
                  {{ (username || email || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="account-text">
                <p class="account-name">Profil</p>
                <p class="account-email" *ngIf="email">{{ email }}</p>
              </div>
            </div>
            <button (click)="logout()">Se déconnecter</button>
          </div>
        </nav>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  private auth = inject(AuthApiService);
  private router = inject(Router);

  accountOpen = false;

  get username(): string | null {
    return this.auth.getUsername();
  }

  get email(): string | null {
    return this.auth.getEmail();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  toggleAccountMenu(): void {
    this.accountOpen = !this.accountOpen;
  }

  logout(): void {
    this.auth.logout();
    this.accountOpen = false;
    this.router.navigate(['/login']);
  }
}
