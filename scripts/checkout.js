
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


    // event listeners below
    addUpdateQtyEventListeners();

    // #handleQuantityInput(event) {
    //   const quantityContainer = event.currentTarget.closest('.js-quantity-container');

    //   if (event.key === 'Enter') {
    //     this.#updateQuantity(quantityContainer);

    //   } else if (event.key === 'Escape') {
    //     this.#cancelUpdateQuantity(quantityContainer);
    //   }
    // }

    // #cancelUpdateQuantity(quantityContainer) {
    //   const inputElement = quantityContainer.querySelector('.js-new-quantity-input');
    //   quantityContainer.classList.remove('is-updating-quantity');

    //   const oldQuantity = quantityContainer
    //     .querySelector('.js-quantity-label')
    //     .textContent;

    //   inputElement.value = parseInt(oldQuantity, 10);
    // }

    // #handleSaveLinkClick(event) {
    //   const quantityContainer = event.currentTarget.closest('.js-quantity-container');
    //   this.#updateQuantity(quantityContainer);
    // }

    // #updateQuantity(quantityContainer) {
    //   const inputElement = quantityContainer.querySelector('.js-new-quantity-input');

    //   if (inputElement.value === '') {
    //     this.#cancelUpdateQuantity(quantityContainer);
    //     return;
    //   }

    //   const newQuantity = parseInt(inputElement.value, 10);

    //   if (newQuantity < 0) {
    //     alert('Not a valid quantity');
    //     return;
    //   }

    //   // Update quantity in cart.
    //   const cartItemContainer = quantityContainer.closest('.js-cart-item');
    //   const cartItemId = cartItemContainer.getAttribute('data-cart-item-id');

    //   if (newQuantity === 0) {
    //     cart.updateQuantity(cartItemId, 0);
    //     this.#removeFromCartSummary(cartItemContainer);

    //   } else {
    //     cart.updateQuantity(cartItemId, newQuantity);

    //     quantityContainer.classList.remove('is-updating-quantity');
    //     quantityContainer.querySelector('.js-quantity-label')
    //       .textContent = newQuantity;
    //   }

    //   this.#updatePaymentDetailsAndHeader();
    // }


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