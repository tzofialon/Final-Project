const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');


// הרשמת משתמש
router.post('/register', userController.register);


// התחברות
router.post('/login', userController.login);


// הצגת משתמשים למנהל
router.get('/', userController.getUsersForAdmin);


module.exports = router;