import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { WebSocketService } from '../services/WebSocketService';
import { AuthService } from '../services/auth.service';

interface Restaurant {
  id: string;
  name: string;
  ort: string;
  plz: string;
  strasse: string;
  image: string;
  beschreibung: string;
}
 

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink, RouterModule, CommonModule],
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  restaurants: Restaurant[] = [];
userBalance:number =0;

 

  constructor(private customerService: CustomerService, 
     private webSocketService: WebSocketService, 
     private router: Router,
    private authservice: AuthService ) { }

  ngOnInit() {
    this.webSocketService.connect((msg: any) => {
      let restau = JSON.parse(msg);
      this.restaurants.unshift(restau); // Füge die neue restaurant direkt zu den laufenden hinzu
    });
    this.loadRestaurants();
    this.getAccountBalance();
  }

  
  loadRestaurants() {
    this.customerService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (error) => {
        console.error('Error fetching restaurants:', error);
      }
    });
  }

  viewRestaurantDetails(restaurantId: number) {
    // Navigate to the restaurant details page
    this.router.navigate(['/restaurant-details', restaurantId]);
  }
  
  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
  //
  
  getAccountBalance(): void {
    this.authservice.getAccount().subscribe({
      next: (kunde) => {
        this.userBalance = kunde.geldbeutel; // Nutze das 'geldbeutel' Feld
        console.log('Aktueller Geldbeutelstand:', this.userBalance);
      },
      error: (error) => {
        console.error('Fehler beim Laden des Geldbeutelstands:', error);
      }
    });
  }

}
