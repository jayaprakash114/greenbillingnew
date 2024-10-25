const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a bill by ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new bill
router.post('/', async (req, res) => {
  const { customerName, contactNumber, selectedOption, selectedProducts, totalAmount, printDetails, createdAt } = req.body;
console.log(customerName)
console.log(selectedOption)
  // Basic validation
  if (!customerName || !contactNumber || !selectedOption|| !selectedProducts || !totalAmount || !printDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const bill = new Bill({
    customerName,
    contactNumber,
    selectedOption,
    selectedProducts,
    totalAmount,
    printDetails,
    createdAt: createdAt ? new Date(createdAt) : new Date(), // Use provided date or default to now
  });

  try {
    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error storing bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) return res.status(404).json({ message: 'Bill not found' });
    res.status(204).end();  // No content
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
