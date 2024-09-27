module.exports = {
  //Access to logged users
  usersOnly: (req, res, next) => {
    if (!req.user) {
      return res.redirect("/auth/login");
    }

    next();
  },

  //Guest access

  guestsOnly: (req, res, next) => {
    if (req.user) {
      return res.redirect("/");
    }
    next();
  },

  // Access for owner recipe
  ownerOnly: async (req, res, next) => {
    const Recipe = require("../models/Custom");

    try {
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) {
        return res.redirect("/");
      }
      //Check user is owner

      if (recipe.owner.equals(req.user._id)) {
        next();
      } else {
        return res.redirect("/");
      }
    } catch (err) {
      return res.status(500).send("Server error", err.message);
    }
  },

  notOwnerOnly: async (req, res, next) => {
    const Recipe = require("../models/Custom");

    try {
      const recipe = await Recipe.findById(req.params._id);
      if (!recipe) {
        return res.redirect("/");
      }
      if (!recipe.owner.equals(req.user._id)) {
        next();
      } else {
        return res.redirect("/");
      }
    } catch (err) {
      return res.status(500).send("Server error: ", err.message);
    }
  },
};
