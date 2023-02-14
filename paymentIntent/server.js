const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
require('dotenv').config()
const stripe = require("stripe")(
  process.env.API_KEY
);
nunjucks.configure('./paymentIntent', {
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
with a price of £20 if successful it will render the success page.
For testing use the following card numbers:

4242424242424242	Succeeds and immediately processes the payment.
4000000000003220	Complete 3D Secure 2 authentication for a successful payment.
4000000000009995	Always fails with a decline code of insufficient_funds
*/
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/create-checkout-session',
  });

  res.redirect(303, session.url);
});

app.listen(3000, () => console.log(`Listening on port ${3000}!`));

  