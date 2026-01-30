import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product, ProductCategory } from '../models/product.model';

interface PagedProductsResponse {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface ProductCategoriesResponse {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getProducts(page = 0, size = 20): Observable<PagedProductsResponse> {
    const url = `${this.baseUrl}/products?page=${page}&size=${size}`;
    return this.http.get<PagedProductsResponse>(url);
  }

  getCategories(): Observable<ProductCategory[]> {
    const url = `${this.baseUrl}/product-category`;
    return this.http
      .get<ProductCategoriesResponse>(url)
      .pipe(map(res => res._embedded.productCategory));
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${id}`;
    return this.http.get<Product>(url);
  }
}
