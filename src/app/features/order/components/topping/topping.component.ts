import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Toppings } from '../../order.model';

@Component({
  selector: 'cpa-topping',
  standalone: true,
  imports: [],
  templateUrl: './topping.component.html',
  styleUrl: './topping.component.scss'
})
export class ToppingComponent {
  @Input('topping') topping!: Toppings;
  @Output() onSelect = new EventEmitter<any>();

  onToppingSelect(price: number, name: string, event: Event) {
    this.onSelect.emit({price, name, isChecked: (event.target as HTMLInputElement).checked });
  }
}
