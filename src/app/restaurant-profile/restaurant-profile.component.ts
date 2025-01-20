import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {RouterLink, RouterModule} from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any; 

import { SettingsService } from '../services/settings.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-restaurant-profile',
  standalone:true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './restaurant-profile.component.html',
  styleUrl: './restaurant-profile.component.css',
 
})
export class RestaurantProfileComponent  implements OnInit, AfterViewInit{
  activeSection: string = 'activeOrders'; // Die Standardsektion
  openingHours: any = {
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  };
  deliveryRadius: number = 0;
  orders: any[] = [];
  completedOrders: any[] = [];
  pendingOrders: any[] = [];
  items: any[] = [];
  itemName: string = '';  // Item Name für das Menu-Management
  itemPrice: string = '';  // Preis des Items
  image: any;  // Für das Bild
  category: string = '';  // Kategorie (Drinks, Meals)
  description: string = '';  // Beschreibung des Items

  
  constructor(
    private settingsService: SettingsService,
    private orderService: OrderService
  ) { }
  

  setActiveSection(section: string): void {
    this.activeSection = section;
   
  }

  onSubmit(formData: NgForm): void {
    console.log('Form Data: ', formData.value);
    this.items.push(formData.value);
    console.log('Items: ', this.items);
    formData.reset();

  
  }

  

  initializeValidation(): void {
    const forms = document.querySelectorAll(
      '.needs-validation'
    ) as NodeListOf<HTMLFormElement>;

    forms.forEach((form) => {
      form.addEventListener(
        'submit',
        (event) => {
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

  
  

  ngOnInit(): void {
    this.loadOrders(); // Bestellungen beim Initialisieren der Komponente laden
    this.loadSettings(); // Einstellungen beim Initialisieren der Komponente laden
    $(document).ready(function() {
      $('#ordersTable').DataTable();
    });
  }


  ngAfterViewInit(): void {
    // Initialisierung der DataTable
   
  }


  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.completedOrders = orders.filter(order => order.status === 'Completed');
      this.pendingOrders = orders.filter(order => order.status === 'Pending');
    });
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe((settings) => {
      this.openingHours = settings.openingHours;
      this.deliveryRadius = settings.deliveryRadius;
    });
  }
  


 


ngAfterViewInit2() {
  // Initialisiere DataTables nach dem Laden der Ansicht
  $(document).ready(function() {
    $('#completedOrdersTable').DataTable();
  });
}

// Beispiel-Funktionen zum Abrufen der Bestellungen (Backend-Integration)
getCompletedOrders() {
  // Abrufen der abgeschlossenen Bestellungen von deinem Backend
  this.completedOrders = [
    { id: 1, customerName: 'John Doe', totalPrice: 25.99, orderedAt: new Date(), status: 'Completed' },
    { id: 2, customerName: 'Jane Doe', totalPrice: 15.99, orderedAt: new Date(), status: 'Completed' }
  ];
}

getPendingOrders() {
  // Abrufen der ausstehenden Bestellungen von deinem Backend
  this.pendingOrders = [
    { id: 3, customerName: 'Mary Jane', totalPrice: 12.99, orderedAt: new Date(), status: 'Pending' },
    { id: 4, customerName: 'Peter Parker', totalPrice: 8.99, orderedAt: new Date(), status: 'Pending' }
  ];
}


getSettings() {
  this.settingsService.getSettings().subscribe((settings) => {
    this.openingHours = settings.openingHours;
    this.deliveryRadius = settings.deliveryRadius;
  });
}

// Öffnungszeiten aktualisieren
updateOpeningHours() {
  const updatedHours = this.openingHours;
  this.settingsService.updateOpeningHours(updatedHours).subscribe({
    next: (response) => {
      console.log('Öffnungszeiten erfolgreich aktualisiert', response);
    },
    error: (error) => {
      console.error('Fehler bei der Aktualisierung der Öffnungszeiten', error);
    }
  });
}
updateDeliveryRadius() {
  const updatedRadius = this.deliveryRadius;
  this.settingsService.updateDeliveryRadius(updatedRadius).subscribe({
    next: (response) => {
      console.log('Lieferradius erfolgreich aktualisiert', response);
    },
    error: (error) => {
      console.error('Fehler bei der Aktualisierung des Lieferradius', error);
    }
  });
}
acceptOrder(order: any) {
  console.log('Order accepted:', order);
  // Implementieren Sie die Logik zum Akzeptieren der Bestellung
}

declineOrder(order: any) {
  console.log('Order declined:', order);
  // Implementieren Sie die Logik zum Ablehnen der Bestellung
}


}