// import products from '../data/products.json' with {type: 'json'};
// export const productsMap = new Map(products.map(product => [product.id, product]));

import { formatAmount } from "./payment.js";

class Products {
    productsMap;

    async init() {
        const locallyStoredProducts = this.#loadFromLocalStorage();
        if (locallyStoredProducts) {
            this.productsMap = new Map(JSON.parse(locallyStoredProducts));
        } else {
            this.productsMap = await this.#getProductsMap();
            this.#saveToLocalStorage();
        }
    }

    getProduct(productId) {
        return this.productsMap.get(productId);
    }

    getStarsUrl(productId) {
        return `images/ratings/rating-${(this.getProduct(productId).rating.stars) * 10}.png`
    }

    getPrice(productId) {
        return formatAmount(this.productsMap.get(productId).priceCents);
    }

    // private methods below
    #loadFromLocalStorage() {
        return localStorage.getItem('productsMap');
    }

    #saveToLocalStorage() {
        localStorage.setItem('productsMap', JSON.stringify([...this.productsMap]));
    }

    async #getProductsMap() {
        const response = await fetch('https://supersimplebackend.dev/products');
        const productsJson = await response.json();
        return new Map(productsJson.map(product => [product.id, product]));
    }
}

async function loadProducts() {
    const products = new Products();
    await products.init();
    return products;
}
export const products = await loadProducts();
