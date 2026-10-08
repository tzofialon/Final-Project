const Product = require('../models/Product');


// שליפת מוצרים מ-MongoDB
const getAllProducts = async (category) => {

    let products;

    // אם נשלחה קטגוריה - מחזירים רק מוצרים מאותה קטגוריה
    if (category) {

        products = await Product.find({
            category: category
        });

    } else {

        // אם לא נשלחה קטגוריה - מחזירים את כל המוצרים
        products = await Product.find({});
    }

    return products;
};


// עדכון מוצר קיים לפי productId
const updateProduct = async (productId, updateData) => {

    const updatedProduct = await Product.findOneAndUpdate(
        { productId: productId },
        updateData,
        { new: true }
    );

    return updatedProduct;
};


// מחיקת מוצר לפי productId
const deleteProduct = async (productId) => {

    const deletedProduct = await Product.findOneAndDelete({
        productId: productId
    });

    return deletedProduct;
};


// מציאת המוצר היקר ביותר בכל קטגוריה
const getMostExpensiveByCategory = async () => {

    const result = await Product.aggregate([
        {
            $sort: { price: -1 }
        },
        {
            $group: {
                _id: "$category",
                productName: { $first: "$name" },
                price: { $first: "$price" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    return result;
};


// שאילתת Aggregation לחישוב נתונים על המוצרים
const getProductStats = async () => {

    // חישוב מספר המוצרים והמחיר הממוצע בכל קטגוריה
    const categoryStats = await Product.aggregate([

        {
            // קיבוץ המוצרים לפי קטגוריה
            $group: {

                _id: "$category",

                // ספירת מספר המוצרים בקטגוריה
                numberOfProducts: {
                    $sum: 1
                },

                // חישוב המחיר הממוצע בקטגוריה
                averagePrice: {
                    $avg: "$price"
                }
            }
        },

        {
            // מיון הקטגוריות לפי השם
            $sort: {
                _id: 1
            }
        }

    ]);


    // חישוב נתונים על כל המוצרים בחנות ביחד
    const totalStats = await Product.aggregate([

        {
            $group: {

                // null = לא מחלקים לקטגוריות,
                // אלא מתייחסים לכל המוצרים כקבוצה אחת
                _id: null,

                // מספר המוצרים הכולל
                totalProducts: {
                    $sum: 1
                },

                // המחיר הממוצע של כל המוצרים
                averagePriceAllProducts: {
                    $avg: "$price"
                }
            }
        }

    ]);


    return {

        // מספר כל המוצרים
        totalProducts:
            totalStats[0]?.totalProducts || 0,

        // ממוצע המחירים של כל המוצרים
        averagePriceAllProducts:
            totalStats[0]?.averagePriceAllProducts || 0,

        // הנתונים שחושבו לכל קטגוריה
        byCategory: categoryStats
    };
};


module.exports = {
    getAllProducts,
    updateProduct,
    deleteProduct,
    getMostExpensiveByCategory,
    getProductStats
};