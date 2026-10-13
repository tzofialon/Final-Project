const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler");
const controller = require("../controllers/userController");

router.get("/", asyncHandler(controller.getUsers));

module.exports = router;
