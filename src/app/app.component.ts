import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { SingupComponent } from './singup/singup.component';
import { PartnerLoginComponent } from './partner-login/partner-login.component';

import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';




@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
    LoginComponent,
    CommonModule,
    RouterModule,
    RouterLink,
    SingupComponent,
    PartnerLoginComponent,
    RestaurantProfileComponent,
 
   ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Lieferpatz-Front';
}
