const Recipe = require("../models/Custom");

exports.getCreatedRecipesPage = (req, res) => {
  res.render("create");
};

exports.createRecipe = async (req, res) => {
  const { title, ingredients, instructions, description, image } = req.body;
  if (title.length < 2) {
    return res
      .status(400)
      .render("create", { error: "Заглавието трябва да е поне 2 символа." });
  }
  if (description.length < 10 || description.length > 100) {
    return res.status(400).render("create", {
      error: "Описанието трябва да е между 10 и 100 символа.",
    });
  }
  if (ingredients.length < 10 || ingredients.length > 200) {
    return res.status(400).render("create", {
      error: "Съставките трябва да са между 10 и 200 символа.",
    });
  }
  if (instructions.length < 10) {
    return res.status(400).render("create", {
      error: "Инструкциите трябва да са поне 10 символа.",
    });
  }
  if (!image.startsWith("http://") && !image.startsWith("https://")) {
    return res.status(400).render("create", {
      error: "URL на снимката трябва да започва с http:// или https://.",
    });
  }

  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      description,
      image,
      owner: req.user._id,
    });
    await newRecipe.save();
    res.redirect("/recipes");
  } catch (err) {
    res.status(400).render("create", { error: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.render("catalog", { recipes });
  } catch (err) {
    res.status(500).render("catalog", { error: err.message });
  }
};

exports.getRecipeDetails = async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const recipe = await Recipe.findById(recipeId).lean();

    if (!recipe) {
      return res
        .status(404)
        .render("details", { error: "Рецептата не е намерена" });
    }
    res.render("details", { recipe });
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};
