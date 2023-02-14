/*
Products describe the specific goods or services you offer to your customers - for more information see:
https://stripe.com/docs/api/products 
*/

require('dotenv').config()
const stripe = require("stripe")(
    process.env.API_KEY
  );

/*
Create a new product with no default price object
*/
async function createProductWithNoPrice() {
  const product = await stripe.products.create({
    name: "Gold Special",
  });
  console.log("PRODUCT WITH NO PRICE OBJECT");
  console.log(product);
  return product.id;
}

/*
Create a new product with a price object which is then generated and becomes the default for this product
*/
async function createProductWithAPriceObject() {
  const product = await stripe.products.create({
    name: "Gold Special Ring",
    default_price_data: {
      currency: "gbp",
      unit_amount_decimal: 2,
    },
  });
  console.log("PRODUCT WITH A PRICE OBJECT");
  console.log(product);
  return product.id
}

/*
Update a products default price via product id and price id - one price can only belong to one product and when creating a price 
it has to be assigned to a product 
 */
async function updateProductsDefaultPrice(id) {
  const product = await stripe.products.update(id, {
    default_price: "price_1MbQYAC4fAq4uZLDGXMayW6I",
  });

  console.log("PRODUCT UPDATED");
  console.log(product);
}

/*
Deletes the product using the generated id
*/
async function deleteProduct(id) {
  const deleted = await stripe.products.del(id);
  console.log("DELETED PRODUCT");
  console.log(deleted);
}

/*
List current products - the size returned can be limited using the limit paramater
*/
async function listProducts() {
  const products = await stripe.products.list({
    limit: 5,
  });

  console.log(products)
}

/*
Retrieves a product using the unique product id
*/
async function retrieveProduct(id){
const product = await stripe.products.retrieve(
    id
  );

  console.log('RETRIEVED THE FOLLOWING PRODUCT')
  console.log(product)
}  

createProductWithNoPrice().then((id) => {
  deleteProduct(id);
});

createProductWithAPriceObject().then((id) =>{
retrieveProduct(id)
});

listProducts()
