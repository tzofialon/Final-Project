const bcrypt = require("bcrypt");
const User = require("../models/User");

// REGISTER // יצירת משתמש חדש עם סיסמה מוצפנת
async function register({ username, email, password }) {
    if (!username || !password) {
        return { status: 400, message: "Missing username or password" };
    }

    const existing = await User.findOne({ username });
    if (existing) {
        return { status: 409, message: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ username, email, password: hashedPassword }).save();

    return { status: 200, message: "User registered successfully" };
}

// LOGIN // מחזיר את המשתמש אם הסיסמה תואמת ל-hash השמור, אחרת null
async function login({ username, password }) {
    const user = await User.findOne({ username });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
}

module.exports = { register, login };
