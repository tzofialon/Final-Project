const userService = require("../services/userService");

// USERS - ADMIN ONLY
async function getUsers(req, res) {
    if (!(await userService.isAdmin(req.query.username))) {
        return res.status(403).send("Access denied");
    }

    res.json(await userService.getAllUsers());
}

module.exports = { getUsers };
