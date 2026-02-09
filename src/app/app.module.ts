import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/home.component';
import { ItemComponent } from './item/item.component';
import { CategoriesComponent } from './categories/categories.component';
import { DisplayComponent } from './display/display.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LoginComponent } from './login/login.component';
import { OrdersComponent } from './orders/orders.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { ListOfItemsComponent } from './list-of-items/list-of-items.component';
import { BannerComponent } from './banner/banner.component';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from './carousel/carousel.component';
import { AccountComponent } from './account/account.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountOrdersComponent } from './account-orders/account-orders.component';
import { AccountEnquiriesComponent } from './account-enquiries/account-enquiries.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsAdminComponent } from './products-admin/products-admin.component';
import { AuthInterceptor } from '../app/interceptors/auth.interceptors';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OurMissionComponent } from './our-mission/our-mission.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemComponent,
    CategoriesComponent,
    DisplayComponent,
    ShoppingCartComponent,
    LoginComponent,
    OrdersComponent,
    NavigationComponent,
    SidePanelComponent,
    ListOfItemsComponent,
    BannerComponent,
    CarouselComponent,
    AccountComponent,
    AccountDetailsComponent,
    AccountOrdersComponent,
    AccountEnquiriesComponent,
    FooterComponent,
    ProductsAdminComponent,
    RegisterComponent,
    CheckoutComponent,
    OurMissionComponent,
    AdminOrdersComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule, ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
