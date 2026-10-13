const Order = require("../models/Order");

// CREATE // יצירת הזמנה חדשה
function createOrder({ username, items, total, deliveryAddress }) {
    return new Order({
        username,
        items,
        total: Number(total),
        deliveryAddress
    }).save();
}

// READ + SORT // כל ההזמנות, מהחדשה לישנה
function getOrders() {
    return Order.find({}).sort({ orderDate: -1 });
}

module.exports = { createOrder, getOrders };
