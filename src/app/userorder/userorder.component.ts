import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { OrderService } from '../services/order.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userorder',
  templateUrl: './userorder.component.html',
  styleUrls: ['./userorder.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  providers: [DatePipe, CustomerService, OrderService],
})
export class UserorderComponent implements OnInit {
  currentOrders: any[] = [];
  orderHistory: any[] = [];
  activeSection: 'CurrentOrder' | 'OrderHistory' = 'CurrentOrder';
  searchTerm: string = '';
  filteredCurrentOrders: any[] = [];
  filteredOrderHistory: any[] = [];

  // Beispiele für Mock-Daten
  mockOrders = [
    { id: 1, restaurantName: 'Sushi Place', items: ['California Roll', 'Miso Soup'], date: '2025-01-13T19:30:00', status: 'In Zubereitung' },
    { id: 2, restaurantName: 'Pizza Town', items: ['Margherita', 'Garlic Bread'], date: '2025-01-12T19:45:00', status: 'In Zubereitung' },
    { id: 3, restaurantName: 'Curry House', items: ['Butter Chicken', 'Naan'], date: '2025-01-02T18:00:00', status: 'Abgeschlossen' },
    { id: 4, restaurantName: 'Burger Grill', items: ['Cheeseburger', 'Fries'], date: '2025-01-08T16:30:00', status: 'Storniert' }
  ];

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeMockOrders();
    this.loadOrdersWithStatus();
  }

  initializeMockOrders() {
    // Mock-Daten sortieren und aufteilen (case-insensitive) nach Datum
    this.currentOrders = this.mockOrders
      .filter(order => ['in zubereitung', 'accepted'].includes(order.status.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Neueste zuerst
  
    this.orderHistory = this.mockOrders
      .filter(order => !['in zubereitung', 'accepted'].includes(order.status.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Neueste zuerst
  }
  
  loadOrdersWithStatus() {
    this.customerService.getCustomerOrders().subscribe(orders => {
      const statusRequests = orders.map(order =>
        this.orderService.getStatus(order.id).pipe(
          map(status => ({ ...order, status: status.status }))
        )
      );
  
      forkJoin(statusRequests).subscribe(completeOrders => {
        const currentOrders = completeOrders
          .filter(order => ['in zubereitung', 'accepted'].includes(order.status.toLowerCase()))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Neueste zuerst
  
        const orderHistory = completeOrders
          .filter(order => !['in zubereitung', 'accepted'].includes(order.status.toLowerCase()))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Neueste zuerst
  
        // Merge mit Mock-Daten
        this.currentOrders = [...this.currentOrders, ...currentOrders];
        this.orderHistory = [...this.orderHistory, ...orderHistory];
      });
    });
  }
  
  setActiveSection(section: 'CurrentOrder' | 'OrderHistory') {
    this.activeSection = section;
  }

  // Example usage of DatePipe in component
  formatOrderDate(date: string): string {
    return this.datePipe.transform(date, 'medium');
  }
  filterOrders() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCurrentOrders = this.currentOrders.filter(order =>
      order.restaurantName.toLowerCase().includes(term) ||
      order.items.some((item: string) => item.toLowerCase().includes(term)) ||
      order.status.toLowerCase().includes(term)
    );

    this.filteredOrderHistory = this.orderHistory.filter(history =>
      history.restaurantName.toLowerCase().includes(term) ||
      history.items.some((item: string) => item.toLowerCase().includes(term)) ||
      history.status.toLowerCase().includes(term)
    );
  }
}
