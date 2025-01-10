import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-partner-login',
  standalone:true,
  imports: [RouterModule , CommonModule, FormsModule],
  templateUrl: './partner-login.component.html',
  styleUrl: './partner-login.component.css'
})
export class PartnerLoginComponent {
  user: any = { name: '', strasse: '', plz: '', beschreibung: '', bild: null, passwort: '' };  // Für die Registrierung
  credentials = { username: '', loginPassword: '' };

  constructor(private authService: AuthService) {}





  ngOnInit(): void {
     this.initializeValidation();
  }


  signupContentIsActive:boolean=true;
  

  toggleTabs(isSignup: boolean): void {
    this.signupContentIsActive = isSignup;
  }

  initializeValidation(): void {
    const forms = document.querySelectorAll<HTMLFormElement>('.needs-validation');

    Array.from(forms).forEach((form: HTMLFormElement) => {
      form.addEventListener('submit', (event: Event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });
  }


  signup(formValue: any) {
    this.authService.signup(formValue).subscribe({
      next: (response) => console.log('Registrierung erfolgreich', response),
      error: (error) => console.log('Fehler bei der Registrierung', error)
    });
  }

 
  login(formValue: any){
    this.authService.login(formValue).subscribe({
      next: (response) => console.log('Login erfolgreich', response),
      error: (error) => console.log('Fehler beim Login', error)
    });
  }

}
