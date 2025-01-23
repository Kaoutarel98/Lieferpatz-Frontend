import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  declineOrder(id: any) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:8080/api/v1/restaurant';
  private WarenkorbUrl = 'http://localhost:8080/api/v1/Warenkorb';  // Die Basis-URL deines Backend-Controllers

  constructor(private http: HttpClient) { }

  // Bestellungen abfragen
  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bestellungen`);
  }

  // Bestellung bestätigen
  // Funktion zum Akzeptieren einer Bestellung
  confirmOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm/${orderId}`, {});
  }

  // Bestellung stornieren
  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/stornieren/${orderId}`, {});
  }

  // Bestellung abschließen (complete)
  completeOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/complete/${orderId}`, {});
  }
  getStatus(orderId: number): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/bestellung/status/${orderId}`);
  }

  
}
