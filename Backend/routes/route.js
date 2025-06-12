const router = require("express").Router();
const {
  testRoute,
  register,
  login,
  profile,
  logout,
  nodemailerGmail,
} = require("../controller/appController");

// Auth routes
router.get("/test", testRoute);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);

// Email route
router.post("/nodemailerGmail", nodemailerGmail);

module.exports = router;
