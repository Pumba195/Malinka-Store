import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  constructor(
    protected readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) { }

  showToast = false;
  toastMessage = '';
  isError = false;
  clickCount = 0;
  toastTimeout: any;

  products: any[] = [];
  errorMessage: string = "";

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getProducts();
      if (this.authService.isLoggedIn()) {
        this.productsService.getFullFavorites();
      }
    }
  }

  showToastNotification(message: string, error: boolean = false) {
    this.isError = error;

    if (error && this.showToast && this.toastMessage === message) {
      this.clickCount++;
    } else if(this.showToast && this.toastMessage === message){
      this.clickCount++;
    } else {
      this.toastMessage = message;
      this.clickCount = 1;
    }

    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.clickCount = 0;
    }, 3000);
  }

  getProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        if (response) {
          this.products = response;
          this.errorMessage = "";
        } else {
          this.products = [];
          this.errorMessage = "No results";
        }
      },
      error: () => {
        this.errorMessage = "Error fetching products";
        this.products = [];
      }
    })
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.showToastNotification(`Please log in to add items to cart!`, true);
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        this.showToastNotification(`${product.title} added to cart! 🍓`);
      },
      error: () => {
        this.showToastNotification(`Could not add items to cart!`, true);
      }
    });
  }

  removeProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.getProducts()
    })
  }

  toggleLike(event: Event, product: any) { // Принимаем объект целиком
    event.preventDefault();
    event.stopPropagation();

    const productId = product._id;
    const productTitle = product.title;

    if (!this.authService.isLoggedIn()) {
      this.showToastNotification(`Please log in to like items!`, true);
      return;
    }

    const isCurrentlyFavorite = this.productsService.isFavorite(productId);
    this.productsService.toggleFavorite(productId);

    if (!isCurrentlyFavorite) {
      this.showToastNotification(`Added ${productTitle} to Wishlist! ❤️`);
    } else {
      this.showToastNotification(`Removed ${productTitle} from Wishlist 💔`);
    }
  }
}