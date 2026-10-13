const Cart = require("../models/Cart");

// READ // עגלת המשתמש; אם אין - יוצרים עגלה ריקה
async function getCart(username) {
    let cart = await Cart.findOne({ username });

    if (!cart) {
        cart = await new Cart({ username, items: [] }).save();
    }

    return cart;
}

// UPDATE // שמירת העגלה (upsert - נוצרת אם לא קיימת)
function saveCart(username, items) {
    return Cart.findOneAndUpdate(
        { username },
        { username, items },
        { new: true, upsert: true, runValidators: true }
    );
}

module.exports = { getCart, saveCart };
