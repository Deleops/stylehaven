const API_BASE = 'https://stylehaven-backend.onrender.com';
const API = {
  USERS_COUNT: `${API_BASE}/admin/users/count`,
  USERS_RECENT: `${API_BASE}/admin/users`,
  ORDERS_COUNT: `${API_BASE}/admin/orders/count`,
  ORDERS_RECENT: `${API_BASE}/admin/orders/recent`
};

const headers = { Authorization: `Bearer ${token}` };

document.addEventListener('DOMContentLoaded', async () => {
  if (!token) return alert('Not authorized. Please log in.');

  try {
    // 📊 Total Users
    const usersRes = await fetch(API.USERS_COUNT, { headers });
    const { total: totalUsers } = await usersRes.json();
    document.getElementById('totalUsers').textContent = totalUsers;

    // 📦 Total Orders
    const ordersRes = await fetch(API.ORDERS_COUNT, { headers });
    const { total: totalOrders } = await ordersRes.json();
    document.getElementById('totalOrders').textContent = totalOrders;

    // 👤 Recent Users
    const recentUsersRes = await fetch(API.USERS_RECENT, { headers });
    const users = await recentUsersRes.json();
    const usersTable = document.getElementById('usersTableBody');
    usersTable.innerHTML = '';
    users.forEach(u => {
      usersTable.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.isAdmin ? 'Admin' : 'User'}</td>
        </tr>
      `;
    });

    // 🧾 Recent Orders
    const recentOrdersRes = await fetch(API.ORDERS_RECENT, { headers });
    const orders = await recentOrdersRes.json();
    const ordersTable = document.getElementById('ordersTableBody');
    ordersTable.innerHTML = '';
    orders.forEach(o => {
      ordersTable.innerHTML += `
        <tr>
          <td>${o.id}</td>
          <td>${o.user}</td>
          <td>$${o.total.toFixed(2)}</td>
          <td>${o.status}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error('Dashboard load error:', err);
    alert('Error loading dashboard data.');
  }
});
