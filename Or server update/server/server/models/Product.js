const mongoose = require("mongoose");

// מגדיר את המבנה של מוצר ב-MongoDB
const productSchema = new mongoose.Schema({

    productId: Number,

    name: String,

    price: Number,

    category: String,

    description: String,

    image: String
});

// יצירת מודל Product שבעזרתו עובדים עם המוצרים ב-MongoDB
const Product = mongoose.model("Product", productSchema);

module.exports = Product;