const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNumber: { type:String, required: true},
  selectedOption: { type: Number, required: true},
  createdAt: { type: Date, default: Date.now }, // Add createdAt field
  selectedProducts: [
    {
      name: String,
      price: Number,
      gst: Number,
      total: Number,
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  printDetails: { type: String, required: true },
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
