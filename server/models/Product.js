const mongoose = require('mongoose');

// מוצר בחנות
const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: [true, 'Please enter a product ID'],
      unique: true // מבטיח שמזהה המוצר לא יחזור על עצמו
    },
    name: {
      type: String,
      required: [true, 'Please enter a product name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
      min: [0, 'Price cannot be negative']
    },
    image: {
      type: String,
      required: [true, 'Please enter an image URL/path']
    },
    inventory: {
      type: Number,
      required: [true, 'Please enter inventory count'],
      default: 10,
      min: [0, 'Inventory cannot be negative']
    }
  },
  {
    timestamps: true // מוסיף אוטומטית שדות createdAt ו-updatedAt
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;