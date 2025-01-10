import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl= '/api/v1/restaurants';

  constructor(private http: HttpClient) { }
  
  signup(restaurantData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/erstellen`, restaurantData);
  }

  // Für Login (Annahme, dass Login Endpoint existiert oder ähnliche Methode)
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials); // Ändern Sie den Pfad entsprechend Ihrem Backend
  }


}
