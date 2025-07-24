const mongoose = require('mongoose');

// Definieer een schema voor bestellingen
const orderSchema = new mongoose.Schema({
  flavors: [
    {
      name: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
  topping: { type: String, required: true },
  straw: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Exporteer het model
module.exports = mongoose.model('Order', orderSchema);