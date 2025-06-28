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
  getWarranties
};
