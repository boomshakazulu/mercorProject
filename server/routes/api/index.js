const router = require("express").Router();
const authenticationRoutes = require("./authentication.route");
const userRoutes = require("./user.route");
const recipeRoutes = require("./recipe.routes");
const favoritesRoutes = require("./favorites.route");

router.use("/auth", authenticationRoutes);
router.use("/users", userRoutes);
router.use("/recipes", recipeRoutes);
router.use("/favorites", favoritesRoutes);

module.exports = router;
