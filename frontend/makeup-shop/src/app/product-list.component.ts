import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from './services/product-api.service';
import { Product } from './models/product.model';
import { CartService } from './services/cart.service';
import { CartItem } from './models/cart.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-page">
      <section class="hero">
        <div>
          <h1>Boutique de maquillage</h1>
          <p class="subtitle">Découvrez notre sélection de rouges à lèvres, palettes, fonds de teint et plus encore.</p>
        </div>
      </section>

      <section class="content">
        <div *ngIf="error" class="error">Erreur de chargement : {{ error }}</div>

        <!-- Affichage des produits (la grille est toujours rendue, même si la liste est vide) -->
        <div class="grid">
          <div
            class="card"
            *ngFor="let p of products"
            [class.selected]="getQuantity(p) > 0"
            (click)="addToCart(p)"
          >
            <div class="image-wrapper">
              <img [src]="p.imageUrl" [alt]="p.name" />
            </div>
            <div class="card-body">
              <h2>{{ p.name }}</h2>
              <p class="price">{{ p.unitPrice | currency:'EUR':'symbol' }}</p>
              <p class="desc">{{ p.description }}</p>
              <span class="badge" *ngIf="getQuantity(p) > 0">Qté dans le panier : {{ getQuantity(p) }}</span>
            </div>
            <button class="primary" (click)="addToCart(p); $event.stopPropagation()">Ajouter au panier</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
    .product-page {
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
    .info, .error {
      margin-top: 1rem;
    }
    .error {
      color: #b00020;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    .card {
      border-radius: 8px;
      border: 1px solid rgba(255,192,203,0.6);
      padding: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: #fff;
      cursor: pointer;
      transition: box-shadow 0.12s ease, transform 0.12s ease, border-color 0.12s ease;
    }
    .image-wrapper {
      border-radius: 8px;
      overflow: hidden;
      height: 180px;
      margin-bottom: 0.5rem;
    }
    .card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .card.selected {
      border-color: #c2185b;
      box-shadow: 0 14px 32px rgba(194,24,91,0.3);
      transform: translateY(-2px);
    }
    .price {
      font-weight: 600;
      color: #c2185b;
    }
    .desc {
      font-size: 0.9rem;
      color: #555;
    }
    .badge {
      display: inline-block;
      margin-top: 0.35rem;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      background: rgba(194,24,91,0.06);
      color: #c2185b;
      font-size: 0.75rem;
      font-weight: 600;
    }
    button.primary {
      margin-top: auto;
      padding: 0.55rem 1rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #f06292, #c2185b);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 6px 16px rgba(194,24,91,0.35);
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    button.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 22px rgba(194,24,91,0.45);
    }
    `
  ]
})
export class ProductListComponent implements OnInit {
  private productApi = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);
  private cart = inject(CartService);

  products: Product[] = [];
  loading = false;
  error: string | null = null;
  private cartItems: CartItem[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.productApi.getProducts().subscribe({
      next: res => {
        this.products = res._embedded?.products ?? [];
        console.log('Produits chargés', this.products);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.error = err.message ?? 'Erreur inconnue';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.cart.items$.subscribe(items => {
      this.cartItems = items;
      this.cdr.markForCheck();
    });
  }

  addToCart(product: Product): void {
    this.cart.addItem(product);
  }

  getQuantity(product: Product): number {
    const found = this.cartItems.find(i => i.product.id === product.id);
    return found ? found.quantity : 0;
  }
}
