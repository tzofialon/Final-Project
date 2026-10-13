const orderService = require("../services/orderService");

async function createOrder(req, res) {
    const { username, items, total } = req.body;

    // VALIDATION // בדיקה בסיסית של נתוני ההזמנה
    if (
        !username ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !Number.isFinite(Number(total))
    ) {
        return res.status(400).send("Invalid order");
    }

    res.status(201).json(await orderService.createOrder(req.body));
}

async function getOrders(req, res) {
    res.json(await orderService.getOrders());
}

module.exports = { createOrder, getOrders };
