import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  constructor(
    protected readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) { }
  
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  public products = signal<any[]>([]);

  public toastTimeout: any;
  public showToast = false;
  public toastMessage = '';

  public clickCount = 0;

  public isLoading = false;
  public errorMessage: string = "";

  public searchQuery = signal<string>('');
  public sortOrder = signal<string>('newest');

  public currentPage = 1;
  public currentLimit = 15;


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getProducts();
      if (this.authService.isLoggedIn()) {
        this.productsService.getFullFavorites();
      }
    }
  }

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let result = [...this.products()];

    if (query) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(query)
      );
    }

    const order = this.sortOrder();

    if (order === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (order === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (order === 'newest') {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }

    return result;
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage = 1;
    this.getProducts();
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.sortOrder.set(value);
    this.currentPage = 1;
    this.getProducts();
  }

  onLimitChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.currentLimit = Number(select.value);
    this.currentPage = 1;
    this.getProducts();
  }

  changePage(step: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage += step;
    this.getProducts();
  }

  isNew(date: string): boolean {
    const productDate = new Date(date).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - productDate) / (1000 * 3600 * 24);
    return daysDiff < 7;
  }

  getProducts() {
    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.currentLimit;

    this.productsService.getAllProducts(
      this.currentLimit,
      offset,
      this.sortOrder(),
      this.searchQuery()
    ).subscribe({
      next: (response) => {
        this.products.set(response || []);
        this.errorMessage = "";
        this.isLoading = false;
      },
      error: () => {
        this.products.set([]);
        this.errorMessage = "Error fetching products";
        this.isLoading = false;
      }
    });
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Error', `Please log in to add items to Сart!`, 'error');
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        this.toastService.show('Added to Сart', `${product.title}`, 'cart');
      },
      error: () => {
        this.toastService.show('Error', `Could not add items to Сart!`, 'error');
      }
    });
  }

  removeProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.getProducts()
    })
  }

  toggleLike(event: Event, product: any) {
    event.preventDefault();
    event.stopPropagation();

    const productId = product._id;
    const productTitle = product.title;

    if (!this.authService.isLoggedIn()) {
      this.toastService.show('Error', `Please log in to add items to Wishlist!`, 'error');
      return;
    }
    
    const isCurrentlyFavorite = this.productsService.isFavorite(productId);
    this.productsService.toggleFavorite(productId);

    if (!isCurrentlyFavorite) {
      this.toastService.show('Added to Wishlist', `${productTitle}`, 'wishlist');
    } else {
      this.toastService.show('Removed from Wishlist',  `${productTitle}`, 'wishlist');
    }
  }
}