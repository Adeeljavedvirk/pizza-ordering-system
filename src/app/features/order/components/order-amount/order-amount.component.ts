import { Component, Input } from '@angular/core';
import { OrderAmount } from '../../order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cpa-order-amount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-amount.component.html',
  styleUrl: './order-amount.component.scss'
})
export class OrderAmountComponent {
  @Input({ required: true }) orderAmount!: OrderAmount;
}
