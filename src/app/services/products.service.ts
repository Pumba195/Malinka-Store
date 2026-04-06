import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  constructor(private http: HttpClient) { }

  private apiURL = "http://localhost:3000";

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/products`);
  }
  deleteProduct(id: string) {
    return this.http.delete(`${this.apiURL}/products/${id}`);
  }

  favorites = signal<string[]>([]);

  toggleFavorite(productId: string): Observable<string[]> {
    return this.http.patch<string[]>(`${this.apiURL}/cart/favorites/toggle`, { productId })
      .pipe(
        tap(updatedIds => this.favorites.set(updatedIds))
      );
  }

  isFavorite(productId: string): boolean {
    return this.favorites().includes(productId);
  }

  getFullFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/cart/favorites`);
  }
}