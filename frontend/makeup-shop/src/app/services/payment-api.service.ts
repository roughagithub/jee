import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaymentRequest, PaymentCreateResponse, PaymentStatusResponse } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/payment`;

  createPayment(payload: PaymentRequest): Observable<PaymentCreateResponse> {
    return this.http.post<PaymentCreateResponse>(`${this.baseUrl}/create`, payload);
  }

  getStatus(transactionId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.baseUrl}/status/${transactionId}`);
  }
}
