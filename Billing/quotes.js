/*
A Quote is a way to model prices that you'd like to provide to a customer. Once accepted, 
it will automatically create an invoice, subscription or subscription schedule. - for more information see:
https://stripe.com/docs/api/quotes
*/
require("dotenv").config();
const stripe = require("stripe")(process.env.API_KEY);
const { createWriteStream } = require("fs");

/*
Creates a customer with a name, email and description more paramaters to be used in the createQuotes function
*/
async function createCustomer() {
  const customer = await stripe.customers.create({
    email: "test123@gmail.com",
    name: "Test User",
    description: "Created in quotes class",
  });

  return customer.id;
}

/*
Creates a price to be used in the quotes function:
*/
async function createPrice() {
  const price = await stripe.prices.create({
    unit_amount: 2000,
    currency: "gbp",
    product_data: {
      name: "quotes1",
      active: true,
    },
  });
  console.log("INITIAL PRICE");
  console.log(price);
  return price.id;
}

/*
A quote models a price and services for a customer
*/
async function createQuotes(customerId, priceId) {
  const quote = await stripe.quotes.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
      },
    ],
  });
  console.log("CREATED QUOTE");
  console.log(quote);
  return quote.id;
}

/*
Update a quote using the unique quoteId
*/
async function updateQuote(priceid, quoteId) {
  const quote = await stripe.quotes.update(quoteId, {
    line_items: [
      {
        price: priceid,
        quantity: 2,
      },
    ],
  });
  console.log("UPDATED QUOTE");
  console.log(quote);
}

/*
Retrieve the quote using the unique quoteId
*/
async function retrieveQuote(quoteId) {
  const quote = await stripe.quotes.retrieve(quoteId);
  console.log("RETRIEVED QUOTE");
  console.log(quote);
}

/*
Finalizes the quote - quote will be cancelled if expires_at paramater is reached if the quote is an open or draft status
*/

async function finalizeQuote(quoteId) {
  const quote = await stripe.quotes.finalizeQuote(quoteId);
  console.log("FINALIZED QUOTE");
  console.log(quote);
}

/*
Accepts the specified quote and creates an invoice, subscription or subscription scedule for the customer
*/
async function acceptQuote(quoteId) {
  const quote = await stripe.quotes.accept(quoteId);
  console.log("ACCEPTED QUOTE");
  console.log(quote);
}

/*
Cancels the specified quote using the unique quoteId
*/
async function cancelQuote(quoteId) {
  const quote = await stripe.quotes.cancel(quoteId);
  console.log("CANCELLED QUOTE");
  console.log(quote);
}

/*
Downloads a PDF for a quote that has been finalized
*/
async function downloadQuotePDF(quoteId) {
  // Returns a stream.Readable
  const pdf = await stripe.quotes.pdf(quoteId);

  await new Promise((resolve) => {
    pdf.pipe(createWriteStream("/temp/temp.pdf"));
    pdf.on("end", () => resolve());
  });
}

/*
Retrieve a quote's line items
*/
async function retrieveQuotesLineItems(quoteId) {
  stripe.quotes.listLineItems(quoteId, { limit: 3 }, function (err, lineItems) {
    // asynchronously called
    console.log("LINE ITEMS");
    console.log(lineItems);
  });
}

/*
When retrieving a quote, there is an includable computed.upfront.line_items property containing the first handful of those items
*/
async function retrieveQuotesUpFrontItems(quoteId) {
  stripe.quotes.listComputedUpfrontLineItems(
    quoteId,
    { limit: 3 },
    function (err, lineItems) {
      // asynchronously called
      console.log("UPFRONT LINE ITEMS");
      console.log(lineItems);
    }
  );
}

/*
List all quotes controlled via limit
*/
async function listAllQuotes(){
    const quotes = await stripe.quotes.list({
        limit: 3,
      });

console.log('ALL QUOTES')
console.log(quotes)
}


// //Process of a customer accepting a quote
async function customerAcceptingAQuoteProcess(){
createCustomer().then((customerId) => {
  createPrice().then((priceId) => {
    createQuotes(customerId, priceId).then((quoteId) =>{
        updateQuote(priceId, quoteId).then(() => {
            retrieveQuote(quoteId).then(() => {
                finalizeQuote(quoteId).then(() => {
                    acceptQuote(quoteId)
                })
            })
        })
    })
  });
});
}

//Process of a customer cancelling a quote and checking line items

async function customerCancellingAQuoteProcess(){
createCustomer().then((customerId) => {
  createPrice().then((priceId) => {
    createQuotes(customerId, priceId).then((quoteId) => {
      retrieveQuotesLineItems(quoteId).then(() => {
        retrieveQuotesUpFrontItems(quoteId) >
          finalizeQuote(quoteId).then(() => {
            cancelQuote(quoteId);
          });
      });
    });
  });
});
}

//Comment out and uncomment based on need:
// customerAcceptingAQuoteProcess()
// customerCancellingAQuoteProcess()
// listAllQuotes()