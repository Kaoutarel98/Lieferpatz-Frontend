import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-partner-login',
  standalone:true,
  imports: [RouterModule , CommonModule, FormsModule],
  templateUrl: './partner-login.component.html',
  styleUrl: './partner-login.component.css'
})
export class PartnerLoginComponent {
  user: any = { name: '', email:'', strasse: '', plz: '',ort:'',beschreibung: '', image: '', password: '' };  // Für die Registrierung
  credentials = { email: '', password: '' };
  selectedFile!: File;
  constructor(private authService: AuthService, private router: Router) {}
 





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
    formValue["image"] = this.user.image;
    this.authService.signup(formValue).subscribe({
      next: (response) => console.log('Registrierung erfolgreich', response),
      error: (error) => console.log('Fehler bei der Registrierung', error)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Convert the image to a Base64 string
      const reader = new FileReader();
      reader.onload = () => {
        this.user.image = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

 
  login(formValue: any) {
    this.authService.login(formValue).subscribe({
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
          this.router.navigate(['/restaurantProfile']);
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (error: any) => console.log('Fehler beim Login', error)
    });
  }
}
