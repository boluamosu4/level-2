const STORAGE_KEYS = {
  users: 'iv_users',
  currentUser: 'iv_currentUser',
  wishlist: 'iv_wishlist',
  ratings: 'iv_ratings',
  orders: 'iv_orders'
};

const CATALOG_PRODUCT_COUNT = 34;
const ADMIN_SESSION_KEY = 'bobforge_admin_session';
const ADMIN_EMAIL = 'boluamosu4@gmail.com';
const ADMIN_PASSWORD = 'James';

function setAdminVisibility(isAuthenticated) {
  document.getElementById('adminLogin').hidden = isAuthenticated;
  document.getElementById('adminApp').hidden = !isAuthenticated;
}

function readStorageArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function readStorageObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch (error) {
    return {};
  }
}

function formatJoinedDate(userId) {
  const joinedDate = new Date(Number(userId));
  if (Number.isNaN(joinedDate.getTime())) return 'Unknown';
  return joinedDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function renderCustomers(users) {
  const tableBody = document.getElementById('customerTableBody');
  if (!tableBody) return;

  if (users.length === 0) {
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="4">No customer accounts found.</td></tr>';
    return;
  }

  tableBody.innerHTML = users
    .slice()
    .sort((firstUser, secondUser) => Number(secondUser.id) - Number(firstUser.id))
    .map(user => `
      <tr>
        <td>${escapeHtml(user.name || 'Unnamed customer')}</td>
        <td>${escapeHtml(user.email || 'No email')}</td>
        <td>#${escapeHtml(String(user.id || 'Unknown'))}</td>
        <td>${formatJoinedDate(user.id)}</td>
      </tr>
    `)
    .join('');
}

function renderOrders(orders) {
  const tableBody = document.getElementById('orderTableBody');
  if (!tableBody) return;
  if (!orders.length) {
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="5">No orders found.</td></tr>';
    return;
  }
  tableBody.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${escapeHtml(order.reference || 'Unknown')}</strong><small class="table-subtext">${escapeHtml(order.date || '')}</small></td>
      <td>${escapeHtml(order.email || 'Unknown')}</td>
      <td>₦${Number(order.amount || 0).toLocaleString()}</td>
      <td><span class="order-status ${String(order.status).toLowerCase()}">${escapeHtml(order.status || 'Processing')}</span></td>
      <td><select class="status-select" onchange="updateOrderStatus('${escapeHtml(order.reference)}', this.value)"><option ${order.status === 'Processing' ? 'selected' : ''}>Processing</option><option ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option><option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option><option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option></select></td>
    </tr>
  `).join('');
}

function updateOrderStatus(reference, status) {
  const orders = readStorageArray(STORAGE_KEYS.orders).map(order => order.reference === reference ? { ...order, status } : order);
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  renderOrders(orders);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

function renderDashboard() {
  const users = readStorageArray(STORAGE_KEYS.users);
  const wishlist = readStorageArray(STORAGE_KEYS.wishlist);
  const ratings = readStorageObject(STORAGE_KEYS.ratings);
  const orders = readStorageArray(STORAGE_KEYS.orders);
  const currentUserEmail = localStorage.getItem(STORAGE_KEYS.currentUser);
  const currentUser = users.find(user => user.email === currentUserEmail);

  document.getElementById('userCount').textContent = users.length;
  document.getElementById('productCount').textContent = CATALOG_PRODUCT_COUNT;
  document.getElementById('wishlistCount').textContent = wishlist.length;
  document.getElementById('ratedProductCount').textContent = Object.keys(ratings).length;
  document.getElementById('orderCount').textContent = orders.length;
  document.getElementById('salesTotal').textContent = `₦${orders.filter(order => order.status !== 'Cancelled').reduce((total, order) => total + Number(order.amount || 0), 0).toLocaleString()}`;

  const currentUserBadge = document.getElementById('currentUserBadge');
  currentUserBadge.textContent = currentUser
    ? `Active: ${currentUser.name || currentUser.email}`
    : 'No active session';

  document.getElementById('lastUpdated').textContent = `Updated ${new Date().toLocaleTimeString()}`;
  renderCustomers(users);
  renderOrders(orders);
}

function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('adminEmail').value.trim().toLowerCase();
  const password = document.getElementById('adminPassword').value;
  const loginError = document.getElementById('loginError');

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    loginError.textContent = 'Invalid administrator credentials.';
    return;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
  loginError.textContent = '';
  setAdminVisibility(true);
  renderDashboard();
}

function handleAdminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  document.getElementById('adminLoginForm').reset();
  setAdminVisibility(false);
}

document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
document.getElementById('refreshButton').addEventListener('click', renderDashboard);
document.getElementById('logoutButton').addEventListener('click', handleAdminLogout);

const isAdminAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
setAdminVisibility(isAdminAuthenticated);
if (isAdminAuthenticated) renderDashboard();
