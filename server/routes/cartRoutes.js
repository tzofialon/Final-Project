const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler");
const controller = require("../controllers/cartController");

router.get("/:username", asyncHandler(controller.getCart));
router.put("/:username", asyncHandler(controller.saveCart));

module.exports = router;
