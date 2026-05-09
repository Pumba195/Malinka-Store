import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'cart' | 'wishlist' | 'auth';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public showToast = false;
  public animateCounter = false;
  public messageTitle = '';
  public toastMessage = '';
  public isError = false;
  public clickCount = 0;
  public currentIcon = '🍓';
  public currentType: ToastType = 'success';

  private toastTimeout: any;

  show(title: string, message: string = '', type: ToastType = 'success', quantity: number = 1) {
    const iconMap: Record<ToastType, string> = {
      success: '🍓',
      error: '⚠️',
      cart: '🛒',
      wishlist: '❤️',
      auth: '👤'
    };

    const isSameToast = this.messageTitle === title && this.toastMessage === message;

    if (this.showToast && !isSameToast) {
      this.showToast = false;
      setTimeout(() => {
        this.applyData(title, message, type, quantity, iconMap);
      }, 10);
    } else {
      this.applyData(title, message, type, quantity, iconMap, isSameToast);
    }
  }

  private applyData(title: string, message: string, type: ToastType, quantity: number, iconMap: any, isSame: boolean = false) {
    this.currentType = type;
    this.isError = type === 'error';
    this.currentIcon = iconMap[type];
    this.messageTitle = title;
    this.toastMessage = message;
    this.showToast = true;

    if (isSame) {
      this.clickCount += quantity;
      this.animateCounter = false;
      setTimeout(() => this.animateCounter = true, 5);
    } else {
      this.clickCount = quantity;
    }

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.clickCount = 0;
    }, 5000);
  }
}