const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

console.log("Server folder:", __dirname);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


app.get("/login.html", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});


// ========================================
// USER SCHEMA
// ========================================

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "customer"
    }
});

const User = mongoose.model("User", userSchema);


// ========================================
// PRODUCT SCHEMA
// ========================================

const productSchema = new mongoose.Schema({
    productId: Number,
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String
});

const Product = mongoose.model("Product", productSchema);


// ========================================
// REGISTER
// ========================================

app.post("/register", async (req, res) => {
    try {

        const user = new User(req.body);

        await user.save();

        res.send("User registered successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error registering user");
    }
});


// ========================================
// OLD ADVANCED GADGETS SEED
// ========================================

app.post("/products/seed", async (req, res) => {
    try {

        const products = [
            {
                productId: 33,
                name: "Bluetooth adapter",
                price: 350,
                category: "Advanced gadgets",
                description: "A small Bluetooth adapter with a modern design intended for old devices such as televisions, with LED lighting and a metallic finish",
                image: "images/Advanced gadgets/Bluetooth.jpg"
            },
            {
                productId: 34,
                name: "Ergonomic mouse2",
                price: 370,
                category: "Advanced gadgets",
                description: "Ergonomic mouse with buttons adapted to games, in a futuristic design with glowing LED lighting",
                image: "images/Advanced gadgets/Ergonomicmouse.jpg"
            },
            {
                productId: 35,
                name: "Smart LED lamp",
                price: 440,
                category: "Advanced gadgets",
                description: "A smart LED lamp in the design of electric circuits, with adjustable lighting in different colors and control via touch or an app",
                image: "images/Advanced gadgets/LED.jpg"
            },
            {
                productId: 36,
                name: "Mechanical keyboard",
                price: 560,
                category: "Advanced gadgets",
                description: "A small mechanical keyboard with a unique design inspired by binary code, with custom RGB lighting and a futuristic look.",
                image: "images/Advanced gadgets/Mechanicalkeyboard.jpg"
            },
            {
                productId: 37,
                name: "Smart pen",
                price: 370,
                category: "Advanced gadgets",
                description: "A smart pen with advanced functions such as automatic translation and erasing digital handwriting, in a modern design with bright LEDs",
                image: "images/Advanced gadgets/smartpen.jpg"
            },
            {
                productId: 38,
                name: "Smart speaker",
                price: 530,
                category: "Advanced gadgets",
                description: "A small smart speaker in the design of a computer chip, with examples of electric circuits and glowing LED lighting",
                image: "images/Advanced gadgets/Smartspeaker.jpg"
            },
            {
                productId: 39,
                name: "Smart watch",
                price: 670,
                category: "Advanced gadgets",
                description: "A smart watch with a customized interface for programming and task management, in a modern and technological design.",
                image: "images/Advanced gadgets/smartwatch.jpg"
            },
            {
                productId: 40,
                name: "Wireless charger",
                price: 490,
                category: "Advanced gadgets",
                description: "The wireless charger with RGB lighting in the design of electric circuits",
                image: "images/Advanced gadgets/thewirelesscharger.jpg"
            },
            {
                productId: 41,
                name: "Webcam",
                price: 620,
                category: "Advanced gadgets",
                description: "The webcam with a custom frame that can be printed in 3D, in a compact and modern design.",
                image: "images/Advanced gadgets/webcam.jpg"
            },
            {
                productId: 42,
                name: "Wireless headphones",
                price: 350,
                category: "Advanced gadgets",
                description: "Wireless headphones in a technological design with glowing LED lighting and a futuristic look",
                image: "images/Advanced gadgets/Wirelessheadphones.jpg"
            }
        ];

        await Product.deleteMany({
            category: "Advanced gadgets"
        });

        await Product.insertMany(products);

        res.send("Advanced gadgets added successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error adding products");
    }
});


// ========================================
// GET PRODUCTS
// ========================================

app.get("/products", async (req, res) => {
    try {

        const category = req.query.category;

        let products;

        if (category) {

            products = await Product.find({
                category: category
            });

        } else {

            products = await Product.find({});
        }

        res.json(products);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error getting products");
    }
});


// ========================================
// PRODUCT AGGREGATION / STATISTICS
// ========================================

app.get("/products/stats", async (req, res) => {
    try {

        // Statistics for each category
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    numberOfProducts: { $sum: 1 },
                    averagePrice: { $avg: "$price" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);


        // Statistics for ALL products together
        const totalStats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    averagePriceAllProducts: { $avg: "$price" }
                }
            }
        ]);


        res.json({
            totalProducts: totalStats[0]?.totalProducts || 0,
            averagePriceAllProducts:
                totalStats[0]?.averagePriceAllProducts || 0,

            byCategory: categoryStats
        });

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting product statistics"
        );
    }
});


// ========================================
// LOGIN
// ========================================

app.post("/login", async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await User.findOne({
            username,
            password
        });

        if (!user) {

            return res
                .status(401)
                .send("Invalid username or password");
        }

        res.json({
            message: "Login successful",
            username: user.username,
            role: user.role
        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Error logging in");
    }
});


// ========================================
// GET USERS - ADMIN ONLY
// ========================================

app.get("/users", async (req, res) => {
    try {

        const username = req.query.username;

        console.log(
            "Username received:",
            username
        );

        const admin = await User.findOne({
            username: username,
            role: "admin"
        });

        console.log(
            "Admin found:",
            admin
        );

        if (!admin) {

            return res
                .status(403)
                .send("Access denied");
        }

        const users = await User.find(
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


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose.connect(
    "mongodb+srv://yohananagosa092_db_user:yohananagosa9@cluster0.8bixhhu.mongodb.net/?appName=Cluster0",
    {
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


// ========================================
// START SERVER
// ========================================

app.listen(3000, () => {
    console.log(
        "Server is running on port 3000"
    );
});