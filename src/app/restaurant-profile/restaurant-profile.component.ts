import { CommonModule } from '@angular/common';

import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';
declare var $: any;

import { OrderService } from '../services/order.service';
import { RestaurantService } from '../services/restaurant.service';
import { SettingsService } from '../services/settings.service';
import { WebSocketService } from '../services/WebSocketService';
import { Subscription } from 'rxjs';

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
items: any[] = [];
selectedFile!: File;
restaurantBalance: number =1000;
selectedTab: any;
selectedOrder: any;
targetBalance: number = 1000; // Ziel-Guthaben
selectedItem: any = {};
weekDays: any;


item = {name: '', preis: 0, imageUrl: '', beschreibung: ''};

  activeSection: string = 'activeOrders'; // Die Standardsektion
  openingHours: any[] = [{
    'dayOfWeek': 'Monday',
    'openTime': '',
    'closeTime': ''},
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
  completedOrders: any[] = [
    // {
    //   id: 1,
    //   kundeName: 'John Doe',
    //   lieferAdresse: 'Beispielstraße 1, 10101 Musterstadt',
    //   gesamtpreis: 25.99,
    //   bestellzeitpunkt: new Date('2025-01-23T18:30:00'),
    //   status: 'accepted',
    //   items: [
    //     { label: "Pizza Margherita", quantity: 2, price: 7.50 },
    //     { label: "Cola 0.5L", quantity: 1, price: 2.50 }
    //   ]
    // },
    // {
    //   id: 2,
    //   kundeName: 'Jane Doe',
    //   lieferAdresse: 'Musterweg 2, 10202 Beispielstadt',
    //   gesamtpreis: 15.99,
    //   bestellzeitpunkt: new Date('2025-01-23T19:00:00'),
    //   status: 'completed',
    //   items: [
    //     { label: "Sushi Set", quantity: 1, price: 15.99 }
    //   ]
    // }
  ];

  pendingOrders: any[] = [
    // {
    //   id: 3,
    //   kundeName: 'Alice Müller',
    //   lieferAdresse: 'Waldstraße 12, 10303 Waldstadt',
    //   gesamtpreis: 39.90,
    //   bestellzeitpunkt: new Date('2025-01-24T14:00:00'),
    //   status: 'pending',
    //   items: [
    //     { label: "Burger Deluxe", quantity: 1, price: 11.90 },
    //     { label: "Pommes Frites", quantity: 2, price: 5.00 },
    //     { label: "Salat Caesar", quantity: 1, price: 8.00 }
    //   ]
    // },
    // {
    //   id: 4,
    //   kundeName: 'Bob Schmidt',
    //   lieferAdresse: 'Hauptstraße 5, 10404 Hauptstadt',
    //   gesamtpreis: 18.50,
    //   bestellzeitpunkt: new Date('2025-01-24T15:30:00'),
    //   status: 'pending',
    //   items: [
    //     { label: "Pasta Carbonara", quantity: 1, price: 12.50 },
    //     { label: "Garlic Bread", quantity: 1, price: 6.00 }
    //   ]
    // }
];

  
 

  
  constructor(
    private cdRef: ChangeDetectorRef,
    private settingsService: SettingsService,
    private orderService: OrderService,
    private webSocketService: WebSocketService,
    private restaurantService: RestaurantService,
    private ngZone: NgZone, 
    

  ) { }
  

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'status-accepted';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
  openDetailsModal(order: any) {
    this.selectedOrder = order;
    // Bootstrap Modal öffnen
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
  }

  getOrderStatusClass(arg0: any): string|string[]|Set<string>|{ [klass: string]: any; } {
    throw new Error('Method not implemented.');
    }

  setActiveSection(section: string): void {
    this.activeSection = section;
    if (section === 'setting') {
      this.selectedTab = 'openingHours'; // Setzt den "Opening Hours" Tab als aktiv
      
    }
    if (section === 'activeOrders' || section === 'ordersHistory') {
      // Verwenden Sie setTimeout, um sicherzustellen, dass die DOM-Elemente vollständig geladen sind
      setTimeout(() => {
        this.initializeDataTables();
      }, 0);
    }
   
  }
  setActiveTab(tab: string): void {
    console.log("Wechsel zum Tab:", tab);
    this.selectedTab = tab;
    
  }

  onSubmit(formData: any): void {
    console.log('Aktuelles Item:', this.item);
    if (!this.item) {
      console.error('Item-Objekt ist nicht definiert.');
      return;
    }
  
    const values = formData.value;
    values["imageUrl"] = this.item.imageUrl;
    values["name"] = this.item.name;
    values["preis"] = this.item.preis;
    this.restaurantService.addItem(values).subscribe({
      next: () => {
        this.loadItems();
        console.log('Item hinzugefügt und Items neu geladen');
      },
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
        console.log("Loaded Base64 URL:", this.item.imageUrl);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  

  editItem(item: any) {
    this.selectedItem = {...item}; // Kopiert das Item, um es im Modal zu bearbeiten
    const editModal = new bootstrap.Modal(document.getElementById('editItemModal'));
    editModal.show();
  }

  updateItem() {
    this.restaurantService.updateItem(this.selectedItem).subscribe({
      next: (updatedItem) => {
        const index = this.items.findIndex(item => item.id === this.selectedItem.id);
        if (index !== -1) {
          this.ngZone.run(() => { // Dies stellt sicher, dass die View-Aktualisierung in Angulars Zone ausgeführt wird.
            this.items[index] = updatedItem;
          });
        }
      },
      error: (error) => console.error('Fehler beim Update des Items', error)
    });
  
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
    editModal.hide(); 
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
    this.webSocketService.connect((msg: any) => {
      let newOrder = JSON.parse(msg);
      this.pendingOrders.unshift(newOrder); // Füge die neue Bestellung direkt zu den laufenden hinzu
    });
  
    this.loadOrders(); // Lade alle Bestellungen beim Start
    this.loadItems();
    this.loadSettings();
    this.loadPlz();
    
    
  }
  
  ngOnDestroy() {
   
    this.webSocketService.disconnect();
  }

  

 

  
  initializeDataTables(): void {
    $(document).ready(() => {
      if ($.fn.DataTable.isDataTable('#pendingOrdersTable')) {
        $('#pendingOrdersTable').DataTable().destroy();
      }
      if ($.fn.DataTable.isDataTable('#completedOrdersTable')) {
        $('#completedOrdersTable').DataTable().destroy();
      }

      $('#pendingOrdersTable').DataTable({
        order: [[4, 'asc']],
        columnDefs: [{ targets: 5, orderData: [5, 4] }]
      });

      $('#completedOrdersTable').DataTable({
        order: [[4, 'asc']],
        columnDefs: [{ targets: 5, orderData: [5, 4] }]
      });
    });
  }

  ngAfterViewInit(): void {
    this.initializeDataTables();
    
    
   
    // Initialisierung der DataTable
   
  }


  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders) => {
      orders.forEach(order => {
        order.bestellzeitpunkt = new Date(order.bestellzeitpunkt);
        console.log(order.bestellzeitpunkt); 
      });
      this.pendingOrders = orders.filter(order => order.status.toLowerCase() === 'bearbeitung');
      this.completedOrders = orders.filter(order => order.status.toLowerCase() !== 'bearbeitung')
                                   .sort((a, b) => new Date(a.bestellzeitpunkt).getTime() - new Date(b.bestellzeitpunkt).getTime());
      console.log('Pending Orders:', this.pendingOrders);
      console.log('Completed Orders:', this.completedOrders);
    });
    
  }
  

  loadItems(): void {
    this.orderService.getItems().subscribe({
      next: (items) => {
        console.log('Geladene Items:', items);
        this.items = items;
      },
      error: (error) => console.error('Fehler beim Laden der Items:', error)
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
        this.plz = response.plz;
      },
      error: (error) => console.error('Fehler beim Laden der Öffnungszeiten', error)
    });
  }
  


 


  ngAfterViewInit2(): void {
    
    // $(document).ready(function() {
    //   $('#completedOrdersTable').DataTable({
    //     "order": [[5, 'asc'], [4, 'asc']], // Sortiert zuerst nach Status, dann nach Bestellzeitpunkt
    //     "columnDefs": [{
    //       "targets": 5,
    //       "orderData": [5, 4] // Innerhalb des gleichen Status nach Datum/Uhrzeit sortieren
    //     }]
    //   });
    // });
  }
  

// Beispiel-Funktionen zum Abrufen der Bestellungen (Backend-Integration)
// getCompletedOrders() {
//   // Abrufen der abgeschlossenen Bestellungen von deinem Backend
//   this.completedOrders = [
//     { id: 1, customerName: 'John Doe', totalPrice: 25.99, orderedAt: new Date(), status: 'Completed' },
//     { id: 2, customerName: 'Jane Doe', totalPrice: 15.99, orderedAt: new Date(), status: 'Completed' }
//   ];
// }

// getPendingOrders() {
//   // Abrufen der ausstehenden Bestellungen von deinem Backend
//   this.pendingOrders = [
//     { id: 3, customerName: 'Mary Jane', totalPrice: 12.99, orderedAt: new Date(), status: 'Pending' },
//     { id: 4, customerName: 'Peter Parker', totalPrice: 8.99, orderedAt: new Date(), status: 'Pending' }
//   ];
// }


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