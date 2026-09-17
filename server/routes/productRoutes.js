const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET - שליפת כל המוצרים בקטלוג
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET - שליפת מוצר בודד לפי ID 
router.get('/:id', async (req, res, next) => {
  try {
    const idParam = req.params.id;
    const isNumber = !isNaN(Number(idParam));

    const filter = isNumber 
      ? { productId: Number(idParam) } 
      : { _id: idParam };

    const product = await Product.findOne(filter);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// POST - הוספת מוצר חדש לקטלוג
router.post('/', async (req, res, next) => {
  try {
    const { productId, name, price, image, inventory } = req.body;
    const newProduct = await Product.create({
      productId,
      name,
      price,
      image,
      inventory
    });
    
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    next(error);
  }
});

// PUT - עדכון מלאי מוצר לאחר רכישה 
router.put('/:id/inventory', async (req, res, next) => {
  try {
    const idParam = req.params.id;
    const { inventory } = req.body;
    const isNumber = !isNaN(Number(idParam));

    const filter = isNumber 
      ? { productId: Number(idParam) } 
      : { _id: idParam };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { inventory: inventory },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Inventory updated successfully', product: updatedProduct });
  } catch (error) {
    next(error);
  }
});

// DELETE - מחיקת מוצר מהקטלוג 
router.delete('/:id', async (req, res, next) => {
  try {
    const idParam = req.params.id;
    const isNumber = !isNaN(Number(idParam));

    const filter = isNumber 
      ? { productId: Number(idParam) } 
      : { _id: idParam };

    const deletedProduct = await Product.findOneAndDelete(filter);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;