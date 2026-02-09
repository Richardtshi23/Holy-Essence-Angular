import { Component, OnInit } from '@angular/core';
import { CartService } from '../Services/cart.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone:false
})
export class ShoppingCartComponent implements OnInit {

  cartItems: any[] = []; // Using any[] to match your existing structure

  // --- CONFIGURATION for Sales Tactics ---
  freeShippingThreshold: number = 599; // Set your free shipping amount here
  shippingCost: number = 63.99;        // Set your flat shipping rate
  public imageBaseUrl = environment.apiImageUrl; 
  constructor(private cart: CartService) { }

  ngOnInit(): void {
    // Subscribe to cart updates from the service
    this.cart.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  // --- GETTERS for dynamic template values ---

  // This getter is robust and will work perfectly with your 'any' array
  get totalPrice(): number {
    if (!this.cartItems) return 0;
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  get amountUntilFreeShipping(): number {
    const amount = this.freeShippingThreshold - this.totalPrice;
    return amount > 0 ? amount : 0;
  }

  get shippingProgressPercentage(): number {
    if (this.freeShippingThreshold <= 0) return 100;
    const percentage = (this.totalPrice / this.freeShippingThreshold) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  }

  hasFreeShipping(): boolean {
    return this.totalPrice >= this.freeShippingThreshold;
  }

  // --- ACTIONS ---

  increaseQuantity(item: any): void {
    const newQty = item.qty + 1;
    this.cart.updateItemQuantity(item.id, newQty);
  }

  decreaseQuantity(item: any): void {
    const newQty = item.qty - 1;
    if (newQty > 0) {
      this.cart.updateItemQuantity(item.id, newQty);
    } else {
      this.removeItem(item.id); // Remove if quantity goes to 0
    }
  }

  updateQuantity(item: any, event: any): void {
    // Defensive check to ensure event.target exists
    if (event.target) {
      const newQty = parseInt(event.target.value, 10);
      if (newQty > 0) {
        this.cart.updateItemQuantity(item.id, newQty);
      } else {
        // Reset to 1 if user enters an invalid number
        event.target.value = 1;
        this.cart.updateItemQuantity(item.id, 1);
      }
    }
  }

  removeItem(itemId: number): void {
    this.cart.removeFromCart(itemId);
  }
}
