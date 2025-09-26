
export let cart = new Map(JSON.parse(localStorage.getItem('cart')) ?? []);
export let cartQty = parseInt(localStorage.getItem('cartQty')) || 0;

export function addToCart(productId, addedQuantity) {
  let qty = cart.get(productId) || 0;
  cart.set(productId, qty + addedQuantity);
  cartQty += addedQuantity;
  saveToLocalStorage();
  getTotalCartQuantity();
}
export function deleteFromCart(productId) {
  const qty = cart.get(productId);
  if (qty) {
    cart.delete(productId);
    cartQty -= qty;
    saveToLocalStorage();
    getTotalCartQuantity();
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