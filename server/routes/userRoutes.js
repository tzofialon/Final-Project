const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET - שליפת כל המשתמשים
router.get('/', userController.getAllUsers);

// GET - שליפת משתמש יחיד לפי ID
router.get('/:id', userController.getUserById);

// POST - יצירת/הרשמת משתמש חדש
router.post('/register', userController.registerUser);

// POST - התחברות משתמש
router.post('/login', userController.loginUser);

// PUT - עדכון משתמש לפי ID
router.put('/:id', userController.updateUser);

// DELETE - מחיקת משתמש לפי ID
router.delete('/:id', userController.deleteUser);

module.exports = router;