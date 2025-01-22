import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = '/api/v1/restaurant';  // Die Basis-URL deines Backend-Controllers

  constructor(private http: HttpClient) { }

  // Öffnungszeiten abfragen
  getOpeningHours(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/opening`);
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
