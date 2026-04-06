import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/cart';
  private cartItems = signal<CartItem[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  totalCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((acc, item) =>
      acc + (item.productId.price * item.quantity), 0
    )
  );

  get items() {
    return this.cartItems.asReadonly();
  }

  loadCart() {
    // Extra safety check for localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<CartItem[]>(this.apiUrl).subscribe({
        next: (items) => this.cartItems.set(items),
        error: (err) => console.error('Failed to load cart', err)
      });
    }
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap((user) => {
        if (user && user.cart) {
          this.cartItems.set(user.cart);
        }
      })
    );
  }

  removeFromCart(productId: string) {
    this.http.delete<any>(`${this.apiUrl}/remove`, { body: { productId } }).subscribe({
      next: (updatedCart) => this.cartItems.set(updatedCart),
      error: (err) => console.error('Delete failed', err)
    });
  }

  updateQuantity(productId: string, change: number) {
    // We send the change (1 or -1) to the server
    this.http.patch<any>(`${this.apiUrl}/update-quantity`, { productId, change }).subscribe({
      next: (updatedCart) => {
        this.cartItems.set(updatedCart);
      },
      error: (err) => console.error('Update failed', err)
    });
  }

  processCheckout() {
    // This will be expanded when we create the Orders collection
    console.log('Sending order to Malinka HQ...', this.cartItems());
  }

  clearCart() {
    this.cartItems.set([]);
  }
}