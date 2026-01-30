export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  description: string;
}

export interface PaymentCreateResponse {
  // structure renvoyée par bankilyService.createPaymentIntent (clé/valeur dynamique)
  transactionId?: string;
  status?: string;
  [key: string]: any;
}

export interface PaymentStatusResponse {
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  bankilyReference: string;
  createdAt: string;
  completedAt?: string;
}
