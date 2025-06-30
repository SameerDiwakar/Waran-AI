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
            item: "EmailJS",
            description: "EmailJS service",
            price: "$10.00",
          },
          {
            item: "Mailgen",
            description: "Mailgen service",
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
        name: "WarrantAI",
        link: "https://warrantai.com/",
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
              item: "Product",
              description: warrantyData.productName,
            },
            {
              item: "Brand",
              description: warrantyData.brand || "N/A",
            },
            {
              item: "Purchase Date",
              description: purchaseDate,
            },
            {
              item: "Warranty End Date",
              description: warrantyEndDate,
            },
            {
              item: "Category",
              description: warrantyData.category,
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
    console.log('Warranty reminder email sent successfully:', info.messageId);
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

module.exports = { 
  nodemailerGmail,
  sendWarrantyReminder,
  sendWarrantyReminderAPI
}; 