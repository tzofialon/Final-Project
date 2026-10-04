const express = require('express');
require('dotenv').config(); // טעינה מהקובץ .env
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

//חיבור למסד הנתונים
connectDB();
c
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ייבוא וחיבור הנתיבים (Routes)
 const userRoutes = require('./routes/userRoutes');
 const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// נתיב ראשי לבדיקה
app.get('/', (req, res) => {
  res.send('השרת פעיל ועובד!');
});

// טיפול בשגיאות
app.use((req, res, next) => {
  res.status(404).json({ error: 'הנתיב המבוקש לא נמצא' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'תרחשה שגיאה פנימית בשרת' });
});

// הפעלת שרת
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});