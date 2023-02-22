const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
require('dotenv').config()
const endpointSecret = process.env.ENDPOINT_SECRET
const stripe = require("stripe")(
  process.env.API_KEY
);
nunjucks.configure('./CheckoutExamples/bankTransfer', {
  express: app
})

app.set('view engine', 'njk');

/*
Renders the checkout page with a button
*/
app.get('/create-checkout-session', async (req, res, next) =>{
  res.render('checkout')
})

/*
Renders the success page when redirected from create-checkout-session page
*/

app.get('/success', async (req, res, next) =>{
    res.render('confirmation')
  })

/*
When user clicks the button on the checkout page it makes a post request which renders a stripe checkout page
with a price of £20 if the customer has enough in their balance it will use automatically use that and will then
render the success page otherwise it will render the bank transfer page.

To test a bank transer use the following in the CLI

stripe test_helpers customers fund_cash_balance "<customer.id>" \
  --amount=2000 \
  --reference=reference from the checkout page \
  --currency=gbp

*/
app.post('/create-checkout-session', async (req, res) => {

  const customer = await stripe.customers.create();

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['customer_balance'],
    payment_method_options: {
      customer_balance: {
        funding_type: 'bank_transfer',
        bank_transfer: {
          type: 'gb_bank_transfer',
        },
      },
    },
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: {
          name: 'T-shirt',
        },
        unit_amount: '2000',
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:4242/success',
    cancel_url: 'http://localhost:4242/create-checkout-session',
  });

  res.redirect(303, session.url);
});

/*
See the readme and make sure the ENDPOINT_SECRET is set - see the word document at chapter 4.2 for more information on how to get set up.
*/

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      console.log('payment succeeded')
      break;

    case 'charge.succeeded':
    console.log('charge succeeded')
    break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log(`Listening on port ${4242}!`));

  