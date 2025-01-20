import { Component } from '@angular/core';
import { RouterLink,RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  restaurants = [
    { id: '1', name: 'Burger King', items: ['Burger', 'Fries', 'Drinks'], imageUrl: './../assets/Burger-king-2.avif', description:'',openingHours:''},
    { id: '2', name: 'Marrakesh Tajine', items: ['Tajine kafta', 'Couscous', 'Mint Tea'],imageUrl: './../assets/Marokkanisch-Restau.jpg', description:'',openingHours:'' },
    { id: '3', name: 'Pizza Palace', items: ['Margherita', 'Pepperoni', 'Calzone'],imageUrl: './../assets/pizza-palace.png', description:'' ,openingHours:''},
    { id: '4', name: 'AL MadaQ AL Dimshqi', items: ['Margherita', 'Pepperoni', 'Calzone'],imageUrl: './../assets/suria-res.jpg', description:'' ,openingHours:''},

  ];
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
