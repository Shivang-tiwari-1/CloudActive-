const {
  createUser,
  login,
  refreshAcessToken,
  logout,
  getMe,
} = require("../controllers/authentication");
const authentication = require("../middleware/auth");

const router = require("express").Router();

router.post("/createuser", createUser);

router.post("/login", login);
router.post("/refreshToken", refreshAcessToken);
router.post("/logout", authentication, logout);
router.post("/getMe", authentication, getMe);

module.exports = router;
