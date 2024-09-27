const { getRecentRecipes } = require("../services/customService");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const recipes = await getRecentRecipes();
  res.render("home", { recipes });
});

module.exports = router;
