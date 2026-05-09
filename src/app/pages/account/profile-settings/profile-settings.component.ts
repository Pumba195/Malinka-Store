import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';

type ModalType = 'name' | 'email' | null;

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public user = this.authService.currentUser;

  // Modal State
  activeModal = signal<ModalType>(null);
  modalError = signal<string>('');
  protected loading = false;
  protected errorMessage = '';
  
  // Input fields for modals
  newName = signal('');
  newEmail = signal('');

  @ViewChild('autofocus') inputElement?: ElementRef<HTMLInputElement>;
  
  openModal(type: ModalType) {
    this.activeModal.set(type);
    this.modalError.set('');
    this.errorMessage = '';
    this.loading = false;
    
    if (type === 'name') {
      this.newName.set(this.user()?.name || '');
    }

    if (type === 'email') {
      this.newEmail.set(this.user()?.email || '');
    }

    // Delay focus to ensure element is rendered
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 0);
  }

  closeModal() {
    this.activeModal.set(null);
    this.modalError.set('');
    this.errorMessage = '';
    this.loading = false;
  }

  onSaveName() {
    const nameValue = this.newName().trim();
    this.modalError.set('');
    this.errorMessage = '';

    if (nameValue.length === 0) {
      this.modalError.set('Name cannot be empty');
      return;
    }

    if (nameValue.length < 2) {
      this.modalError.set('Minimum 2 characters');
      return;
    }

    if (nameValue.length > 40) {
      this.modalError.set('Maximum 40 characters');
      return;
    }

    if (nameValue === this.user()?.name) {
      this.modalError.set('New name is the same as the current one');
      return;
    }

    this.loading = true;
    this.authService.updateName(nameValue).subscribe({
      next: () => {
        this.toastService.show('Successful update', 'Your name has been changed to ' + nameValue, 'auth');
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update name';
      }
    });
  }

  onSaveEmail() {
    const emailValue = this.newEmail().trim().toLowerCase();
    this.modalError.set('');
    this.errorMessage = '';

    if (emailValue.length === 0) {
      this.modalError.set('Email cannot be empty');
      return;
    }

    if (emailValue.includes('@') === false) {
      this.modalError.set('Please enter a valid email address');
      return;
    }

    if (emailValue === this.user()?.email) {
      this.modalError.set('New email is the same as the current one');
      return;
    }

    if (this.authService.resendTimer() > 0) {
      this.toastService.show('Wait a moment', 'You can send another code in ' + this.authService.resendTimer() + ' seconds', 'error');
      return;
    }

    this.loading = true;
    this.authService.requestEmailChange(emailValue).subscribe({
      next: () => {
        this.authService.startResendCooldown();
        this.toastService.show('Verification sent', 'Please check your new email for the code', 'auth');
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingEmail', emailValue);
        }
        this.closeModal();
        this.router.navigate(['/profile/verify-email']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to request email change';
      }
    });
  }

  onChangePasswordNavigation() {
    this.router.navigate(['/profile/change-password']);
  }
}
