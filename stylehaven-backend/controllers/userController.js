const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1) Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2) Update profile (name, email, password) - with current password verification
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, currentPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Require current password to update
    if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3) Get saved addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedAddresses');
    res.json(user.savedAddresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4) Add address
exports.addAddress = async (req, res) => {
  try {
    const { addressLine, city, zip } = req.body;
    const user = await User.findById(req.user.id);
    const newAddress = { _id: new mongoose.Types.ObjectId(), addressLine, city, zip };
    user.savedAddresses.push(newAddress);
    await user.save();
    res.json({ message: 'Address added', address: newAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5) Remove address
exports.removeAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the id exists and is valid
    if (!req.params.id) return res.status(400).json({ message: 'Address ID is required' });

    // Ensure both are ObjectId and compare as strings for proper matching
    const addressId = req.params.id;
    const index = user.savedAddresses.findIndex(address => address._id.toString() === addressId);

    if (index === -1) return res.status(404).json({ message: 'Address not found' });

    // Remove the address at the found index
    user.savedAddresses.splice(index, 1);

    await user.save();
    res.json({ message: 'Address removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6) Get saved cards
exports.getCards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedCards');
    res.json(user.savedCards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7) Add card
exports.addCard = async (req, res) => {
  try {
    const { cardNumber, expiry, cvv } = req.body;
    const user = await User.findById(req.user.id);
    const newCard = { _id: new mongoose.Types.ObjectId(), cardNumber, expiry, cvv };
    user.savedCards.push(newCard);
    await user.save();
    res.json({ message: 'Card added', card: newCard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8) Remove card
exports.removeCard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the id exists and is valid
    if (!req.params.id) return res.status(400).json({ message: 'Card ID is required' });

    // Ensure both are ObjectId and compare as strings for proper matching
    const cardId = req.params.id;
    const index = user.savedCards.findIndex(card => card._id.toString() === cardId);

    if (index === -1) return res.status(404).json({ message: 'Card not found' });

    // Remove the card at the found index
    user.savedCards.splice(index, 1);

    await user.save();
    res.json({ message: 'Card removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Save new order
exports.placeOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { items, totalPrice, shippingAddress, paymentCard } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = {
      items,
      totalPrice,
      shippingAddress,
      paymentCard,
      createdAt: new Date()
    };

    user.orders.push(order);
    await user.save();
    res.json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('orders');
    res.json(user.orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.orders = user.orders.filter(order => order._id.toString() !== req.params.orderId);
    await user.save();

    res.json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
