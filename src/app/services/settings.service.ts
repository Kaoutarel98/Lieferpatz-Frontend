import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = 'http://localhost:8080/api/v1/restaurant';  // Die Basis-URL deines Backend-Controllers

  constructor(private http: HttpClient) { }

  // Öffnungszeiten abfragen
  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/settings`);
  }

  // Öffnungszeiten aktualisieren
  updateOpeningHours(openingHours: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/opening/update`, openingHours);
  }

  // Lieferradius aktualisieren
  updateDeliveryRadius(deliveryRadius: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delivery/radius`, { deliveryRadius });
  }
}
