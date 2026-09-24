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
app.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.send("User registered successfully");
    } catch (error) {
        res.status(500).send("Error registering user");
    }
});


mongoose.connect("mongodb+srv://yohananagosa092_db_user:yohananagosa9@cluster0.8bixhhu.mongodb.net/?appName=Cluster0", {
    dbName: "techgeek"
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB connection error:", error));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).send("Invalid username or password");
        }

        res.json({
            message: "Login successful",
            username: user.username,
            role: user.role
        });

    } catch (error) {
        res.status(500).send("Error logging in");
    }
});

app.get("/users", async (req, res) => {
    try {
        const username = req.query.username;
        console.log("Username received:", username);

        const admin = await User.findOne({
            username: username,
            role: "admin"
        });
        console.log("Admin found:", admin);

        if (!admin) {
            return res.status(403).send("Access denied");
        }

        const users = await User.find({}, "username email role");

        res.json(users);

    } catch (error) {
        res.status(500).send("Error getting users");
    }
});