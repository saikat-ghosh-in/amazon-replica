
let orderSummary = {
  itemQty: 0,
  itemTotal: 0,
  shippingAndHandlingCost: 0,
  totalBeforeTax: 0,
  taxPercentage: 0,
  taxAmount: 0,
  orderTotal: 0
};

export function formatAmount(amountInCents) {
  return (amountInCents / 100).toFixed(2);
}

export function getOrderSummary(cart, productsMap) {
  cart.forEach((quantity, productId) => {
    orderSummary.itemQty += quantity;
    orderSummary.itemTotal += productsMap.get(productId).priceCents;
  });

  orderSummary.shippingAndHandlingCost = 1000; // static value for now
  orderSummary.totalBeforeTax = orderSummary.itemTotal + orderSummary.shippingAndHandlingCost;
  orderSummary.taxPercentage = 10;
  orderSummary.taxAmount = orderSummary.totalBeforeTax * (10 / 100);
  orderSummary.orderTotal = orderSummary.totalBeforeTax + orderSummary.taxAmount;
  return orderSummary;
}
