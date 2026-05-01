import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../../../models/cart-item.model';
import { ToastService } from '../../../services/toast.service';
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
  private toastService = inject(ToastService);

  public items = this.cartService.items;
  public totalCount = this.cartService.totalCount;
  public totalPrice = this.cartService.totalPrice;
  public isLoading = this.cartService.isLoading;

  public isModalOpen = false;
  public itemToDelete: CartItem | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!!localStorage.getItem('token')) {
        this.cartService.loadCart();
      }
    }
  }

  updateQuantity(item: CartItem | undefined, change: number): void {
    const product = item?.productId;
    if (!product?._id) {
      console.warn('Cannot update quantity: Product data missing');
      return;
    }

    if (item?.quantity == 1 && change < 0) {
      this.openConfirmModal(item)
      return
    }

    this.cartService.updateQuantity(product._id, change);

    const title = product.title;
    if (change > 0) {
      this.toastService.show('Added to Cart', title, 'cart');
    } else if (change < 0) {
      this.toastService.show('Removed from Cart', title, 'cart');
    }
  }

  // removeFromCart(item: CartItem): void {
  //   const idToRemove = item._id;

  //   if (confirm('Do you want to remove this item?')) {
  //     this.cartService.removeFromCart(idToRemove);
  //   }
  // }

  onCheckout(): void {
    if (this.items().length === 0) return;

    console.log('Finalizing order for:', this.items());
    alert('Thank you for your order! Malinka Store team will contact you soon.');
  }

  openConfirmModal(item: CartItem): void {
    this.itemToDelete = item;
    this.isModalOpen = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      this.cartService.removeFromCart(this.itemToDelete._id);
      this.toastService.show('Removed from Cart', `${this.itemToDelete.productId?.title}`, 'cart', this.itemToDelete.quantity);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.itemToDelete = null;
  }
}