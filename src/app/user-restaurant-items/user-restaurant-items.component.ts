import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';




@Component({
  selector: 'app-user-restaurant-items',
  imports: [RouterModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './user-restaurant-items.component.html',
  styleUrls: ['./user-restaurant-items.component.css']
})
export class UserRestaurantItemsComponent implements OnInit {
  restaurantId: number = 0; //aktuelle Restaurant-Id
  restaurant: { id: string; name: string; items: string[]; imageUrl:string ; description:String; openinghours:String}
  restaurants = [
    { id: '1', name: 'Burger King', items: ['Burger', 'Fries', 'Drinks'], imageUrl: './../assets/Burger-king-2.avif', description:'', openinghours:''},
    { id: '2', name: 'Marrakesh Tajine', items: ['Tajine kafta', 'Couscous', 'Mint Tea'], imageUrl: './../assets/Marokkanisch-Restau.jpg', description:'', openinghours:'' },
    { id: '3', name: 'Pizza Palace', items: ['Margherita', 'Pepperoni', 'Calzone'], imageUrl: './../assets/pizza-palace.png', description:'' , openinghours:''},
    { id: '4', name: 'AL MadaQ AL Dimshqi', items: ['Margherita', 'Pepperoni', 'Calzone'], imageUrl: './../assets/suria-res.jpg', description:'' , openinghours:''},

  ];
  items: any[] = [
    {
      id: 1,
      name: 'Tajine Kafta',
      description: 'Hackfleisch in Tajine mit Tomatensauce',
      price: 12,
      imageUrl: './../../assets/tajine-hackfleich.jpeg'
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      description: 'Tomaten, Mozzarella, Basilikum',
      price: 8.5,
      imageUrl: './../../assets/mar.jpeg'
    },
    {
      id: 3,
      name: 'Grillteller',
      description: 'Verschiedene gegrillte Fleischsorten',
      price: 15,
      imageUrl: './../../assets/gegrillte-teller.webp'
    },
    {
      id: 4,
      name: 'Spaghetti Carbonara',
      description: 'Spaghetti mit Speck und cremiger Soße',
      price: 10,
      imageUrl: './../../assets/carbonara.jpeg'
    }
  ]; //Produkte aus der Datenbank

  cartItems: any[] = [
    {
      id: 1,
      name: 'Tajine Kafta',
      description: 'Hackfleisch in Tajine mit Tomatensauce',
      price: 12,
      quantity: 2,
      remark: '',
      newRemark: '',
      showRemarkInput: false
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      description: 'Tomaten, Mozzarella, Basilikum',
      price: 8.5,
      quantity: 1,
      remark: '',
      newRemark: '',
      showRemarkInput: false
    }
  ]; // Warenkorb-Items
  balance: number = 100;//Guthaben
  subtotal: number = 0; // Zwischensumme
  total: number = 0; // Gesamtsumme
  showRemark: boolean = false;
  remarkText: string = '';
  
  newRemark:string= '';// Für Remark-Eingabe
 
  event: Event;
  
  constructor(private customerService: CustomerService, private route: ActivatedRoute) { }

  

  ngOnInit() {
    // ID aus der Route abrufen
    this.restaurantId = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    // Restaurant anhand der ID suchen
    this.restaurant = this.restaurants.find(r => r.id === this.restaurantId.toString());

    if (this.restaurant) {
      console.log('Restaurant gefunden:', this.restaurant);
    } else {
      console.error('Restaurant nicht gefunden!');
    }
  }

  loadrestaurantItems(restaurantId: number):void {
    this.customerService.getRestaurantItems(this.restaurantId).subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Menü-Items:', error);
      },
    });
  }

  


//alle funktionen die mit dem warenkorb zu tun haben


  addToCart(item: any): void {
    // Prüfen, ob das Item bereits im Warenkorb existiert
    const existingCartItem = this.cartItems.find(cartItem => cartItem.id === item.id);

    if (existingCartItem) {
      // Menge erhöhen, falls das Item bereits vorhanden ist
      existingCartItem.quantity += 1;
    } else {
      // Neues Item hinzufügen
      this.cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }

    console.log('Aktualisierter Warenkorb:', this.cartItems);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }



  increaseItemQuantity(item: any): void {
    item.quantity += 1;
    this.updateTotals();
  }

  // Menge verringern
  decreaseItemQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateTotals();
    }
  }

  // Artikel entfernen
  removeItemFromCart(item: any): void {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
    this.updateTotals();
  }
  updateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.total = this.subtotal - this.balance;
  }
  

  // Anmerkung speichern
 
  checkout(): void {
    alert('Vielen Dank für Ihre Bestellung!');
    this.cartItems = [];
    this.updateTotals();
  }
  // Controls the visibility of the remark box

  toggleRemarkInput(cartItem: any): void {
    cartItem.showRemarkInput = true; // Öffne das Eingabefeld
    cartItem.newRemark = cartItem.remark; // Lade vorhandenes Remark (falls vorhanden)
  }
  saveRemark(cartItem: any): void {
    // Save the remark
    cartItem.remark = cartItem.tempRemark;
    cartItem.showRemarkInput = false; // Close the input box
  }
  
  editRemark(cartItem: any): void {
    // Open remark input box with the current remark for editing
    cartItem.showRemarkInput = true;
    cartItem.tempRemark = cartItem.remark;
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

 
  



 


