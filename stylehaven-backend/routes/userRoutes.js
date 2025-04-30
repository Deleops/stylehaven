const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  removeAddress,
  getCards,
  addCard,
  removeCard,
  getOrders,
  placeOrder,
  cancelOrder  
} = require('../controllers/userController');

router.use(auth);

// Profile
router.get('/me', getProfile);
router.put('/me', updateProfile);

// Addresses
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', removeAddress);

// Cards
router.get('/cards', getCards);
router.post('/cards', addCard);
router.delete('/cards/:id', removeCard);

// Orders
router.get('/orders', getOrders);
router.post('/orders', placeOrder);
router.delete('/orders/:orderId', cancelOrder); 

module.exports = router;
