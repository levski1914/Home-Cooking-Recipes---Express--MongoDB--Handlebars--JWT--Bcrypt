const mongoose = require("mongoose");
// const { schema } = require("./User");

const CustomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  ingredients: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200,
  },
  instructions: {
    type: String,
    required: true,
    minlength: 10,
  },
  image: {
    type: String,
    required: true,
    match: /^https?:\/\//,
  },
  recommendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", CustomSchema);

module.exports = Recipe;
