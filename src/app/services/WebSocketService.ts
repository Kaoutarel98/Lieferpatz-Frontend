import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;

  constructor(private authService: AuthService) {}

  connect(onMessageReceived: (message: string) => void): void {
    console.log('WebSocket connecting...');
    let token = sessionStorage.getItem("Authorization")
    if (token){
        token = token.substring(7)
        this.authService.getAccount().subscribe((response) => {
        
        const socket = new SockJS('http://localhost:8080/order-request?token=' + token); // Spring Boot WebSocket endpoint
        this.stompClient = Stomp.Stomp.over(socket);
        
        this.stompClient.onConnect = () => {
            console.log('WebSocket connected!');
            
            // Subscribe to the backend topic
            this.stompClient?.subscribe(`/user/${response.body.email}/queue/notifications`, (message: any) => {
                onMessageReceived(message.body);
            });
        };
        
        this.stompClient.activate();
      }
    )}
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    console.log('WebSocket disconnected!');
  }
}
