const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler");
const controller = require("../controllers/authController");

router.post("/register", asyncHandler(controller.register));
router.post("/login", asyncHandler(controller.login));

module.exports = router;
