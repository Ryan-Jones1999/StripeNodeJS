/*
More information can be seen:
https://stripe.com/docs/api/invoices
*/

require('dotenv').config()
const stripe = require("stripe")(
  process.env.API_KEY
);

/*
Creates an invoice for a customer using an id - fix amount due
*/

async function createInvoice(){
const invoice = await stripe.invoices.create({
    customer: 'cus_NLiYa30x00yaU6',
    amount_due: 300000,
    currency:'gbp'
  })
  console.log(invoice)
}

createInvoice()