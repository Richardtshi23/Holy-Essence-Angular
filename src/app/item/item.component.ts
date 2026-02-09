import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../Services/products.service';
import { CartService } from '../Services/cart.service';
import { ReviewsService } from '../Services/reviews.service';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

// Define an interface for better type safety
interface Product {
  id: number;
  name?: string;
  image?: string;
  price: number;
  oldPrice?: number;
  description?: string;
  galleryImages?: { url: string; alt: string }[];
  qty: number;
}

interface Review {
  id: number;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string; // Assuming date is a string from API
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  standalone:false
})
export class ItemComponent implements OnInit, OnDestroy {
  // --- Component Properties ---
  product: Product = { id: 0, price: 0, qty: 1 }; // Initialize to avoid template errors
  selectedImage?: string;
  quantity: number = 1;

  // Reviews State
  reviews: Review[] = [];
  newReview = { name: '', rating: 0, comment: '' };
  averageRating: number = 0;
  isPosting: boolean = false;

  // Premium Features State
  activeTab: string = 'description';
  reviewsToShow: number = 5; // Show 5 reviews initially
  visibleReviews: Review[] = [];

  private routeSub!: Subscription;
  public imageBaseUrl = environment.apiImageUrl; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cart: CartService,
    private router: Router,
    private reviewsService: ReviewsService,
    private authService: AuthService, // Assuming you might use this for user's name
    private el: ElementRef // Inject ElementRef for smooth scrolling
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productService.getProductById(id).subscribe({
          next: (data: Product) => {
            this.product = data;

            // Set initial selected image
            this.selectedImage = 'https://localhost:7148' + this.product.image;

            // Mock gallery images if they don't exist on product object for demonstration
            if (!this.product.galleryImages || this.product.galleryImages.length === 0) {
              this.product.galleryImages = [
                { url: this.product.image!, alt: 'Main view' },
                { url: this.product.image!, alt: 'Side view' },
                { url: this.product.image!, alt: 'Close-up view' }
              ];
            }
            this.loadReviews(this.product.id);
          },
          error: (err) => console.error('Error fetching product:', err)
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  selectImage(imgUrl: string): void {
    this.selectedImage = imgUrl;
  }

  addToCart(): void {
    if (!this.product) return;
    const itemToAdd = { ...this.product, qty: this.quantity };
    this.cart.addToCart(itemToAdd);
    // Consider adding a visual feedback, like a toast notification: "Added to cart!"
    console.log(`${this.quantity} x ${this.product.name} added to cart.`);
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigateByUrl("/shopping-cart");
  }

  round(value: number): number {
    return Math.round(value);
  }

  // --- Review Logic ---

  loadReviews(productId: number): void {
    this.reviewsService.getByProductId(productId).subscribe({
      next: (res: Review[]) => {
        // Sort reviews with the newest one first
        this.reviews = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.calculateAverageRating();
        this.updateVisibleReviews();
      },
      error: (err) => console.error('Failed to load reviews:', err)
    });
  }

  submitReview(): void {
    if (!this.product?.id) {
      alert('Product not loaded yet.');
      return;
    }

    if (!this.newReview.name || !this.newReview.comment || this.newReview.rating === 0) {
      alert('Please fill all fields and choose a rating.');
      return;
    }

    this.isPosting = true;
    const payload = {
      productId: this.product.id,
      ...this.newReview
    };

    this.reviewsService.create(payload).subscribe({
      next: (savedReview: Review) => {
        this.reviews.unshift(savedReview); // Add new review to the top of the main list
        this.calculateAverageRating();
        this.updateVisibleReviews();
        // Reset the form
        this.newReview = { name: '', rating: 0, comment: '' };
        this.isPosting = false;
      },
      error: (err) => {
        console.error('Failed to post review', err);
        alert('Failed to post review. Please try again later.');
        this.isPosting = false;
      }
    });
  }

  setRating(value: number): void {
    this.newReview.rating = value;
  }

  private calculateAverageRating(): void {
    if (!this.reviews || this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const total = this.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    this.averageRating = total / this.reviews.length;
  }

  // --- Premium Feature Logic ---

  private updateVisibleReviews(): void {
    this.visibleReviews = this.reviews.slice(0, this.reviewsToShow);
  }

  showMoreReviews(): void {
    this.reviewsToShow += 5; // Increase the number of visible reviews
    this.updateVisibleReviews();
  }

  scrollToReviews(event: MouseEvent): void {
    event.preventDefault();
    this.activeTab = 'reviews';
    // Use a timeout to ensure the DOM has updated before scrolling
    setTimeout(() => {
      const element = this.el.nativeElement.querySelector('#reviews-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
