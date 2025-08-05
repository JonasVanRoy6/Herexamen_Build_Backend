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
    console.log('Ontvangen data:', req.body);

    const { flavors, topping, straw, customer } = req.body;

    if (!flavors || !topping || !straw || !customer || !customer.name || !customer.address) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    const order = new Order({
      flavors,
      topping,
      straw,
      customer: {
        name: customer.name,
        address: {
          street: customer.address.street,
          city: customer.address.city,
        },
      },
      status: 'pending',
    });

    await order.save();
    res.status(201).json({ message: 'Bestelling geplaatst', order });
  } catch (error) {
    console.error('Fout bij het plaatsen van de bestelling:', error);
    res.status(500).json({ message: 'Er is een fout opgetreden', error });
  }
});

// API-endpoint om alle bestellingen op te halen
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    console.log('Bestellingen:', orders); // Controleer de data
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

// API-endpoint om een bestelling te verwijderen
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Bestelling niet gevonden' });
    }
    res.status(200).json({ message: 'Bestelling succesvol verwijderd' });
  } catch (error) {
    console.error('Fout bij het verwijderen van de bestelling:', error);
    res.status(500).json({ message: 'Er is een fout opgetreden', error });
  }
});

// Start de server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});