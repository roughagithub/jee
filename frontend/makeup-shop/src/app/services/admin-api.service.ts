import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product.model';

export interface AdminDashboardResponse {
  totalUsers: number;
  title: string;
  message: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  roles?: string[];
}

export interface AdminProductPayload {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  sku?: string;
  unitPrice?: number;
  unitsInStock?: number;
  active?: boolean;
  discountPercent?: number | null;
  categoryId?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin`;

  getDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(`${this.baseUrl}/dashboard`);
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  // --- Produits (admin) ---

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  createProduct(payload: AdminProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, payload);
  }

  updateProduct(id: number, payload: AdminProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, payload);
  }
}
