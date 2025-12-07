const router = require("express").Router();
const controller = require("../controllers/authController");

router.post("/signup", controller.register);
router.post("/login", controller.login);

module.exports = router;
