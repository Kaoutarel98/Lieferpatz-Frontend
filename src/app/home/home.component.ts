import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  Title:String="Lieferpatz";
  imageLink:String="C:\Users\kaoutar el gharbouji\Lieferpatz-Front\src\assets\Logo.png"

}
