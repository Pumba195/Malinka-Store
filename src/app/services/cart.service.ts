import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  private cartItems = signal<CartItem[]>([]);
  public isLoading = signal<boolean>(false);

  totalCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item?.quantity || 0), 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => {
      if (item && item.productId && item.productId.price) {
        return acc + (item.productId.price * item.quantity);
      }
      return acc;
    }, 0)
  );

  get items() {
    return this.cartItems.asReadonly();
  }

  loadCart() {
    this.isLoading.set(true);
    this.http.get<CartItem[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.cartItems.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Failed to load cart', err);
      }
    });
  }

  addToCart(productId: string, quantity: number = 1): Observable<CartItem[]> {
    return this.http.post<CartItem[]>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap((updatedCart) => {
        this.cartItems.set(updatedCart);
      })
    );
  }

  removeFromCart(cartItemId: string) {
    this.http.delete<CartItem[]>(`${this.apiUrl}/remove`, { body: { productId: cartItemId } }).subscribe({
      next: (updatedCart) => this.cartItems.set(updatedCart),
      error: (err) => console.error('Delete failed', err)
    });
  }

  updateQuantity(productId: string, change: number) {
    this.http.patch<CartItem[]>(`${this.apiUrl}/update-quantity`, { productId, change }).subscribe({
      next: (updatedCart) => this.cartItems.set(updatedCart),
      error: (err) => console.error('Update failed', err)
    });
  }

  clearCart() {
    this.cartItems.set([]);
  }
}