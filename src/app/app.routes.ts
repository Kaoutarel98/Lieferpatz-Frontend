import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {NotFoundComponent} from './not-found/not-found.component';
import { SingupComponent } from './singup/singup.component';
import { PartnerLoginComponent } from './partner-login/partner-login.component';

import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserorderComponent } from './userorder/userorder.component';

import { UserRestaurantItemsComponent } from './user-restaurant-items/user-restaurant-items.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home',  pathMatch: 'full'},
    { path: 'home',component:HomeComponent   },
    { path: 'login', component: LoginComponent },       
    { path: 'signup', component: SingupComponent },
    { path: 'partner', component: PartnerLoginComponent },
    
    { path: 'restaurantProfile', component: RestaurantProfileComponent},
    { path: 'UserDashboard', component: UserDashboardComponent},
    { path: 'restaurant-menu/:id', component: UserRestaurantItemsComponent},
    { path: 'userorder', component: UserorderComponent},
   




    { path: '**', component: NotFoundComponent }, 
];
