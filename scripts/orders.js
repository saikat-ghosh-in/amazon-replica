import { getOrdersHtml } from "./utils/htmlGenerator.js";
import { cart } from "./cart.js";

const orders = JSON.parse(localStorage.getItem('orders')) || [];

if (window.location.href.endsWith('orders.html')) {
  loadOrdersPage(); // for initial load
}

function loadOrdersPage() {
  document.querySelector('.js-order-grid').innerHTML = getOrdersHtml(orders);
}

export async function placeOrder() {
  const response = await fetch('https://supersimplebackend.dev/orders',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: cart.getCartAsArray()
      })
    }
  );
  const order = await response.json();
  addOrder(order);
  return 'order placed successfully';
}

function addOrder(order) {
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}
