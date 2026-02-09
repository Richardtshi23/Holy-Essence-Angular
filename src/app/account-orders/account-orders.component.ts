import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../Services/orders.service';
import { AuthService } from '../Services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-account-orders',
  standalone: false,
  templateUrl: './account-orders.component.html',
  styleUrl: './account-orders.component.css'
})
export class AccountOrdersComponent implements OnInit {
  orders: any[] = [];
  expandedOrderIds: Set<number> = new Set();
  userId: number = 0; // To store the logged-in user's ID
  public imageBaseUrl = environment.apiImageUrl
  constructor(
    private ordersService: OrdersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // First, get the logged-in user's ID
    this.authService.getUser().subscribe({
      next: (user: any) => {
        if (user && user.id) {
          this.userId = user.id;
          // Once we have the user ID, fetch their orders
          this.loadOrders(this.userId);
        } else {
          console.error("User is not logged in or user ID is missing.");
          // Optionally, redirect to login page
        }
      },
      error: (err) => console.error("Error fetching user:", err)
    });
  }

  loadOrders(userId: number): void {
    this.ordersService.getOrdersForUser(userId).subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      },
      error: (err) => console.error("Error fetching orders:", err)
    });
  }

  toggleOrder(orderId: number): void {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrderIds.has(orderId);
  }

  // Helper function to apply CSS classes based on order status
  getStatusClass(status: string): string {
    if (!status) return '';
    return status.toLowerCase().replace(' ', '-');
  }
}
