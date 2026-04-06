import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'

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
    private readonly cartService: CartService
  ) { }

  products: any[] = [];
  errorMessage: string = "";

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getProducts();
    }
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

  addToCart(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.cartService.addToCart(productId, 1).subscribe({});
  }

  removeProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.getProducts()
    })
  }

  toggleLike(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation(); 
    this.productsService.toggleFavorite(productId).subscribe({});
  }
}