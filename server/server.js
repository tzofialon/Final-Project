const path = require("path");

// ENV // טעינת משתני סביבה מקובץ .env (אם קיים)
try {
    process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch {
    // אין קובץ .env - משתמשים במשתני הסביבה של המערכת
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

connectDB().catch((error) => {
    console.error("MongoDB connection error:", error);
});
