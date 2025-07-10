const router = require("express").Router();
const { upload, uploadInvoice, uploadMultiple } = require("../middleware/multer");
const multer = require("multer");

// Import controllers
const {
  testRoute,
  register,
  login,
  profile,
  logout,
  deleteAccount,
  updateProfile,
  forgotPassword,
  validateResetToken,
  resetPassword
} = require("../controller/authController");

const {
  addWarranty,
  updateWarranty,
  deleteWarranty,
  getWarranties,
  uploadInvoiceFile
} = require("../controller/warrantyController");

const {
  processDocument
} = require("../utlis/documentProcessor");

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

const { healthCheck } = require("../controller/mainController");

// Auth routes
router.get("/test", testRoute);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);
router.put("/profile", updateProfile);
// Forgot/reset password routes
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/validate", validateResetToken);
router.post("/reset-password", resetPassword);

// Email routes
router.post("/nodemailerGmail", nodemailerGmail);
router.post("/sendWarrantyReminder", sendWarrantyReminderAPI);

// Warranty routes
router.post("/addWarranty", uploadMultiple.fields([
  { name: 'image', maxCount: 1 },
  { name: 'invoice', maxCount: 1 }
]), addWarranty);
router.post("/processDocument", upload.single('document'), processDocument);
router.put("/warranty/:id", 
  (req, res, next) => {
    uploadMultiple.fields([
      { name: 'image', maxCount: 1 },
      { name: 'invoice', maxCount: 1 }
    ])(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      } else if (err) {
        console.error('Other error:', err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, 
  updateWarranty
);
router.delete("/warranty/:id", deleteWarranty);
router.get("/warranties", getWarranties);
router.post("/warranty/:id/upload-invoice", uploadInvoice.single('invoice'), uploadInvoiceFile);

// Warranty scheduler route
router.post("/checkWarrantyStatuses", manualWarrantyCheck);

// AI Troubleshooting route
router.post("/troubleshoot", troubleshootIssue);

// Account deletion route
router.delete("/account", deleteAccount);

// Health check route
router.get("/health", healthCheck);

module.exports = router;
