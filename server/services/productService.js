const Product = require("../models/Product");

// READ // כל המוצרים, או לפי קטגוריה
function getProducts(category) {
    return Product.find(category ? { category } : {});
}

// UPDATE // עדכון לפי productId, מחזיר את המוצר אחרי העדכון
function updateProduct(productId, data) {
    return Product.findOneAndUpdate({ productId }, data, { new: true });
}

// DELETE
function deleteProduct(productId) {
    return Product.findOneAndDelete({ productId });
}

// AGGREGATE 1 // המוצר היקר ביותר בכל קטגוריה
function getMostExpensiveByCategory() {
    return Product.aggregate([
        { $sort: { price: -1 } },
        {
            // אחרי מיון יורד, $first הוא היקר ביותר בקטגוריה
            $group: {
                _id: "$category",
                productName: { $first: "$name" },
                price: { $first: "$price" }
            }
        },
        { $sort: { _id: 1 } }
    ]);
}

// AGGREGATE 2 // מספר מוצרים + מחיר ממוצע, לכל קטגוריה ובסך הכול
async function getStats() {
    const byCategory = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                numberOfProducts: { $sum: 1 },
                averagePrice: { $avg: "$price" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const totalStats = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                averagePriceAllProducts: { $avg: "$price" }
            }
        }
    ]);

    return {
        totalProducts: totalStats[0]?.totalProducts || 0,
        averagePriceAllProducts: totalStats[0]?.averagePriceAllProducts || 0,
        byCategory
    };
}

module.exports = {
    getProducts,
    updateProduct,
    deleteProduct,
    getMostExpensiveByCategory,
    getStats
};
