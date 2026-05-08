import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent {
  // Placeholder for orders.
  orders: any[] = [];
}
