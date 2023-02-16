/*
Subscriptions allow you to charge a customer on a recurring basis
https://stripe.com/docs/api/subscriptions
*/
require("dotenv").config();
const stripe = require("stripe")(process.env.API_KEY);

/*
Creates a default payment method which will be attched to the customer 
*/
async function createDefaultCardMethod() {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: "4242424242424242",
      exp_month: 8,
      exp_year: 2024,
      cvc: "314",
    },
  });
  return paymentMethod.id;
}

async function createCustomer(paymentMethodId) {
  const customer = await stripe.customers.create({
    email: "subscriptions@gmail.com",
    name: "Test User",
    description: "Created in subscriptions class",
    payment_method: paymentMethodId,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
  return customer.id;
}

/*
Creates a price to be used in the quotes function - note the recurring field as this is recuired for subscriptions:
*/
async function createPrice() {
  const price = await stripe.prices.create({
    unit_amount: 2000,
    currency: "gbp",
    product_data: {
      name: "quotes1",
      active: true,
    },
    recurring: {
      interval: "month",
    },
  });
  return price.id;
}
/*
Add funds to the customers cash balance
*/
async function addCashBalance(customerId) {
  const customer = await stripe.testHelpers.customers.fundCashBalance(
    customerId,
    { amount: 200000, currency: "gbp" }
  );
}

/*
Creates a new subscription on an existing customer - each customer can have max 500 active/sceduled subscriptions - max of 20
subscriptions items
*/
async function createSubscription(customerId, priceId) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
  console.log("CREATED SUBSCRIPTION");
  console.log(subscription);
  return subscription.id;
}

/*
Updates a subscription on an existing customer using the subscriptionId - see the documentation on how billing is affected when 
making changes.
*/
async function updateSubscrition(subscriptionId, priceId) {
  const secondPriceId = await createPrice();
  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        price: secondPriceId,
      },
    ],
  });
}

/*
Retrieve a subscription using the unique subscriptionId
*/

async function retrieveSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log("RETRIEVED SUBSCRIPTION");
  console.log(subscription);
}

/*
Cancel a subscription for a customer using subscriptionId - Note, however, that any pending invoice items that you’ve created will 
still be charged for at the end of the period, unless manually deleted.
*/
async function cancelSubscription(subscriptionId) {
  const deleted = await stripe.subscriptions.del(subscriptionId);
  console.log("DELETED SUBSCRIPTION");
  console.log(deleted);
}

/*
By default it returns a list of subscriptions that have not been cancelled - to list use the status paramater as shown:
*/
async function listSubscriptions() {
  const subscriptions = await stripe.subscriptions.list({
    limit: 2,
    status:'canceled'
  });

  console.log('LIST SUBSCRIPTIONS')
  console.log(subscriptions)
}

async function createPricesAndCreateAndUpdateSubscriptions() {
  createDefaultCardMethod().then((paymentMethodId) => {
    createCustomer(paymentMethodId).then((customerId) => {
      addCashBalance(customerId).then(() => {
        createPrice().then((priceId) => {
          createSubscription(customerId, priceId).then((subscriptionId) => {
            updateSubscrition(subscriptionId, priceId).then(() => {
              retrieveSubscription(subscriptionId).then(() => {
                cancelSubscription(subscriptionId);
              });
            });
          });
        });
      });
    });
  });
}
//Comment and uncomment out as required
//createPricesAndCreateAndUpdateSubscriptions()
listSubscriptions()
