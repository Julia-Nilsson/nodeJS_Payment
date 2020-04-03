if(process.env.NODE_ENV!=="production"){
require("dotenv").config()
}

const stripekey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const config = { 

databaseURL:process.env.DATABASE, 
mail:process.env.MAIL
}
module.exports = config