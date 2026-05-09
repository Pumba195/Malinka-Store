import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private productsService = inject(ProductsService);

  @ViewChild('autofocus') inputElement!: ElementRef<HTMLInputElement>;

  protected errorMessage = '';
  protected loading = false;
  protected showPassword = false;

  ngAfterViewInit() {
    this.inputElement.nativeElement.focus();
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginForm.valid) {
      this.loading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loading = false;
          localStorage.removeItem('email');
          this.cartService.loadCart();
          this.productsService.getFullFavorites();
          
          this.router.navigate(['/profile']);
          this.toastService.show('Successful Login', 'You are login as ' + res.user.name, 'auth')
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Login failed: ' + (err.error?.message || 'Invalid email or password');
        }
      });
    }
  }

  get f() {
    return this.loginForm.controls as any;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}