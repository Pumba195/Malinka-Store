import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const guestGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (!token || token == 'undefined' || token === null) {
      return true;
    } else {
      router.navigate(['/profile']);
      return false;
    }
  }
  return false;
};