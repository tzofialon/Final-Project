const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET - שליפת כל המשתמשים
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET - שליפת משתמש יחיד לפי ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// POST - יצירת/הרשמת משתמש חדש
router.post('/register', async (req, res, next) => {
  try {
    const { username, phone, email } = req.body;
    const newUser = await User.create({ username, phone, email });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    next(error);
  }
});

// POST - התחברות משתמש
router.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    next(error);
  }
});

// PUT - עדכון משתמש לפי ID
router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// DELETE - מחיקת משתמש לפי ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;










