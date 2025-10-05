import { products } from '../products.js';
import { cart } from '../cart.js';
import { formatAmount, getOrderSummary } from '../payment.js';
import { deliveryMethods } from "../deliveryMethods.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function getCheckoutHeaderHtml(cartQty) {
  let checkoutHeaderHtml =
    `
      <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>`;
  if (cartQty > 0) {
    checkoutHeaderHtml +=
      `
        <div class="checkout-header-middle-section">
          Checkout (<a class="return-to-home-link" href="amazon.html">${cartQty === 1 ? '1 item' : cartQty + ' items'}</a>)
        </div>
        <div>
          <button class="reset-cart-button js-reset-cart-button">
            Clear your cart
          </button>
        </div>`;
  } else {
    checkoutHeaderHtml +=
      `
        <div class="checkout-header-middle-section"></div>
        <div>
          <button class="reset-cart-button js-reset-cart-button" style="opacity: 0.5;">
            Clear your cart
          </button>
        </div>`;
  }

  checkoutHeaderHtml +=
    `
      <div class="checkout-header-right-section">
        <img src="images/icons/checkout-lock-icon.png">
      </div>
    </div>`;
  return checkoutHeaderHtml;
}


export function getProductsSummaryHtml() {
  let productsSummaryHtml = '';
  cart.cartItems.forEach((cartDetails, productId) => {
    productsSummaryHtml +=
      `
        <div class="cart-item-container">
          <div class="delivery-date">
            Delivery date: ${cart.getDeliveryDate(productId)}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${products.getProduct(productId).image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${products.getProduct(productId).name}
              </div>
              <div class="product-price">
                $${products.getPrice(productId)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label">${cartDetails.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                  Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-product"
                data-product-id=${productId}>
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options js-delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${getDeliveryOptionsHtml(productId)}
            </div>
          </div>
        </div>
      `;
  });
  return productsSummaryHtml;
}


export function getOrderSummaryHtml() {
  const orderSummary = getOrderSummary();
  const orderSummaryHtml =
    `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${orderSummary.itemQty}):</div>
        <div class="payment-summary-money">$${formatAmount(orderSummary.itemTotal)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatAmount(orderSummary.shippingAndHandlingCost)}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatAmount(orderSummary.totalBeforeTax)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (${orderSummary.taxPercentage}%):</div>
        <div class="payment-summary-money">$${formatAmount(orderSummary.taxAmount)}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatAmount(orderSummary.orderTotal)}</div>
      </div>
      <a class="cart-link header-link" href="orders.html">
      <button class="place-order-button button-primary">
        Place your order
      </button>
      </a>
      <a href="amazon.html">
      <button class="continue-shopping-button button-secondary">
        Continue Shopping
      </button>
      </a>`
    ;
  return orderSummaryHtml;
}

export function getEmptyCartHtml() {
  const emptyCartHtml =
    `
    <div>
      Your cart is empty
    </div>
    <a href="amazon.html">
      <button class="continue-shopping-button-empty-cart">
        Continue shopping
      </button>
    </a>`
    ;
  return emptyCartHtml;
}

  // generate delivery options html
  function getDeliveryOptionsHtml(productId) {
    let deliveryOptionsHtml = '';
    const shipMethod = cart.cartItems.get(productId).shipMethod;

    deliveryMethods.forEach((deliveryDetails, deliveryMethod) => {
      const dateString = dayjs().add(deliveryDetails.deliveryDays, 'days').format('dddd, MMMM D');
      const priceString = deliveryDetails.costInCents === 0 ? 'FREE Shipping' : `$${formatAmount(deliveryDetails.costInCents)}`;
      const isChecked = deliveryMethod === shipMethod ? 'checked' : '';

      deliveryOptionsHtml +=
        `<div class="delivery-option js-delivery-option"
      data-product-id="${productId}"
      data-delivery-method="${deliveryMethod}">
        <input type="radio" ${isChecked}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString}
          </div>
        </div>
      </div>`;
    });

    return deliveryOptionsHtml;
  }