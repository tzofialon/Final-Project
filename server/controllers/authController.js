const authService = require("../services/authService");

async function register(req, res) {
    const result = await authService.register(req.body);
    res.status(result.status).send(result.message);
}

async function login(req, res) {
    const user = await authService.login(req.body);

    if (!user) {
        return res.status(401).send("Invalid username or password");
    }

    res.json({
        message: "Login successful",
        username: user.username,
        role: user.role
    });
}

module.exports = { register, login };
