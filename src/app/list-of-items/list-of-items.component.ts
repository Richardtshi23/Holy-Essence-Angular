import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../Services/products.service';
import { CartService } from '../Services/cart.service';
import { switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';

// Use a more specific interface
interface Product {
  //id: number;
  //name?: string;
  //image?: string;
  //price: number;
  //discount?: string;
  //rrp?: string;
  //qty: number;

  id: number;
  name?: string;
  image?: string;
  price: number;
  discount?: string;
  averageRating: number;
  reviewCount?: number;
  qty : number;
}

@Component({
  selector: 'app-list-of-items',
  templateUrl: './list-of-items.component.html',
  styleUrls: ['./list-of-items.component.css'],
  standalone: false
})
export class ListOfItemsComponent implements OnInit {

  products: Product[] = [];

  // State for the "Quick View" modal
  selectedProductForQuickView: Product | null = null;
  quickViewQuantity: number = 1;
  public imageBaseUrl = environment.apiImageUrl; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService // Inject CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        if (params.has('category')) {
          const category = params.get('category')!;
          return this.productService.getProductByCategory(category);
        }
        // Fallback to fetch all products if no specific category
        return this.productService.getAllProducts('all');
      })
    ).subscribe(data => {
      this.products = data;
    });
  }

  round(value: number = 0): number {
    return Math.round(value);
  }

  // --- Quick View Logic ---
  openQuickView(product: Product): void {
    this.selectedProductForQuickView = product;
    this.quickViewQuantity = 1; // Reset quantity each time
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeQuickView(): void {
    this.selectedProductForQuickView = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  // --- Cart Logic ---
  addToCart(product: Product, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation when clicking the cart icon
    this.cartService.addToCart(product);
    console.log(`${product.name} added to cart.`);
    // You can add a toast notification here for user feedback
  }

  addToCartFromQuickView(product: Product): void {
    //this.cartService.addToCart({ ...product, qty: this.quickViewQuantity });
    console.log(`${this.quickViewQuantity} x ${product.name} added to cart from Quick View.`);
    this.closeQuickView(); // Close modal after adding to cart
  }
}
