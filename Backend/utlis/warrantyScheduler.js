const Warranty = require("../models/warranty");
const User = require("../models/user");
const { sendWarrantyReminder } = require("../controller/emailController");

// Calculate the status of a warranty based on its end date
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

// Check and update warranty statuses, send reminders if needed
const checkWarrantyStatuses = async () => {
  try {
    // Find all warranties that are not expired and populate user data
    const warranties = await Warranty.find({ 
      status: { $ne: 'expired' } 
    }).populate('userId', 'email name');
    
    let updatedCount = 0;
    let emailSentCount = 0;
    let errors = [];
    
    for (const warranty of warranties) {
      try {
        const newStatus = calculateWarrantyStatus(warranty.warrantyEnd);
        // If status changed, update it
        if (newStatus !== warranty.status) {
          warranty.status = newStatus;
          await warranty.save();
          // Send email reminder if status changed to "expiring soon"
          if (newStatus === 'expiring soon' && warranty.userId && warranty.userId.email) {
            try {
              const emailResult = await sendWarrantyReminder(
                warranty.userId.email, 
                warranty.userId.name, 
                warranty
              );
              if (emailResult.success) {
                emailSentCount++;
              } else {
                errors.push(`Failed to send email for warranty: ${emailResult.error}`);
              }
            } catch (emailError) {
              errors.push(`Email error: ${emailError.message}`);
            }
          }
          updatedCount++;
        }
      } catch (warrantyError) {
        errors.push(`Processing error: ${warrantyError.message}`);
      }
    }
    return { updatedCount, emailSentCount, errors };
  } catch (error) {
    // Log only critical errors
    console.error('Error checking warranty statuses:', error);
    throw error;
  }
};

// Manually trigger status check and email reminders
const manualWarrantyCheck = async (req, res) => {
  try {
    const result = await checkWarrantyStatuses();
    res.json({ 
      message: 'Warranty status check completed successfully', 
      result 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking warranty statuses', 
      error: error.message 
    });
  }
};

// Schedule the warranty check to run daily and on startup
const scheduleWarrantyCheck = () => {
  // Run immediately when server starts (after 5 seconds)
  setTimeout(async () => {
    try {
      await checkWarrantyStatuses();
    } catch (error) {
      // Log only critical errors
      console.error('Initial warranty check failed:', error);
    }
  }, 5000);
  
  // Run every 24 hours
  if (typeof setInterval !== 'undefined') {
    setInterval(async () => {
      try {
        await checkWarrantyStatuses();
      } catch (error) {
        // Log only critical errors
        console.error('Scheduled warranty check failed:', error);
      }
    }, 24 * 60 * 60 * 1000);
  }
};

module.exports = {
  checkWarrantyStatuses,
  manualWarrantyCheck,
  scheduleWarrantyCheck
}; 