const router = require("express").Router();
const customService = require("../services/customService");

router.get("/", customService.getAllRecipes);
router.get("/:recipeId", customService.getRecipeDetails);
router.get("/create", customService.getCreatedRecipesPage);
router.post("/create", customService.createRecipe);

module.exports = router;
