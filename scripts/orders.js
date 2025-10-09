import { getOrdersHtml } from "./utils/htmlGenerator.js";
import { cart } from "./cart.js";

let orders = JSON.parse(localStorage.getItem('orders')) || [];

if (window.location.href.endsWith('orders.html')) {
  loadOrdersPage(); // for initial load
}

function loadOrdersPage() {
  document.querySelector('.js-order-grid').innerHTML = getOrdersHtml(orders);


  document.querySelectorAll('.js-cancel-order-button').forEach((button) => {
    button.addEventListener('click', () => {
      console.log(orders);
      let order = orders.find(order=> order.id===button.dataset.orderId);
      //remove product here... wip
      // console.log(orders);
      // saveToLocalStorage();
      // loadOrdersPage();
    });
  });
}

function saveToLocalStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
  console.log(orders);
}


class Order {

  constructor() {
    this.id = '';
    this.orderTime = '';
    this.totalCostCents = 0;
    this.products = [];
  }

  async placeOrder() {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cart: cart.getCartAsArray()
          })
        }
      );
      const responseJson = await response.json();
      this.id = responseJson.id;
      this.orderTime = responseJson.orderTime;
      this.totalCostCents = responseJson.totalCostCents;
      this.products = responseJson.products;
      this.#addOrder(this);
      return 'order placed successfully';
    } catch (exception) {
      return 'error: ' + exception;
    }
  }

  #addOrder(order) {
    orders.unshift(order);
    saveToLocalStorage();
  }
}
export const order = new Order();