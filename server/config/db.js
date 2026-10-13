const dns = require("dns");
const mongoose = require("mongoose");

// DNS // אם Node לא מצליח לפענח כתובת mongodb+srv (למשל querySrv ECONNREFUSED),
// אפשר להגדיר ב-.env שרתי DNS ידניים: DNS_SERVERS=8.8.8.8,1.1.1.1
if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()));
}

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
