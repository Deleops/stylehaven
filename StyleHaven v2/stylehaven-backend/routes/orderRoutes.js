const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Place order
router.post('/create', async (req, res) => {
  const { userId, items, totalAmount, address } = req.body;
  try {
    const order = new Order({ user: userId, items, totalAmount, address });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's orders
router.get('/user/:id', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
