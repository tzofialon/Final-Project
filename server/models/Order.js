const mongoose = require("mongoose");
const cartItemSchema = require("./cartItemSchema");

// ORDER SCHEMA // מבנה הזמנה ב-MongoDB
const orderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    // צילום של המוצרים בזמן ביצוע ההזמנה
    items: {
        type: [cartItemSchema],
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    deliveryAddress: String,

    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
