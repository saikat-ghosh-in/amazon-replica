import { cart } from './cart.js';

export function formatAmount(amountInCents) {
  return (Math.round(amountInCents) / 100).toFixed(2);
}

export function getOrderSummary() {

  let itemQty = cart.cartQty;
  let itemTotal = cart.getItemTotal();
  let shippingAndHandlingCost = cart.getShippingAndHandlingCost();
  let totalBeforeTax = itemTotal + shippingAndHandlingCost;
  let taxPercentage = 10;
  let taxAmount = totalBeforeTax * (10 / 100);
  let orderTotal = totalBeforeTax + taxAmount;

  let orderSummary = {
    itemQty: itemQty,
    itemTotal: itemTotal,
    shippingAndHandlingCost: shippingAndHandlingCost,
    totalBeforeTax: totalBeforeTax,
    taxPercentage: taxPercentage,
    taxAmount: taxAmount,
    orderTotal: orderTotal
  };
  return orderSummary;
}