import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl= 'http://localhost:8080/api/v1/restaurant'; // Ändern Sie den Pfad entsprechend Ihrem Backend

  constructor(private http: HttpClient) { }
  
  signup(restaurantData: any): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/erstellen`, restaurantData);
  }

  // Für Login (Annahme, dass Login Endpoint existiert oder ähnliche Methode)
  login(credentials: any): Observable<any> {
    console.log(' credentials:  ', credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials); // Ändern Sie den Pfad entsprechend Ihrem Backend
  }


}
