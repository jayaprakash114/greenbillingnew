const express = require('express');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');
const billsRouter = require('./routes/bills');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const serverApp = express();
const PORT = process.env.PORT || 5000;

// Middleware
serverApp.use(cors());
serverApp.use(bodyParser.json());
serverApp.use(helmet());
serverApp.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

serverApp.get('/', (req, res) => {
  res.send("Hi")
});

// API routes
serverApp.use('/items', productsRouter);
serverApp.use('/bills', billsRouter);
serverApp.use('/customer', customerRoutes);
serverApp.use('/login', authRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
serverApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});