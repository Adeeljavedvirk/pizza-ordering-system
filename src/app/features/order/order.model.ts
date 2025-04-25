export interface Toppings {
    name: string
    price: number
}

export interface PizzaSize {
  size: string
  price: number
}

export interface ToppingTypes {
  veg: Veg[];
  nonVeg: NonVeg[];
}

export type Veg = Toppings;
export type NonVeg = Toppings;
export type Topping = Pick<Toppings, 'price' | 'name'> & {
  isChecked: boolean;
};


export interface OrderAmount {
  smallPizzaTotal: number
  mediumPizzaTotal: number
  largePizzaTotal: number
  extraLargePizzaTotal: number
  mediumPizzaOfferPrice: number
  largePizzaOfferPrice: number
}