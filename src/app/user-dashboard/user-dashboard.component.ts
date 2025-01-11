import { Component } from '@angular/core';
import { RouterLink,RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  restaurants = [];
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
