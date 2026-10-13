const mongoose = require("mongoose");
const cartItemSchema = require("./cartItemSchema");

// CART SCHEMA // לכל username יש עגלה משלו
const cartSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    items: {
        type: [cartItemSchema],
        default: []
    }
});

module.exports = mongoose.model("Cart", cartSchema);
