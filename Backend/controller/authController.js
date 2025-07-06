require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'ndwsd93er932rh02';
const { z } = require('zod');
const { sendWelcomeEmail, sendProfileUpdateEmail } = require('./emailController');

// Test route function
const testRoute = (req, res) => {
  res.json("test ok");
};

// Zod schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must include at least one letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
});
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Register route function
const register = async (req, res) => {
  const { name, email, password } = req.body;
  // Zod validation
  const result = registerSchema.safeParse({ name, email, password });
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0]?.message || 'Invalid input' });
  }
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    // Send welcome email (async, don't block response)
    sendWelcomeEmail(email, name).catch(e => console.error('Welcome email error:', e));
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
};

// Login route function
const login = async (req, res) => {
  const { email, password } = req.body;
  // Zod validation
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0]?.message || 'Invalid input' });
  }
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
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        }).json(userDoc);
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

// Delete account route function
const deleteAccount = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    try {
      await User.findByIdAndDelete(userData.id);
      res.cookie('token', '').json({ message: "Account deleted" });
    } catch (e) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });
};

// Update profile route function
const updateProfile = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ success: false, message: "Unauthorized" });
    try {
      const user = await User.findById(userData.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // If changing email or password, require oldPassword and verify
      if ((email && email !== user.email) || newPassword) {
        if (!oldPassword) {
          return res.status(400).json({ success: false, message: "Current password required to change email or password" });
        }
        const passOk = bcrypt.compareSync(oldPassword, user.password);
        if (!passOk) {
          return res.status(401).json({ success: false, message: "Incorrect current password" });
        }
        // Prevent new password from being the same as old password
        if (newPassword && bcrypt.compareSync(newPassword, user.password)) {
          return res.status(400).json({ success: false, message: "New password cannot be the same as the old password" });
        }
      }

      // Update fields
      const updatedFields = {};
      if (name && name !== user.name) { user.name = name; updatedFields.name = name; }
      if (email && email !== user.email) { user.email = email; updatedFields.email = email; }
      if (newPassword) { user.password = bcrypt.hashSync(newPassword, bcryptSalt); updatedFields.password = true; }
      await user.save();
      // Send profile update email if any field changed
      if (Object.keys(updatedFields).length > 0) {
        sendProfileUpdateEmail(user.email, user.name, updatedFields).catch(e => console.error('Profile update email error:', e));
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  });
};

module.exports = { 
  testRoute,
  register,
  login,
  profile,
  logout,
  deleteAccount,
  updateProfile
}; 