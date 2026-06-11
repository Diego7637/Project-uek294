import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  ProductControllerService,
  ProductDetailDto
} from '../../openapi-client';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {

  product = signal<ProductDetailDto | null>(null);

  constructor(
    private route: ActivatedRoute,
    private productApi: ProductControllerService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.productApi.getProductById(id).subscribe({
      next: data => {
        console.log('Produkt geladen:', data);
        this.product.set(data);
      },
      error: err => console.error('API Fehler:', err)
    });
  }
}
