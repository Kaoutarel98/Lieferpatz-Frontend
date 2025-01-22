import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = '/api/v1/restaurant';
  private WarenkorbUrl = '/api/v1/Warenkorb';  // Die Basis-URL deines Backend-Controllers

  constructor(private http: HttpClient) { }

  // Bestellungen abfragen
  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bestellungen`);
  }

  getItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/items`);
  }

  addItem(item: any): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.apiUrl}/item/add`, item, {observe: 'response'});
  }

  updateItem(item: any): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.apiUrl}/item/update`, item, {observe: 'response'});
  }

  deleteItem(item: any): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.apiUrl}/item/delete/${item.id}`, {observe: 'response'});
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
