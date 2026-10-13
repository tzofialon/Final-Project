const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler");
const controller = require("../controllers/orderController");

router.post("/", asyncHandler(controller.createOrder));
router.get("/", asyncHandler(controller.getOrders));

module.exports = router;
