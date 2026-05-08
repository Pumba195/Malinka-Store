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
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  @ViewChild('autofocus') firstInput!: ElementRef<HTMLInputElement>;

  mode = signal<'change' | 'reset-request' | 'reset-verify'>('change');
  loading = signal(false);
  
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

  toggleVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrentPassword.update(v => !v);
    if (field === 'new') this.showNewPassword.update(v => !v);
    if (field === 'confirm') this.showConfirmPassword.update(v => !v);
  }

  setMode(newMode: 'change' | 'reset-request' | 'reset-verify') {
    this.mode.set(newMode);
    this.changeForm.reset();
    this.resetForm.reset();
    this.focusFirst();
  }

  onSaveChange() {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.changePassword(this.changeForm.value).subscribe({
      next: () => {
        this.toastService.show('Success', 'Password changed successfully', 'auth');
        this.router.navigate(['/profile/settings']);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.show('Error', err.error?.message || 'Failed to change password', 'error');
      }
    });
  }

  onForgotPassword() {
    this.loading.set(true);
    this.authService.requestPasswordReset().subscribe({
      next: () => {
        this.toastService.show('Code sent', 'Verification code sent to your email', 'auth');
        this.setMode('reset-verify');
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.show('Error', err.error?.message || 'Failed to request reset code', 'error');
      }
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
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
        this.loading.set(false);
        this.toastService.show('Error', err.error?.message || 'Failed to reset password', 'error');
      }
    });
  }

  get cf() { return this.changeForm.controls as any; }
  get rf() { return this.resetForm.controls as any; }
}
