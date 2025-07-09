// Main Controller - This file can serve as an index or contain any remaining functions
// All functionality has been separated into specific controllers:
// - authController.js: Authentication related functions
// - warrantyController.js: Warranty management functions  
// - troubleshootController.js: AI troubleshooting functions
// - emailController.js: Email related functions

// If you need to add any general or utility functions, they can go here

const healthCheck = (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
};

module.exports = {
  // Add any remaining functions here if needed
  healthCheck,
}; 