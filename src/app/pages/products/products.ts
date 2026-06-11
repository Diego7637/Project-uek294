import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ProductControllerService,
  ProductShowDto
} from '../../openapi-client';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent {

  products = signal<ProductShowDto[]>([]);

  constructor(
    private productApi: ProductControllerService
  ) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productApi.getAllProducts().subscribe({
      next: data => this.products.set(data),
      error: err => console.error(err)
    });
  }
}
