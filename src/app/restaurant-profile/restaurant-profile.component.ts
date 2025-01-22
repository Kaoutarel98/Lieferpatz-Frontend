import { CommonModule } from '@angular/common';

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
declare var $: any; 

import { OrderService } from '../services/order.service';
import { SettingsService } from '../services/settings.service';
import { WebSocketService } from '../services/WebSocketService';

@Component({
  selector: 'app-restaurant-profile',
  standalone:true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './restaurant-profile.component.html',
  styleUrl: './restaurant-profile.component.css',
 
})
export class RestaurantProfileComponent  implements OnInit, AfterViewInit{
  item = {name: '', preis: '', imageUrl: '', beschreibung: ''};
  activeSection: string = 'activeOrders'; // Die Standardsektion
  openingHours: any = {
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  };
  deliveryRadius: number = 0;
  completedOrders: any[] = [];
  pendingOrders: any[] = [];
  items: any[] = [];
  selectedFile!: File;

  
  constructor(
    private settingsService: SettingsService,
    private orderService: OrderService,
    private webSocketService: WebSocketService
  ) { }
  

  setActiveSection(section: string): void {
    this.activeSection = section;
   
  }

  onSubmit(formData: any): void {
    const values = formData.value;
    values["imageUrl"] = this.item.imageUrl;
    this.orderService.addItem(values).subscribe({
      next: () => this.loadItems(),
      error: (error) => console.log('Fehler beim Hinzufügen', error),
      complete: () => formData.reset()
    });

  
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Convert the image to a Base64 string
      const reader = new FileReader();
      reader.onload = () => {
        this.item.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  editItem(item: any) {
    // TODO: implement editItem
    // this.orderService.updateItem(item).subscribe({
    //   next: () => this.loadItems(),
    //   error: (error) => console.log('Fehler bei der Update', error),
    // });
  }

  deleteItem(item: any) {
    const confirmed = window.confirm('Are you sure you want to delete the item?');
    if (!confirmed) {
      return;
    }
    this.orderService.deleteItem(item).subscribe({
      next: () => this.loadItems(),
      error: (error) => console.log('Fehler beim Löschen', error),
    });
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
    this.webSocketService.connect((msg: any) => this.pendingOrders.unshift(JSON.parse(msg)));
    
    this.loadOrders(); // Bestellungen beim Initialisieren der Komponente laden
    this.loadItems()
    this.loadSettings(); // Einstellungen beim Initialisieren der Komponente laden

    $(document).ready(function() {
      $('#pendingOrdersTable').DataTable();
    });
    $(document).ready(function() {
      $('#completedOrdersTable').DataTable();
    });
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }

  ngAfterViewInit(): void {
    // Initialisierung der DataTable
   
  }


  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.completedOrders = orders.filter(order => order.status !== 'BEARBEITUNG');
      console.log('Completed Orders:', this.completedOrders);
      this.pendingOrders = orders.filter(order => order.status === 'BEARBEITUNG');
    });
  }

  loadItems(): void {
    this.orderService.getItems().subscribe((items) => {
      this.items = items;
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
