import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, AfterViewInit {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productsService = inject(ProductsService);
  protected toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('autofocus') inputElement!: ElementRef<HTMLInputElement>;

  email: string = '';
  newEmail: string = '';
  code: string = '';
  errorMessage: string = '';
  isChangingEmail: boolean = false;
  canGoBack: boolean = true;

  protected loading = false;
  
  ngAfterViewInit() {
    this.focusInput();
  }

  private focusInput() {
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 0);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = localStorage.getItem('email');

      if (savedEmail) {
        this.email = savedEmail;
        this.newEmail = savedEmail;
        this.isChangingEmail = false;
        this.canGoBack = true;
      } else {
        this.isChangingEmail = true;
        this.canGoBack = false;
      }
    }
  }

  onVerify() {
    if (this.loading) return;
    this.errorMessage = '';
    this.loading = true;

    this.authService.verifyEmail(this.email, this.code).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.cartService.loadCart();
        this.productsService.getFullFavorites();
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('email');
        }
        this.router.navigate(['/profile']);
        this.toastService.show('Successful registration', 'You are registered as ' + res.user.name, 'auth')
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'The code is invalid or has expired';
      }
    });
  }

  resendCode() {
    if (this.authService.resendTimer() > 0 || this.loading) {
      if (this.authService.resendTimer() > 0) {
        this.toastService.show('Wait a moment', 'You can send another code in ' + this.authService.resendTimer() + ' seconds', 'error');
      }
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.resendCode(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.authService.startResendCooldown();
        this.toastService.show('The code has been resent', 'New code has been sent to your email', 'auth')
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to resend code. Please try again later.';
      }
    });
  }

  toggleChangeEmailView() {
    if (this.canGoBack) {
      this.isChangingEmail = !this.isChangingEmail;
      this.errorMessage = '';
      this.newEmail = this.email;
      this.focusInput();
    }
  }

  confirmEmailChange() {
    const trimmedNewEmail = this.newEmail?.trim().toLowerCase();
    const currentEmail = this.email?.trim().toLowerCase();

    if (!trimmedNewEmail || !trimmedNewEmail.includes('@')) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (trimmedNewEmail === currentEmail) {
      this.errorMessage = 'You are already using this email';
      return;
    }

    if (this.authService.resendTimer() > 0 || this.loading) {
      this.toastService.show('Wait a moment', 'You can send another code in ' + this.authService.resendTimer() + ' seconds', 'error');
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.checkUserStatus(trimmedNewEmail).subscribe({
      next: (user: any) => {
        this.loading = false;
        this.authService.startResendCooldown();
        this.email = trimmedNewEmail;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('email', this.email);
        }

        this.isChangingEmail = false;
        this.canGoBack = true;
        this.focusInput();

        this.toastService.show('Email changed successfully', 'Now you can request a code for this address', 'auth')
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'User with this email not found. Please register first.';
        } else if (err.status === 400) {
          this.errorMessage = 'This email is already verified. Please log in.';
        } else {
          this.errorMessage = 'An error occurred while checking status.';
        }
      }
    });
  }
};