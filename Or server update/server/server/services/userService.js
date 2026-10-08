const User = require('../models/User');


// ========================================
// REGISTER
// ========================================

// יצירת משתמש חדש ושמירה ב-MongoDB
const createUser = async (userData) => {

    const user = new User(userData);

    await user.save();

};


// ========================================
// LOGIN
// ========================================

// חיפוש משתמש לפי username ו-password
const loginUser = async (username, password) => {

    const user = await User.findOne({
        username: username,
        password: password
    });

    return user;
};


// ========================================
// GET USERS - ADMIN ONLY
// ========================================

// בדיקה אם המשתמש הוא מנהל
const getUsersForAdmin = async (username) => {

    const admin = await User.findOne({

        username: username,

        role: "admin"
    });


    // אם המשתמש אינו מנהל
    if (!admin) {

        return null;
    }


    // שליפת המשתמשים
    const users = await User.find(
        {},
        "username email role"
    );


    return users;
};


module.exports = {
    createUser,
    loginUser,
    getUsersForAdmin
};