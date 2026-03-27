import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent {
  productId!: string;
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
  ) {
    this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.productsService.getAllProducts().subscribe((allProducts: any[]) => {
        this.product = allProducts.find(p => p._id === this.productId);
      });
    });
  }
}
