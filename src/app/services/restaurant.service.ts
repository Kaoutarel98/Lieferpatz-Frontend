// src/app/services/restaurant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = 'http://localhost:8080/api/v1/restaurant'; // Basis-URL des Controllers

  constructor(private http: HttpClient) {}

  // Neues Item hinzufügen
  addItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/item/add`, item);
  }

  // Item löschen
  deleteItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/item/delete/${itemId}`);
  }

  // Item aktualisieren
  updateItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/item/update`, item);
  }
}
