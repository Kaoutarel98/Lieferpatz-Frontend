import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';




@Component({
  selector: 'app-user-restaurant-items',
  imports: [RouterModule, RouterLink, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './user-restaurant-items.component.html',
  styleUrls: ['./user-restaurant-items.component.css']
})
export class UserRestaurantItemsComponent implements OnInit {
  restaurantId: number = 0; //aktuelle Restaurant-Id
  restaurant = { id: '', name: '', items: [], image:'',  description: '', openinghours:''} 
  items: any ; //Produkte aus der Datenbank

  cartItems: any[] = []; // Warenkorb-Items
  balance: number = 100;//Guthaben
  subtotal: number = 0; // Zwischensumme
  total: number = 0; // Gesamtsumme
  showRemark: boolean = false;
  remarkText: string = '';
  
  newRemark:string= '';// Für Remark-Eingabe
 
  event: Event;
  
  constructor(private customerService: CustomerService, private route: ActivatedRoute, private authService: AuthService ) { }

  

  ngOnInit() {
    // ID aus der Route abrufen
    this.restaurantId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.loadrestaurantItems();
    this.updateBalance();
    this.loadWarekorbItems();
  }

  updateBalance(): void {
    this.authService.getAccount().subscribe({
      next: (data: any) => {this.balance = data.body.geldbeutel - data.body.vorgemerkt; this.updateTotals();},
      error: (error) => console.error('Fehler beim Laden des Guthabens:', error)
    });
  }

  loadWarekorbItems(): void {
    this.customerService.getWarenkorbItems().subscribe({
      next: (data: any) => {
        console.log('Warenkorb-Items geladen:', data);
        if(data) {
          this.cartItems = data;
          this.updateTotals();
        }
      },
      error: (error) => console.error('Fehler beim Laden der Warenkorb-Items:', error)
    });
  }

  loadrestaurantItems():void {
    this.customerService.getRestaurantItems(this.restaurantId).subscribe({
      next: (data: any) => {
        console.log('Menü-Items geladen:', data);
        if(data) {
          this.restaurant.name = data.restaurantName;
          this.restaurant.image = data.restaurantImage;
          this.items = data.items;
        }
      },
      error: (error) => console.error('Fehler beim Laden der Menü-Items:', error)
    });
  }

  


//alle funktionen die mit dem warenkorb zu tun haben


  addToCart(item: any): void {
    // Prüfen, ob das Item bereits im Warenkorb existiert
    const existingCartItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    const quantity = existingCartItem ? existingCartItem.quantity + 1 : 1;
    this.customerService.addWarenkorbItem({itemId: item.id, quantity: quantity}).subscribe({
      next: (data: any) => {
        console.log('Item zum Warenkorb hinzugefügt:', data);
        this.loadWarekorbItems();
      },
      error: (error) => console.error('Fehler beim Hinzufügen des Items zum Warenkorb:', error)
    });
    console.log('Aktualisierter Warenkorb:', this.cartItems);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }



  increaseItemQuantity(item: any): void {
    this.customerService.addWarenkorbItem({itemId: item.itemId, quantity: item.quantity + 1, remark: item.remark}).subscribe({
      next: (data: any) => {
        console.log('Item zum Warenkorb hinzugefügt:', data);
        this.loadWarekorbItems();
      },
      error: (error) => console.error('Fehler beim Hinzufügen des Items zum Warenkorb:', error)
    });
  }

  // Menge verringern
  decreaseItemQuantity(item: any): void {
      this.customerService.addWarenkorbItem({itemId: item.itemId, quantity: item.quantity - 1, remark: item.remark}).subscribe({
        next: (data: any) => {
          console.log('Item zum Warenkorb hinzugefügt:', data);
          this.loadWarekorbItems();
        },
        error: (error) => console.error('Fehler beim Hinzufügen des Items zum Warenkorb:', error)
      });
  }

  // Artikel entfernen
  removeItemFromCart(item: any): void {
    this.decreaseItemQuantity(item)
  }
  updateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.preis * item.quantity, 0);
    this.total = this.balance - this.subtotal;
  }
  

  // Anmerkung speichern
 
  checkout(): void {
    this.customerService.placeOrder().subscribe({
      next: (data: any) => {
        this.updateBalance();
        this.loadWarekorbItems();
        alert('Vielen Dank für Ihre Bestellung!');
      },
      error: (error) => console.error('Fehler beim Aufgeben der Bestellung:', error)
    });
  }
  // Controls the visibility of the remark box

  toggleRemarkInput(cartItem: any): void {
    cartItem.showRemarkInput = true; // Öffne das Eingabefeld
  }
  saveRemark(cartItem: any): void {
    // Save the remark
    cartItem.remark = cartItem.tempRemark;
    this.customerService.addWarenkorbItem({itemId: cartItem.itemId, quantity: cartItem.quantity, remark: cartItem.remark }).subscribe({
      next: (data: any) => {
        console.log('Item zum Warenkorb hinzugefügt:', data);
        this.loadWarekorbItems();
      },
      error: (error) => console.error('Fehler beim Hinzufügen des Items zum Warenkorb:', error)
    });
    cartItem.showRemarkInput = false; // Close the input box
  }
  
  editRemark(cartItem: any): void {
    // Open remark input box with the current remark for editing
    cartItem.showRemarkInput = true;
  }
  
  cancelRemark(cartItem: any): void {
    // Close the input box without saving
    cartItem.showRemarkInput = false;
    cartItem.tempRemark = ''; // Clear temp field
  }
  
  removeRemark(cartItem: any): void {
    // Remove the remark and show 'Add Remark' option
    cartItem.remark = null;
  }
 

  
}

 
  



 


