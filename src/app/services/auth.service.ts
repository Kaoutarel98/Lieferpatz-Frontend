import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private restaurantApiUrl= '/api/v1/restaurant';
  private kundeApiUrl= '/api/v1/kunde';
  private userApiUrl = '/api/v1/user';
  
  
 // Ändern Sie den Pfad entsprechend Ihrem Backend

  private apiUrl= '/api/v1/restaurant'; // Ändern Sie den Pfad entsprechend Ihrem Backend

  constructor(private http: HttpClient) { }
  
  signup(restaurantData: any): Observable<any> {
    
    return this.http.post(`${this.restaurantApiUrl}/erstellen`, restaurantData);
  }

  signupKunde(kundeData: any): Observable<any> {
    
    return this.http.post(`${this.kundeApiUrl}/erstellen`, kundeData);
  }

  // Für Login (Annahme, dass Login Endpoint existiert oder ähnliche Methode)
  login(credentials: any): Observable<any> {
    
    console.log(' credentials:  ', credentials);

    return this.http.post(`${this.userApiUrl}/login`, credentials); // Ändern Sie den Pfad entsprechend Ihrem Backend

    
     // Ändern Sie den Pfad entsprechend Ihrem Backend
 
  }


}
