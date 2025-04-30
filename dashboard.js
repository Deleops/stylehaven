document.addEventListener("DOMContentLoaded", async () => {
    const usersRes = await fetch("/api/admin/users");
    const ordersRes = await fetch("/api/admin/orders");
  
    const users = await usersRes.json();
    const orders = await ordersRes.json();
  
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalOrders").textContent = orders.length;
  
    const usersTableBody = document.getElementById("usersTableBody");
    const ordersTableBody = document.getElementById("ordersTableBody");
  
    users.slice(0,5).forEach(user => {
      usersTableBody.innerHTML += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.isAdmin ? "Admin" : "Customer"}</td>
        </tr>
      `;
    });
  
    orders.slice(0,5).forEach(order => {
      ordersTableBody.innerHTML += `
        <tr>
          <td>${order._id}</td>
          <td>${order.userName}</td>
          <td>$${order.total.toFixed(2)}</td>
          <td>${order.status}</td>
        </tr>
      `;
    });
  });
  