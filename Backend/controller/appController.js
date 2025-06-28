require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const Mailgen = require("mailgen");
const nodemailer = require('nodemailer')
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'ndwsd93er932rh02'
const multer = require('multer')
const Warranty = require("../models/warranty");
const cloudinary = require("../utlis/cloudinary");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Test route function
const testRoute = (req, res) => {
  res.json("test ok");
};

// Register route function
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
};

// Login route function
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      }
    );
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Profile route function
const profile = (req, res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
};

// Logout route function
const logout = (req, res) => {
  res.cookie('token','').json(true);
};

const calculateWarrantyStatus = (warrantyEndDate) => {
  // Compare only the date part to avoid timezone issues
  const currentDate = new Date();
  const endDate = new Date(warrantyEndDate);
  // Zero out the time part for both dates
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
    res.status(201).json({ message: 'Warranty Created', warranty: newWarranty });
  } catch (error) {
    console.error(error);
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
    res.json({ message: 'Warranty Updated', warranty: updatedWarranty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error Updating Warranty' });
  }
};

const deleteWarranty = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete warranty with ID:', id);
    
    const deletedWarranty = await Warranty.findByIdAndDelete(id);
    
    if (!deletedWarranty) {
      console.log('Warranty not found with ID:', id);
      return res.status(404).json({ message: 'Warranty not found' });
    }
    
    console.log('Successfully deleted warranty:', deletedWarranty._id);
    res.json({message: 'Warranty Deleted', warranty: deletedWarranty});
  } catch (error) {
    console.log('Error deleting warranty:', error);
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
    console.log('Found warranties for user:', userId, 'Count:', warranties.length);
    console.log('Warranty IDs:', warranties.map(w => w._id));
    res.json(warranties);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error Fetching Warranties'});
  }
};

const nodemailerGmail = (req, res) => {
  const { userEmail } = req.body;
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD, //Removed App Password for security reasons
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

const troubleshootIssue = async (req, res) => {
  try {
    const { issue, productName, warrantyInfo } = req.body;
    
    if (!issue || !issue.trim()) {
      return res.status(400).json({ message: 'Issue description is required' });
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not found, using fallback response');
      
      // Fallback response without AI
      const fallbackResponse = {
        diagnosis: "General Product Issue Analysis",
        warrantyStatus: warrantyInfo ? "Based on your warranty information" : "Please check your warranty terms",
        steps: [
          "Check if the product is properly connected and powered on",
          "Verify all cables and connections are secure",
          "Try restarting the device",
          "Check for any visible damage or loose parts",
          "Contact manufacturer support if the issue persists"
        ],
        repairOptions: [
          {
            type: "Warranty Service",
            description: "Contact manufacturer support for warranty-covered repairs"
          },
          {
            type: "Professional Repair",
            description: "Local repair service"
          }
        ],
        // nearbyServiceCenters: [
        //   {
        //     name: "Local Service Center",
        //     distance: "Check your area",
        //     rating: 4.0
        //   }
        // ],
        additionalNotes: "This is a fallback response. For more specific advice, please ensure the GEMINI_API_KEY is configured."
      };

      return res.json({
        success: true,
        result: fallbackResponse
      });
    }

    // Initialize Gemini AI only if API key is available
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a comprehensive prompt for the AI
    const prompt = `
You are a professional warranty and technical support specialist based in India. A customer is experiencing an issue with their product and needs troubleshooting assistance.

Customer Issue: ${issue}
${productName ? `Product: ${productName}` : ''}
${warrantyInfo ? `Warranty Information: ${warrantyInfo}` : ''}

Please provide a comprehensive troubleshooting analysis in the following JSON format:

{
  "diagnosis": "Brief diagnosis of the likely problem",
  "warrantyStatus": "Assessment of warranty coverage for this issue",
  "steps": [
    "Step 1: First troubleshooting step",
    "Step 2: Second troubleshooting step",
    "Step 3: Third troubleshooting step",
    "Step 4: Fourth troubleshooting step",
    "Step 5: Fifth troubleshooting step"
  ],
  "repairOptions": [
    {
      "type": "Warranty Service",
      "description": "Description of warranty service option"
    },
    {
      "type": "Professional Repair",
      "description": "Description of professional repair option"
    },
    {
      "type": "DIY Repair",
      "description": "Description of DIY repair option if applicable"
    }
  ],
  "additionalNotes": "Any additional important information or warnings"
}

Please ensure the response is valid JSON and provides practical, actionable advice. Focus on common issues and realistic solutions. If the issue is complex or potentially dangerous, recommend professional assistance.
`;

    console.log('Sending prompt to Gemini AI:', prompt);

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Raw AI response:', response);

    // Try to parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case AI adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response that failed to parse:', response);
      
      // Fallback response if JSON parsing fails
      parsedResponse = {
        diagnosis: "Unable to parse AI response",
        warrantyStatus: "Please contact customer support for warranty information",
        steps: [
          "Contact the manufacturer's customer support",
          "Provide detailed description of the issue",
          "Have your warranty information ready",
          "Take photos of the problem if applicable"
        ],
        repairOptions: [
          {
            type: "Contact Support",
            description: "Reach out to manufacturer support for assistance"
          }
        ],
        // nearbyServiceCenters: [],
        additionalNotes: "The AI response could not be parsed. Please try again or contact support directly."
      };
    }

    res.json({
      success: true,
      result: parsedResponse
    });

  } catch (error) {
    console.error('Troubleshoot error:', error);
    
    // Handle specific AI API errors
    if (error.message.includes('API_KEY')) {
      return res.status(500).json({ 
        success: false,
        message: 'AI service authentication error. Please contact support.' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error processing troubleshooting request',
      error: error.message 
    });
  }
};

module.exports = { 
  testRoute,
  register,
  login,
  profile,
  logout,
  nodemailerGmail,
  addWarranty,
  updateWarranty,
  deleteWarranty,
  getWarranties,
  troubleshootIssue
};
