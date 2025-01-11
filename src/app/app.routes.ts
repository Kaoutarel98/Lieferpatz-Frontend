import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {NotFoundComponent} from './not-found/not-found.component';
import { SingupComponent } from './singup/singup.component';
import { PartnerLoginComponent } from './partner-login/partner-login.component';

import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserorderComponent } from './userorder/userorder.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home',  pathMatch: 'full'},
    { path: 'home',component:HomeComponent   },
    { path: 'login', component: LoginComponent },       
    { path: 'signup', component: SingupComponent },
    { path: 'partner', component: PartnerLoginComponent },
    
    { path: 'restaurantProfile', component: RestaurantProfileComponent},
    { path: 'UserDashboard', component: UserDashboardComponent},
    { path: 'userorder', component: UserorderComponent},
    { path: 'userorderhistory', component: UserOrderHistoryComponent},




    { path: '**', component: NotFoundComponent }, 
];
