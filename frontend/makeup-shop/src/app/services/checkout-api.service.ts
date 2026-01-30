import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Purchase, PurchaseResponse } from '../models/purchase.model';

@Injectable({ providedIn: 'root' })
export class CheckoutApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/checkout`;

  placeOrder(purchase: Purchase): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${this.baseUrl}/purchase`, purchase);
  }
}
