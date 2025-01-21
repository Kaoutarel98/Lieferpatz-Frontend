import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  standalone:true,
    imports: [CommonModule, FormsModule, RouterLink],
  styleUrl: './singup.component.css'
})
export class SingupComponent {

  kunde: any = { vorname: '', nachname:'', email:'', strasse: '', plz: '', password: '', ort:'' };  // Für die Registrierung

   constructor(private authService: AuthService) {}

  signup(formValue: any) {
    console.log('formValue: ', formValue);
    this.authService.signupKunde(formValue).subscribe({
      next: (response) => console.log('Registrierung erfolgreich', response),
      error: (error) => console.log('Fehler bei der Registrierung', error)
    });
  }
}
