const express = require('express')
const appRoute = require('./routes/route')
const app = express()
const port = 4000
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
require("dotenv").config();

// Import warranty scheduler
const { scheduleWarrantyCheck } = require('./utlis/warrantyScheduler');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "http://localhost:8080",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/', appRoute)

// Start server and initialize scheduler
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    scheduleWarrantyCheck();
})

