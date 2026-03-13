const router = require("express").Router();
const {
  createUser,
  login,
} = require("../../controller/authentication.controller");

router.post("/register", createUser);
router.post("/login", login);

module.exports = router;
