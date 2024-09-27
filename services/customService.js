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
exports.getRecentRecipes = async (req, res) => {
  return Recipe.find().sort({ $natural: -1 }).limit(3).lean();
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

    const isOwner = recipe.owner.equals(req.user._id);
    res.render("details", { recipe, isOwner });
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};

//loading editing page

exports.getEditRecipePage = async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const recipe = await Recipe.findById(recipeId).lean();

    if (!recipe) {
      return res.status(404).render("edit", { error: "Recipe not found" });
    }
    const isOwner = recipe.owner.equals(req.user.id);
    res.render("edit", { recipe, isOwner });
  } catch (err) {
    res.status(500).render("edit", { error: err.message });
  }
};

exports.editPage = async (req, res) => {
  const { title, ingredients, instructions, description, image } = req.body;
  const recipeId = req.params.recipeId;

  if (title.length < 2) {
    return res
      .status(400)
      .render("edit", { error: "Title length minimum 2 symbols." });
  }
  if (description.length < 10 || description.length > 100) {
    return res.status(400).render("edit", {
      error: "Описанието трябва да е между 10 и 100 символа.",
    });
  }
  if (ingredients.length < 10 || ingredients.length > 200) {
    return res.status(400).render("edit", {
      error: "Съставките трябва да са между 10 и 200 символа.",
    });
  }
  if (instructions.length < 10) {
    return res.status(400).render("edit", {
      error: "Инструкциите трябва да са поне 10 символа.",
    });
  }
  if (!image.startsWith("http://") && !image.startsWith("https://")) {
    return res.status(400).render("edit", {
      error: "URL на снимката трябва да започва с http:// или https://.",
    });
  }

  try {
    await Recipe.findByIdAndUpdate(recipeId, {
      title,
      ingredients,
      instructions,
      description,
      image,
    });
    res.redirect(`/recipes/details/${recipeId}`);
  } catch (err) {
    res.status(500).render("edit", { error: err.message });
  }
};

//Delete recipe

exports.deleteRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect("/"); // Пренасочваме към началната страница
  } catch (err) {
    res.status(500).render("details", { error: err.message });
  }
};

exports.recommendRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe.recommendList.includes(req.user._id)) {
      recipe.recommendList.push(req.user._id);
      await recipe.save();
    }
    res.redirect(`/recipes/details/${recipeId}`);
  } catch (err) {
    res.status(500).send("Server error: ", err.message);
  }
};
