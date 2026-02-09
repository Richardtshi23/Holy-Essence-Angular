import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../Services/orders.service'; // Ensure this path is correct for your project structure

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
  standalone:false
})
export class AdminOrdersComponent implements OnInit {

  allOrders: any[] = [];
  filteredOrders: any[] = [];
  activeTab: 'pending' | 'fulfilled' = 'pending';

  selectedOrder: any | null = null; // For the details modal

  // Property to manage the set of selected order IDs for bulk actions
  selectedOrderIds: Set<number> = new Set();

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    // Calls the service method that fetches ALL orders (fulfilled and pending)
    this.ordersService.getAllOrders().subscribe({
      next: (data) => {
        // Sorts all orders by date, newest first
        this.allOrders = data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.filterOrders(); // Apply the initial filter based on the active tab
      },
      error: (err) => {
        console.error("Error fetching orders:", err);
        // You could add user-facing error handling here, e.g., a toast notification
      }
    });
  }

  setActiveTab(tab: 'pending' | 'fulfilled'): void {
    this.activeTab = tab;
    this.selectedOrderIds.clear(); // Important: Clear selections when changing tabs
    this.filterOrders();
  }

  filterOrders(): void {
    if (this.activeTab === 'pending') {
      this.filteredOrders = this.allOrders.filter(order => !order.isFulfilled);
    } else {
      this.filteredOrders = this.allOrders.filter(order => order.isFulfilled);
    }
  }

  // --- Checkbox and Selection Logic ---

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.selectedOrderIds.clear();
    if (isChecked) {
      this.filteredOrders.forEach(order => this.selectedOrderIds.add(order.id));
    }
  }

  toggleSelection(orderId: number, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedOrderIds.add(orderId);
    } else {
      this.selectedOrderIds.delete(orderId);
    }
  }

  isSelected(orderId: number): boolean {
    return this.selectedOrderIds.has(orderId);
  }

  // --- Action Logic ---

  // Handles the "Mark X as Fulfilled" button
  applyBulkAction(action: string): void {
    const idsToUpdate = Array.from(this.selectedOrderIds);
    if (idsToUpdate.length === 0) {
      alert("No orders selected.");
      return;
    }

    if (action === 'mark_fulfilled') {
      if (confirm(`Are you sure you want to mark ${idsToUpdate.length} orders as fulfilled?`)) {
        // Calls the new bulk update service method
        this.ordersService.bulkMarkAsFulfilled(idsToUpdate).subscribe({
          next: (response) => {
            alert(response.message || `${idsToUpdate.length} orders marked as fulfilled.`);
            this.loadAllOrders(); // Refresh the entire list of orders
            this.selectedOrderIds.clear(); // Clear the selection
          },
          error: (err) => {
            console.error("Bulk update failed:", err);
            alert("There was an error updating the orders. Please try again.");
          }
        });
      }
    }
  }

  // Handles the single "Mark Fulfilled" button on each row
  markAsFulfilled(orderId: number): void {
    if (confirm('Are you sure you want to mark this order as fulfilled?')) {
      // Calls the single-item update service method
      this.ordersService.markOrderAsFulfilled(orderId, true).subscribe({
        next: () => {
          this.loadAllOrders(); // Refresh the list after the update is successful
        },
        error: (err) => {
          console.error(`Failed to update order ${orderId}:`, err);
          alert("There was an error updating the order. Please try again.");
        }
      });
    }
  }

  // --- Helper and Modal Logic ---

  // Helper function for applying CSS classes to status badges
  getStatusClass(status: string): string {
    if (!status) return 'processing';
    return status.toLowerCase().replace(/\s+/g, '-'); // Handles statuses with spaces
  }

  // Opens the details modal
  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  // Closes the details modal
  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}
