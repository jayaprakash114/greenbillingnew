const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  const { name, price, gstPercentage } = req.body;
  const gstAmount = (price * gstPercentage) / 100;
  const total = price + gstAmount;

  const product = new Product({
    name,
    price,
    gst: gstAmount,
    total
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, gstPercentage } = req.body;
  const gstAmount = (price * gstPercentage) / 100;
  const total = price + gstAmount;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, gst: gstAmount, total },
      { new: true }  // Return the updated document
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(204).end();  // No content
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
