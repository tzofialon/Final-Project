const mongoose = require('mongoose');

//משתמש
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

module.exports = User;