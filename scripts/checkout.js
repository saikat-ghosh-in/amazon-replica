
import { productsMap } from "./products.js";
import { cart } from "./cart.js";
import { formatAmount, getOrderSummary } from "./payment.js";
import { deliveryMethods } from "./deliveryMethods.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";




// initial load
updateCheckoutPage();

// load checkout header
function updateCheckoutPage() {
  let checkoutHeaderHtml = '';
  let productsSummaryHtml = '';
  let orderSummaryHtml = '';

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
          Checkout (<a class="return-to-home-link" href="amazon.html">${cart.cartItems.size === 1 ? '1 item' : cart.cartItems.size + ' items'}</a>)
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

    cart.cartItems.forEach((cartDetails, productId) => {
      productsSummaryHtml +=
        `
        <div class="cart-item-container">
          <div class="delivery-date">
            Delivery date: ${dayjs().add(deliveryMethods.get(cartDetails.shipMethod).deliveryDays, 'days').format('dddd, MMMM D')}
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

    const orderSummary = getOrderSummary(cart.cartItems, productsMap, deliveryMethods);
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
      `;

    document.querySelector('.js-checkout-header').innerHTML = checkoutHeaderHtml;
    document.querySelector('.js-order-summary').innerHTML = productsSummaryHtml;
    document.querySelector('.js-payment-summary').innerHTML = orderSummaryHtml;


    // delete product from cart
    document.querySelectorAll('.js-delete-product').forEach((link) => {
      link.addEventListener('click', () => {
        cart.deleteFromCart(link.dataset.productId);
        updateCheckoutPage();
      });
    });

    // reset cart button
    document.querySelector('.js-reset-cart-button').addEventListener('click', () => {
      cart.resetCart();
      updateCheckoutPage();
    });

    // get delivery options
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        cart.updateDeliveryMethod(element.dataset.productId, element.dataset.deliveryMethod);
        updateCheckoutPage();
      });
    });
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
      `
      ;
    document.querySelector('.js-checkout-header').innerHTML = checkoutHeaderHtml;

    // have a splash page for empty cart
    document.querySelector('.js-checkout-main').innerHTML =
      `<div>
          Your cart is empty
        </div>
        <a  href="amazon.html">
          <button>
            Continue shopping
          </button>
        </a>`
      ;
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
}