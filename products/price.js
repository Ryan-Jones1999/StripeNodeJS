/*
For more information see: https://stripe.com/docs/api/prices
*/

require("dotenv").config();
const stripe = require("stripe")(process.env.API_KEY);

/*
Create a price attatched to a product - note a price must be attatched to a product throught the product paramater or by creating a new one
as shown below
*/

async function createPrice() {
  const price = await stripe.prices.create({
    unit_amount: 2000,
    currency: "gbp",
    product_data: {
      name: "test",
      active: true,
    },
  });
  console.log('INITIAL PRICE')
  console.log(price);
  return price.id;
}

/*
Retrieves the details a price via a unique price id
*/
async function retrievePrice(priceId) {
  const price = await stripe.prices.retrieve(priceId);
  console.log("RETREIEVED PRICE");
  console.log(price);
}

/*
Updates the nickname for a price using the id - more paramaters can be changed see the link at the top of the page for more information
*/
async function updatePrice(priceId) {
  const price = await stripe.prices.update(priceId, {
    nickname: "Updated nickname",
  });
  console.log('UPDATED DETAILS')
  console.log(price);
}

/*
List prices controlled by limit flag and other paramaters to narrow down the list
*/
async function listPrices(){
  const prices = await stripe.prices.list({
    limit: 3,
    currency: 'gbp'
  });
  console.log('LIST PRICES')
  console.log(prices)
}

/*
Search for prices based on a query list of possible options can be seen:
https://stripe.com/docs/search#query-fields-for-prices

More query options can be seen:
https://stripe.com/docs/search#search-query-language
*/
async function searchPrices(){
const price = await stripe.prices.search({
  query: 'active:\'true\'',
  limit:2
});
console.log(price)
}

createPrice().then((id) => {
  updatePrice(id).then(() => {
    retrievePrice(id);
  });
});

listPrices()
searchPrices()


