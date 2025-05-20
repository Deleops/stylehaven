const User = require('../models/User');

// 📋 1. Get all users (latest 10)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email isAdmin')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
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

// 🛒 3. Get total order count (efficient aggregation)
exports.getOrderCount = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $project: { orderCount: { $size: "$orders" } } },
      { $group: { _id: null, total: { $sum: "$orderCount" } } }
    ]);
    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 4. Get recent orders (latest 10 from all users)
exports.getRecentOrders = async (req, res) => {
  try {
    const users = await User.find({}, 'name orders').lean();
    const orders = [];

    users.forEach(user => {
      user.orders?.forEach(order => {
        orders.push({
          id: order._id,
          user: user.name || 'Unknown',
          total: order.totalPrice || 0,
          createdAt: order.createdAt || new Date(),
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
