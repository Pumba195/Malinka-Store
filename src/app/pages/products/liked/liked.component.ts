import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-liked',
  imports: [CommonModule, RouterModule],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.css'
})

export class LikedComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  public items = this.productsService.favoriteItems;
  public isLoading = this.productsService.isLoading;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (!!localStorage.getItem('token')) {
        this.productsService.getFullFavorites();
      } 
    }
  }

  toggleLike(productTitle: string, productId: string) {
    this.productsService.toggleFavorite(productId);
    this.toastService.show('Removed from Wishlist', `${productTitle}`, 'wishlist');
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Error', `Please log in to add items to Сart!`, 'error');
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        this.toastService.show('Added to Сart', `${product.title}`, 'cart');
      },
      error: () => {
        this.toastService.show('Error', `Could not add items to Сart!`, 'error');
      }
    });
  }
}