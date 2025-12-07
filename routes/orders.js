const router = require("express").Router();
const controller = require("../controllers/ordersController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get("/:id", controller.getOne);
router.get("/", authenticate, authorize(1), controller.getAll);

router.post("/", authenticate, authorize(1), controller.create);
router.put("/:id", authenticate, authorize(1), controller.update);
router.delete("/:id", authenticate, authorize(1), controller.remove);

module.exports = router;
