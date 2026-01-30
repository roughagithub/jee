import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from './services/cart.service';
import { CartItem } from './models/cart.model';
import { PaymentApiService } from './services/payment-api.service';
import { PaymentRequest, PaymentCreateResponse } from './models/payment.model';
import { CheckoutApiService } from './services/checkout-api.service';
import { Address, Customer, OrderItem, Purchase } from './models/purchase.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-page">
      <section class="hero">
        <div>
          <h1>Votre panier</h1>
          <p class="subtitle">Retrouvez ici les produits que vous avez ajoutés.</p>
        </div>
      </section>

      <section class="content" *ngIf="items.length; else empty">
        <div class="cart-grid">
          <div class="cart-card" *ngFor="let item of items">
            <div class="thumb">
              <img [src]="item.product.imageUrl" [alt]="item.product.name" />
            </div>
            <div class="info">
              <h2>{{ item.product.name }}</h2>
              <p class="desc">{{ item.product.description }}</p>
              <div class="meta">
                <span class="price">{{ item.product.unitPrice | currency:'EUR':'symbol' }}</span>
                <span class="qty">Qté : {{ item.quantity }}</span>
                <span class="line-total">Total : {{ item.product.unitPrice * item.quantity | currency:'EUR':'symbol' }}</span>
              </div>
            </div>
            <div class="actions">
              <button class="link" (click)="remove(item.product.id)">Retirer</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <span>Total panier</span>
          <strong>{{ total | currency:'EUR':'symbol' }}</strong>
        </div>

        <div class="payment-panel">
          <h2>Payer avec Bankily</h2>
          <p class="hint">Entrez votre numéro Bankily au format +222XXXXXXXX puis validez le paiement.</p>
          <div class="payment-form">
            <input
              type="tel"
              placeholder="Numéro Bankily (+222...)"
              [(ngModel)]="phoneNumber"
            />
            <button class="primary" (click)="payWithBankily()" [disabled]="processing || !phoneNumber">
              {{ processing ? 'Paiement en cours...' : 'Payer maintenant' }}
            </button>
          </div>
          <p class="payment-message success" *ngIf="paymentMessage && paymentSuccess">{{ paymentMessage }}</p>
          <p class="payment-message error" *ngIf="paymentMessage && !paymentSuccess">{{ paymentMessage }}</p>
        </div>

        <div class="checkout-panel">
          <h2>Validation de la commande</h2>
          <p class="hint">Renseignez vos informations pour finaliser la commande et la livraison.</p>

          <div class="checkout-grid">
            <div class="field-group">
              <label>Prénom</label>
              <input type="text" [(ngModel)]="customer.firstName" />
            </div>
            <div class="field-group">
              <label>Nom</label>
              <input type="text" [(ngModel)]="customer.lastName" />
            </div>
            <div class="field-group full">
              <label>Email</label>
              <input type="email" [(ngModel)]="customer.email" />
            </div>
            <div class="field-group full">
              <label>Adresse</label>
              <input type="text" [(ngModel)]="shippingAddress.street" />
            </div>
            <div class="field-row">
              <div class="field-group">
                <label>Ville</label>
                <input type="text" [(ngModel)]="shippingAddress.city" />
              </div>
              <div class="field-group">
                <label>Pays</label>
                <input type="text" [(ngModel)]="shippingAddress.country" />
              </div>
              <div class="field-group">
                <label>Code postal</label>
                <input type="text" [(ngModel)]="shippingAddress.zipCode" />
              </div>
            </div>
          </div>

          <button
            class="primary checkout-btn"
            (click)="placeOrder()"
            [disabled]="placingOrder || !canPlaceOrder()"
          >
            {{ placingOrder ? 'Commande en cours...' : 'Valider la commande' }}
          </button>

          <p class="payment-message success" *ngIf="orderMessage && orderSuccess">{{ orderMessage }}</p>
          <p class="payment-message error" *ngIf="orderMessage && !orderSuccess">{{ orderMessage }}</p>
        </div>
      </section>

      <ng-template #empty>
        <p class="info">Votre panier est vide pour le moment.</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
    .cart-page {
      padding: 2rem 2.5rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .hero {
      margin-bottom: 1.5rem;
    }
    .hero h1 {
      margin: 0 0 0.4rem;
      font-size: 2rem;
    }
    .hero .subtitle {
      color: #666;
      font-size: 0.95rem;
    }
    .info {
      margin-top: 1rem;
      color: #666;
    }
    .cart-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .cart-card {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 1rem;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid rgba(255,192,203,0.6);
      background: #fff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      align-items: center;
    }
    .thumb {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .info h2 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
    }
    .desc {
      margin: 0 0 0.5rem;
      font-size: 0.85rem;
      color: #555;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.9rem;
      align-items: baseline;
    }
    .price {
      font-weight: 600;
      color: #c2185b;
    }
    .qty {
      color: #444;
    }
    .line-total {
      font-weight: 600;
    }
    .actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }
    .actions .link {
      background: none;
      border: none;
      color: #c2185b;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: underline;
      padding: 0;
    }
    .cart-summary {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      font-size: 1rem;
      align-items: baseline;
    }
    .cart-summary strong {
      font-size: 1.1rem;
      color: #c2185b;
    }
    .payment-panel {
      margin-top: 2rem;
      padding: 1.25rem 1.5rem;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,0.06);
      background: #fff7fb;
    }
    .payment-panel h2 {
      margin: 0 0 0.5rem;
      font-size: 1.15rem;
    }
    .payment-panel .hint {
      margin: 0 0 0.75rem;
      font-size: 0.85rem;
      color: #666;
    }
    .payment-form {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
    .payment-form input[type='tel'] {
      padding: 0.5rem 0.75rem;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,0.18);
      min-width: 220px;
      font-size: 0.9rem;
    }
    .payment-form .primary {
      padding: 0.55rem 1.1rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #f06292, #c2185b);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 6px 16px rgba(194,24,91,0.35);
    }
    .payment-form .primary[disabled] {
      opacity: 0.6;
      cursor: default;
      box-shadow: none;
    }
    .payment-message {
      margin-top: 0.75rem;
      font-size: 0.9rem;
    }
    .payment-message.success {
      color: #2e7d32;
    }
    .payment-message.error {
      color: #b00020;
    }
    .checkout-panel {
      margin-top: 2rem;
      padding: 1.25rem 1.5rem;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,0.06);
      background: #ffffff;
    }
    .checkout-panel h2 {
      margin: 0 0 0.5rem;
      font-size: 1.15rem;
    }
    .checkout-panel .hint {
      margin: 0 0 0.75rem;
      font-size: 0.85rem;
      color: #666;
    }
    .checkout-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem 1rem;
      margin-bottom: 1rem;
    }
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.85rem;
    }
    .field-group.full {
      grid-column: 1 / -1;
    }
    .field-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem 1rem;
    }
    .field-group label {
      color: #555;
    }
    .field-group input {
      padding: 0.45rem 0.65rem;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.18);
      font-size: 0.9rem;
    }
    .checkout-btn {
      margin-top: 0.5rem;
      padding: 0.55rem 1.4rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #f06292, #c2185b);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 6px 16px rgba(194,24,91,0.35);
    }
    .checkout-btn[disabled] {
      opacity: 0.6;
      cursor: default;
      box-shadow: none;
    }
    @media (max-width: 640px) {
      .cart-page {
        padding: 1.5rem 1rem;
      }
      .cart-card {
        grid-template-columns: 80px 1fr;
        grid-auto-rows: auto;
      }
      .actions {
        align-items: flex-start;
      }
    }
    `
  ]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private paymentApi = inject(PaymentApiService);
  private checkoutApi = inject(CheckoutApiService);

  items: CartItem[] = [];
  total = 0;
  phoneNumber = '';
  processing = false;
  paymentMessage: string | null = null;
  paymentSuccess = false;
  customer: Customer = { firstName: '', lastName: '', email: '' };
  shippingAddress: Address = {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  };
  placingOrder = false;
  orderMessage: string | null = null;
  orderSuccess = false;

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  remove(productId: number): void {
    this.cartService.removeItem(productId);
  }

  payWithBankily(): void {
    if (!this.total || !this.phoneNumber) {
      return;
    }
    this.processing = true;
    this.paymentMessage = null;
    this.paymentSuccess = false;

    const payload: PaymentRequest = {
      amount: this.total,
      phoneNumber: this.phoneNumber,
      description: `Commande Makeup Shop - total ${this.total.toFixed(2)} EUR`
    };

    this.paymentApi.createPayment(payload).subscribe({
      next: (res: PaymentCreateResponse) => {
        this.processing = false;
        this.paymentSuccess = true;
        const tx = (res.transactionId as string) || (res['transactionId'] as string) || '';
        this.paymentMessage = tx
          ? `Paiement Bankily initié avec succès. Référence transaction : ${tx}`
          : 'Paiement Bankily initié avec succès.';
      },
      error: err => {
        this.processing = false;
        this.paymentSuccess = false;
        this.paymentMessage = err?.error?.error || 'Erreur lors du paiement Bankily.';
      }
    });
  }

  canPlaceOrder(): boolean {
    return (
      !!this.customer.firstName &&
      !!this.customer.lastName &&
      !!this.customer.email &&
      !!this.shippingAddress.street &&
      !!this.shippingAddress.city &&
      !!this.shippingAddress.country &&
      !!this.shippingAddress.zipCode &&
      this.items.length > 0
    );
  }

  placeOrder(): void {
    if (!this.canPlaceOrder()) {
      return;
    }

    this.placingOrder = true;
    this.orderMessage = null;
    this.orderSuccess = false;

    const orderItems: OrderItem[] = this.items.map(item => ({
      imageUrl: item.product.imageUrl,
      unitPrice: item.product.unitPrice,
      quantity: item.quantity,
      productId: item.product.id
    }));

    const purchase: Purchase = {
      customer: this.customer,
      shippingAddress: this.shippingAddress,
      billingAddress: this.shippingAddress,
      order: {
        totalPrice: this.total,
        totalQuantity: this.items.reduce((sum, i) => sum + i.quantity, 0)
      },
      orderItems
    };

    this.checkoutApi.placeOrder(purchase).subscribe({
      next: res => {
        this.placingOrder = false;
        this.orderSuccess = true;
        this.orderMessage = `Commande validée avec succès. Numéro de suivi : ${res.orderTrackingNumber}`;
      },
      error: err => {
        this.placingOrder = false;
        this.orderSuccess = false;
        this.orderMessage = err?.error?.message || 'Erreur lors de la validation de la commande.';
      }
    });
  }
}
