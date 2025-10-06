import { getOrdersHtml } from "./utils/htmlGenerator.js";
import { cart } from "./cart.js";

const orders = JSON.parse(localStorage.getItem('orders')) || [];

loadOrdersPage();

function loadOrdersPage() {
  document.querySelector('.js-order-grid').innerHTML = getOrdersHtml(orders);
}