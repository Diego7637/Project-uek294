import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CategoryControllerService,
  CategoryShowDto,
  ProductControllerService,
  ProductShowDto,
  ProductCreateDto,
  ProductUpdateDto,
  CategoryCreateDto,
  CategoryUpdateDto
} from '../../openapi-client';

@Component({
  selector: 'pm-product-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-admin.html',
  styleUrls: ['./product-admin.scss']
})
export class ProductAdmin {

  private productService = inject(ProductControllerService);
  private categoryService = inject(CategoryControllerService);

  products = signal<ProductShowDto[]>([]);
  categories = signal<CategoryShowDto[]>([]);

  newCategoryName = '';
  editingCategory: (CategoryUpdateDto & { id: number }) | null = null;

  newProduct: ProductCreateDto = {
    sku: '',
    active: true,
    name: '',
    image: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: undefined
  };

  editingProduct: (ProductUpdateDto & { id: number }) | null = null;

  constructor() {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: data => this.categories.set(data),
      error: err => console.error('CATEGORY LOAD ERROR', err)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => this.products.set(data),
      error: err => console.error('LOAD ERROR', err)
    });
  }

  createCategory(): void {
    const name = this.newCategoryName.trim();

    if (!name) return;

    const category: CategoryCreateDto = {
      active: true,
      name
    };

    this.categoryService.createCategory(category).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: err => console.error('CATEGORY CREATE ERROR', err)
    });
  }

  startRenameCategory(category: CategoryShowDto): void {
    this.editingCategory = {
      id: category.id,
      active: true,
      name: category.name
    };
  }

  saveCategoryRename(): void {
    if (!this.editingCategory) return;

    const name = this.editingCategory.name.trim();
    if (!name) return;

    const { id, ...dto } = {
      ...this.editingCategory,
      name
    };

    this.categoryService.updateCategoryById(id, dto).subscribe({
      next: () => {
        this.editingCategory = null;
        this.loadCategories();
      },
      error: err => console.error('CATEGORY UPDATE ERROR', err)
    });
  }

  cancelCategoryRename(): void {
    this.editingCategory = null;
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.loadProducts();

      this.newProduct = {
        sku: '',
        active: true,
        name: '',
        image: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: undefined
      };
    });
  }

  startEdit(product: ProductShowDto): void {
    this.editingProduct = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      active: true,
      description: '',
      categoryId: undefined
    };
  }

  saveEdit(): void {
    if (!this.editingProduct) return;

    const { id, ...dto } = this.editingProduct;

    this.productService.updateProductById(id, dto).subscribe({
      next: () => {
        this.editingProduct = null;
        this.loadProducts();
      },
      error: err => console.error('UPDATE ERROR', err)
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProductById(id).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error('DELETE ERROR', err)
    });
  }
}
