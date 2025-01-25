import { CommonModule } from '@angular/common';

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
declare var $: any; 

import { OrderService } from '../services/order.service';
import { RestaurantService } from '../services/restaurant.service';
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
orders: any;
deliveryPlzs: string[] = [];

getOrderStatusClass(arg0: any): string|string[]|Set<string>|{ [klass: string]: any; } {
throw new Error('Method not implemented.');
}

weekDays: any;

  item = {name: '', preis: '', imageUrl: '', beschreibung: ''};
  activeSection: string = 'activeOrders'; // Die Standardsektion
  openingHours: any[] = [{
    'dayOfWeek': 'Monday',
    'openTime': '',
    'closeTime': ''
  },
  {
    'dayOfWeek': 'Tuesday',
    'openTime': '',
    'closeTime': ''
  },
  {
    'dayOfWeek': 'Wednesday',
    'openTime': '',
    'closeTime': ''
  },
  {
    'dayOfWeek': 'Thursday',
    'openTime': '',
    'closeTime': ''
  },
  {
    'dayOfWeek': 'Friday',
    'openTime': '',
    'closeTime': ''
  },
  {
    'dayOfWeek': 'Saturday',
    'openTime': '',
    'closeTime': ''
  },{
    'dayOfWeek': 'Sunday',
    'openTime': '',
    'closeTime': ''
  }]
  plz: string = '';
  completedOrders: any[] = [];
  pendingOrders: any[] = [];
  items: any[] = [];
  selectedFile!: File;
  restaurantBalance: string|number;
  selectedTab: any;

  
  constructor(
    private settingsService: SettingsService,
    private orderService: OrderService,
    private webSocketService: WebSocketService,
    private restaurantService: RestaurantService
  ) { }
  

  setActiveSection(section: string): void {
    this.activeSection = section;
    if (section === 'setting') {
      this.selectedTab = 'openingHours'; // Setzt den "Opening Hours" Tab als aktiv
    }
   
  }
  setActiveTab(tab: string): void {
    console.log("Wechsel zum Tab:", tab);
    this.selectedTab = tab;
  }

  onSubmit(formData: any): void {
    const values = formData.value;
    values["imageUrl"] = this.item.imageUrl;
    this.restaurantService.addItem(values).subscribe({
      next: () => this.loadItems(),
      error: (error) => console.log('Fehler beim Hinzufügen', error),
      complete: () => formData.reset()
    });

  
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(this.selectedFile )
    if (input.files && input.files[0]) {

      // Convert the image to a Base64 string
      const reader = new FileReader();
      reader.onload = () => {
        this.item.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  editItem(item: any) {
    // TODO: implement editItem
    // this.restaurantService.updateItem(item).subscribe({
    //   next: () => this.loadItems(),
    //   error: (error) => console.log('Fehler bei der Update', error),
    // });
  }

  deleteItem(item: any) {
    const confirmed = window.confirm('Are you sure you want to delete the item?');
    if (!confirmed) {
      return;
    }
    this.restaurantService.deleteItem(item.id).subscribe({
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
    this.loadPlz();
    

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
    this.settingsService.getOpeningHours().subscribe({
      next: (response) => {
        if(response && response.length > 0) {
          this.openingHours = response
        }
      },
      error: (error) => console.error('Fehler beim Laden der Öffnungszeiten', error)
    });
  }

  loadPlz(): void {
    this.settingsService.getDeliveryPlz().subscribe({
      next: (response) =>   {
        // Stelle sicher, dass response.plz ein Array ist
        this.deliveryPlzs = Array.isArray(response.plz) ? response.plz : [response.plz];
      },
      error: (error) => console.error('Fehler beim Laden der Öffnungszeiten', error)
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


// Öffnungszeiten aktualisieren
updateOpeningHours() {
  this.settingsService.updateOpeningHours(this.openingHours).subscribe({
    next: (response) => {
      console.log('Öffnungszeiten erfolgreich aktualisiert', response);
    },
    error: (error) => {
      console.error('Fehler bei der Aktualisierung der Öffnungszeiten', error);
    }
  });
}
updateDeliveryPlz() {
  this.deliveryPlzs.push(this.plz); // Füge die neue PLZ zur Liste hinzu
  this.plz = ''; 
  this.settingsService.updateDeliveryPlz(this.plz).subscribe({
    next: (response) => {
      console.log('LieferPlz erfolgreich aktualisiert', response);
    },
    error: (error) => {
      console.error('Fehler bei der Aktualisierung des LieferPlz', error);
    }
  });
}

removeDeliveryPlz(plz: string) {
  this.settingsService.deleteDeliveryPlz(plz).subscribe(() => {
    this.deliveryPlzs = this.deliveryPlzs.filter(p => p !== plz); // Entferne die PLZ aus der Liste
  });
}

acceptOrder(order: any) {
  this.orderService.confirmOrder(order.id).subscribe({
    next: () => this.loadOrders(),
    error: (error) => console.error('Fehler beim Bestätigen der Bestellung', error)
  });
}

declineOrder(order: any) {
  this.orderService.cancelOrder(order.id).subscribe({
    next: () => this.loadOrders(),
    error: (error) => console.error('Fehler beim Decline der Bestellung', error)
  });
}


}