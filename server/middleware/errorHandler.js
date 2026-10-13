// ERROR HANDLER // טיפול מרוכז בשגיאות שרת
module.exports = (error, req, res, next) => {
    console.error(`Error in ${req.method} ${req.originalUrl}:`, error);
    res.status(500).send("Internal server error");
};
