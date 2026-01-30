import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart-items';
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$ = this.itemsSubject.asObservable();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private loadFromStorage(): CartItem[] {
    if (!this.isBrowser()) {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  }

  private saveToStorage(items: CartItem[]): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addItem(product: CartItem['product']): void {
    const items = [...this.itemsSubject.value];
    const index = items.findIndex(i => i.product.id === product.id);
    if (index >= 0) {
      items[index] = { ...items[index], quantity: items[index].quantity + 1 };
    } else {
      items.push({ product, quantity: 1 });
    }
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  removeItem(productId: number): void {
    const items = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  clear(): void {
    this.itemsSubject.next([]);
    this.saveToStorage([]);
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.product.unitPrice * item.quantity, 0);
  }
}
