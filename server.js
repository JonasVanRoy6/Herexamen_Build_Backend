const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Order = require('./models/Order'); // Importeer het Order-model


// Maak een Express-app
const app = express();
app.use(cors());
app.use(express.json()); // Zorg ervoor dat je JSON-gegevens kunt verwerken

// Verbind met MongoDB
mongoose.connect('mongodb://localhost:27017/icecream_orders');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB-verbinding mislukt:'));
db.once('open', () => {
  console.log('Verbonden met MongoDB');
});

// API-endpoint om een bestelling te plaatsen
app.post('/api/orders', async (req, res) => {
  try {
    const { flavors, topping, straw } = req.body;

    // Controleer of de flavors-array correct is
    console.log('Ontvangen flavors:', flavors);

    const order = new Order({ flavors, topping, straw });
    await order.save();
    res.status(201).json({ message: 'Bestelling geplaatst', order });
  } catch (error) {
    console.error('Fout bij het plaatsen van de bestelling:', error);
    res.status(500).json({ message: 'Fout bij het plaatsen van de bestelling', error });
  }
});

// API-endpoint om alle bestellingen op te halen
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij het ophalen van de bestellingen', error });
  }
});

// API-endpoint om een order als verzonden te markeren
app.post('/api/orders/markAsShipped', async (req, res) => {
  const { orderId } = req.body;

  try {
    // Zoek de order en update de status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order niet gevonden' });
    }

    order.status = 'shipped'; // Update de status naar "shipped"
    await order.save();

    res.status(200).json({ message: 'Order gemarkeerd als verzonden', order });
  } catch (error) {
    console.error('Fout bij het markeren als verzonden:', error);
    res.status(500).json({ message: 'Er is een fout opgetreden', error });
  }
});

// API-endpoint om een order als geannuleerd te markeren
app.post('/api/orders/markAsCancelled', async (req, res) => {
  const { orderId } = req.body;

  try {
    // Zoek de order en update de status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order niet gevonden' });
    }

    order.status = 'cancelled'; // Update de status naar "cancelled"
    await order.save();

    res.status(200).json({ message: 'Order gemarkeerd als geannuleerd', order });
  } catch (error) {
    console.error('Fout bij het markeren als geannuleerd:', error);
    res.status(500).json({ message: 'Er is een fout opgetreden', error });
  }
});

// API-endpoint om een orderstatus bij te werken
app.post('/api/orders/updateStatus', async (req, res) => {
  const { orderId, status } = req.body;

  try {
    // Zoek de order en update de status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order niet gevonden' });
    }

    order.status = status; // Update de status naar "shipped" of "cancelled"
    await order.save();

    res.status(200).json({ message: `Order gemarkeerd als ${status}`, order });
  } catch (error) {
    console.error('Fout bij het bijwerken van de status:', error);
    res.status(500).json({ message: 'Er is een fout opgetreden', error });
  }
});

// Start de server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});