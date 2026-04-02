import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser; 

  onLogout() {
    this.authService.logout();
  }
}