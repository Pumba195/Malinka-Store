import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductItem } from '../models/product-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}`;

  private favorites = signal<ProductItem[]>([]);
  public isLoading = signal<boolean>(false);

  getAllProducts(limit: number = 15, offset: number = 0, sort: string = 'newest', search: string = '') {
    return this.http.get<ProductItem[]>(
      `${this.apiUrl}/products?limit=${limit}&offset=${offset}&sort=${sort}&search=${search}`
    );
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  toggleFavorite(productId: string): void {
    this.http.patch<ProductItem[]>(`${this.apiUrl}/cart/favorites/toggle`, { productId }).subscribe({
      next: (updatedFavorites) => {
        this.favorites.set(updatedFavorites);
      },
      error: (err) => console.error('Error set like:', err)
    });
  }

  isFavorite(productId: string): boolean {
    return this.favorites().some(item => item._id === productId);
  }

  getFullFavorites() {
    this.isLoading.set(true);
    this.http.get<ProductItem[]>(`${this.apiUrl}/cart/favorites`).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.favorites.set(data);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
      }
    });;
  }

  clearFavorites() {
    this.favorites.set([]);
  }

  get favoriteItems() {
    return this.favorites.asReadonly();
  }
}