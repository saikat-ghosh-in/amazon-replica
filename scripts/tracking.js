
import { OrderTracking } from "./trackingClass.js";
import { getTrackingPageHeaderHtml } from "./utils/htmlGenerator.js";

// load tracking page
if (window.location.href.includes('tracking.html')) {
  document.querySelector('.js-tracking-amazon-header').innerHTML = getTrackingPageHeaderHtml();
  new OrderTracking('.js-order-tracking').create();
}
