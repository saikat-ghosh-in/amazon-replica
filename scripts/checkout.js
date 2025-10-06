
import { cart } from "./cart.js";
import { getCheckoutHeaderHtml, getProductsSummaryHtml, getOrderSummaryHtml, getEmptyCartHtml } from './utils/htmlGenerator.js';


// for initial load
updateCheckoutPage();

function updateCheckoutPage() {

  if (cart.cartItems.size > 0) {
    // html modifiers below
    document.querySelector('.js-checkout-header').innerHTML = getCheckoutHeaderHtml(cart.cartQty);
    document.querySelector('.js-order-summary').innerHTML = getProductsSummaryHtml();
    document.querySelector('.js-payment-summary').innerHTML = getOrderSummaryHtml();


    // event listeners below
    // delete product from cart
    document.querySelectorAll('.js-delete-product').forEach((link) => {
      link.addEventListener('click', () => {
        cart.deleteFromCart(link.dataset.productId);
        updateCheckoutPage();
      });
    });

    // reset cart button
    document.querySelector('.js-reset-cart-button')
      .addEventListener('click', () => {
        cart.resetCart();
        updateCheckoutPage();
      });

    // update delivery method
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        cart.updateDeliveryMethod(element.dataset.productId, element.dataset.deliveryMethod);
        updateCheckoutPage();
      });
    });

    // place the order
    document.querySelector('.js-place-order-button')
      .addEventListener('click', async () => {
        await placeOrder();
        window.location.href = 'orders.html';
      });

  } else {

    document.querySelector('.js-checkout-header').innerHTML = getCheckoutHeaderHtml(0); // when cart is empty
    document.querySelector('.js-checkout-main').innerHTML = getEmptyCartHtml(); // have a splash page for empty cart
  }
}

async function placeOrder() {
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
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}