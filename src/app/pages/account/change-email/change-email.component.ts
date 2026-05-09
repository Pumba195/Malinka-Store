import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css'
})
export class ChangeEmailComponent implements OnInit {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  email: string = '';
  code: string = '';
  protected errorMessage = '';
  protected loading = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = localStorage.getItem('pendingEmail');
      if (savedEmail) {
        this.email = savedEmail;
      } else {
        // If no pending email, redirect back to settings
        this.router.navigate(['/profile/settings']);
      }
    }
  }

  onVerify() {
    if (this.loading) return;
    this.errorMessage = '';
    this.loading = true;

    this.authService.verifyEmailChange(this.code).subscribe({
      next: (user: any) => {
        this.loading = false;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('pendingEmail');
        }
        this.router.navigate(['/profile/settings']);
        this.toastService.show('Email updated', 'Your email has been successfully changed', 'auth');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'The code is invalid or has expired';
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

    this.authService.resendEmailChangeCode().subscribe({
      next: () => {
        this.loading = false;
        this.authService.startResendCooldown();
        this.toastService.show('Code resent', 'New verification code has been sent', 'auth');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to resend code';
      }
    });
  }
}
