// Helper function for authenticated requests
const API = 'https://stylehaven-backend.onrender.com';
const fetchJSON = (path, opts = {}) => {
  opts.headers = {
    'Content-Type': 'application/json',
    ...(localStorage.token && { Authorization: `Bearer ${localStorage.token}` }),
    ...opts.headers
  };
  return fetch(`${API}${path}`, opts).then(r => r.json());
};

// Spinner control
const showSpinner = () => document.getElementById('spinner').classList.remove('hidden');
const hideSpinner = () => document.getElementById('spinner').classList.add('hidden');

// Toast Notification
function showToast(message, success = true) {
  const toast = document.createElement('div');
  toast.className = `toast ${success ? '' : 'error'}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 2000);
}

// Load user profile
async function loadProfile() {
  showSpinner();
  try {
    const res = await fetchJSON('/api/user/me');
    document.getElementById('name').value = res.name;
    document.getElementById('email').value = res.email;
  } catch (error) {
    console.error('Error loading profile:', error);
  } finally {
    hideSpinner();
  }
}

// Update profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const updates = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    currentPassword: document.getElementById('currentPassword').value
  };
  showSpinner();
  try {
    const res = await fetchJSON('/api/user/me', { method: 'PUT', body: JSON.stringify(updates) });
    showToast(res.message || 'Profile updated');
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('Error updating profile', false);
  } finally {
    hideSpinner();
  }
});

// Load saved addresses
async function loadAddresses() {
  showSpinner();
  try {
    const res = await fetch(`${API}/api/user/addresses`, {
      headers: { Authorization: `Bearer ${localStorage.token}` }
    });
    const addresses = await res.json();
    const addressList = document.getElementById('addressList');
    addressList.innerHTML = '';
    addresses.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${a.addressLine}, ${a.city} - ${a.zip}
        <button onclick="deleteAddress('${a._id}')" class="small-btn remove-btn">Remove</button>
      `;
      addressList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading addresses:', error);
  } finally {
    hideSpinner();
  }
}

// Remove address
async function deleteAddress(id) {
  if (confirm('Are you sure you want to delete this address?')) {
    showSpinner();
    try {
      await fetch(`${API}/api/user/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.token}` }
      });
      await loadAddresses();
      showToast('Address deleted');
    } catch (error) {
      console.error('Error deleting address:', error);
      showToast('Error deleting address', false);
    } finally {
      hideSpinner();
    }
  }
}

// Load saved cards
async function loadCards() {
  showSpinner();
  try {
    const res = await fetch(`${API}/api/user/cards`, {
      headers: { Authorization: `Bearer ${localStorage.token}` }
    });
    const cards = await res.json();
    const cardList = document.getElementById('cardList');
    cardList.innerHTML = '';
    cards.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `
        **** **** **** ${c.cardNumber.slice(-4)} (Exp ${c.expiry})
        <button onclick="deleteCard('${c._id}')" class="small-btn remove-btn">Remove</button>
      `;
      cardList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading cards:', error);
  } finally {
    hideSpinner();
  }
}

// Remove card
async function deleteCard(id) {
  if (confirm('Are you sure you want to delete this card?')) {
    showSpinner();
    try {
      await fetch(`${API}/api/user/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.token}` }
      });
      await loadCards();
      showToast('Card deleted');
    } catch (error) {
      console.error('Error deleting card:', error);
      showToast('Error deleting card', false);
    } finally {
      hideSpinner();
    }
  }
}

// Address form handlers
document.getElementById('addAddressBtn').onclick = () => {
  document.getElementById('addressForm').classList.remove('hidden');
};
document.getElementById('cancelAddressBtn').onclick = () => {
  document.getElementById('addressForm').classList.add('hidden');
};
document.getElementById('addressForm').addEventListener('submit', async e => {
  e.preventDefault();
  showSpinner();
  try {
    await fetch(`${API}/api/user/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        addressLine: document.getElementById('addressLine').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value
      })
    });
    e.target.reset();
    e.target.classList.add('hidden');
    await loadAddresses();
    showToast('Address added');
  } catch (error) {
    console.error('Error adding address:', error);
    showToast('Error adding address', false);
  } finally {
    hideSpinner();
  }
});

// Card form handlers
document.getElementById('addCardBtn').onclick = () => {
  document.getElementById('cardForm').classList.remove('hidden');
};
document.getElementById('cancelCardBtn').onclick = () => {
  document.getElementById('cardForm').classList.add('hidden');
};
document.getElementById('cardForm').addEventListener('submit', async e => {
  e.preventDefault();
  showSpinner();
  try {
    await fetch(`${API}/api/user/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        cardNumber: document.getElementById('cardNumber').value,
        expiry: document.getElementById('expiry').value,
        cvv: document.getElementById('cvv').value
      })
    });
    e.target.reset();
    e.target.classList.add('hidden');
    await loadCards();
    showToast('Card added');
  } catch (error) {
    console.error('Error adding card:', error);
    showToast('Error adding card', false);
  } finally {
    hideSpinner();
  }
});

// Initial load
loadProfile();
loadAddresses();
loadCards();
