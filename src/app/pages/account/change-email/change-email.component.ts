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
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  email: string = '';
  code: string = '';
  errorMessage: string = '';

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
    this.errorMessage = '';
    this.authService.verifyEmailChange(this.code).subscribe({
      next: (user: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('pendingEmail');
        }
        this.router.navigate(['/profile/settings']);
        this.toastService.show('Email updated', 'Your email has been successfully changed', 'auth');
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'The code is invalid or has expired';
      }
    });
  }

  resendCode() {
    this.authService.resendEmailChangeCode().subscribe({
      next: () => {
        this.toastService.show('Code resent', 'New verification code has been sent', 'auth');
      },
      error: (err) => {
        this.errorMessage = 'Failed to resend code';
      }
    });
  }
}
