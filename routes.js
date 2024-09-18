const router = require("express").Router();

const homeController = require("./controller/homeController");
const authController = require("./controller/authController");
const recipeController = require("./controller/customController");

// router.get("");
router.use(homeController);
router.use("/auth", authController);

router.use("/recipes", recipeController);
module.exports = router;
