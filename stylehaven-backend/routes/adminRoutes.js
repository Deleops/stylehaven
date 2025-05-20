const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  getAllUsers,
  getUserCount,
  getOrderCount,
  getRecentOrders,
  getTotalRevenue // ⬅️ Add this
} = require('../controllers/adminController');

router.get('/users', auth, isAdmin, getAllUsers);
router.get('/users/count', auth, isAdmin, getUserCount);
router.get('/orders/count', auth, isAdmin, getOrderCount);
router.get('/orders/recent', auth, isAdmin, getRecentOrders);
router.get('/revenue', auth, isAdmin, getTotalRevenue); // ⬅️ New route

module.exports = router;
