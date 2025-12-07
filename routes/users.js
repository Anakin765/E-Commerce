const router = require("express").Router();
const controller = require("../controllers/usersController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get("/", authenticate, authorize(1), controller.getAll);
router.get("/:id", authenticate, authorize(1), controller.getOne);
router.post("/", authenticate, authorize(1), controller.create);
router.put("/:id", authenticate, authorize(1), controller.update);
router.delete("/:id", authenticate, authorize(1), controller.remove);

module.exports = router;
