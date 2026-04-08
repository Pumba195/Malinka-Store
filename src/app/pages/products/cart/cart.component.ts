import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  public cartService = inject(CartService);

  public items = this.cartService.items;
  public totalCount = this.cartService.totalCount;
  public totalPrice = this.cartService.totalPrice;
  public isLoading = this.cartService.isLoading;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.loadCart();
    }
  }

  updateQuantity(productId: string, change: number): void {
    this.cartService.updateQuantity(productId, change);
  }

  removeFromCart(productId: string): void {
    if (confirm('Do you want to remove this product entirely?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  onCheckout(): void {
    if (this.items().length === 0) return;

    console.log('Finalizing order for:', this.items());
    alert('Thank you for your order! Malinka Store team will contact you soon.');
  }
}