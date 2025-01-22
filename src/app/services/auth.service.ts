import { HttpClient, HttpResponse } from '@angular/common/http';
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
  
  signup(restaurantData: any): Observable<HttpResponse<void>> {
    
    return this.http.post<void>(`${this.restaurantApiUrl}/erstellen`, restaurantData, {observe: 'response'});
  }

  signupKunde(kundeData: any): Observable<HttpResponse<void>> {
    
    return this.http.post<void>(`${this.kundeApiUrl}/erstellen`, kundeData, {observe: 'response'});
  }

  // Für Login (Annahme, dass Login Endpoint existiert oder ähnliche Methode)
  login(credentials: any): Observable<HttpResponse<void>> {
    
    console.log(' credentials:  ', credentials);

    return this.http.post<void>(`${this.userApiUrl}/login`, credentials, {observe: 'response'}); // Ändern Sie den Pfad entsprechend Ihrem Backend

    
     // Ändern Sie den Pfad entsprechend Ihrem Backend
 
  }

  getAccount(): Observable<any> {

    return this.http.get<any>(`${this.userApiUrl}`, {observe: 'response'}); 
 
  }


}
