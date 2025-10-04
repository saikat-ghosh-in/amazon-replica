
// export let cart = new Map(JSON.parse(localStorage.getItem('cart')) ?? []);
// export let cartQty = parseInt(localStorage.getItem('cartQty')) || 0;

/*
export function addToCart(productId, addedQuantity) {
  const qty = cart.get(productId) ? cart.get(productId).quantity : 0;
  console.log(qty);
  console.log(typeof qty);
  console.log(addedQuantity);
  console.log(typeof addedQuantity);
  const currQty = qty + addedQuantity
  cart.set(productId, { 'quantity': currQty, 'shipMethod': 'STANDARD' });
  cartQty += addedQuantity;
  saveToLocalStorage();
  getTotalCartQuantity();
}
export function deleteFromCart(productId) {
  const qty = cart.get(productId).quantity;
  if (qty) {
    cart.delete(productId);
    cartQty -= qty;
    saveToLocalStorage();
    getTotalCartQuantity();
  }
}
export function updateDeliveryMethod(productId, deliveryMethod) {
  if (cart.get(productId)) {
    cart.get(productId).shipMethod = deliveryMethod;
    saveToLocalStorage();
  }
}

function getTotalCartQuantity() {
  const qty = parseInt(localStorage.getItem('cartQty'));
  console.log('cart qty: ' + qty)
}

function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify([...cart]));
  localStorage.setItem('cartQty', cartQty);
  console.log(localStorage.getItem('cart'));
}

export function resetCart() {
  if (localStorage.getItem('cart')) {
    localStorage.removeItem('cart');
    cart.clear();
  }
  if (localStorage.getItem('cartQty')) {
    localStorage.removeItem('cartQty');
    cartQty = 0;
  }
  console.log('cart has been reset');
}
*/
///////////////////////////////////////////////////////////////

class Cart {
  cartItems;
  cartQty;

  constructor() {
    this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    this.cartQty = parseInt(localStorage.getItem('cartQty')) || 0;
  }


  addToCart(productId, addedQuantity) {
    const qty = this.cartItems.get(productId) ? this.cartItems.get(productId).quantity : 0;
    // console.log(qty);
    // console.log(typeof qty);
    // console.log(addedQuantity);
    // console.log(typeof addedQuantity);
    const currQty = qty + addedQuantity
    this.cartItems.set(productId, { 'quantity': currQty, 'shipMethod': 'STANDARD' });
    this.cartQty += addedQuantity;
    saveToLocalStorage();
    getTotalCartQuantity();
  }
  deleteFromCart(productId) {
    const qty = this.cartItems.get(productId).quantity;
    if (qty) {
      this.cartItems.delete(productId);
      this.cartQty -= qty;
      saveToLocalStorage();
      getTotalCartQuantity();
    }
  }
  updateDeliveryMethod(productId, deliveryMethod) {
    if (this.cartItems.get(productId)) {
      this.cartItems.get(productId).shipMethod = deliveryMethod;
      saveToLocalStorage();
    }
  }

  getTotalCartQuantity() {
    const qty = parseInt(localStorage.getItem('cartQty'));
    console.log('cart qty: ' + qty)
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify([...this.cartItems]));
    localStorage.setItem('cartQty', this.cartQty);
    console.log(localStorage.getItem('cart'));
  }

  resetCart() {
    if (localStorage.getItem('cart')) {
      localStorage.removeItem('cart');
      this.cartItems.clear();
    }
    if (localStorage.getItem('cartQty')) {
      localStorage.removeItem('cartQty');
      this.cartQty = 0;
    }
    console.log('cart has been reset');
  }
}

export let cart = new Cart();