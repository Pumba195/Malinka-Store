import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private platformId = inject(PLATFORM_ID);

  currentUser = signal<any>(this.getUserFromStorage());

  private getUserFromStorage() {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const userJson = localStorage.getItem('user');
    if (!userJson || userJson === 'undefined') {
      return null;
    }

    return userJson ? JSON.parse(userJson) : null;
  }

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        this.currentUser.set(res.user);
      })
    );
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        this.currentUser.set(res.user);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  verifyEmail(email: string, code: string) {
    return this.http.post<any>(`${this.apiUrl}/verify`, { email, code }).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.currentUser.set(res.user);
      })
    );
  }

  resendCode(email: string) {
    return this.http.post(`${this.apiUrl}/resend-code`, { email });
  }

  openVerifyEmailPage(email?: string) {
    if (isPlatformBrowser(this.platformId) && email) {
      localStorage.setItem('email', email);
    }
    this.router.navigate(['/verify-email']);
  }

  checkUserStatus(email: string) {
    return this.http.post(`${this.apiUrl}/check-status`, { email });
  }
}