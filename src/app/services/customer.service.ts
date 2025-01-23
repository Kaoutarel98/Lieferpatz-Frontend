// src/app/services/customer.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Injectable decorator makes this class a service that can be injected into other components
@Injectable({
  providedIn: 'root',  // Provided at root means it's available throughout the app
})
export class CustomerService {
  // API URL
  private apiUrl = '/api/v1/kunde';  // Adjust the URL for your backend API
  private warenkorbUrl = '/api/v1/warenkorb';  // Die Basis-URL deines Backend-Controllers

  constructor(private http: HttpClient) {}

  // Fetch list of restaurants for the customer
  getRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurant/get`);
  }

  // Fetch menu items for a specific restaurant
  getRestaurantItems(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurant/${restaurantId}/items`);
  }

  // Get customer orders
  getCustomerOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bestellung`);
  }

  // Place a new order
  placeOrder(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bestellung`, null);
  }

  // Fetch order details
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bestellung/${orderId}`);
  }

  getWarenkorbItems(): Observable<any> {
    return this.http.get<any>(`${this.warenkorbUrl}`);
  }

  addWarenkorbItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.warenkorbUrl}`, item);
  }
}
