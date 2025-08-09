const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  flavors: [{ name: String, color: String }],
  topping: { type: String, default: "" }, // Sta een lege topping toe
  straw: String,
  customer: {
    name: String,
    address: {
      street: String,
      city: String,
    },
  },
  price: Number, // Voeg het prijsveld toe
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);