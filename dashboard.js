const API = 'https://stylehaven-backend.onrender.com';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

// Load dashboard data
document.addEventListener('DOMContentLoaded', async () => {
  if (!token) return alert('Not authorized. Please log in.');

  try {
    // Fetch total users
    const usersRes = await fetch(`${API}/users/count`, { headers });
    const { total: totalUsers } = await usersRes.json();
    document.getElementById('totalUsers').textContent = totalUsers;

    // Fetch total orders
    const ordersRes = await fetch(`${API}/orders/count`, { headers });
    const { total: totalOrders } = await ordersRes.json();
    document.getElementById('totalOrders').textContent = totalOrders;

    // Fetch recent users
    const recentUsersRes = await fetch(`${API}/users`, { headers });
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

    // Fetch recent orders
    const recentOrdersRes = await fetch(`${API}/orders/recent`, { headers });
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
