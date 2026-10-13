const cartService = require("../services/cartService");

async function getCart(req, res) {
    res.json(await cartService.getCart(req.params.username));
}

async function saveCart(req, res) {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    res.json(await cartService.saveCart(req.params.username, items));
}

module.exports = { getCart, saveCart };
