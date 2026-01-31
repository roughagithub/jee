import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService, AdminDashboardResponse, AdminUser } from './services/admin-api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <h1>Panel d'administration</h1>

      <section class="admin-section" *ngIf="dashboard">
        <div class="admin-summary">
          <div class="admin-card">
            <span class="label">Utilisateurs inscrits</span>
            <span class="value">{{ dashboard.totalUsers }}</span>
          </div>
        </div>
      </section>
      <section class="admin-section">
        <div *ngIf="usersError" class="error">{{ usersError }}</div>
        <table class="users-table" *ngIf="users?.length; else noUsers">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.id }}</td>
              <td>{{ u.username }}</td>
              <td>{{ u.email }}</td>
              <td>
                <button class="danger" (click)="onDeleteUser(u.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noUsers>
          <p>Aucun utilisateur trouvé.</p>
        </ng-template>
      </section>
    </div>
  `,
  styles: [
    `
    .admin-page {
      padding: 2rem 2.5rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .admin-page h1 {
      margin: 0 0 1.25rem;
      font-size: 1.9rem;
    }
    .admin-section {
      margin-top: 1.5rem;
    }
    .admin-summary {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
    }
    .admin-card {
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      background: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 200px;
    }
    .admin-card .label {
      font-size: 0.85rem;
      color: #666;
    }
    .admin-card .value {
      font-size: 1.4rem;
      font-weight: 600;
      color: #c2185b;
    }
    .users-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.75rem;
      background: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,0.04);
      border-radius: 0.75rem;
      overflow: hidden;
    }
    .users-table th,
    .users-table td {
      padding: 0.6rem 0.75rem;
      text-align: left;
      font-size: 0.9rem;
    }
    .users-table thead {
      background: #ffe4f0;
    }
    .users-table tbody tr:nth-child(even) {
      background: #fff7fb;
    }
    .users-table tbody tr:hover {
      background: #ffeef7;
    }
    button.danger {
      border: none;
      border-radius: 999px;
      padding: 0.3rem 0.8rem;
      background: #e53935;
      color: #fff;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .error {
      color: #b00020;
      margin-top: 0.5rem;
    }
    `
  ]
})
export class AdminComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  dashboard: AdminDashboardResponse | null = null;
  users: AdminUser[] = [];
  usersError: string | null = null;

  ngOnInit(): void {
    this.adminApi.getDashboard().subscribe({
      next: d => (this.dashboard = d),
      error: () => (this.dashboard = null)
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.adminApi.getUsers().subscribe({
      next: list => {
        this.users = list;
        this.usersError = null;
      },
      error: () => {
        this.usersError = "Erreur lors du chargement des utilisateurs";
      }
    });
  }

  onDeleteUser(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) {
      return;
    }
    this.adminApi.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Erreur lors de la suppression')
    });
  }
}
