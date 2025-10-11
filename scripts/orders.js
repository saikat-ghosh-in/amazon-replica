import { getOrdersHeaderHtml, getOrdersHtml } from "./utils/htmlGenerator.js";
import { cart } from "./cart.js";
import { WindowUtils } from "./utils/windowUtils.js";

let orders = JSON.parse(localStorage.getItem('orders')) || [];

if (window.location.href.endsWith('orders.html')) {
  loadOrdersPage(); // for initial load
}

function loadOrdersPage() {
  document.querySelector('.js-orders-amazon-header').innerHTML = getOrdersHeaderHtml();
  document.querySelector('.js-order-grid').innerHTML = getOrdersHtml(orders);

  document.querySelectorAll('.js-track-package-button').forEach((button) => {
    button.addEventListener('click', () => {
      WindowUtils.setHref(`tracking.html?orderId=${button.dataset.orderId}&cartItemId=${button.dataset.productId}`);
    });
  });

  document.querySelectorAll('.js-cancel-order-button').forEach((button) => {
    button.addEventListener('click', () => {
      updateFulfillmentStatus(button.dataset.orderId, button.dataset.productId, 'CANCELLED');
      saveToLocalStorage();
      loadOrdersPage();
    });
  });

  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    button.addEventListener('click', () => {
      cart.addToCart(JSON.parse(button.dataset.product), button.dataset.quantity);
      WindowUtils.setHref('checkout.html');
    });
  });
}

function updateFulfillmentStatus(orderId, productId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return false;

  const product = order.products.find(p => p.productId === productId);
  if (!product) return false;

  product.status = newStatus;
  return true;
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
      this.products = responseJson.products.map(product => ({
        ...product,
        status: 'NEW_ORDER'
      }));
      this.#addOrder(this);
      return 'order placed successfully';
    } catch (exception) {
      return 'error: ' + exception;
    }
  }

  fetchOrderDetailsById(orderId) {
    return orders.find(o => o.id === orderId);
  }

  #addOrder(order) {
    orders.unshift(order);
    saveToLocalStorage();
  }
}
export const order = new Order();