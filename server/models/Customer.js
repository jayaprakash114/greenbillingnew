const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  selectedOption: {type:Number, required: true}
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
