import { Component, inject, signal, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  @ViewChild('autofocus') firstInput!: ElementRef<HTMLInputElement>;

  mode = signal<'change' | 'reset-request' | 'reset-verify'>('change');
  protected loading = false;
  protected errorMessage = '';

  // Visibility toggles
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  changeForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  resetForm = this.fb.group({
    verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  ngOnInit() {
    this.focusFirst();
  }

  private focusFirst() {
    setTimeout(() => {
      this.firstInput?.nativeElement.focus();
    }, 0);
  }

  private resetVisibility() {
    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
  }

  toggleVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrentPassword.update(v => !v);
    if (field === 'new') this.showNewPassword.update(v => !v);
    if (field === 'confirm') this.showConfirmPassword.update(v => !v);
  }

  setMode(newMode: 'change' | 'reset-request' | 'reset-verify') {
    this.mode.set(newMode);
    this.errorMessage = '';
    this.resetVisibility();
    this.changeForm.reset();
    this.resetForm.reset();
    this.focusFirst();
  }

  onSaveChange() {
    if (this.loading) return;
    this.errorMessage = '';

    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.changePassword(this.changeForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.show('Success', 'Password changed successfully', 'auth');
        this.router.navigate(['/profile/settings']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to change password';
      }
    });
  }

  onForgotPassword() {
    if (this.authService.resendTimer() > 0 || this.loading) {
      if (this.authService.resendTimer() > 0) {
        this.toastService.show('Wait a moment', 'You can send another code in ' + this.authService.resendTimer() + ' seconds', 'error');
      }
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.authService.requestPasswordReset().subscribe({
      next: () => {
        this.authService.startResendCooldown();
        this.toastService.show('Code sent', 'Verification code sent to your email', 'auth');
        this.setMode('reset-verify');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to request reset code';
      }
    });
  }

  resendResetCode() {
    if (this.authService.resendTimer() > 0 || this.loading) {
      if (this.authService.resendTimer() > 0) {
        this.toastService.show('Wait a moment', 'You can send another code in ' + this.authService.resendTimer() + ' seconds', 'error');
      }
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.authService.requestPasswordReset().subscribe({
      next: () => {
        this.authService.startResendCooldown();
        this.toastService.show('Code sent', 'New verification code has been sent', 'auth');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to resend code';
      }
    });
  }

  onResetPassword() {
    if (this.loading) return;
    this.errorMessage = '';

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const resetData = {
      code: this.resetForm.value.verificationCode,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.resetPassword(resetData).subscribe({
      next: () => {
        this.toastService.show('Success', 'Password reset successfully', 'auth');
        this.router.navigate(['/profile/settings']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password';
      }
    });
  }

  get cf() { return this.changeForm.controls as any; }
  get rf() { return this.resetForm.controls as any; }
}
