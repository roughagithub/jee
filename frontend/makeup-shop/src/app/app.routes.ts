import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { CartComponent } from './cart.component';
import { AccountComponent } from './account.component';
import { AdminComponent } from './admin.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'shop', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

