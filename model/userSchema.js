const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    resetToken: String,
    expirationToken: Date,
    wishlist: [{
        candyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candy"
        }
    }],
    userinfo: [{
        lastname: { type: String },
        phonenumber: { type: Number },
        address: { type: String },
        city: { type: String },
        zip: { type: Number }
    }]
});

// Lägg till produkt till wishlist
userSchema.methods.addToWishList = function (candy) {
    this.wishlist.push({ candyId: candy._id })
    const newWishlist = this.wishlist.filter(function ({ candyId }) {

        return !this.has(`${candyId}`) && this.add(`${candyId}`)
    }, new Set)
    this.wishlist = [...newWishlist]
    return this.save();
}

// Ta bort produkt från wishlist
userSchema.methods.removeFromList = function (candyId) {
    const restOftheProducts = this.wishlist.filter(candy =>
        candy.candyId.toString() !== candyId.toString()
    );
    this.wishlist = restOftheProducts;
    return this.save();
}

//Lägg till produkt i varukorg
userSchema.methods.addToCart = function(candy) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.candyId.toString() === candy._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
   
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        candyId: candy._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };

//Ta bort produkt från varukorg
  userSchema.methods.removeFromCart = function(candyId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.candyId.toString() !== candyId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };
//Rensa varukorg
  userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };
  
const User = mongoose.model("User", userSchema);
module.exports = User;