import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { OrderService } from '../services/order.service';

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
  activeSectionS:String= 'openingHours'
  searchTerm: string = '';
  filteredCurrentOrders: any[] = [];
  filteredOrderHistory: any[] = [];

  constructor(
    private customerService: CustomerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadOrdersWithStatus();
  }

  loadOrdersWithStatus() {
    this.customerService.getCustomerOrders().subscribe((orders) => {
      this.currentOrders = orders.filter(order => ['BEARBEITUNG', 'ZUBEREITUNG'].includes(order.status));
      this.orderHistory = orders.filter(order => !['BEARBEITUNG', 'ZUBEREITUNG'].includes(order.status));
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
      order.bestellungItems.some((item: any) => item.itemLabel.toLowerCase().includes(term)) ||
      order.status.toLowerCase().includes(term)
    );
    
    this.filteredOrderHistory = this.orderHistory.filter(history =>
      history.restaurantName.toLowerCase().includes(term) ||
      history.bestellungItems.some((item: any) => item.itemLabel.toLowerCase().includes(term)) ||
      history.status.toLowerCase().includes(term)
    );
  }
}
