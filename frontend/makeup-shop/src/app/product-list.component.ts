import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from './services/product-api.service';
import { Product } from './models/product.model';
import { CartService } from './services/cart.service';
import { CartItem } from './models/cart.model';
import { AuthApiService } from './services/auth-api.service';
import { AdminApiService, AdminProductPayload } from './services/admin-api.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-page">
      <section class="hero">
        <div>
          <h1>Boutique de maquillage</h1>
          <p class="subtitle">Découvrez notre sélection de rouges à lèvres, palettes, fonds de teint et plus encore.</p>
        </div>
      </section>

      <section class="content">
        <!-- Zone admin : création rapide de produit -->
        <div *ngIf="isAdmin" class="admin-create">
          <h2>Ajouter un produit</h2>
          <div class="admin-create-grid">
            <input
              type="text"
              placeholder="Nom du produit"
              [(ngModel)]="newProduct.name"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix (€)"
              [(ngModel)]="newProduct.unitPrice"
            />
            <input
              type="number"
              min="0"
              placeholder="Stock"
              [(ngModel)]="newProduct.unitsInStock"
            />
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Discount %"
              [(ngModel)]="newProduct.discountPercent"
            />
            <input
              type="text"
              placeholder="URL image"
              [(ngModel)]="newProduct.imageUrl"
            />
          </div>
          <button class="primary" (click)="onCreateProduct()" [disabled]="!canCreateProduct()">
            Créer le produit
          </button>
          <div *ngIf="adminError" class="error">{{ adminError }}</div>
        </div>
        <div *ngIf="error" class="error">Erreur de chargement : {{ error }}</div>

        <!-- Affichage des produits (la grille est toujours rendue, même si la liste est vide) -->
        <div class="grid">
          <div
            class="card"
            *ngFor="let p of products"
            [class.selected]="getQuantity(p) > 0"
          >
            <div class="image-wrapper">
              <img [src]="p.imageUrl" [alt]="p.name" />
            </div>
            <div class="card-body">
              <h2>{{ p.name }}</h2>
              <p class="price">{{ p.unitPrice | currency:'EUR':'symbol' }}</p>
              <p class="desc">{{ p.description }}</p>
              <div *ngIf="isAdmin" class="admin-flags">
                <span class="flag" *ngIf="p.unitsInStock === 0">Sold out</span>
                <span class="flag discount" *ngIf="p.discountPercent && p.discountPercent > 0">
                  -{{ p.discountPercent }}%
                </span>
              </div>
              <div class="qty-wrapper" (click)="$event.stopPropagation()">
                <button class="qty-btn" (click)="decreaseQuantity(p); $event.stopPropagation()">−</button>
                <span class="qty-value">{{ getQuantity(p) || 1 }}</span>
                <button class="qty-btn" (click)="increaseQuantity(p); $event.stopPropagation()">+</button>
              </div>
              <span class="badge" *ngIf="getQuantity(p) > 0">Qté dans le panier : {{ getQuantity(p) }}</span>
              <div *ngIf="isAdmin" class="admin-actions" (click)="$event.stopPropagation()">
                <button class="admin-btn" (click)="markSoldOut(p)">Marquer sold out</button>
                <div class="discount-inline">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    [(ngModel)]="discountEdits[p.id]"
                    placeholder="Discount %"
                  />
                  <button class="admin-btn" (click)="applyDiscount(p)">Appliquer</button>
                </div>
              </div>
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
      margin-top: 0.5rem;
    }
    .admin-create {
      margin-bottom: 1.5rem;
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      background: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,0.05);
    }
    .admin-create h2 {
      margin: 0 0 0.75rem;
      font-size: 1.1rem;
    }
    .admin-create-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .admin-create-grid input {
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      border: 1px solid #ddd;
      font-size: 0.85rem;
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
    .admin-flags {
      margin-top: 0.25rem;
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .flag {
      font-size: 0.7rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      background: #ffe0e0;
      color: #c2185b;
      font-weight: 600;
    }
    .flag.discount {
      background: #e3f2fd;
      color: #1565c0;
    }
    .qty-wrapper {
      margin-top: 0.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      border-radius: 10px;
      border: 1px solid #222;
      padding: 0.3rem 0.9rem;
    }
    .qty-btn {
      background: none;
      border: none;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;
      color: #444;
      padding: 0;
      width: 1rem;
      text-align: center;
    }
    .qty-value {
      font-weight: 600;
      font-size: 0.95rem;
      min-width: 0.75rem;
      text-align: center;
    }
    .admin-actions {
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .admin-btn {
      border: none;
      border-radius: 999px;
      padding: 0.25rem 0.7rem;
      font-size: 0.75rem;
      cursor: pointer;
      background: #ffe4f0;
      color: #c2185b;
      align-self: flex-start;
    }
    .discount-inline {
      display: flex;
      gap: 0.3rem;
      align-items: center;
    }
    .discount-inline input {
      width: 70px;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
      border: 1px solid #ddd;
      font-size: 0.75rem;
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
  private auth = inject(AuthApiService);
  private adminApi = inject(AdminApiService);

  products: Product[] = [];
  loading = false;
  error: string | null = null;
  private cartItems: CartItem[] = [];

  // Admin state
  newProduct: AdminProductPayload = {
    name: '',
    unitPrice: undefined,
    unitsInStock: 0,
    discountPercent: null,
    imageUrl: ''
  };
  adminError: string | null = null;
  discountEdits: { [id: number]: number } = {};

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

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
    const current = this.getQuantity(product) || 1;
    this.cart.setQuantity(product, current);
  }

  getQuantity(product: Product): number {
    const found = this.cartItems.find(i => i.product.id === product.id);
    return found ? found.quantity : 0;
  }

  increaseQuantity(product: Product): void {
    const current = this.getQuantity(product) || 1;
    this.cart.setQuantity(product, current + 1);
  }

  decreaseQuantity(product: Product): void {
    const current = this.getQuantity(product) || 1;
    const next = current - 1;
    this.cart.setQuantity(product, next);
  }

  // --- Admin actions ---

  canCreateProduct(): boolean {
    return !!this.newProduct.name && this.newProduct.unitPrice != null;
  }

  onCreateProduct(): void {
    if (!this.canCreateProduct()) {
      return;
    }
    this.adminError = null;
    this.adminApi.createProduct(this.newProduct).subscribe({
      next: created => {
        this.products = [...this.products, created];
        this.newProduct = {
          name: '',
          unitPrice: undefined,
          unitsInStock: 0,
          discountPercent: null,
          imageUrl: ''
        };
        this.cdr.markForCheck();
      },
      error: err => {
        this.adminError = err?.error?.message || 'Erreur lors de la création du produit';
        this.cdr.markForCheck();
      }
    });
  }

  markSoldOut(product: Product): void {
    if (!product.id) {
      return;
    }
    this.adminApi.updateProduct(product.id, { unitsInStock: 0 }).subscribe({
      next: updated => {
        product.unitsInStock = updated.unitsInStock;
        this.cdr.markForCheck();
      },
      error: () => {
        this.adminError = "Impossible de marquer ce produit comme sold out";
        this.cdr.markForCheck();
      }
    });
  }

  applyDiscount(product: Product): void {
    if (!product.id) {
      return;
    }
    const value = this.discountEdits[product.id];
    if (value == null || value < 0 || value > 100) {
      this.adminError = 'Discount doit être entre 0 et 100';
      return;
    }
    this.adminApi.updateProduct(product.id, { discountPercent: value }).subscribe({
      next: updated => {
        (product as any).discountPercent = (updated as any).discountPercent;
        this.cdr.markForCheck();
      },
      error: () => {
        this.adminError = 'Erreur lors de la mise à jour du discount';
        this.cdr.markForCheck();
      }
    });
  }
}
