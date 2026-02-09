import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfItemsComponent } from './list-of-items/list-of-items.component';
import { HomeComponent } from './Home/home.component';
import { ItemComponent } from './item/item.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AccountComponent } from './account/account.component';
import { ProductsAdminComponent } from './products-admin/products-admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AccountOrdersComponent } from './account-orders/account-orders.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountEnquiriesComponent } from './account-enquiries/account-enquiries.component';
import { OurMissionComponent } from './our-mission/our-mission.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component'

const routes: Routes = [{ path: '', component: HomeComponent },
  {
  path: 'item/display/:all', component: ListOfItemsComponent,
  },
  { path: 'item/category/:category', component: ListOfItemsComponent },
  { path: 'listItem/:id', component: ItemComponent },
  { path: 'item/category/:category/listItem/:id', component: ItemComponent },
  { path: 'adminOrders', component: AdminOrdersComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'our-mission', component: OurMissionComponent },
  {
    path: 'accountSettings', component: AccountComponent, children: [{path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'orders', component: AccountOrdersComponent },
      { path: 'details', component: AccountDetailsComponent }]
  },
  { path: 'admin', component: ProductsAdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'accountSettings', component: AccountComponent },
  { path: 'checkout', component: CheckoutComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'        
  })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
