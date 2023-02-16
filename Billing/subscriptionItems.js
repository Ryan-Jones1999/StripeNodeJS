/*
Subscriptions allow you to create customer subscriptions with more than one plan
https://stripe.com/docs/api/subscription_items?lang=node
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
  Adds on a new subscription item to an existing subscription 
  */
async function createSubscriptionItem(subscriptionId) {
  const secondPrice = await createPrice();
  const subscriptionItem = await stripe.subscriptionItems.create({
    subscription: subscriptionId,
    price: secondPrice,
    quantity: 2,
  });
  console.log("CREATED SUBSCRIPTION ITEM");
  console.log(subscriptionItem);
  return subscriptionItem.id;
}

/*
  Update the plan or quantity of an item on a current subscription
  */
async function updateSubscriptionItem(subscriptionItemId) {
  const subscriptionItem = await stripe.subscriptionItems.update(
    subscriptionItemId,
    { metadata: { order_id: "6735" } }
  );
  console.log("UPDATED SUBSCRIPTION ITEM");
  console.log(subscriptionItem);
}

/*
Deletes an item from the subscription - removing an item will not cancell the subscription
 */

async function deleteSubscriptionItem(subscriptionItemId) {
  const deleted = await stripe.subscriptionItems.del(subscriptionItemId);
  console.log("DELETED SUBSCRIPTION ITEM");
  console.log(deleted);
}

/*
Retrieves the subscription item with the given ID
*/
async function retrieveSubscriptionItem(subscriptionItemId) {
  const subscriptionItem = await stripe.subscriptionItems.retrieve(
    subscriptionItemId
  );
  console.log("RETRIEVED SUBSCRIPTION FROM ID");
  console.log(subscriptionItem);
}

/*
Returns a list of your subscription items for a given subscription
*/
async function listSubscriptionItems(subscriptionId){
    const subscriptionItems = await stripe.subscriptionItems.list({
        subscription: subscriptionId,
      });

    console.log('RETRIEVED SUBSCRIPTION ITEMS')
    console.log(subscriptionItems)
}

async function createPricesAndCreateAndUpdateSubscriptionsItems() {

  createDefaultCardMethod().then((paymentMethodId) => {

    createCustomer(paymentMethodId).then((customerId) => {

      addCashBalance(customerId).then(() => {

        createPrice().then((priceId) => {

          createSubscription(customerId, priceId).then((subscriptionId) => {

            createSubscriptionItem(subscriptionId).then((subscriptionItemId) => {

                updateSubscriptionItem(subscriptionItemId).then(() => {

                  retrieveSubscriptionItem(subscriptionItemId).then(() => {

                    deleteSubscriptionItem(subscriptionItemId).then(() => {

                        listSubscriptionItems(subscriptionId)
                    })
                  });
                });
              }
            );
          });
        });
      });
    });
  });
}

createPricesAndCreateAndUpdateSubscriptionsItems();
