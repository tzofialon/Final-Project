const mongoose = require("mongoose");

// CART ITEM SCHEMA // מוצר בתוך עגלה / הזמנה (תת-מסמך)
const cartItemSchema = new mongoose.Schema({
    productId: Number,
    name: String,
    price: Number,
    image: String,
    quantity: Number
}, {
    // אין צורך ב-_id נפרד לכל פריט
    _id: false
});

module.exports = cartItemSchema;
