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
  private cartService = inject(CartService);

  likedItems = signal<any[]>([]);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFavorites();
    }
  }

  loadFavorites() {
    this.productsService.getFullFavorites().subscribe({
      next: (data) => this.likedItems.set(data),
      error: (err) => console.error(err)
    });
  }

  toggleLike(productId: string) {
    this.productsService.toggleFavorite(productId).subscribe({
        next: () => {
            this.likedItems.set(this.likedItems().filter(item => item._id !== productId));
        }
    });
  }

}