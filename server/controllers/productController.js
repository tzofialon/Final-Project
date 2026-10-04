const productService = require('../services/productService');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateInventory(req.params.id, req.body.inventory);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

