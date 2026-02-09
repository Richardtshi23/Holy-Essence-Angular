import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { CartService } from '../Services/cart.service';
import { PaymentsService } from '../Services/payments.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone:false
})
export class CheckoutComponent implements OnInit {

  currentStep: number = 1;
  checkoutForm: FormGroup;
  isLoggedIn = false;
  cart: any[] = [];
  shippingCost = 63.99; // Define shipping cost
  private user: any = null; // To store logged-in user details
  public imageBaseUrl = environment.apiImageUrl; 

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cartService: CartService,
    private paymentsService: PaymentsService,
    private router: Router
  ) {
    // Initialize the Reactive Form for Step 1
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postal: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Load cart items
    this.cart = this.cartService.getCartItems();
    if (this.cart.length === 0) {
      this.router.navigate(['/']); // Redirect to home if cart is empty
    }

    // Check for logged-in user and pre-fill form
    this.auth.getUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.isLoggedIn = true;
          this.user = user; // Store user details
          // Use patchValue to pre-fill the form with user data
          this.checkoutForm.patchValue({
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            postal: user.postal
          });
        }
      },
      error: () => this.isLoggedIn = false
    });
  }

  getTotal(): number {
    return this.cart.reduce((t, i) => t + (i.price * i.qty), 0);
  }

  goToNextStep(): void {
    if (this.currentStep === 1 && this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched(); // Show validation errors
      return;
    }
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  goToPrevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  submitCheckout(): void {
    // Check form validity one last time
    if (this.checkoutForm.invalid) {
      this.currentStep = 1; // Send user back to the form if invalid
      this.checkoutForm.markAllAsTouched();
      alert('Please fill out all required fields in the Information step.');
      return;
    }

    // Your existing submission logic, now using data from the Reactive Form
    const dto = {
      ...this.checkoutForm.value,
      cart: this.cart,
      amount: this.getTotal(), // Include shipping in the final amount
      user: this.isLoggedIn ? this.user : null
    };

    // Call your existing payment service
    this.paymentsService.pay(dto);
  }
}
