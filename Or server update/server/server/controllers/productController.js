const productService = require('../services/productService');


// GET PRODUCTS
const getAllProducts = async (req, res, next) => {

    try {

        const category = req.query.category;

        const products = await productService.getAllProducts(category);

        res.json(products);

    } catch (error) {

        console.log("PRODUCT ERROR:", error);

        res.status(500).send("Error getting products");
    }

};


// UPDATE PRODUCT
const updateProduct = async (req, res, next) => {

    try {

        const productId = Number(req.params.productId);

        const updatedProduct = await productService.updateProduct(
            productId,
            req.body
        );

        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }

        res.json(updatedProduct);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error updating product");

    }

};


// DELETE PRODUCT
const deleteProduct = async (req, res, next) => {

    try {

        const productId = Number(req.params.productId);

        const deletedProduct = await productService.deleteProduct(
            productId
        );

        if (!deletedProduct) {
            return res.status(404).send("Product not found");
        }

        res.send("Product deleted successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error deleting product");
    }

};
// GET most expensive product by category
const getMostExpensiveByCategory = async (req, res, next) => {

    try {

        const result =
            await productService.getMostExpensiveByCategory();

        res.json(result);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error getting aggregation");
    }

};


// GET product statistics
const getProductStats = async (req, res, next) => {

    try {

        const stats =
            await productService.getProductStats();

        res.json({
            totalProducts:
                stats.totalProducts || 0,

            averagePriceAllProducts:
                stats.averagePriceAllProducts || 0,

            byCategory:
                stats.byCategory
        });

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting product statistics"
        );
    }

};


module.exports = {
    getAllProducts,
    updateProduct,
    deleteProduct,
    getMostExpensiveByCategory,
    getProductStats
};
