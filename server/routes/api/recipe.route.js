const router = require("express").Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../../controller/recipe.controller");

router.get("/recipes", getAllRecipes);
router.get("/recipes/:id", getRecipeById);
router.post("/recipes", createRecipe);
router.put("/recipes/:id", updateRecipe);
router.delete("/recipes/:id", deleteRecipe);

module.exports = router;
