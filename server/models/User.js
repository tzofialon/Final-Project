const mongoose = require('mongoose');

//משתמש
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please enter a phone number'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter an email address'],
      unique: true,
      lowercase: true,
      trim: true
    }
  },
  {
    timestamps: true  // מוסיף אוטומטית שדות createdAt ו-updatedAt
  }
);

//יצירת המודל
const User = mongoose.model('User', userSchema);

module.exports = User;