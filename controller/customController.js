const router = require("express").Router();
const {
  guestsOnly,
  usersOnly,
  ownerOnly,
} = require("../middlewares/routeGuards");
const customService = require("../services/customService");

router.get("/catalog", customService.getAllRecipes);
router.get("/create", usersOnly, customService.getCreatedRecipesPage);
router.get("/details/:recipeId", usersOnly, customService.getRecipeDetails);
router.post("/create", customService.createRecipe);

router.get(
  "/edit/:recipeId",
  ownerOnly,

  customService.getEditRecipePage
);
router.post("/edit/:recipeId", ownerOnly, customService.editPage);

router.get("/delete/:recipeId", ownerOnly, customService.deleteRecipe);

module.exports = router;
