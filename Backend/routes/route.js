const router = require("express").Router();
const upload = require("../middleware/multer")
const {
  testRoute,
  register,
  login,
  profile,
  logout,
  nodemailerGmail,
  addWarranty,
  updateWarranty,
  deleteWarranty,
  getWarranties
} = require("../controller/appController");

// Auth routes
router.get("/test", testRoute);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);

// Email route
router.post("/nodemailerGmail", nodemailerGmail);

// Warranty routes
router.post("/addWarranty", upload.single('image'), addWarranty);
router.put("/warranty/:id", upload.fields([{ name: 'photo', maxCount: 1 }]), updateWarranty);
router.delete("/warranty/:id", deleteWarranty);
router.get("/warranties", getWarranties);

module.exports = router;
