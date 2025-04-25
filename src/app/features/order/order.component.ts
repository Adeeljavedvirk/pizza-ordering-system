import { Component, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NonVeg, OrderAmount, PizzaSize, Topping, ToppingTypes, Veg } from './order.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from './order.service';
import { LARGE_PIZZA_OFFER_TOPPINGS, PIZZA_SIZE_KEYS, PIZZA_SIZE_WITH_PRICE, SINGLE_MEDIUM_PIZZA_WITH_TWO_TOPPINGS, TWO_MEDIUM_PIZZA_WITH_FOUR_TOPPINGS } from './order.constants';
import { calculateTotal, largePizzaOffer } from './order.utils';
import { ToppingListComponent } from './components/topping-list/topping-list.component';
import { OrderAmountComponent } from './components/order-amount/order-amount.component';

@Component({
  selector: 'cpa-order',
  standalone: true,
  imports: [SharedModule, ToppingListComponent, OrderAmountComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  vegToppings: Veg[] = [];
  nonVegToppings: NonVeg[] = [];
  pizzaSizes = signal<PizzaSize[]>([]);
  orderAmount = signal<OrderAmount>({
    smallPizzaTotal: 0,
    mediumPizzaTotal: 0,
    largePizzaTotal: 0,
    extraLargePizzaTotal: 0,
    mediumPizzaOfferPrice: 0,
    largePizzaOfferPrice: 0
  });
  toppings: string[] = [];
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {
    this.orderForm = this.fb.group({
      small: this.fb.array([]),
      medium: this.fb.array([]),
      large: this.fb.array([]),
      extraLarge: this.fb.array([]),
      smallPizzaQuantity: new FormControl([Validators.required]),
      mediumPizzaQuantity: new FormControl([Validators.required]),
      largePizzaQuantity: new FormControl([Validators.required]),
      extraLargePizzaQuantity: new FormControl([Validators.required])
    });
  }
 
  ngOnInit(): void {
    this.getToppings();
    this.orderForm.patchValue({
      smallPizzaQuantity: 1,
      mediumPizzaQuantity: 1,
      largePizzaQuantity: 1,
      extraLargePizzaQuantity: 1
    })
    const pizzaSizesWithPrice = Object.entries(PIZZA_SIZE_KEYS)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key]) => ({ size: key, price:  +PIZZA_SIZE_WITH_PRICE[(PIZZA_SIZE_KEYS as any)[key]]}));

    this.pizzaSizes.set(pizzaSizesWithPrice);
  }

  onQuantityChange(size: string, $event: Event) {
    this.orderForm.controls[`${size}PizzaQuantity`].patchValue(($event.target as HTMLInputElement).value);
    this.showOrderAmount(size as any);
  }

  onToppingSelect<K extends keyof typeof PIZZA_SIZE_KEYS>(event: Topping, size: K) {
    this.handleFormEntries(event, size);
    this.showOrderAmount(size);
  }

  showOrderAmount<K extends keyof typeof PIZZA_SIZE_KEYS>(size: K) {
    this.checkIfAnyOfferIsApplicable(size);
    this.orderAmount.update((value) =>({
      ...value,
      [`${size}PizzaTotal`]: calculateTotal(size, this.orderForm.value[size], this.orderForm.value[`${size}PizzaQuantity`])
    })); 
  }

  checkIfAnyOfferIsApplicable<K extends keyof typeof PIZZA_SIZE_KEYS>(size: K) {
    let quantity = +(this.orderForm.controls[`${size}PizzaQuantity`].value ?? '0');
    let toppings = this.orderForm.controls[size].value;
    let toppingsLength = toppings.length;

    switch(size) {
      case 'medium':
        this.orderAmount().mediumPizzaOfferPrice = (quantity === 1 && toppingsLength === 2)
        ? SINGLE_MEDIUM_PIZZA_WITH_TWO_TOPPINGS
        : (quantity === 2 && toppingsLength === 4) 
        ? TWO_MEDIUM_PIZZA_WITH_FOUR_TOPPINGS
        : 0;
        break;
      case 'large':
        if (quantity === 1) {
          if (
            (LARGE_PIZZA_OFFER_TOPPINGS.every(topping => this.toppings.includes(topping))
          && toppingsLength === 2)
          || (LARGE_PIZZA_OFFER_TOPPINGS.every(topping => !this.toppings.includes(topping))
          && toppingsLength === 4)
          ) {
           this.orderAmount().largePizzaOfferPrice = largePizzaOffer(size, toppings);
          } else {
            this.orderAmount().largePizzaOfferPrice = 0;
          }
        }
        
        break;
        default: break;
    }
  }

  getToppings() {
    this.orderService.getToppings().subscribe(({ veg, nonVeg}: ToppingTypes) => {
      this.vegToppings = veg;
      this.nonVegToppings = nonVeg;
    })
  }

  handleFormEntries<K extends keyof typeof PIZZA_SIZE_KEYS>(topping: Topping, size: K) {
    let pizzaSizeArray = this.orderForm.controls[size] as FormArray;
    if (topping.isChecked) {
      pizzaSizeArray.push(new FormControl(topping.price));
      this.toppings.push(topping.name);
    } else {
      let index = pizzaSizeArray.controls.findIndex(x => x.value == topping.price)
      pizzaSizeArray.removeAt(index);
      let i = this.toppings.indexOf(topping.name);
      this.toppings.splice(i, 1);
    }
  }
}
