import products from './products.json' with {type: 'json'};


export const productsMap =
  new Map(products.map(product => [product.id, product]));
