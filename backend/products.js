import products from '../data/products.json' with {type: 'json'};


export const productsMap = new Map(products.map(product => [product.id, product]));

/*
export function fetchProductsMap() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            const products = JSON.parse(xhr.response);
            const map = new Map(products.map(product => [product.id, product]));
            resolve(map);
        });
        xhr.addEventListener('error', () => {
            reject('Unexpected error. Please try again later.');
        });
        xhr.open('GET', 'https://supersimplebackend.dev/products');
        xhr.send();
    });
}

//goes where it is being used
import { fetchProductsMap } from './products.js';

fetchProductsMap().then(productsMap => {
    // Use productsMap here
});
*/