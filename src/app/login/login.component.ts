
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(formData: NgForm): void {
    console.log(formData)
    this.authService.login(formData).subscribe({
      next: (response: any) => {
        console.log('Login erfolgreich', response);
        if (response && response.status === 200) {
          const authHeader = response.headers.get('Authorization');
          if (authHeader) {
            sessionStorage.setItem('Authorization', authHeader);
            console.log('Authorization header saved:', authHeader);
          } else {
            console.log('Authorization header is not present in the response');
          }
          this.router.navigate(['/UserDashboard']);
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (error: any) => alert('Fehler beim Login. E-Mail oder Passwort sind falsch')
    });
  }

}
