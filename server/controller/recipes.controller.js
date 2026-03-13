const mongoose = require("mongoose");
const { Recipe } = require("../models/recipe.model");

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getRecipeById: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createRecipe: async (req, res) => {
    try {
      const newRecipe = new Recipe(req.body);
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateRecipe: async (req, res) => {
    try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json(updatedRecipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
      if (!deletedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json({ message: "Recipe deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
