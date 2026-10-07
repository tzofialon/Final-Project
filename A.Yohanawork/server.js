// ======================================================
// IMPORTS // ספריות שהשרת משתמש בהן
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// ======================================================
// EXPRESS SERVER // יצירת שרת Express
// ======================================================

const app = express();

// CORS // מאפשר תקשורת בין ה-Frontend לשרת
app.use(cors());

// JSON // מאפשר לשרת לקבל מידע בפורמט JSON
app.use(express.json());

// STATIC FILES // הצגת קבצי ה-Frontend
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});


// ======================================================
// USER SCHEMA // מבנה המשתמש ב-MongoDB
// ======================================================

const userSchema = new mongoose.Schema({

    username: String,

    email: String,

    password: String,

    // ROLE // סוג המשתמש - customer / admin
    role: {
        type: String,
        default: "customer"
    }

});

// USER MODEL // המודל שבעזרתו עובדים עם המשתמשים ב-MongoDB
const User = mongoose.model("User", userSchema);



// ======================================================
// PRODUCT SCHEMA // מבנה המוצר ב-MongoDB
// ======================================================

// 51 PRODUCTS:
// ההכנסה הראשונית של 51 המוצרים ל-MongoDB
// נעשתה דרך הקובץ seedProducts.js.
//
// כאן אנחנו מגדירים את המבנה של המוצרים
// שאיתם השרת עובד לאחר שהם נמצאים ב-MongoDB.

const productSchema = new mongoose.Schema({

    productId: Number,

    name: String,

    price: Number,

    category: String,

    description: String,

    image: String,

    stock: Number

});

// PRODUCT MODEL // עבודה מול Collection המוצרים
const Product = mongoose.model("Product", productSchema);



// ======================================================
// CART ITEM SCHEMA // מבנה של מוצר בתוך עגלת קניות
// ======================================================

const cartItemSchema = new mongoose.Schema({

    productId: Number,

    name: String,

    price: Number,

    image: String,

    quantity: Number

}, {

    // אין צורך ב-_id נפרד לכל פריט בתוך העגלה
    _id: false

});



// ======================================================
// CART SCHEMA // מבנה עגלת קניות ב-MongoDB
// ======================================================

// לכל username יש עגלה משלו.
// כך העגלה נשמרת במסד הנתונים ולא רק בדפדפן.

const cartSchema = new mongoose.Schema({

    // USERNAME // המשתמש שהעגלה שייכת אליו
    username: {
        type: String,
        required: true,
        unique: true
    },

    // ITEMS // המוצרים שנמצאים בעגלה
    items: {
        type: [cartItemSchema],
        default: []
    }

});

// CART MODEL // עבודה מול Collection העגלות
const Cart = mongoose.model("Cart", cartSchema);



// ======================================================
// ORDER SCHEMA // מבנה הזמנה ב-MongoDB
// ======================================================

const orderSchema = new mongoose.Schema({

    // USERNAME // המשתמש שביצע את ההזמנה
    username: {
        type: String,
        required: true
    },

    // ITEMS // צילום של המוצרים בזמן ביצוע ההזמנה
    items: {
        type: [cartItemSchema],
        required: true
    },

    // TOTAL // הסכום הכולל של ההזמנה
    total: {
        type: Number,
        required: true
    },

    // DELIVERY ADDRESS // כתובת למשלוח
    deliveryAddress: String,

    // ORDER DATE // תאריך יצירת ההזמנה
    orderDate: {
        type: Date,
        default: Date.now
    }

});

// ORDER MODEL // עבודה מול Collection ההזמנות
const Order = mongoose.model("Order", orderSchema);



// ======================================================
// CRUD - CREATE USER
// יצירת משתמש חדש ושמירתו ב-MongoDB
// ======================================================

app.post("/register", async (req, res) => {

    try {

        // CREATE // יצירת Object חדש מסוג User
        const user = new User(req.body);

        // SAVE // שמירת המשתמש ב-MongoDB
        await user.save();

        res.send("User registered successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error registering user"
        );
    }

});



// ======================================================
// CRUD - READ PRODUCTS
// שליפת מוצרים מ-MongoDB
// ======================================================

app.get("/products", async (req, res) => {

    try {

        // QUERY PARAMETER // קטגוריה שהגיעה מה-Frontend
        const category = req.query.category;

        let products;

        if (category) {

            // READ WITH FILTER
            // שליפת מוצרים מקטגוריה מסוימת
            products = await Product.find({
                category: category
            });

        } else {

            // READ ALL
            // שליפת כל המוצרים
            products = await Product.find({});
        }

        res.json(products);

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting products"
        );
    }

});



// ======================================================
// CRUD - UPDATE PRODUCT
// עדכון מוצר קיים ב-MongoDB
// ======================================================

app.put("/products/:productId", async (req, res) => {

    try {

        // PRODUCT ID // מזהה המוצר שמגיע מה-URL
        const productId =
            Number(req.params.productId);


        // UPDATE QUERY
        // חיפוש המוצר לפי productId ועדכון הנתונים שלו
        const updatedProduct =
            await Product.findOneAndUpdate(

                {
                    productId: productId
                },

                req.body,

                {
                    // NEW TRUE // מחזיר את המוצר אחרי העדכון
                    new: true
                }

            );


        if (!updatedProduct) {

            return res
                .status(404)
                .send("Product not found");
        }


        res.json(updatedProduct);

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error updating product"
        );
    }

});



// ======================================================
// CRUD - DELETE PRODUCT
// מחיקת מוצר קיים מ-MongoDB
// ======================================================

app.delete("/products/:productId", async (req, res) => {

    try {

        const productId =
            Number(req.params.productId);


        // DELETE QUERY
        // חיפוש מוצר לפי productId ומחיקתו
        const deletedProduct =
            await Product.findOneAndDelete({

                productId: productId

            });


        if (!deletedProduct) {

            return res
                .status(404)
                .send("Product not found");
        }


        res.send(
            "Product deleted successfully"
        );

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error deleting product"
        );
    }

});



// ======================================================
// CART - READ
// שליפת עגלת המשתמש מ-MongoDB
// ======================================================

app.get("/cart/:username", async (req, res) => {

    try {

        const username =
            req.params.username;


        // READ CART
        // מחפשים את העגלה לפי username
        let cart =
            await Cart.findOne({
                username: username
            });


        // אם עדיין אין למשתמש עגלה,
        // יוצרים עבורו עגלה ריקה.
        if (!cart) {

            cart = new Cart({

                username: username,

                items: []

            });


            // CREATE CART // שמירת העגלה החדשה
            await cart.save();
        }


        res.json(cart);

    } catch (error) {

        console.error(
            "Error getting cart:",
            error
        );

        res.status(500).send(
            "Error getting cart"
        );
    }

});



// ======================================================
// CART - UPDATE
// שמירה / עדכון של עגלת המשתמש ב-MongoDB
// ======================================================

app.put("/cart/:username", async (req, res) => {

    try {

        const username =
            req.params.username;


        // ITEMS // המוצרים שהגיעו מה-Frontend
        const items =
            Array.isArray(req.body.items)
                ? req.body.items
                : [];


        // UPDATE CART
        // מעדכן את העגלה של המשתמש.
        //
        // UPSERT TRUE:
        // אם אין עדיין עגלה - MongoDB ייצור אותה.
        const cart =
            await Cart.findOneAndUpdate(

                {
                    username: username
                },

                {
                    username: username,
                    items: items
                },

                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }

            );


        res.json(cart);

    } catch (error) {

        console.error(
            "Error updating cart:",
            error
        );

        res.status(500).send(
            "Error updating cart"
        );
    }

});



// ======================================================
// ORDER - CREATE
// יצירת הזמנה חדשה ושמירתה ב-MongoDB
// ======================================================

app.post("/orders", async (req, res) => {

    try {

        const {
            username,
            items,
            total,
            deliveryAddress
        } = req.body;


        // VALIDATION // בדיקה בסיסית של נתוני ההזמנה
        if (
            !username ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !Number.isFinite(Number(total))
        ) {

            return res
                .status(400)
                .send("Invalid order");
        }


        // CREATE ORDER
        // יצירת מסמך Order חדש
        const order = new Order({

            username: username,

            items: items,

            total: Number(total),

            deliveryAddress:
                deliveryAddress

        });


        // SAVE ORDER // שמירת ההזמנה ב-MongoDB
        await order.save();


        res.status(201).json(order);

    } catch (error) {

        console.error(
            "Error creating order:",
            error
        );

        res.status(500).send(
            "Error creating order"
        );
    }

});



// ======================================================
// ORDERS - READ + SORT
// שליפת ההזמנות ומיון מהחדשה לישנה
// ======================================================

app.get("/orders", async (req, res) => {

    try {

        const orders =
            await Order

                // READ // שליפת כל ההזמנות
                .find({})

                // SORT // מיון לפי תאריך בסדר יורד
                // -1 = מהחדש לישן
                .sort({
                    orderDate: -1
                });


        res.json(orders);

    } catch (error) {

        console.error(
            "Error getting orders:",
            error
        );

        res.status(500).send(
            "Error getting orders"
        );
    }

});



// ======================================================
// AGGREGATE QUERY 1
// המוצר היקר ביותר בכל קטגוריה
// ======================================================

app.get(
    "/products/most-expensive-by-category",
    async (req, res) => {

        try {

            const result =
                await Product.aggregate([

                    {
                        // SORT // מיון לפי מחיר
                        // -1 = מהמחיר הגבוה לנמוך
                        $sort: {
                            price: -1
                        }
                    },

                    {
                        // GROUP // קיבוץ לפי קטגוריה
                        //
                        // בגלל שמיינו קודם מהיקר לזול,
                        // $first יהיה המוצר היקר ביותר
                        // בכל קטגוריה.
                        $group: {

                            _id: "$category",

                            productName: {
                                $first: "$name"
                            },

                            price: {
                                $first: "$price"
                            }

                        }
                    },

                    {
                        // SORT // מיון הקטגוריות לפי השם
                        $sort: {
                            _id: 1
                        }
                    }

                ]);


            res.json(result);

        } catch (error) {

            console.log(error);

            res.status(500).send(
                "Error getting aggregation"
            );
        }

    }
);



// ======================================================
// AGGREGATE QUERY 2
// PRODUCT STATISTICS // סטטיסטיקות על המוצרים
// ======================================================

app.get("/products/stats", async (req, res) => {

    try {


        // ----------------------------------------------
        // AGGREGATION BY CATEGORY
        // מספר מוצרים + מחיר ממוצע בכל קטגוריה
        // ----------------------------------------------

        const categoryStats =
            await Product.aggregate([

                {
                    // GROUP // קיבוץ לפי קטגוריה
                    $group: {

                        _id: "$category",

                        // SUM // מספר המוצרים בקטגוריה
                        numberOfProducts: {
                            $sum: 1
                        },

                        // AVG // המחיר הממוצע בקטגוריה
                        averagePrice: {
                            $avg: "$price"
                        }

                    }
                },

                {
                    // SORT // מיון הקטגוריות לפי השם
                    $sort: {
                        _id: 1
                    }
                }

            ]);



        // ----------------------------------------------
        // TOTAL PRODUCT STATISTICS
        // סטטיסטיקה של כל מוצרי החנות ביחד
        // ----------------------------------------------

        const totalStats =
            await Product.aggregate([

                {
                    // GROUP ALL PRODUCTS
                    // _id:null = כל המוצרים כקבוצה אחת
                    $group: {

                        _id: null,

                        // SUM // מספר המוצרים הכולל
                        totalProducts: {
                            $sum: 1
                        },

                        // AVG // ממוצע המחירים של כל המוצרים
                        averagePriceAllProducts: {
                            $avg: "$price"
                        }

                    }
                }

            ]);


        // RESPONSE // שליחת הסטטיסטיקות ל-Frontend
        res.json({

            totalProducts:
                totalStats[0]
                    ?.totalProducts || 0,

            averagePriceAllProducts:
                totalStats[0]
                    ?.averagePriceAllProducts || 0,

            byCategory:
                categoryStats

        });


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting product statistics"
        );
    }

});



// ======================================================
// LOGIN
// התחברות - חיפוש המשתמש ב-MongoDB
// ======================================================

app.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // READ USER
        // חיפוש משתמש לפי username + password
        const user =
            await User.findOne({

                username: username,

                password: password

            });


        // USER NOT FOUND // פרטי התחברות לא נכונים
        if (!user) {

            return res
                .status(401)
                .send(
                    "Invalid username or password"
                );
        }


        // LOGIN SUCCESS
        // מחזירים גם role כדי שה-Frontend
        // ידע אם המשתמש הוא customer או admin.
        res.json({

            message:
                "Login successful",

            username:
                user.username,

            role:
                user.role

        });


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error logging in"
        );
    }

});



// ======================================================
// USERS - ADMIN ONLY
// שליפת רשימת המשתמשים מ-MongoDB
// ======================================================

app.get("/users", async (req, res) => {

    try {

        const username =
            req.query.username;


        // ADMIN CHECK
        // בודקים ב-MongoDB שהמשתמש שמבקש
        // את הרשימה הוא באמת admin.
        const admin =
            await User.findOne({

                username: username,

                role: "admin"

            });


        // ACCESS CONTROL // חסימת משתמש שאינו מנהל
        if (!admin) {

            return res
                .status(403)
                .send(
                    "Access denied"
                );
        }


        // READ USERS
        // שליפת כל המשתמשים.
        //
        // מחזירים רק:
        // username, email, role
        //
        // ולכן password לא נשלח ל-Frontend.
        const users =
            await User.find(

                {},

                "username email role"

            );


        res.json(users);

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting users"
        );
    }

});



// ======================================================
// MONGODB CONNECTION
// חיבור השרת ל-MongoDB Atlas
// ======================================================

// כאן תשאירי את מחרוזת החיבור הקיימת אצלך.
// לא לשים את ה-placeholder אם את רוצה שהשרת באמת יתחבר.

mongoose.connect(

    "mongodb+srv://yohananagosa092_db_user:yohananagosa9@cluster0.8bixhhu.mongodb.net/?appName=Cluster0",

    {
        // DATABASE NAME // שם בסיס הנתונים
        dbName: "techgeek"
    }

)

.then(() => {

    console.log(
        "Connected to MongoDB"
    );

})

.catch((error) => {

    console.log(
        "MongoDB connection error:",
        error
    );

});



// ======================================================
// START SERVER
// הפעלת השרת על Port 3000
// ======================================================

app.listen(3000, () => {

    console.log(
        "Server is running on port 3000"
    );

});