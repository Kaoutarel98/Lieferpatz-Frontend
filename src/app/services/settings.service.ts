import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = 'http://localhost:8080/api/v1/restaurant';  // Die Basis-URL deines Backend-Controllers

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
  updateDeliveryPlz(plz: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/plz/add`, { plz: plz });
  }

  getDeliveryPlz(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/plz`);
  }
  deleteDeliveryPlz(plz: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/plz/delete/${plz}`);
  }
}
