import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Topping, Toppings } from '../../order.model';
import { ToppingComponent } from '../topping/topping.component';

@Component({
  selector: 'cpa-topping-list',
  standalone: true,
  imports: [ToppingComponent],
  templateUrl: './topping-list.component.html',
  styleUrl: './topping-list.component.scss'
})
export class ToppingListComponent {
  @Input('toppings') toppings: Toppings[] = [];
  @Output() toppingSelect = new EventEmitter<any>();

  onToppingSelect(topping: Topping) {
    this.toppingSelect.emit(topping);
  }
}
