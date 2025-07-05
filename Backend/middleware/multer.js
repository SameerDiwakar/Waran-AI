const multer = require('multer');

// Storage for product images
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Storage and filter for invoice files (PDF/image)
const invoiceStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadInvoice = multer({
  storage: invoiceStorage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed for invoice upload'));
    }
  }
});

// Storage for multiple files (image and invoice)
const multiStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadMultiple = multer({
  storage: multiStorage,
  fileFilter: function (req, file, cb) {
    // Allow images for product images
    if (file.fieldname === 'image') {
      const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for product images'));
      }
    }
    // Allow PDF and images for invoices
    else if (file.fieldname === 'invoice') {
      const allowedInvoiceTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];
      if (allowedInvoiceTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and image files are allowed for invoice upload'));
      }
    }
    // Reject other field names
    else {
      cb(new Error('Invalid field name'));
    }
  }
});

module.exports = {
  upload,
  uploadInvoice,
  uploadMultiple
};