// import products from '../data/products.json' with {type: 'json'};

export const productsMap = await getProductsMap();

async function getProductsMap() {
    const response = await fetch('https://supersimplebackend.dev/products');
    const productsJson = await response.json();
    return new Map(productsJson.map(product => [product.id, product]));
}