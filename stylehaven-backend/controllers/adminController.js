const User = require('../models/User');

// 📋 1. Get all users (latest 10, no password)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email isAdmin createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👥 2. Get total user count
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🛒 3. Get total order count
exports.getOrderCount = async (req, res) => {
  try {
    const users = await User.find({}, 'orders');
    const totalOrders = users.reduce((sum, user) => sum + user.orders.length, 0);
    res.json({ total: totalOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 4. Get recent orders (latest 10 from all users)
exports.getRecentOrders = async (req, res) => {
  try {
    const users = await User.find({}, 'name orders');
    const orders = [];

    users.forEach(user => {
      user.orders.forEach(order => {
        orders.push({
          id: order._id,
          user: user.name,
          total: order.totalPrice,
          createdAt: order.createdAt,
          status: order.status || 'Placed'
        });
      });
    });

    const sortedOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json(sortedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
