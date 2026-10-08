const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');


// GET all products
router.get('/', productController.getAllProducts);


// UPDATE product
router.put('/:productId', productController.updateProduct);


// DELETE product
router.delete('/:productId', productController.deleteProduct);


router.get(
    '/most-expensive-by-category',
    productController.getMostExpensiveByCategory
);

router.get(
    '/stats',
    productController.getProductStats
);


module.exports = router;