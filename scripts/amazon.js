import { products } from './products.js';
import { cart } from './cart.js';
import { formatAmount } from './payment.js';

// for initial cartQty load from local storage
document.querySelector('.js-cart-quantity').innerText = cart.cartQty;

// loadProductsToPlp
let plpHtml = '';
products.productsMap.forEach((product, productId) => {
  plpHtml +=
    `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${products.getStarsUrl(productId)}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatAmount(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product='${JSON.stringify({id: productId, unitPrice: product.priceCents})}'>
          Add to Cart
        </button>
      </div>
    `;
});
document.querySelector('.js-products-grid').innerHTML = plpHtml;

//add product to cart
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    cart.addToCart(JSON.parse(button.dataset.product), 1);
    // make Added visible here
    document.querySelector('.js-cart-quantity').innerText = cart.cartQty;
  });
});