const conversionRates = {
  USD: 1,
  EUR: 0.90,
  INR: 80,
};

function formatPrice(price) {
  const currency = localStorage.getItem('currency') || 'USD';
  const rate = conversionRates[currency] || 1;
  const converted = price * rate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(converted);
}

const API = 'https://stylehaven-backend.onrender.com';
const headers = { Authorization: `Bearer ${token}` };

document.addEventListener('DOMContentLoaded', async () => {
  if (!token) return alert('Not authorized. Please log in.');

  try {
    // Total Users
    const usersRes = await fetch(`${API}/api/admin/users/count`, { headers });
    const { total: totalUsers } = await usersRes.json();
    document.getElementById('totalUsers').textContent = totalUsers;

    // Total Orders
    const ordersRes = await fetch(`${API}/api/admin/orders/count`, { headers });
    const { total: totalOrders } = await ordersRes.json();
    document.getElementById('totalOrders').textContent = totalOrders;

    // Total Revenue (NEW)
    const revenueRes = await fetch(`${API}/api/admin/revenue`, { headers });
    const { total: totalRevenue } = await revenueRes.json();
    document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);

    // Recent Users
    const recentUsersRes = await fetch(`${API}/api/admin/users`, { headers });
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

    // Recent Orders
    const recentOrdersRes = await fetch(`${API}/api/admin/orders/recent`, { headers });
    const orders = await recentOrdersRes.json();
    const ordersTable = document.getElementById('ordersTableBody');
    ordersTable.innerHTML = '';
    orders.forEach(o => {
      ordersTable.innerHTML += `
        <tr>
          <td>${o.id}</td>
          <td>${o.user}</td>
          <td>${formatPrice(o.total)}</td>
          <td>${o.status}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error('Dashboard load error:', err);
    alert('Error loading dashboard data.');
  }
});
