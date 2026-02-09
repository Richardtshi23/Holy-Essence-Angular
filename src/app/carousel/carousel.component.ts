import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ProductsService } from '../Services/products.service';
import { CartService } from '../Services/cart.service';
import { environment } from '../../environments/environment';

interface item {
  id: number;
  name?: string;
  image?: string;
  price: number;
  discount?: string;
  averageRating: number;
  reviewCount?: number;
  qty: number;
}

@Component({
  selector: 'app-carousel',
  standalone: false,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'] // Note: Use styleUrls for multiple stylesheets
})
export class CarouselComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @Input() categories: string = '';
  @Input() title: string = '';

  items: any[] = []; // Give it a type for better practice
  public imageBaseUrl = environment.apiImageUrl; 
  constructor(private productService: ProductsService, private cartService: CartService) { }

  ngOnInit() {
    this.productService.getProductByCategory(this.categories).subscribe(products => {
      // Example of adding a new property for the badge
      this.items = products.map((p: any) => ({ ...p, isTopSeller: p.averageRating > 4.5 }));
    });
  }

  scrollLeft() {
    // Scroll by the width of one item + gap for a cleaner scroll
    const itemWidth = this.carousel.nativeElement.querySelector('.carousel-item').offsetWidth;
    const scrollAmount = itemWidth + 24; // 24px is 1.5rem gap
    this.carousel.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight() {
    const itemWidth = this.carousel.nativeElement.querySelector('.carousel-item').offsetWidth;
    const scrollAmount = itemWidth + 24;
    this.carousel.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // NEW: Add to cart function
  addToCart(item: any, event: MouseEvent) {
    event.preventDefault();  // Prevents the routerLink from navigating
    event.stopPropagation(); // Stops the event from bubbling up

    this.cartService.addToCart(item);
    console.log(`${item.name} added to cart.`);
    console.log('Adding to cart:', item.name);
    //
    // ----> Your cart logic goes here! <----
    // e.g., this.cartService.addItem(item);
    //
  }

  // You might not need the round function anymore if you simplify the stars in the template
}
