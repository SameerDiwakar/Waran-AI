require('dotenv').config();
const Warranty = require("../models/warranty");
const User = require("../models/user");
const cloudinary = require("../utlis/cloudinary");
const { sendWarrantyReminder } = require("./emailController");
const fs = require('fs');
const documentProcessor = require("../utlis/documentProcessor");

const calculateWarrantyStatus = (warrantyEndDate) => {
  const currentDate = new Date();
  const endDate = new Date(warrantyEndDate);
  currentDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const daysDifference = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

  if (daysDifference < 0) {
    return 'expired';
  } else if (daysDifference <= 5) {
    return 'expiring soon';
  } else {
    return 'active';
  }
};

const addWarranty = async (req, res) => {
  try {
    // Accept both JSON and multipart/form-data
    let data = req.body;
    let imageUrl = null;
    let invoiceUrl = null;

    // If multipart/form-data, req.file or req.files may be present
    // Handle product image upload (if present)
    if (req.file && req.file.fieldname === 'image') {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'warranty_images',
      });
      imageUrl = result.secure_url;
    }
    // If using upload.fields or uploadMultiple
    if (req.files && req.files['image'] && req.files['image'][0]) {
      const result = await cloudinary.uploader.upload(req.files['image'][0].path, {
        resource_type: 'image',
        folder: 'warranty_images',
      });
      imageUrl = result.secure_url;
    }

    // Handle invoice - either from file upload or from OCR processing
    if (req.files && req.files['invoice'] && req.files['invoice'][0]) {
      const file = req.files['invoice'][0];
      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: 'warranty_invoices',
      });
      invoiceUrl = result.secure_url;
    } else if (req.file && req.file.fieldname === 'invoice') {
      // If only invoice is uploaded (single mode)
      const file = req.file;
      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: 'warranty_invoices',
      });
      invoiceUrl = result.secure_url;
    } else if (data.invoice) {
      // Invoice URL from OCR processing
      invoiceUrl = data.invoice;
    }

    const { productName, brand, purchaseDate, warrantyEnd, category, userId } = data;

    if (!productName || !purchaseDate || !warrantyEnd || !category || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate purchaseDate is not after warrantyEnd
    if (new Date(purchaseDate) > new Date(warrantyEnd)) {
      return res.status(400).json({ message: 'Purchase date cannot be after warranty end date' });
    }

    const status = calculateWarrantyStatus(warrantyEnd);

    const newWarranty = new Warranty({
      productName,
      brand: brand || '',
      purchaseDate,
      warrantyEnd,
      status,
      category,
      image: imageUrl, // Store product image URL
      invoice: invoiceUrl || '',
      userId,
    });

    await newWarranty.save();

    // Send email reminder if warranty is expiring soon
    if (status === 'expiring soon') {
      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          const emailResult = await sendWarrantyReminder(user.email, user.name, newWarranty);
        }
      } catch (emailError) {
        // Don't fail the warranty creation if email fails
      }
    }

    res.status(201).json({ message: 'Warranty Created', warranty: newWarranty });
  } catch (error) {
    // Only log errors
    console.error('Error in addWarranty:', error);
    res.status(500).json({ message: 'Error Creating Warranty' });
  }
};

const updateWarranty = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, brand, purchaseDate, warrantyEnd, category, userId } = req.body;
    
    // console.log('Update warranty request:', { id, productName, brand, purchaseDate, warrantyEnd, category, userId });
    // console.log('Files received:', req.files);
    
    if (!productName || !purchaseDate || !warrantyEnd || !category || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate purchaseDate is not after warrantyEnd
    if (new Date(purchaseDate) > new Date(warrantyEnd)) {
      return res.status(400).json({ message: 'Purchase date cannot be after warranty end date' });
    }
    
    // Get the current warranty to check if status is changing
    const currentWarranty = await Warranty.findById(id);
    if (!currentWarranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    const previousStatus = currentWarranty.status;
    
    let imageUrl = undefined;
    let invoiceUrl = undefined;

    // Handle product image upload (if present)
    if (req.files && req.files['image'] && req.files['image'][0]) {
      // console.log('Processing image upload...');
      try {
        const result = await cloudinary.uploader.upload(req.files['image'][0].path, {
          resource_type: 'image',
          folder: 'warranty_images',
        });
        imageUrl = result.secure_url;
        // console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
      }
    }

    // Handle invoice file upload (if present)
    if (req.files && req.files['invoice'] && req.files['invoice'][0]) {
      // console.log('Processing invoice upload...');
      try {
        const file = req.files['invoice'][0];
        /*
        console.log('Invoice file details:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
        */
        
        // Check if file exists
        if (!fs.existsSync(file.path)) {
          console.error('File does not exist at path:', file.path);
          return res.status(500).json({ message: 'Uploaded file not found' });
        }
        
        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
        // console.log('Invoice file type:', file.mimetype, 'Resource type:', resourceType);
        
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: resourceType,
          folder: 'warranty_invoices',
        });
        invoiceUrl = result.secure_url;
        // console.log('Invoice uploaded successfully:', invoiceUrl);
      } catch (uploadError) {
        console.error('Error uploading invoice:', uploadError);
        console.error('Upload error details:', {
          message: uploadError.message,
          stack: uploadError.stack
        });
        return res.status(500).json({ message: 'Error uploading invoice', error: uploadError.message });
      }
    }

    const status = calculateWarrantyStatus(warrantyEnd);
    const updateData = {
      productName,
      brand: brand || '',
      purchaseDate,
      warrantyEnd,
      status,
      category,
      userId,
    };
    
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    
    if (invoiceUrl) {
      updateData.invoice = invoiceUrl;
    }
    
    // console.log('Updating warranty with data:', updateData);
    
    const updatedWarranty = await Warranty.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedWarranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }

    // Send email reminder if status changed to "expiring soon"
    if (status === 'expiring soon' && previousStatus !== 'expiring soon') {
      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          await sendWarrantyReminder(user.email, user.name, updatedWarranty);
        }
      } catch (emailError) {
        // Don't fail the warranty update if email fails
        console.error('Email reminder error:', emailError);
      }
    }

    // console.log('Warranty updated successfully');
    res.json({ message: 'Warranty Updated', warranty: updatedWarranty });
  } catch (error) {
    // Log detailed error information
    console.error('Error Updating Warranty:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error Updating Warranty', error: error.message });
  }
};

const deleteWarranty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedWarranty = await Warranty.findByIdAndDelete(id);
    
    if (!deletedWarranty) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    res.json({message: 'Warranty Deleted', warranty: deletedWarranty});
  } catch (error) {
    // Only log errors
    console.error('Error Deleting Warranty:', error);
    res.status(500).json({message: 'Error Deleting Warranty'});
  }
};

const getWarranties = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const warranties = await Warranty.find({ userId }).sort({ createdAt: -1 });
    res.json(warranties);
  } catch (error) {
    // Only log errors
    console.error('Error Fetching Warranties:', error);
    res.status(500).json({message: 'Error Fetching Warranties'});
  }
};

// Upload invoice file for a warranty
const uploadInvoiceFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No invoice file uploaded" });
    }
    const file = req.file;
    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
      folder: 'warranty_invoices',
    });
    const updatedWarranty = await Warranty.findByIdAndUpdate(
      id,
      { invoice: result.secure_url },
      { new: true }
    );
    if (!updatedWarranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }
    res.json({ message: "Invoice uploaded", warranty: updatedWarranty });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    res.status(500).json({ message: "Error uploading invoice" });
  }
};

module.exports = {
  addWarranty,
  updateWarranty,
  deleteWarranty,
  getWarranties,
  uploadInvoiceFile,
}; 