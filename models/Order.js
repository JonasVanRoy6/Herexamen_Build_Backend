const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  flavors: [
    {
      name: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
  topping: { type: String, required: true },
  straw: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
    },
  },
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);