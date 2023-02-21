/*
PaymentMethod objects represent your customer's payment instruments. 
You can use them with PaymentIntents to collect payments or save them to Customer objects to store instrument details for future payments.

More information on paramters etc can can be seen:
https://stripe.com/docs/api/payment_methods
*/

require('dotenv').config()
const stripe = require("stripe")(
  process.env.API_KEY
);

/*
Creates a PaymentMethod object 

NOTE: Instead of creating a PaymentMethod directly, 
we recommend using the PaymentIntents API to accept a payment 
immediately or the SetupIntent API to collect payment method 
details ahead of a future payment.

*/

async function createPaymentMethod(){
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 8,
          exp_year: 2024,
          cvc: '314',
        },
      });
    console.log('CREATED PAYMENT METHOD')
    console.log(paymentMethod)
    return paymentMethod.id
}

/*
Retrieve a payment method usuing a unique PaymentMethodID
*/
async function retrievePaymentMethod(paymentMethodID){
    const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodID
      );
    console.log('RETRIEVED PAYMENT METHOD')
    console.log(paymentMethod)
}

/*
Returns an automatically generated id - Used for set up for below functions
*/
async function createCustomer() {
  const customer = await stripe.customers.create({
    email: "PaymentMethod@gmail.com",
    name: "PaymentMethod",
    description:
      "Created for payment intent function (created for API docs at https://www.stripe.com/docs/api)",
  });

  return customer.id;
}

/*
Attaches a payment method to a customer to be used for future payments we recommend 
you use a SetupIntent or a PaymentIntent with setup_future_usage. These approaches will 
perform any necessary steps to set up the PaymentMethod for future payments.
*/
async function attatchPaymentMethodToCustomer(customerId, paymentMethodId){
    const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        {customer: customerId}
      );
      console.log('PAYMENT ATTACTHED')
      console.log(paymentMethod)
}

/*
Detatches payment method from the customer its attatched to
*/
async function detatchPaymentMethodFromCustomer(paymentMethodId){
  const paymentMethod = await stripe.paymentMethods.detach(
    paymentMethodId
  );
  console.log('DETATCHED FROM CUSTOMER')
  console.log(paymentMethod)
}
/*
Updates a payment method - note payment method must be attached to a customer to be updated
*/

async function updatePaymentMethod(paymentMethodId){
  const paymentMethod = await stripe.paymentMethods.update(
    paymentMethodId,
    {billing_details:{
      address:{
        city:"updated",
        country:"GB"
      }
    }}
  );
  console.log('UPDATED DETAILS')
  console.log(paymentMethod)
}

/*
Lists the payment methods attatched to a customer which can be filtered by the type option - note this is optional and can be removed
*/
async function listPaymentMethodForACustomer(customerId){
  const paymentMethods = await stripe.customers.listPaymentMethods(
    customerId,
    {type: 'card'}
  );
  console.log('Listed payment methods')
  console.log(paymentMethods)
}

createPaymentMethod().then((paymentMethodId) => {
  retrievePaymentMethod(paymentMethodId).then(() => {
    createCustomer().then((customerId) => {
      attatchPaymentMethodToCustomer(customerId,paymentMethodId).then(() => {
        updatePaymentMethod(paymentMethodId).then(() =>{
          listPaymentMethodForACustomer(customerId).then(() => {
            detatchPaymentMethodFromCustomer(paymentMethodId)
          })
        })
      })
    })
  })
})
