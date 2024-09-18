const router = require("express").Router();

const homeController = require("./controller/homeController");
const authController = require("./controller/authController");
router.use(homeController);
router.use("/auth", authController);

module.exports = router;
