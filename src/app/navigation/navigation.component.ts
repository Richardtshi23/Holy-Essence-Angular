import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CartService } from '../Services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { ProductsService } from '../Services/products.service';
import { Observable, Subscription, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: false
})
export class NavigationComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isScrolled = false;
  cartCount = 0;
  animateCart = false;
  isLoggedIn$!: Observable<boolean>;
  private cartSub!: Subscription;

  searchOpen = false;
  searchControl = new FormControl('');
  searchResults: any[] = [];
  showNoResultsMessage = false;
  public imageBaseUrl = environment.apiImageUrl; 
  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(items => {
      if (items.length > this.cartCount) {
        this.animateCart = true;
        setTimeout(() => this.animateCart = false, 300);
      }
      this.cartCount = items.length;
    });
    this.isLoggedIn$ = this.authService.isAuthenticated$();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(searchTerm => {
        if (!searchTerm || searchTerm.length < 2) {
          this.searchResults = [];
          this.showNoResultsMessage = false;
        }
      }),
      switchMap(searchTerm => {
        if (searchTerm && searchTerm.length >= 2) {
          return this.productsService.searchProducts(searchTerm);
        } else {
          return of([]);
        }
      })
    ).subscribe(results => {
      this.searchResults = results;
      // FIXED: Added a null check before accessing .length
      const searchTermValue = this.searchControl.value || '';
      this.showNoResultsMessage = searchTermValue.length >= 2 && results.length === 0;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    document.body.style.overflow = this.searchOpen ? 'hidden' : 'auto';
    if (!this.searchOpen) {
      this.searchControl.setValue('');
    }
  }

  goToCart(): void { this.router.navigate(['/shopping-cart']); }

  goToLoginOrProfile(): void {
    // This now works because 'take' is imported correctly
    this.isLoggedIn$.pipe(take(1)).subscribe(isloggedIn => {
      this.router.navigate([isloggedIn ? '/accountSettings' : '/login']);
    });
  }
}
