import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public router: Router) {}

  lastScrollTop = 0;
  isNavHidden = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Если прокрутили вниз больше чем на 50px — прячем
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.isNavHidden = true;
    } 
    // Если прокрутили вверх — показываем
    else {
      this.isNavHidden = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
