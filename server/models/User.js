const mongoose = require("mongoose");

// USER SCHEMA // מבנה המשתמש ב-MongoDB
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

module.exports = mongoose.model("User", userSchema);
