import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Your existing interface - no changes needed here.
export interface product {
  id: number;
  name?: string;
  image?: string;
  price: number;
  discount?: string;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartKey = 'shopping_cart';
  private cartSubject = new BehaviorSubject<product[]>(this.getCartItems());
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getCartItems(): product[] {
    const cartJson = localStorage.getItem(this.cartKey);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  private saveCartItems(items: product[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartSubject.next(items);
  }

  addToCart(item: product): void {
    const items = this.getCartItems();
    const existingItem = items.find(i => i.id === item.id);
    if (existingItem) {
      // If adding from product page, it correctly increments quantity
      existingItem.qty += item.qty;
    } else {
      items.push(item);
    }
    this.saveCartItems(items);
  }

  // --- NEW METHOD ADDED HERE ---
  /**
   * Updates the quantity of a specific item in the cart.
   * This is essential for the +/- buttons in the new premium cart UI.
   * @param productId The ID of the product to update.
   * @param newQuantity The new quantity for the product.
   */
  updateItemQuantity(productId: number, newQuantity: number): void {
    // 1. Get the current state of the cart
    const items = this.getCartItems();

    // 2. Find the specific item we need to update
    const itemToUpdate = items.find(i => i.id === productId);

    // 3. If the item exists, update its quantity
    if (itemToUpdate) {
      itemToUpdate.qty = newQuantity;
    }

    // 4. Save the updated cart back to localStorage and notify all subscribers
    this.saveCartItems(items);
  }
  // --- END OF NEW METHOD ---

  removeFromCart(productId: number): void {
    let items = this.getCartItems();
    items = items.filter(i => i.id !== productId);
    this.saveCartItems(items);
  }

  clearCart(): void {
    this.saveCartItems([]);
  }

  getTotalPrice(): number {
    const items = this.getCartItems();
    return items.reduce((total, item) => total + item.price * item.qty, 0);
  }

  getTotalItems(): number {
    const items = this.getCartItems();
    return items.reduce((total, item) => total + item.qty, 0);
  }

  checkout() {
    const items = this.getCartItems();
    return this.http.post('/api/checkout', { items });
  }

  // ✅ Sync cart with backend when logged in : toDO
  syncWithServer(userId: string) {
    const cart = this.getCartItems();
    return this.http.post(`/api/cart/sync`, { userId, items: cart });
  }
}
