import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToppingTypes } from '../order/order.model';
import * as toppingsResponse from '../../../api/mock/toppings.json';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  getToppings(): Observable<ToppingTypes> {
    // TODO: We can call the external backend to fetch the data.
    return of(toppingsResponse);
  }
  
}
