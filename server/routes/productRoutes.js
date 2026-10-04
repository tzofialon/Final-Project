const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET - שליפת כל המוצרים בקטלוג
router.get('/', productController.getAllProducts);

// GET - שליפת מוצר בודד לפי ID
router.get('/:id', productController.getProductById);

// POST - הוספת מוצר חדש לקטלוג
router.post('/', productController.createProduct);

// PUT - עדכון מלאי מוצר לאחר רכישה
router.put('/:id/inventory', productController.updateInventory);

// DELETE - מחיקת מוצר מהקטלוג
router.delete('/:id', productController.deleteProduct);

module.exports = router;