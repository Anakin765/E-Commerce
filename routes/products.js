const router = require("express").Router();
const controller = require("../controllers/productsController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Public
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Admin 
router.post("/", authenticate, authorize(1), controller.create);
router.put("/:id", authenticate, authorize(1), controller.update);
router.delete("/:id", authenticate, authorize(1), controller.remove);

module.exports = router;
