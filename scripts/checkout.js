
import { cart } from "./cart.js";
import { getCheckoutHeaderHtml, getProductsSummaryHtml, getOrderSummaryHtml, getEmptyCartHtml } from './utils/htmlGenerator.js';
import { order } from "./orders.js";

// for initial load
updateCheckoutPage();

function updateCheckoutPage() {

  if (cart.cartItems.size > 0) {
    // html modifiers below
    document.querySelector('.js-checkout-header').innerHTML = getCheckoutHeaderHtml(cart.cartQty);
    document.querySelector('.js-order-summary').innerHTML = getProductsSummaryHtml();
    document.querySelector('.js-payment-summary').innerHTML = getOrderSummaryHtml();


    //// event listeners below ////

    // add update quantity event listeners (update -> text box enter/esc, save link)
    addUpdateQtyEventListeners();

    // delete product from cart
    document.querySelectorAll('.js-delete-quantity-link').forEach((element) => {
      element.addEventListener('click', () => {
        const quantityContainer = element.closest('.js-quantity-container');
        cart.deleteFromCart(quantityContainer.dataset.productId);
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
        await order.placeOrder();
        window.location.href = 'orders.html';
        cart.resetCart();
      });
  } else {

    document.querySelector('.js-checkout-header').innerHTML = getCheckoutHeaderHtml(0); // when cart is empty
    document.querySelector('.js-checkout-main').innerHTML = getEmptyCartHtml(); // have a splash page for empty cart
  }
}

function addUpdateQtyEventListeners() {
  document.querySelectorAll('.js-update-quantity-link').forEach((element) => {
    element.addEventListener('click', () => {
      const quantityContainer = element.closest('.js-quantity-container');
      const productId = quantityContainer.dataset.productId;
      quantityContainer.classList.add('is-updating-quantity');

      const newQuantityInputDom = quantityContainer.querySelector('.js-new-quantity-input');

      newQuantityInputDom.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          const enteredQuantity = Number(newQuantityInputDom.value.trim());

          if (!isValidCartQuantity(enteredQuantity)) {
            alert('Not a valid quantity');
            updateCheckoutPage();
            return;
          }

          cart.updateQuantity(productId, enteredQuantity);
          quantityContainer.classList.remove('is-updating-quantity');
          updateCheckoutPage();
          return;
        } else if (event.key === 'Escape') {
          quantityContainer.classList.remove('is-updating-quantity');
          return;
        }
      });

      const saveQuantityLinkDom = quantityContainer.querySelector('.js-save-quantity-link');
      saveQuantityLinkDom.addEventListener('click', () => {
        const enteredQuantity = Number(newQuantityInputDom.value.trim());

        if (!isValidCartQuantity(enteredQuantity)) {
          alert('Not a valid quantity');
          updateCheckoutPage();
          return;
        }

        cart.updateQuantity(productId, enteredQuantity);
        quantityContainer.classList.remove('is-updating-quantity');
        updateCheckoutPage();
        return;
      });
    });
  });
}

function isValidCartQuantity(inputValue) {
  return (!isNaN(inputValue) && inputValue >= 0 && Number.isInteger(inputValue));
}