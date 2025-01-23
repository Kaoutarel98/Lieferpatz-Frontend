import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = '/api/v1/restaurant';

  constructor(private http: HttpClient) { }

  // Bestellungen abfragen
  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bestellungen`);
  }

  getItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/items`);
  }

  // Bestellung bestätigen
  confirmOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bestellung/confirm/${orderId}`, {});
  }

  // Bestellung stornieren
  cancelOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bestellung/stornieren/${orderId}`, {});
  }

  // Bestellung abschließen
  completeOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bestellung/complete/${orderId}`, {});
  }
  getStatus(orderId: number): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/bestellung/status/${orderId}`);
  }

  
}