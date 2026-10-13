const mongoose = require("mongoose");

// CONNECT // חיבור ל-MongoDB לפי משתני הסביבה (.env)
async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is not defined (see .env.example)");
    }

    await mongoose.connect(uri, {
        dbName: process.env.DB_NAME || "techgeek"
    });

    console.log("Connected to MongoDB");
}

module.exports = connectDB;
