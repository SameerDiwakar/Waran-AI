require('dotenv').config();
const Mailgen = require("mailgen");
const nodemailer = require('nodemailer');

const nodemailerGmail = (req, res) => {
  const { userEmail } = req.body;
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD, //Removed App Password for security reasons
    },
  };
  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      name: "John Doe",
      intro: "Your invoice is ready to be downloaded.",
      table: {
        data: [
          {
            Field: "EmailJS",
            Value: "EmailJS service",
            price: "$10.00",
          },
          {
            Field: "Mailgen",
            Value: "Mailgen service",
            price: "$20.00",
          },
        ],
      },
      outro: "Looking forward to doing more business with you!",
    },
  };
  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Invoice",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "Email sent successfully!",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json("Error sending email!" + error);
    });
};

// New function for warranty expiration reminders
const sendWarrantyReminder = async (userEmail, userName, warrantyData) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    };
    
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "WaranAI",
        link: "https://waranai.com/",
      },
    });

    // Format dates for better readability
    const purchaseDate = new Date(warrantyData.purchaseDate).toLocaleDateString();
    const warrantyEndDate = new Date(warrantyData.warrantyEnd).toLocaleDateString();
    
    let response = {
      body: {
        name: userName || "Valued Customer",
        intro: "Your warranty is expiring soon!",
        action: {
          instructions: "Please take action to renew or extend your warranty before it expires.",
          button: {
            color: "#22BC66",
            text: "View Warranty Details",
            link: "https://warrantai.com/dashboard"
          }
        },
        table: {
          data: [
            {
              Field: "Product",
              Value: warrantyData.productName,
            },
            {
              Field: "Brand",
              Value: warrantyData.brand || "N/A",
            },
            {
              Field: "Purchase Date",
              Value: purchaseDate,
            },
            {
              Field: "Warranty End Date",
              Value: warrantyEndDate,
            },
            {
              Field: "Category",
              Value: warrantyData.category,
            },
          ],
        },
        outro: "Don't let your warranty expire! Contact the manufacturer or retailer to extend your coverage.",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `⚠️ Warranty Expiring Soon: ${warrantyData.productName}`,
      html: mail,
    };

    const info = await transporter.sendMail(message);
    // console.log('Warranty reminder email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending warranty reminder email:', error);
    return { success: false, error: error.message };
  }
};

// Controller function to handle the API endpoint
const sendWarrantyReminderAPI = async (req, res) => {
  try {
    const { userEmail, userName, warrantyData } = req.body;
    
    if (!userEmail || !warrantyData) {
      return res.status(400).json({ message: 'User email and warranty data are required' });
    }
    
    const result = await sendWarrantyReminder(userEmail, userName, warrantyData);
    
    if (result.success) {
      res.status(200).json({ message: 'Warranty reminder email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ message: 'Failed to send warranty reminder email', error: result.error });
    }
  } catch (error) {
    console.error('Error in warranty reminder API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Welcome email function for new users
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    };
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "WaranAI",
        link: "https://waranai.com/",
      },
    });
    let response = {
      body: {
        name: userName || "Valued Customer",
        intro: "Welcome to WaranAI! 🎉",
        action: {
          instructions: "We're excited to have you on board. Get started by uploading your first warranty document.",
          button: {
            color: "#22BC66",
            text: "Go to Dashboard",
            link: "https://waranai.com/dashboard",
          },
        },
        table: {
          data: [
            { Feature: "Document Upload", Description: "Upload warranty documents and invoices" },
            { Feature: "AI Processing", Description: "Automatically extract warranty information" },
            { Feature: "Smart Reminders", Description: "Get notified before warranties expire" },
            { Feature: "Easy Management", Description: "Organize and track all your warranties" },
          ],
        },
        outro: "If you have any questions, feel free to reach out to our support team. Happy warranty managing!",
      },
    };
    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `Welcome to WaranAI, ${userName}! 🎉`,
      html: mail,
    };
    const info = await transporter.sendMail(message);
    // console.log("Welcome email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

// Profile update confirmation email function
const sendProfileUpdateEmail = async (userEmail, userName, updatedFields) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    };
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "WaranAI",
        link: "https://waranai.com/",
      },
    });
    // Create a list of updated fields for the email
    const updatedFieldsList = Object.keys(updatedFields).map(field => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return `• ${fieldName}`;
    }).join('<br>');
    let response = {
      body: {
        name: userName || "Valued Customer",
        intro: "Your profile has been updated successfully! ✅",
        action: {
          instructions: "Your account information has been modified. Here's what was updated:",
          button: {
            color: "#22BC66",
            text: "View Profile",
            link: "https://waranai.com/settings",
          },
        },
        table: {
          data: [
            { "Updated Fields": "Changes Made", Details: updatedFieldsList || "Profile information updated" },
          ],
        },
        outro: "If you didn't make these changes, please contact our support team immediately. Your account security is important to us!",
      },
    };
    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `Profile Updated - WaranAI`,
      html: mail,
    };
    const info = await transporter.sendMail(message);
    // console.log("Profile update email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending profile update email:", error);
    return { success: false, error: error.message };
  }
};

// Account deletion confirmation email function
const sendAccountDeletionEmail = async (userEmail, userName) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    };
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "WaranAI",
        link: "https://waranai.com/",
      },
    });
    let response = {
      body: {
        name: userName || "Valued Customer",
        intro: "Your WaranAI account has been deleted.",
        action: {
          instructions: "We're sorry to see you go. If this was a mistake or you have feedback, please let us know.",
          button: {
            color: "#22BC66",
            text: "Contact Support",
            link: "https://waranai.com/contact",
          },
        },
        outro: "Thank you for using WaranAI. If you change your mind, you're always welcome back!",
      },
    };
    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `Account Deleted - WaranAI`,
      html: mail,
    };
    const info = await transporter.sendMail(message);
    // console.log("Account deletion email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending account deletion email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { 
  nodemailerGmail,
  sendWelcomeEmail,
  sendProfileUpdateEmail,
  sendWarrantyReminder,
  sendWarrantyReminderAPI,
  sendAccountDeletionEmail
}; 