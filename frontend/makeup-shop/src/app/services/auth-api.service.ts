import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginRequest, SignupRequest, JwtResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  // Helper to ensure we only touch localStorage in the browser (avoids SSR errors)
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  login(payload: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.baseUrl}/signin`, payload)
      .pipe(
        tap(res => {
          if (this.isBrowser()) {
            localStorage.setItem('token', res.token);
            const anyRes = res as any;
            if (anyRes?.username) {
              localStorage.setItem('username', anyRes.username);
            }
            if (anyRes?.email) {
              localStorage.setItem('email', anyRes.email);
            }
            if (Array.isArray(anyRes?.roles)) {
              localStorage.setItem('roles', JSON.stringify(anyRes.roles));
            }
          }
        })
      );
  }

  register(payload: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('roles');
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getUsername(): string | null {
    return this.isBrowser() ? localStorage.getItem('username') : null;
  }

  getEmail(): string | null {
    return this.isBrowser() ? localStorage.getItem('email') : null;
  }

  getRoles(): string[] {
    if (!this.isBrowser()) {
      return [];
    }
    const raw = localStorage.getItem('roles');
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }
}
