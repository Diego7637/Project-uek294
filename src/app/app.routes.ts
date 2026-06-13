import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { CategoriesComponent } from './pages/categories/categories';
import { ProductsComponent } from './pages/products/products';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { UserAdmin } from './pages/user-admin/user-admin';
import { ProductAdmin } from './pages/product-admin/product-admin';
import { adminGuard } from './guards/admin-guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },

  {
    path: 'admin/users',
    component: UserAdmin,
    canActivate: [adminGuard]
  },

  {
    path: 'admin/products',
    component: ProductAdmin,
    canActivate: [adminGuard]
  },

  { path: '**', redirectTo: 'home' }
];
