const User = require("../models/User");

// בודק ב-MongoDB שהמשתמש הוא admin
async function isAdmin(username) {
    return Boolean(await User.findOne({ username, role: "admin" }));
}

// מחזירים רק username, email, role - בלי password
function getAllUsers() {
    return User.find({}, "username email role");
}

module.exports = { isAdmin, getAllUsers };
