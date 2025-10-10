
import { order } from "./orders.js";
import { products } from "./products.js";
import { DateUtils } from "./utils/dateUtils.js";
import { WindowUtils } from "./utils/windowUtils.js";
import { Component } from "./utils/component.js";

import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export class OrderTracking extends Component {

  render() {

    const urlSearchParams = new URLSearchParams(WindowUtils.getSearch());
    const orderId = urlSearchParams.get('orderId');
    const cartItemId = urlSearchParams.get('cartItemId');

    const orderObj = order.fetchOrderDetailsById(orderId);
    if (!orderObj) {
      this.#renderNotFoundMessage();
      return;
    }
    const productDetails = orderObj.products.find(p => p.productId === cartItemId);
    if (!productDetails) {
      this.#renderNotFoundMessage();
      return;
    }

    const estimatedDeliveryTimeMs = this.#getEstimatedDeliveryTimeMs(productDetails.estimatedDeliveryTime);
    const deliveryDateMessage = Date.now() < estimatedDeliveryTimeMs
      ? `Arriving on ${DateUtils.formatDateWeekday(estimatedDeliveryTimeMs)}`
      : `Delivered on ${DateUtils.formatDateWeekday(estimatedDeliveryTimeMs)}`;

    const product = products.getProduct(productDetails.productId);
    const productImage = product.image;

    const progressPercent = this.#getProgressPercent(new Date(orderObj.orderTime).getTime(), estimatedDeliveryTimeMs);
    const status = this.#getDeliveryStatus(progressPercent);

    this.element.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date" data-testid="delivery-date-message">
        ${deliveryDateMessage}
      </div>

      <div class="product-info" data-testid="product-name">
        ${product.name}
      </div>

      <div class="product-info">
        Quantity: ${productDetails.quantity}
      </div>

      <img class="product-image" src="${productImage}">

      <div class="progress-labels-container">
        <div class="progress-label
          ${status === 'Preparing' ? 'current-status-label' : ''}"
          ${status === 'Preparing' ? 'data-testid="current-status"' : ''}>
          Preparing
        </div>
        <div class="progress-label
          ${status === 'Shipped' ? 'current-status-label' : ''}"
          ${status === 'Shipped' ? 'data-testid="current-status"' : ''}>
          Shipped
        </div>
        <div class="progress-label
          ${status === 'Delivered' ? 'current-status-label' : ''}"
          ${status === 'Delivered' ? 'data-testid="current-status"' : ''}>
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="js-progress-bar progress-bar"
          data-testid="progress-bar"></div>
      </div>
    `;

    setTimeout(() => {
      this.element.querySelector('.js-progress-bar')
        .style.width = `${progressPercent}%`;
    }, 300);
  }

  #renderNotFoundMessage() {
    this.element.innerHTML = `
      <div data-testid="not-found-message">
        Tracking information not found.
      </div>
    `;
  }

  #getProgressPercent(orderTimeMs, estimatedDeliveryTimeMs) {
    const totalShippingTime = estimatedDeliveryTimeMs - orderTimeMs;
    const timeSinceOrdered = Date.now() - orderTimeMs;

    let progressPercent = timeSinceOrdered / totalShippingTime * 100;

    if (progressPercent <= 5) {
      progressPercent = 5;
    } else if (progressPercent >= 100) {
      progressPercent = 100;
    }

    return Math.ceil(progressPercent);
  }

  #getDeliveryStatus(progressPercent) {
    if (progressPercent === 100) {
      return 'Delivered';
    } else if (progressPercent > 50) {
      return 'Shipped';
    } else {
      return 'Preparing';
    }
  }

  #getEstimatedDeliveryTimeMs(estimatedDeliveryTime) {
    const today = new Date();
    return DateUtils.calculateDeliveryDate(today, dayjs(estimatedDeliveryTime).diff(dayjs(), 'day')) - 1000 * 60 * 60 * 5;
  }
}
