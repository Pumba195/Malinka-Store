import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductItem } from '../models/product-item.model';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  private http = inject(HttpClient);

  private apiURL = "http://localhost:3000";
  private favorites = signal<ProductItem[]>([]);
  public isLoading = signal<boolean>(false);

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/products`);
  }
  deleteProduct(id: string) {
    return this.http.delete(`${this.apiURL}/products/${id}`);
  }

  toggleFavorite(productId: string): void {
    this.http.patch<ProductItem[]>(`${this.apiURL}/cart/favorites/toggle`, { productId }).subscribe({
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
    this.http.get<ProductItem[]>(`${this.apiURL}/cart/favorites`).subscribe({
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