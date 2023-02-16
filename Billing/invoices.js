/*
More information can be seen:
https://stripe.com/docs/api/invoices
https://stripe.com/docs/api/invoiceitems
*/

require('dotenv').config()
const stripe = require("stripe")(
  process.env.API_KEY
);

/*
Creates an invoice for a customer using an id - fix amount due
*/

async function createInvoice(){
const customer = await stripe.customers.create();
const invoice = await stripe.invoices.create({
    customer: customer.id,
    currency:'gbp'
  })
  return {invoice: invoice.id, customer:customer.id}
}

/*
Using the invoice number returned from the createInvoice it will then add an amount onto the invoice which previously had a value of 0
*/

async function createInvoiceItem(customerId, invoiceId){
  const invoiceItem = await stripe.invoiceItems.create({
    customer: customerId,
    invoice: invoiceId,
    amount: 200000
  });
}

/*
Retrieves an invoice with the unique invoice.id
*/

async function retrieveInvoice(invoiceID){
  const invoice = await stripe.invoices.retrieve(
    invoiceID
  );

  console.log('RETRIEVED INVOICE')
  console.log(invoice)
}

createInvoice().then((value) => {
  createInvoiceItem(value.customer, value.invoice).then(() => {
    retrieveInvoice(value.invoice)
  })

})

