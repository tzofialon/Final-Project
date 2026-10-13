const mongoose = require("mongoose");

// PRODUCT SCHEMA // מבנה המוצר ב-MongoDB
// 51 המוצרים הוכנסו ל-MongoDB דרך seedProducts.js (לא נמצא בפרויקט).
const productSchema = new mongoose.Schema({
    productId: Number,
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String,
    stock: Number
});

module.exports = mongoose.model("Product", productSchema);
