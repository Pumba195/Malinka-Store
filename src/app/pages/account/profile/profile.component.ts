import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);

  user = this.authService.currentUser;

  onLogout() {
    this.authService.logout();
    this.cartService.clearCart();
    this.productsService.clearFavorites();
    this.toastService.show('Successful Logout', 'You are successfully Logout', 'auth')
  }
}