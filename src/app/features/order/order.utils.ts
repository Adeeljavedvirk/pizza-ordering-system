import { PIZZA_SIZE_WITH_PRICE, PIZZA_SIZE_KEYS } from "./order.constants";

export function calculatePrice(prices: number[]) {
    return prices.reduce((sum: number, number: number) => sum + number, 0);
}

export function calculateTotal(size: string, sizePrices: number[], quantity: number) {
    return (quantity * (+PIZZA_SIZE_WITH_PRICE[(PIZZA_SIZE_KEYS as any)[size]])) + calculatePrice(sizePrices);
}

export function largePizzaOffer(size: string, toppingPrices: number[]) {
    return (((+PIZZA_SIZE_WITH_PRICE[(PIZZA_SIZE_KEYS as any)[size]]))+ calculatePrice(toppingPrices))*50/100;
}