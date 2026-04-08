import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-liked',
  imports: [CommonModule, RouterModule],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.css'
})

export class LikedComponent implements OnInit {
  private productsService = inject(ProductsService);
  private platformId = inject(PLATFORM_ID);

  public items = this.productsService.favoriteItems;
  public isLoading = this.productsService.isLoading;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.productsService.getFullFavorites();
    }
  }

  toggleLike(productId: string) {
    this.productsService.toggleFavorite(productId);
  }
}