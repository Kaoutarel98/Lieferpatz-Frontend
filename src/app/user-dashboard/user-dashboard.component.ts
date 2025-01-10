import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeSection: string = 'restaurantOverview';  // Default active section is 'restaurantOverview'
  restaurants: any[] = [];
  menuItems: any[] = [];
  cartItems: any[] = [];
  orderHistory: any[] = [];
  totalPrice: number = 0;
  orderNote: string = '';
  selectedRestaurant: any = null;
  orders: any[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadRestaurants();  // Load the restaurants
    this.loadCustomerOrders();  // Load the orders
  }

  // Set active section
  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Fetch the list of restaurants
  loadRestaurants(): void {
    this.customerService.getRestaurants().subscribe((data) => {
      this.restaurants = data;
    });
  }

  // Fetch the menu items for a selected restaurant
  loadMenuItems(restaurantId: number): void {
    this.customerService.getRestaurantItems(restaurantId).subscribe((items) => {
      this.menuItems = items;
    });
  }

  // Fetch customer orders
  loadCustomerOrders(): void {
    this.customerService.getCustomerOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  // View restaurant details and menu items
  viewRestaurantDetails(restaurantId: number): void {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      this.selectedRestaurant = restaurant;
      this.loadMenuItems(restaurantId);
      this.setActiveSection('restaurantDetails');
    }
  }

  // Add item to the cart
  addItemToCart(item: any): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item, quantity: item.quantity });
    }
    this.calculateTotalPrice();
  }

  // Calculate total price for the cart
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Submit order
  submitOrder(): void {
    const orderData = {
      items: this.cartItems,
      totalPrice: this.totalPrice,
      note: this.orderNote,
    };
    this.customerService.placeOrder(orderData).subscribe(response => {
      console.log('Order placed successfully:', response);
      this.cartItems = [];
      this.totalPrice = 0;
      this.orderNote = '';
    });
  }

  // Accept order
  acceptOrder(order: any): void {
    this.customerService.acceptOrder(order.id).subscribe(response => {
      order.status = 'In Preparation';
      console.log('Order accepted:', response);
    });
  }

  // Decline order
  declineOrder(order: any): void {
    this.customerService.declineOrder(order.id).subscribe(response => {
      order.status = 'Cancelled';
      console.log('Order declined:', response);
    });
  }

  // Logout functionality
  logout(): void {
    // Your logout logic here
    console.log('Logged out');
  }
}
