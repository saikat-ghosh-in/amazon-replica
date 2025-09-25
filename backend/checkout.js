// import { cart } from './cart.js';
import { productsMap } from "./products.js";
import { resetCart } from "./cart.js";
import { formatAmount, getOrderSummary } from "./payment.js";

let cart = new Map(JSON.parse(localStorage.getItem('cart')) ?? []);
let checkoutHeaderHtml = '';
let productsSummaryHtml = '';
let orderSummaryHtml = '';

// initial load
updateCheckoutHeader();
updateOrderSummary();
updateProductsForCheckout();

// reset cart button
document.querySelector('.js-reset-cart-button').addEventListener('click', () => {
  resetCart();
  cart.clear();
  updateCheckoutHeader();
  updateOrderSummary();
  updateProductsForCheckout();
});

// load checkout header
function updateCheckoutHeader() {
  if (cart.size > 0) {
    checkoutHeaderHtml =
      `
      <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>

        <div class="checkout-header-middle-section">
          Checkout (<a class="return-to-home-link" href="amazon.html">${cart.size === 1 ? '1 item' : cart.size + ' items'}</a>)
        </div>
        <div>
          <button class="reset-cart-button js-reset-cart-button">
            Clear your cart
          </button>
        </div>
        <div class="checkout-header-right-section">
          <img src="images/icons/checkout-lock-icon.png">
        </div>
      </div>
    `;
  } else {
    checkoutHeaderHtml =
      `
      <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>
        
        <div class="checkout-header-middle-section"></div>
        <div>
          <button class="reset-cart-button js-reset-cart-button"
          style="opacity: 0.5;">
            Clear your cart
          </button>
        </div>
        <div class="checkout-header-right-section">
          <img src="images/icons/checkout-lock-icon.png">
        </div>
      </div>
    `;
  }
  document.querySelector('.js-checkout-header').innerHTML = checkoutHeaderHtml;
}

// load products from cart for checkout
function updateProductsForCheckout() {
  if (cart.size > 0) {
    cart.forEach((quantity, productId) => {
      productsSummaryHtml +=
        `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${productsMap.get(productId).image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${productsMap.get(productId).name}
            </div>
            <div class="product-price">
              $${(productsMap.get(productId).priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="delete-quantity-link link-primary">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${productId}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${productId}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${productId}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
        ;
    });
  } else {
    productsSummaryHtml = '';
  }
  document.querySelector('.js-order-summary').innerHTML = productsSummaryHtml;
}

// load payment summary
function updateOrderSummary() {
  if (cart.size > 0) {
    const orderSummary = getOrderSummary(cart, productsMap);
    orderSummaryHtml =
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
  `
      ;
    document.querySelector('.js-payment-summary').innerHTML = orderSummaryHtml;
  } else {
    document.querySelector('.js-checkout-main').innerHTML = '<p>Your cart is empty</p>';
  }
}
