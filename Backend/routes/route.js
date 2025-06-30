const router = require("express").Router();
const upload = require("../middleware/multer");

// Import controllers
const {
  testRoute,
  register,
  login,
  profile,
  logout
} = require("../controller/authController");

const {
  addWarranty,
  updateWarranty,
  deleteWarranty,
  getWarranties
} = require("../controller/warrantyController");

const {
  troubleshootIssue
} = require("../controller/troubleshootController");

const {
  nodemailerGmail,
  sendWarrantyReminder,
  sendWarrantyReminderAPI
} = require("../controller/emailController");

const {
  manualWarrantyCheck
} = require("../utlis/warrantyScheduler");

// Auth routes
router.get("/test", testRoute);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);

// Email routes
router.post("/nodemailerGmail", nodemailerGmail);
router.post("/sendWarrantyReminder", sendWarrantyReminderAPI);

// Warranty routes
router.post("/addWarranty", upload.single('image'), addWarranty);
router.put("/warranty/:id", upload.single('image'), updateWarranty);
router.delete("/warranty/:id", deleteWarranty);
router.get("/warranties", getWarranties);

// Warranty scheduler route
router.post("/checkWarrantyStatuses", manualWarrantyCheck);

// AI Troubleshooting route
router.post("/troubleshoot", troubleshootIssue);

module.exports = router;
