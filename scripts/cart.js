import { deliveryMethods } from "./deliveryMethods.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

class Cart {
  #cartKey;
  cartItems;
  cartQty;

  constructor(cartKey) {
    this.#cartKey = cartKey;
    this.#loadFromLocalStorage();

  }

  #loadFromLocalStorage() {
    this.cartItems = new Map(JSON.parse(localStorage.getItem(this.#cartKey)) || []);
    this.cartQty = parseInt(localStorage.getItem(this.#cartKey + 'CartQty')) || 0;
  }


  addToCart(product, addedQuantity) {
    const qty = this.cartItems.get(product.id) ? this.cartItems.get(product.id).quantity : 0;
    const currQty = qty + addedQuantity

    this.cartItems.set(product.id, { quantity: currQty, unitPrice: product.priceCents, shipMethod: 'STANDARD' });
    this.cartQty += addedQuantity;
    this.saveToLocalStorage();
  }

  getItemTotal() {
    let itemTotal = 0;
    this.cartItems.forEach((cartItem, productId) => {
      itemTotal += cartItem.quantity * cartItem.unitPrice;
    });
    return itemTotal;
  }

  getShippingAndHandlingCost() {
    let shippingAndHandlingCost = 0;
    this.cartItems.forEach((cartItem, productId) => {
      const deliveryMethod = cartItem.shipMethod;
      shippingAndHandlingCost += deliveryMethods.get(deliveryMethod).costInCents;
    });
    return shippingAndHandlingCost;
  }

  getDeliveryDate(productId) {
    if (this.cartItems.get(productId)) {
      const deliveryMethod = this.cartItems.get(productId).shipMethod;
      const deliveryDays = deliveryMethods.get(deliveryMethod).deliveryDays;
      return dayjs().add(deliveryDays, 'days').format('dddd, MMMM D');
    } else {
      return '';
    }
  }

  deleteFromCart(productId) {
    const qty = this.cartItems.get(productId).quantity;
    if (qty) {
      this.cartItems.delete(productId);
      this.cartQty -= qty;
      this.saveToLocalStorage();
    }
  }

  updateDeliveryMethod(productId, deliveryMethod) {
    if (this.cartItems.get(productId)) {
      this.cartItems.get(productId).shipMethod = deliveryMethod;
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#cartKey, JSON.stringify([...this.cartItems]));
    localStorage.setItem(this.#cartKey + 'CartQty', this.cartQty);
    console.log(localStorage.getItem(this.#cartKey));
  }

  resetCart() {
    this.cartItems.clear();
    this.cartQty = 0;
    this.saveToLocalStorage();
    console.log('Cart has been reset!');
  }

  // for placeOrder input
  getCartAsArray() {
    let cartArray = [];
    this.cartItems.forEach((cartItem, productId)=>{
      cartArray.push({
        productId: productId,
        quantity: cartItem.quantity,
        deliveryOptionId: deliveryMethods.get(cartItem.shipMethod).deliveryOptionId
      })

    });
    return cartArray;
  }
}

export let cart = new Cart('cart');