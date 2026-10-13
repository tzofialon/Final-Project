// עוטף controller אסינכרוני ומעביר שגיאות ל-errorHandler
module.exports = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
