const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

router.post('/', async (req, res) => {
  const { customerName, contactNumber, selectedOption, selectedProducts, totalAmount, printDetails, createdAt } = req.body;
  // Basic validation
  if (!customerName || !contactNumber || !selectedOption || !selectedProducts || !totalAmount || !printDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newBill = new Bill({
      customerName,
      contactNumber,
      selectedOption,
      selectedProducts,
      totalAmount,
      printDetails,
      createdAt: createdAt ? new Date(createdAt) : undefined, // Use provided date or default to now
    });

    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    console.error('Error storing bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
