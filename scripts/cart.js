
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
    this.cartQty = parseInt(localStorage.getItem(this.#cartKey + 'cartQty')) || 0;
  }


  addToCart(productId, addedQuantity) {
    const qty = this.cartItems.get(productId) ? this.cartItems.get(productId).quantity : 0;
    const currQty = qty + addedQuantity
    this.cartItems.set(productId, { 'quantity': currQty, 'shipMethod': 'STANDARD' });
    this.cartQty += addedQuantity;
    this.saveToLocalStorage();
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
    localStorage.setItem(this.#cartKey + 'cartQty', this.cartQty);
    console.log(localStorage.getItem(this.#cartKey));
  }

  resetCart() {
    this.cartItems.clear();
    this.cartQty = 0;
    this.saveToLocalStorage();
    console.log('cart has been reset!');
  }
}

export let cart = new Cart('cart');