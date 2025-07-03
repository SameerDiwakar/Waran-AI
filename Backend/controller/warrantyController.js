require('dotenv').config();
const Warranty = require("../models/warranty");
const User = require("../models/user");
const cloudinary = require("../utlis/cloudinary");
const { sendWarrantyReminder } = require("./emailController");

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
    const { productName, brand, purchaseDate, warrantyEnd, category, invoice, userId } = req.body;

    if (!productName || !purchaseDate || !warrantyEnd || !category || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate purchaseDate is not after warrantyEnd
    if (new Date(purchaseDate) > new Date(warrantyEnd)) {
      return res.status(400).json({ message: 'Purchase date cannot be after warranty end date' });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'warranty_images',
      });
      imageUrl = result.secure_url;
    }

    const status = calculateWarrantyStatus(warrantyEnd);

    const newWarranty = new Warranty({
      productName,
      brand: brand || '',
      purchaseDate,
      warrantyEnd,
      status,
      category,
      image: imageUrl,
      invoice: invoice || '',
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
    const { productName, brand, purchaseDate, warrantyEnd, category, invoice, userId } = req.body;
    if (!productName || !purchaseDate || !warrantyEnd || !category || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate purchaseDate is not after warrantyEnd
    if (new Date(purchaseDate) > new Date(warrantyEnd)) {
      return res.status(400).json({ message: 'Purchase date cannot be after warranty end date' });
    }
    
    // Get the current warranty to check if status is changing
    const currentWarranty = await Warranty.findById(id);
    const previousStatus = currentWarranty ? currentWarranty.status : null;
    
    let imageUrl = undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'warranty_images',
      });
      imageUrl = result.secure_url;
    }
    const status = calculateWarrantyStatus(warrantyEnd);
    const updateData = {
      productName,
      brand: brand || '',
      purchaseDate,
      warrantyEnd,
      status,
      category,
      invoice: invoice || '',
      userId,
    };
    if (imageUrl) {
      updateData.image = imageUrl;
    }
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
      }
    }

    res.json({ message: 'Warranty Updated', warranty: updatedWarranty });
  } catch (error) {
    // Only log errors
    console.error('Error Updating Warranty:', error);
    res.status(500).json({ message: 'Error Updating Warranty' });
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

module.exports = {
  addWarranty,
  updateWarranty,
  deleteWarranty,
  getWarranties
}; 