import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private productsService = inject(ProductsService);

  protected errorMessage = '';
  protected loading = false;
  protected showPassword = false;
  protected showConfirmPassword = false;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  onSubmit() {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.authService.openVerifyEmailPage(this.registerForm.value.email ?? undefined)
        this.toastService.show('Successful registration', 'Now please confirm your email', 'auth')
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Registration failed: " + (err.error?.message || 'Unknown error');
      }
    });
  }

  get f() {
    return this.registerForm.controls as any;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}