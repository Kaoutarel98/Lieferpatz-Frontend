import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';

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
  router: any;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadRestaurants();
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
  

  //
  

}
