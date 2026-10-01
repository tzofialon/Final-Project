// ================================
// IMPORTS - ספריות שהשרת צריך
// ================================

// ספרייה ליצירת השרת
const express = require("express");

// ספרייה לעבודה עם MongoDB
const mongoose = require("mongoose");

// מאפשר תקשורת בין ה-Frontend לשרת
const cors = require("cors");


// יצירת שרת Express
const app = express();


// מאפשר קבלת בקשות מה-Frontend
app.use(cors());

// מאפשר לשרת לקבל מידע בפורמט JSON
app.use(express.json());

// מאפשר לשרת להציג את קבצי האתר
app.use(express.static(__dirname));



// ================================
// USER SCHEMA
// ================================

// מגדיר את המבנה של משתמש ב-MongoDB
const userSchema = new mongoose.Schema({

    username: String,

    email: String,

    password: String,

    // סוג המשתמש - מנהל או לקוח
    role: {
        type: String,
        default: "customer"
    }
});


// יצירת מודל User שבעזרתו עובדים מול MongoDB
const User = mongoose.model("User", userSchema);



// ================================
// PRODUCT SCHEMA
// ================================

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



// ================================
// REGISTER
// ================================

// מקבל פרטי הרשמה מה-Frontend ושומר משתמש חדש
app.post("/register", async (req, res) => {

    try {

        // יצירת משתמש חדש מהפרטים שהגיעו מהטופס
        const user = new User(req.body);

        // שמירת המשתמש ב-MongoDB
        await user.save();

        // תשובה ל-Frontend אם ההרשמה הצליחה
        res.send("User registered successfully");

    } catch (error) {

        console.log(error);

        // תשובה במקרה של שגיאה
        res.status(500).send("Error registering user");
    }

});



// ================================
// GET PRODUCTS
// ================================

// שליפת מוצרים מ-MongoDB
app.get("/products", async (req, res) => {

    try {

        // קבלת הקטגוריה שנשלחה מה-Frontend
        const category = req.query.category;

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


        // החזרת המוצרים ל-Frontend כ-JSON
        res.json(products);


    } catch (error) {

        console.log(error);

        res.status(500).send("Error getting products");
    }

});


// ================================
// UPDATE PRODUCT
// ================================

// עדכון מוצר קיים לפי productId
app.put("/products/:productId", async (req, res) => {

    try {

        const productId = Number(req.params.productId);

        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productId },
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }

        res.json(updatedProduct);

    } catch (error) {

        console.log(error);
        res.status(500).send("Error updating product");

    }

});


// ================================
// DELETE PRODUCT
// ================================

// מחיקת מוצר לפי productId
app.delete("/products/:productId", async (req, res) => {

    try {
        const productId = Number(req.params.productId);

        const deletedProduct = await Product.findOneAndDelete({
            productId: productId
        });

        if (!deletedProduct) {
            return res.status(404).send("Product not found");
        }

        res.send("Product deleted successfully");

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting product");
    }

});

// ================================
// AGGREGATION - MOST EXPENSIVE PRODUCT
// ================================

// מציאת המוצר היקר ביותר בכל קטגוריה
app.get("/products/most-expensive-by-category", async (req, res) => {

    try {

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

        res.json(result);

    } catch (error) {

        console.log(error);
        res.status(500).send("Error getting aggregation");

    }

});


// ================================
// PRODUCT AGGREGATION / STATISTICS
// ================================

// שאילתת Aggregation לחישוב נתונים על המוצרים
app.get("/products/stats", async (req, res) => {

    try {


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



        // שליחת תוצאות החישובים ל-Frontend
        res.json({

            // מספר כל המוצרים
            totalProducts:
                totalStats[0]?.totalProducts || 0,

            // ממוצע המחירים של כל המוצרים
            averagePriceAllProducts:
                totalStats[0]?.averagePriceAllProducts || 0,

            // הנתונים שחושבו לכל קטגוריה
            byCategory: categoryStats
        });


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting product statistics"
        );
    }

});



// ================================
// LOGIN
// ================================

// בדיקת פרטי ההתחברות של המשתמש
app.post("/login", async (req, res) => {

    try {

        // קבלת שם המשתמש והסיסמה מה-Frontend
        const { username, password } = req.body;


        // חיפוש משתמש מתאים ב-MongoDB
        const user = await User.findOne({
            username: username,
            password: password
        });


        // אם לא נמצא משתמש מתאים
        if (!user) {

            return res
                .status(401)
                .send("Invalid username or password");
        }


        // אם המשתמש נמצא - מחזירים את פרטיו ל-Frontend
        res.json({

            message: "Login successful",

            username: user.username,

            // מחזירים גם את התפקיד כדי לדעת אם הוא admin
            role: user.role
        });


    } catch (error) {

        console.log(error);

        res.status(500).send("Error logging in");
    }

});



// ================================
// GET USERS - ADMIN ONLY
// ================================

// מחזיר את רשימת המשתמשים רק למנהל
app.get("/users", async (req, res) => {

    try {

        // קבלת שם המשתמש מהבקשה
        const username = req.query.username;


        // בדיקה ב-MongoDB שהמשתמש הוא admin
        const admin = await User.findOne({

            username: username,

            role: "admin"
        });


        // אם המשתמש אינו מנהל - אין גישה
        if (!admin) {

            return res
                .status(403)
                .send("Access denied");
        }


        // שליפת המשתמשים מ-MongoDB
        // מחזירים רק username, email ו-role
        const users = await User.find(
            {},
            "username email role"
        );


        // החזרת רשימת המשתמשים ל-Frontend
        res.json(users);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting users"
        );
    }

});



// ================================
// MONGODB CONNECTION
// ================================

// חיבור למסד הנתונים MongoDB
mongoose.connect(
"mongodb+srv://yohananagosa092_db_user:yohananagosa9@cluster0.8bixhhu.mongodb.net/?appName=Cluster0",    {
        dbName: "techgeek"
    }
)

.then(() => {

    console.log("Connected to MongoDB");

})

.catch((error) => {

    console.log(
        "MongoDB connection error:",
        error
    );

});



// ================================
// START SERVER
// ================================

// הפעלת השרת על פורט 3000
app.listen(3000, () => {

    console.log(
        "Server is running on port 3000"
    );

});