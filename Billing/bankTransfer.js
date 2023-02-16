/*
Stripe can accept bank transfers from your customers using Stripe-provided, customer-specific bank account details.
https://stripe.com/docs/invoicing/bank-transfer
*/

require('dotenv').config()
const stripe = require("stripe")(
  process.env.API_KEY
);

/*
Creates a customer with a name, email and description more paramaters can be specified:

Returns an automatically generated id
*/
async function createCustomer() {
    const customer = await stripe.customers.create({
      email: "ryanjoneswork1999@gmail.com",
      name: "Payment",
      description:
        "Paying",
    });
  
    return customer.id;
  }

/*
Creates an invoice item for the customer to pay
*/
async function createInvoiceItems(customerId){
const invoiceItem = await stripe.invoiceItems.create({
    amount: 1234,
    currency: 'gbp',
    customer: customerId,
    description: 'Professional services',
  })

console.log('INVOICED ITEM')
console.log(invoiceItem)
}

/*
Creates an invoice for a customer to pay via bank transfer which is enabled by specifying the customer_balance field
*/
async function createInvoice(customerId){
    const invoice = await stripe.invoices.create({
        customer: customerId,
        payment_settings: {payment_method_types: ['customer_balance']},
        collection_method: 'send_invoice',
        days_until_due: 0,
      });
      console.log('INVOICED RECEIPT')
      console.log(invoice)
}

createCustomer().then((customerId) =>{
    createInvoiceItems(customerId).then(() => {
        createInvoice(customerId)
    })
})

