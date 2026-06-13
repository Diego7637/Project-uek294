import { Component, signal, computed } from '@angular/core';


import {
  CategoryControllerService,
  ProductControllerService,
  CategoryShowDto,
  CategoryDetailDto,
  ProductShowDto
} from '../../openapi-client';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class CategoriesComponent {

  categories = signal<CategoryShowDto[]>([]);
  selectedCategoryId = signal<number | null>(null);
  products = signal<ProductShowDto[]>([]);

  constructor(
    private categoryApi: CategoryControllerService,
    private productApi: ProductControllerService
  ) {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryApi.getAllCategories().subscribe({
      next: data => this.categories.set(data),
      error: err => console.error(err)
    });
  }

  selectCategory(id: number): void {
    this.selectedCategoryId.set(id);

    this.categoryApi.getCategoryById(id).subscribe({
      next: (category: CategoryDetailDto) => {
        this.products.set(category.products);
      },
      error: err => console.error(err)
    });
  }
}
