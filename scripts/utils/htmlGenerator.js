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
          Checkout
        </div>
        <div>
          <button class="reset-cart-button js-reset-cart-button">
            Clear your cart
          </button>
        </div>`;
  } else {
    checkoutHeaderHtml +=
      `<div class="checkout-header-middle-section"></div>`;
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
      <a class="cart-link header-link">
      <button class="place-order-button button-primary js-place-order-button">
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
      Your cart is empty!
    </div>
    <a href="amazon.html">
      <button class="continue-shopping-button-empty-cart">
        Continue shopping
      </button>
    </a>`
    ;
  return emptyCartHtml;
}


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


export function getOrdersHtml(orders) {
  let ordersHtml = '';

  orders.forEach((order) => {
    ordersHtml +=
      `<div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dayjs(order.orderTime).format('MMMM D, YYYY')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatAmount(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">`;
    order.products.forEach((productDetails) => {
      const product = products.getProduct(productDetails.productId);
      ordersHtml +=
        `
          <div class="product-image-container">
            <img src="${product.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D, YYYY')}
            </div>
            <div class="product-quantity">
              Quantity: ${productDetails.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
           
              <a href="tracking.html">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
              <button class="track-package-button button-secondary">
                Cancel Order
              </button>
          </div>`
        ;
    });
    ordersHtml +=
      `
          </div>
        </div>`
      ;
  });

  return ordersHtml;
}