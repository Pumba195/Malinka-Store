import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-shop',
  imports: [RouterLink, CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  constructor(private readonly productsService: ProductsService){}

  products: any[] = [];
  errorMessage: string = "";

  ngOnInit() {
    this.getProducts();
  }
  
  getProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        if(response) {
          this.products = response;
          this.errorMessage = "";
        } else {
          this.products = [];
          this.errorMessage = response.Error || "No results";
        }
      },
      error: () => {
        this.errorMessage = "Error fetching products";
        this.products = [];
      }
    })
  }

  removeProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({})
  }

  addToCart(id: string) {
    return
  }
  
}
