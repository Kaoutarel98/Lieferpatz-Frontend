import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-partner-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.css'],
  providers: [AuthService],
})
export class PartnerLoginComponent implements OnInit {
  // Datenmodelle für Registrierung und Login
  user = {
    name: '',
    email: '',
    strasse: '',
    plz: '',
    ort: '',
    beschreibung: '',
    bild: '',
    password: '',
  };

  credentials = { email: '', password: '' };

  signupContentIsActive = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initializeValidation();
  }

  // Umschalten zwischen "Sign Up" und "Log In"
  toggleTabs(isSignup: boolean): void {
    this.signupContentIsActive = isSignup;
  }

  // Clientseitige Validierung aktivieren
  initializeValidation(): void {
    const forms = document.querySelectorAll<HTMLFormElement>('.needs-validation');

    Array.from(forms).forEach((form: HTMLFormElement) => {
      form.addEventListener(
        'submit',
        (event: Event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  }

  // Registrierung
  signup(formValue: any) {
    console.log('Registrierung:', formValue);
    this.authService.signup(formValue).subscribe({
      next: (response) => {
        console.log('Registrierung erfolgreich', response);
        alert('Registrierung erfolgreich!');
      },
      error: (error) => {
        console.error('Fehler bei der Registrierung', error);
        alert('Fehler bei der Registrierung.');
      },
    });
  }

  // Login
  login(formValue: any) {
    this.authService.login(formValue).subscribe({
      next: (response: any) => {
        console.log('Login erfolgreich:', response);
        if (response && response.token) {
          alert('Login erfolgreich!');
          this.router.navigate(['/restaurantProfile']);
        } else {
          console.error('Login fehlgeschlagen: Ungültige Antwortstruktur', response);
        }
      },
      error: (error) => {
        console.error('Fehler beim Login:', error);
        alert('Fehler beim Login.');
      },
    });
  }
}
