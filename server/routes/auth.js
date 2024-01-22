const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  forgot_password,
  verifyOtp,
  changePassword,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.post("/forgot_password", forgot_password);
router.post("/verifyOtp", verifyOtp);
router.post("/changePassword", changePassword);
router.get("/logout/:id", logOut);

module.exports = router;
