const userService = require('../services/userService');


// ========================================
// REGISTER
// ========================================

// מקבל את פרטי ההרשמה ומעביר אותם ל-Service
const register = async (req, res, next) => {

    try {

        // העברת פרטי המשתמש ל-Service
        await userService.createUser(req.body);

        // תשובה ל-Frontend אם ההרשמה הצליחה
        res.send("User registered successfully");

    } catch (error) {

        console.log(error);

        // תשובה במקרה של שגיאה
        res.status(500).send("Error registering user");
    }

};


// ========================================
// LOGIN
// ========================================

// בדיקת פרטי ההתחברות
const login = async (req, res, next) => {

    try {

        // קבלת שם המשתמש והסיסמה מה-Frontend
        const { username, password } = req.body;


        // חיפוש המשתמש דרך ה-Service
        const user = await userService.loginUser(
            username,
            password
        );


        // אם לא נמצא משתמש מתאים
        if (!user) {

            return res
                .status(401)
                .send("Invalid username or password");
        }


        // אם המשתמש נמצא - מחזירים את פרטיו
        res.json({

            message: "Login successful",

            username: user.username,

            // מחזירים גם את התפקיד
            role: user.role
        });


    } catch (error) {

        console.log(error);

        res.status(500).send("Error logging in");
    }

};


// ========================================
// GET USERS - ADMIN ONLY
// ========================================

// מחזיר את רשימת המשתמשים רק למנהל
const getUsersForAdmin = async (req, res, next) => {

    try {

        // קבלת שם המשתמש מהבקשה
        const username = req.query.username;


        // בדיקה דרך ה-Service שהמשתמש הוא admin
        const users = await userService.getUsersForAdmin(
            username
        );


        // אם המשתמש אינו מנהל - אין גישה
        if (!users) {

            return res
                .status(403)
                .send("Access denied");
        }


        // החזרת רשימת המשתמשים ל-Frontend
        res.json(users);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error getting users"
        );
    }

};


module.exports = {
    register,
    login,
    getUsersForAdmin
};