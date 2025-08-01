const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  flavors: [
    {
      name: String,
      color: String,
    },
  ],
  topping: String,
  straw: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }, // Voeg een statusveld toe
});

module.exports = mongoose.model('Order', orderSchema);