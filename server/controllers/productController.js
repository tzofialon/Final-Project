const productService = require("../services/productService");

async function getProducts(req, res) {
    res.json(await productService.getProducts(req.query.category));
}

async function updateProduct(req, res) {
    const product = await productService.updateProduct(
        Number(req.params.productId),
        req.body
    );

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.json(product);
}

async function deleteProduct(req, res) {
    const product = await productService.deleteProduct(
        Number(req.params.productId)
    );

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.send("Product deleted successfully");
}

async function getMostExpensiveByCategory(req, res) {
    res.json(await productService.getMostExpensiveByCategory());
}

async function getStats(req, res) {
    res.json(await productService.getStats());
}

module.exports = {
    getProducts,
    updateProduct,
    deleteProduct,
    getMostExpensiveByCategory,
    getStats
};
