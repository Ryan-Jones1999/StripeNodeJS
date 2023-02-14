/*
More information can be seen:
https://stripe.com/docs/api/customers
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
    email: "test123@gmail.com",
    name: "Test User",
    description:
      "My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
  });

  return customer.id;
}

/*
Retrieves the customers account via id
*/
async function retrieveCustomer(id) {
  const customer = await stripe.customers.retrieve(id);
  console.log("RETRIEVE CUSTOMER");
  console.log(customer);
}

/*
Update the fields for a customer using an id
*/
async function updateCustomer(id) {
  const customer = await stripe.customers.update(id, {
    metadata: { order_id: "6735" },
  });
  console.log("UPDATE CUSTOMER");
  console.log(customer);
}

/*
Deletes the customer using an id
*/
async function deleteCustomer(id) {
  const deleted = await stripe.customers.del(id);
  console.log("DELETED CUSTOMER");
  console.log(deleted);
}

createCustomer().then((id) => {
  retrieveCustomer(id).then(() => {
    updateCustomer(id).then(() => {
     deleteCustomer(id);
    });
  });
});
