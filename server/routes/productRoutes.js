const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler");
const controller = require("../controllers/productController");

router.get("/", asyncHandler(controller.getProducts));
router.get("/most-expensive-by-category", asyncHandler(controller.getMostExpensiveByCategory));
router.get("/stats", asyncHandler(controller.getStats));
router.put("/:productId", asyncHandler(controller.updateProduct));
router.delete("/:productId", asyncHandler(controller.deleteProduct));

module.exports = router;
