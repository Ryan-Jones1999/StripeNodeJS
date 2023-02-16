/*
For more information see: https://stripe.com/docs/invoicing/integration/virtual-bank-numbers
*/

require('dotenv').config()
const stripe = require("stripe")(
  process.env.API_KEY
);

/*
Creates a virtual account for the user to transfer funds into - returns the created account information such as id, bank name and account number
*/
async function createAccount(){
const source = await stripe.sources.create({
  type: 'ach_credit_transfer',
  currency: 'usd',
  owner: {email: 'test@gmail.com'},
});
return source.id
}

/*
Retrieves the account based on the id and outputs the information such as id, bank name etc
*/
async function retrieveAccount(id){
const source = await stripe.sources.retrieve(id);
}

/*
Attatches the ACH virtual bank account to the customers account - creates customer if not already created
*/
async function attatchToCustomer(value){
  const customer = await stripe.customers.create({
    email: 'test@gmail.com',
    source: value
  });
}

//Calls the functions
createAccount().then((value) => { 
  retrieveAccount(value).then(() => {
    attatchToCustomer(value)
  })
})


