// Sample Gym Gear Inventory Data
const products = [
  { id: 1, title: "Pro Rubber Hex Dumbbell (Pair)", price: 45000, rating: 5, image: "images/product-1.jpg" },
  { id: 2, title: "Heavy-Duty Power Rack Station", price: 350000, rating: 5, image: "images/product-2.jpg" },
  { id: 3, title: "Olympic Bumper Plate Set (100kg)", price: 180000, rating: 4, image: "images/product-3.jpg" },
  { id: 4, title: "Commercial Adjustable Bench", price: 95000, rating: 5, image: "images/product-4.jpg" },

  { id: 5, title: "Kettlebell 16kg", price: 12000, rating: 4, image: "images/product-5.jpg" },
  { id: 6, title: "Kettlebell 24kg", price: 18000, rating: 4, image: "images/product-6.jpg" },
  { id: 7, title: "Resistance Band Set (5pcs)", price: 4500, rating: 4, image: "images/product-7.jpg" },
  { id: 8, title: "Adjustable Dumbbell (Single)", price: 65000, rating: 5, image: "images/product-8.jpg" },
  { id: 9, title: "EZ Curl Bar", price: 15000, rating: 4, image: "images/product-9.jpg" },
  { id: 10, title: "Lat Pulldown Attachment", price: 45000, rating: 4, image: "images/product-10.jpg" },
  { id: 11, title: "Cable Machine Pulley", price: 22000, rating: 4, image: "images/product-11.jpg" },
  { id: 12, title: "Medicine Ball 10kg", price: 8000, rating: 4, image: "images/product-12.jpg" },
  { id: 13, title: "Battle Rope 50ft", price: 14000, rating: 4, image: "images/product-13.jpg" },
  { id: 14, title: "Plyo Box Set (3-in-1)", price: 25000, rating: 5, image: "images/product-14.jpg" },
  { id: 15, title: "Folding Treadmill", price: 220000, rating: 4, image: "images/product-15.jpg" },
  { id: 16, title: "Stationary Upright Bike", price: 95000, rating: 4, image: "images/product-16.jpg" },
  { id: 17, title: "Rowing Machine (Magnetic)", price: 120000, rating: 4, image: "images/product-17.jpg" },
  { id: 18, title: "Speed Jump Rope", price: 2500, rating: 3, image: "images/product-18.jpg" },
  { id: 19, title: "Hex Trap Bar", price: 75000, rating: 5, image: "images/product-19.jpg" },
  { id: 20, title: "Farmer's Walk Handles (Pair)", price: 30000, rating: 4, image: "images/product-20.jpg" },
  { id: 21, title: "Weightlifting Shoes (Pair)", price: 28000, rating: 4, image: "images/product-21.jpg" },
  { id: 22, title: "Leather Weightlifting Belt", price: 9000, rating: 4, image: "images/product-22.jpg" },
  { id: 23, title: "Gym Flooring Tile (6-pack)", price: 14000, rating: 4, image: "images/product-23.jpg" },
  { id: 24, title: "Compact Smith Machine", price: 280000, rating: 5, image: "images/product-24.jpg" },
  { id: 25, title: "Olympic Barbell 20kg", price: 85000, rating: 5, image: "images/product-25.svg" },
  { id: 26, title: "Olympic Plate Tree", price: 55000, rating: 4, image: "images/product-26.svg" },
  { id: 27, title: "Wall-Mounted Pull-Up Bar", price: 32000, rating: 4, image: "images/product-27.svg" },
  { id: 28, title: "Gymnastic Rings Set", price: 18000, rating: 5, image: "images/product-28.svg" },
  { id: 29, title: "Ab Wheel Roller", price: 7500, rating: 4, image: "images/product-29.svg" },
  { id: 30, title: "Non-Slip Yoga Mat", price: 16000, rating: 4, image: "images/product-30.svg" },
  { id: 31, title: "Cable Machine Ankle Straps", price: 6500, rating: 4, image: "images/product-31.svg" },
  { id: 32, title: "Weighted Training Sandbag", price: 28000, rating: 5, image: "images/product-32.svg" },
  { id: 33, title: "Parallel Dip Station", price: 68000, rating: 4, image: "images/product-33.svg" },
  { id: 34, title: "High-Density Foam Roller", price: 11000, rating: 4, image: "images/product-34.svg" }
];

// App State Management
let cart = [];
let transactions = [];
let isAuthModeSignIn = true;
let pendingSectionId = null;
let activeCategory = 'all';
let activeSort = 'featured';
// Local storage keys
const LS_USERS = 'iv_users';
const LS_CURRENT = 'iv_currentUser';
const LS_RATINGS = 'iv_ratings';
const LS_WISHLIST = 'iv_wishlist';
const LS_THEME = 'iv_theme';
const LS_CART_PREFIX = 'iv_cart_';
const LS_ORDERS = 'iv_orders';
const LS_REVIEWS = 'iv_reviews';
const LS_RECENT = 'iv_recentProducts';
let pendingRemoveId = null;
let checkoutDraft = null;
let appliedCoupon = null;

// DOM Load Initialization
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem(LS_THEME) || 'light');
  loadRatings();
  renderProducts(products);
  document.getElementById('categoryFilter')?.addEventListener('change', event => {
    activeCategory = event.target.value;
    applyStoreFilters();
  });
  document.getElementById('sortProducts')?.addEventListener('change', event => {
    activeSort = event.target.value;
    applyStoreFilters();
  });
  updateUserStateUI();
  seedDemoUser();
});

// create a demo user if none exists
function seedDemoUser() {
  const demoEmail = 'demo@bobforge.com';
  if (!findUserByEmail(demoEmail)) {
    createUser({ name: 'Demo User', email: demoEmail, password: 'demo123' });
    console.info('Demo user created:', demoEmail);
  }
}

// ----- User persistence helpers -----
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS) || '[]');
  } catch (e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users || []));
}

function findUserByEmail(email) {
  if (!email) return null;
  const users = loadUsers();
  return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
}

function createUser({ name, email, password }) {
  const users = loadUsers();
  if (findUserByEmail(email)) return null; // already exists
  const user = { id: Date.now(), name: name || '', email: email || '', password: password || '' };
  users.push(user);
  saveUsers(users);
  return user;
}

function setCurrentUser(email) {
  localStorage.setItem(LS_CURRENT, email || '');
  updateUserStateUI();
}

function getCurrentUser() {
  const email = localStorage.getItem(LS_CURRENT) || '';
  if (!email) return null;
  return findUserByEmail(email) || null;
}

function clearCurrentUser() {
  localStorage.removeItem(LS_CURRENT);
  cart = [];
  updateCartUI();
  updateUserStateUI();
}

function getCartStorageKey(email) {
  return `${LS_CART_PREFIX}${email.toLowerCase()}`;
}

function loadUserCart(email) {
  try {
    const savedCart = JSON.parse(localStorage.getItem(getCartStorageKey(email)) || '[]');
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    return [];
  }
}

function saveUserCart() {
  const user = getCurrentUser();
  if (user) localStorage.setItem(getCartStorageKey(user.email), JSON.stringify(cart));
}

function loadOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(LS_ORDERS) || '[]');
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    return [];
  }
}

function saveOrder(order) {
  const orders = loadOrders();
  orders.unshift(order);
  localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
}

function updateUserStateUI() {
  const user = getCurrentUser();
  const authBtn = document.getElementById('authBtn');
  const profileBtn = document.getElementById('profileBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  if (authBtn) authBtn.innerText = user ? (user.name || 'Account') : 'Sign In';

  const welcomeEl = document.getElementById('userWelcome');
  if (welcomeEl) {
    if (user) {
      welcomeEl.innerText = `Welcome, ${user.name}`;
      welcomeEl.classList.remove('text-muted');
    } else {
      welcomeEl.innerText = 'Welcome, Guest';
      welcomeEl.classList.add('text-muted');
    }
  }
  // Show/hide sign out button and adjust auth button behavior
  if (signOutBtn) {
    if (user) {
      signOutBtn.classList.remove('d-none');
    } else {
      signOutBtn.classList.add('d-none');
    }
  }

  if (profileBtn) {
    profileBtn.classList.toggle('d-none', !user);
  }

  if (authBtn) {
    if (user) {
      authBtn.classList.remove('btn-red');
      authBtn.classList.add('btn-outline-light');
      authBtn.removeAttribute('data-bs-toggle');
      authBtn.removeAttribute('data-bs-target');
      authBtn.onclick = null;
      authBtn.disabled = true;
    } else {
      authBtn.classList.remove('btn-outline-light');
      authBtn.classList.add('btn-red');
      authBtn.setAttribute('data-bs-toggle', 'modal');
      authBtn.setAttribute('data-bs-target', '#authModal');
      authBtn.onclick = null;
      authBtn.disabled = false;
    }
  }
}

function openProfile() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('profileName').value = user.name || '';
  document.getElementById('profileEmail').value = user.email || '';
  document.getElementById('profilePhone').value = user.phone || '';
  document.getElementById('profileAddress').value = user.address || '';
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  updateProfilePhotoPreview(user.profileImage || '');
}

function previewProfilePhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    event.target.value = '';
    showMessage('danger', 'Please choose an image smaller than 2 MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => updateProfilePhotoPreview(reader.result);
  reader.readAsDataURL(file);
}

function updateProfilePhotoPreview(imageSource) {
  const avatar = document.getElementById('profileAvatar');
  const initials = document.getElementById('profileInitials');
  const user = getCurrentUser();
  const name = user?.name || document.getElementById('profileName')?.value || 'BobForge';
  const nameInitials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');

  avatar.src = imageSource || '';
  avatar.classList.toggle('has-image', Boolean(imageSource));
  initials.textContent = nameInitials || 'BF';
}

function clearProfilePhoto() {
  document.getElementById('profilePhoto').value = '';
  updateProfilePhotoPreview('');
}

function saveProfile(event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const name = document.getElementById('profileName').value.trim();
  const email = document.getElementById('profileEmail').value.trim().toLowerCase();
  const phone = document.getElementById('profilePhone').value.trim();
  const address = document.getElementById('profileAddress').value.trim();
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  const profileImage = document.getElementById('profileAvatar').classList.contains('has-image')
    ? document.getElementById('profileAvatar').src
    : '';

  if (!name || !email) {
    showMessage('danger', 'Name and email are required.');
    return;
  }
  if (email !== currentUser.email && findUserByEmail(email)) {
    showMessage('danger', 'That email address is already in use.');
    return;
  }
  if (newPassword || confirmNewPassword || currentPassword) {
    if (currentPassword !== currentUser.password) {
      showMessage('danger', 'Your current password is incorrect.');
      return;
    }
    if (newPassword.length < 6 || newPassword !== confirmNewPassword) {
      showMessage('danger', 'New passwords must match and contain at least 6 characters.');
      return;
    }
  }

  const users = loadUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  if (userIndex === -1) return;

  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    phone,
    address,
    password: newPassword || currentUser.password,
    profileImage
  };
  saveUsers(users);
  setCurrentUser(email);
  if (email !== currentUser.email) {
    const oldCartKey = getCartStorageKey(currentUser.email);
    const newCartKey = getCartStorageKey(email);
    const existingCart = localStorage.getItem(oldCartKey);
    if (existingCart) localStorage.setItem(newCartKey, existingCart);
    localStorage.removeItem(oldCartKey);

    const updatedOrders = loadOrders().map(order => order.email.toLowerCase() === currentUser.email.toLowerCase()
      ? { ...order, email }
      : order);
    localStorage.setItem(LS_ORDERS, JSON.stringify(updatedOrders));
  }
  showMessage('success', 'Your profile has been updated.');
  bootstrap.Modal.getInstance(document.getElementById('profileModal'))?.hide();
}

function handleSignOut() {
  clearCurrentUser();
  showMessage('info', 'You have been signed out.');
}

// ----- Wishlist helpers -----
function loadWishlist() {
  try { return JSON.parse(localStorage.getItem(LS_WISHLIST) || '[]'); } catch (e) { return []; }
}

function saveWishlist(list) { localStorage.setItem(LS_WISHLIST, JSON.stringify(list || [])); }

function addToWishlist(productId) {
  const list = loadWishlist();
  if (list.includes(productId)) return false;
  list.push(productId);
  saveWishlist(list);
  return true;
}

function toggleWishlistFromStore(productId) {
  const list = loadWishlist();
  const alreadyLiked = list.includes(productId);

  if (alreadyLiked) {
    removeFromWishlist(productId);
    showMessage('info', 'Item removed from your wishlist.');
  } else {
    addToWishlist(productId);
    renderLikedItems();
    showMessage('success', 'Item added to your wishlist.');
  }

  const button = document.getElementById(`wishlistBtn-${productId}`);
  if (button) {
    button.classList.toggle('btn-red', !alreadyLiked);
    button.classList.toggle('btn-outline-danger', alreadyLiked);
    button.innerHTML = alreadyLiked
      ? '<i class="fa-solid fa-heart me-1"></i> Add To Wishlist'
      : '<i class="fa-solid fa-heart me-1"></i> In Wishlist';
  }
}

function removeFromWishlist(productId) {
  const list = loadWishlist().filter(id => id !== productId);
  saveWishlist(list);
  updateLikedCounter();
  renderLikedItems();
}

function updateLikedCounter() {
  const count = loadWishlist().length;
  const el = document.getElementById('likedCount');
  if (el) el.innerText = count;
}

function renderLikedItems() {
  const container = document.getElementById('likedList');
  if (!container) return;
  const list = loadWishlist();
  if (list.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">Your wishlist is empty.</p>`;
    updateLikedCounter();
    return;
  }

  const html = list.map(id => {
    const p = products.find(pr => pr.id === id);
    if (!p) return '';
    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card product-card h-100 border-0 shadow-sm">
            ${renderProductMedia(p)}
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title fw-bold">${p.title}</h5>
              <div class="price-tag mb-3">₦${p.price.toLocaleString()}</div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-red w-100" onclick="addWishlistToCart(${p.id})">Add To Cart</button>
              <button class="btn btn-outline-secondary w-100" onclick="removeFromWishlist(${p.id})">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
  updateLikedCounter();
}

function addWishlistToCart(productId) {
  // ensure signed in
  const user = getCurrentUser();
  if (!user) {
    showMessage('info', 'Please sign in to add wishlist items to your cart.');
    const authModalEl = document.getElementById('authModal');
    if (authModalEl && window.bootstrap) bootstrap.Modal.getOrCreateInstance(authModalEl).show();
    return;
  }

  // add to cart and remove from wishlist
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += 1; else cart.push({ ...product, qty: 1 });
  updateCartUI();
  removeFromWishlist(productId);
  showMessage('success', `${product.title} added to cart from your wishlist.`);
}

// In-page notification helper (replaces alert())
function showMessage(type, text, timeout = 5000) {
  const container = document.getElementById('notificationContainer');
  if (!container) return console.warn('notification container missing', text);

  const alertEl = document.createElement('div');
  alertEl.className = `site-alert ${type}`;
  alertEl.setAttribute('role', 'alert');

  alertEl.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
      <div class="me-3">${text}</div>
      <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(alertEl);

  const closeBtn = alertEl.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => alertEl.remove());

  setTimeout(() => {
    if (alertEl.parentNode) alertEl.remove();
  }, timeout);
}

// Single Page Navigation Switcher
function showSection(sectionId) {
  if (sectionId !== 'home' && !getCurrentUser()) {
    pendingSectionId = sectionId;
    showMessage('info', 'Please sign in or create an account to continue.');
    const authModalEl = document.getElementById('authModal');
    if (authModalEl && window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance(authModalEl).show();
    }
    return;
  }

  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active-section"));
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active-section");
  }
  if (sectionId === 'liked') renderLikedItems();
}

// Render Product Cards
function renderProducts(items) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  const count = document.getElementById('productResultCount');
  if (count) count.innerText = `${items.length} product${items.length === 1 ? '' : 's'}`;

  if (items.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No gear matches your search.</p>`;
    return;
  }

  items.forEach(product => {
    const isLiked = loadWishlist().includes(product.id);
    const starsHtml = Array.from({length:5}).map((_,i) => `
      <span class="rating-star ${i < product.rating ? 'filled' : ''}" onclick="setRating(${product.id}, ${i+1})">★</span>
    `).join('');

    const cardHtml = `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card product-card h-100 border-0 shadow-sm">
          ${renderProductMedia(product)}
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title fw-bold">${product.title}</h5>
              <p class="small text-muted">${product.description || 'Reliable equipment for consistent training.'}</p>
              <div class="mb-2 rating-stars text-warning d-flex align-items-center">
                <div>${starsHtml}</div>
                <small class="text-muted ms-2">(${product.ratingCount || 0})</small>
              </div>
            </div>
            <div>
              <div class="price-tag mb-3">₦${product.price.toLocaleString()}</div>
              <button class="btn btn-red w-100 fw-bold text-uppercase mb-2" onclick="addToCart(${product.id})">
                <i class="fa-solid fa-cart-plus me-1"></i> Add To Cart
              </button>
              <button class="btn btn-outline-secondary w-100 fw-bold text-uppercase mb-2" onclick="openProductDetails(${product.id})">
                <i class="fa-solid fa-eye me-1"></i> View Details
              </button>
              <button id="wishlistBtn-${product.id}" class="btn ${isLiked ? 'btn-outline-danger' : 'btn-red'} w-100 fw-bold text-uppercase" onclick="toggleWishlistFromStore(${product.id})">
                <i class="fa-solid fa-heart me-1"></i> ${isLiked ? 'In Wishlist' : 'Add To Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

// Ratings persistence
function loadRatings() {
  try {
    const map = JSON.parse(localStorage.getItem(LS_RATINGS) || '{}');
    if (map && typeof map === 'object') {
      products.forEach(p => {
        const r = map[p.id];
        if (r) {
          p.rating = r.avg || p.rating || 0;
          p.ratingCount = r.count || 0;
        } else {
          p.rating = p.rating || 0;
          p.ratingCount = p.rating ? 1 : 0;
        }
      });
    }
  } catch (e) { /* ignore */ }
}

function saveRatings() {
  const map = {};
  products.forEach(p => { map[p.id] = { avg: p.rating || 0, count: p.ratingCount || 0 }; });
  localStorage.setItem(LS_RATINGS, JSON.stringify(map));
}

function setRating(productId, rating) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const prevCount = product.ratingCount || 0;
  const prevAvg = product.rating || 0;
  const newCount = prevCount + 1;
  const newAvg = Math.round(((prevAvg * prevCount) + rating) / newCount);

  product.ratingCount = newCount;
  product.rating = newAvg;

  saveRatings();
  renderProducts(products);
  showMessage('success', `You rated ${product.title} ${rating}★ — total votes: ${newCount}`);
}

// Search Logic
function searchProducts() {
  applyStoreFilters();
  showSection("store");
}

function selectCategoryAndShop(category) {
  activeCategory = category;
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) categoryFilter.value = category;
  applyStoreFilters();
  showSection('store');
}

function handleNewsletterSignup(event) {
  event.preventDefault();
  const emailInput = event.currentTarget.querySelector('input[type="email"]');
  const email = emailInput?.value.trim();
  if (!email) return;

  localStorage.setItem('iv_newsletterEmail', email);
  event.currentTarget.reset();
  showMessage('success', 'You are subscribed to BobForge updates.');
}

function getProductCategory(product) {
  const title = product.title.toLowerCase();
  if (/treadmill|bike|rowing/.test(title)) return 'cardio';
  if (/dumbbell|rack|plate|bench|kettlebell|bar|machine|box|ball|sandbag|dip station/.test(title)) return 'strength';
  return 'accessories';
}

function applyStoreFilters() {
  const query = document.getElementById('searchInput')?.value.toLowerCase() || '';
  let filtered = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(query);
    const matchesCategory = activeCategory === 'all' || getProductCategory(product) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeSort === 'price-low') filtered.sort((first, second) => first.price - second.price);
  if (activeSort === 'price-high') filtered.sort((first, second) => second.price - first.price);
  if (activeSort === 'rating') filtered.sort((first, second) => second.rating - first.rating);
  if (activeSort === 'name') filtered.sort((first, second) => first.title.localeCompare(second.title));

  renderProducts(filtered);
}

// Cart Logic
function addToCart(productId) {
  // require sign-in before adding to cart
  const user = getCurrentUser();
  if (!user) {
    showMessage('info', 'Please sign in or create an account to add items to your cart.');
    const authModalEl = document.getElementById('authModal');
    if (authModalEl && window.bootstrap) {
      const modal = bootstrap.Modal.getOrCreateInstance(authModalEl);
      modal.show();
    } else {
      window.location.href = 'signup.html';
    }
    return;
  }

  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  const cartItem = cart.find(i => i.id === productId);
  const qty = cartItem ? cartItem.qty : 0;
  showMessage('success', `${product.title} added to cart (Qty: ${qty})`);
}

function removeFromCart(productId) {
  // show confirmation modal with options to move to liked items or remove
  pendingRemoveId = productId;
  const product = products.find(p => p.id === productId);
  const modalText = document.getElementById('removeModalText');
  if (modalText && product) {
    modalText.innerText = `Remove "${product.title}" from your cart?`;
  }
  const removeModalEl = document.getElementById('cartRemoveModal');
  if (removeModalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getOrCreateInstance(removeModalEl);
    modal.show();
  } else {
    // fallback: remove directly
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
  }
}

function performPendingRemove() {
  if (!pendingRemoveId) return;
  cart = cart.filter(item => item.id !== pendingRemoveId);
  updateCartUI();
  pendingRemoveId = null;
  const removeModalEl = document.getElementById('cartRemoveModal');
  if (removeModalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(removeModalEl);
    if (modal) modal.hide();
  }
}

function movePendingToWishlist() {
  if (!pendingRemoveId) return;
  const added = addToWishlist(pendingRemoveId);
  performPendingRemove();
  renderLikedItems();
  if (added) showMessage('success', 'Item moved to your wishlist.');
  else showMessage('info', 'Item is already in your wishlist.');
}

function updateCartUI() {
  const cartCountEl = document.getElementById("cartCount");
  const mobileCartCountEl = document.getElementById("mobileCartCount");
  const cartBodyEl = document.getElementById("cartBody");
  const cartTotalEl = document.getElementById("cartTotal");

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  saveUserCart();

  cartCountEl.innerText = totalItems;
  if (mobileCartCountEl) mobileCartCountEl.innerText = totalItems;
  cartTotalEl.innerText = `₦${totalPrice.toLocaleString()}`;

  if (cart.length === 0) {
    cartBodyEl.innerHTML = `<p class="text-center text-muted my-4">Your cart is currently empty.</p>`;
    return;
  }

  cartBodyEl.innerHTML = cart.map(item => `
    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
      <div>
        <h6 class="fw-bold mb-0">${item.title}</h6>
        <small class="text-muted">₦${item.price.toLocaleString()}</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="input-group input-group-sm" style="width:130px;">
          <button class="btn btn-outline-secondary" type="button" onclick="changeQty(${item.id}, -1)">-</button>
          <input type="text" class="form-control text-center" value="${item.qty}" readonly />
          <button class="btn btn-outline-secondary" type="button" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <div class="text-end ms-2">
          <div class="fw-bold text-red">₦${(item.price * item.qty).toLocaleString()}</div>
          <button class="btn btn-sm btn-outline-danger mt-1" onclick="removeFromCart(${item.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Change quantity for a cart item by delta (+1 or -1). Removes item if qty <= 0.
function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;
  item.qty = (item.qty || 0) + delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

// Auth Toggle Logic
function toggleAuthMode() {
  isAuthModeSignIn = !isAuthModeSignIn;
  const modalTitle = document.getElementById("authModalTitle");
  const submitBtn = document.getElementById("authSubmitBtn");
  const toggleLink = document.getElementById("authToggleLink");

  if (isAuthModeSignIn) {
    modalTitle.innerText = "Sign In";
    submitBtn.innerText = "Sign In";
    toggleLink.innerText = "Don't have an account? Sign Up";
  } else {
    modalTitle.innerText = "Sign Up";
    submitBtn.innerText = "Create Account";
    toggleLink.innerText = "Already registered? Sign In";
  }
}

function togglePasswordVisibility(inputId = 'authPassword', buttonId = 'toggleAuthPassword') {
  const passwordInput = document.getElementById(inputId);
  const toggleButton = document.getElementById(buttonId);
  const icon = toggleButton?.querySelector('i');
  if (!passwordInput || !toggleButton || !icon) return;

  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  toggleButton.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  toggleButton.title = isHidden ? 'Hide password' : 'Show password';
  icon.classList.toggle('fa-eye', !isHidden);
  icon.classList.toggle('fa-eye-slash', isHidden);
}

function handleAuth(event) {
  event.preventDefault();
  const authModalEl = document.getElementById("authModal");
  const modalInstance = bootstrap.Modal.getInstance(authModalEl);
  // perform a simple local signin using stored users
  const email = document.getElementById('authEmail')?.value || '';
  const password = document.getElementById('authPassword')?.value || '';

  if (!email || !password) {
    showMessage('danger', 'Please provide email and password.');
    return;
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    showMessage('danger', 'Invalid credentials.');
    return;
  }

  setCurrentUser(user.email);
  cart = loadUserCart(user.email);
  updateCartUI();
  showMessage('success', 'Logged in successfully!');
  if (modalInstance) modalInstance.hide();
  if (pendingSectionId) {
    const sectionToOpen = pendingSectionId;
    pendingSectionId = null;
    showSection(sectionToOpen);
  }
}

// Open a pre-filled email so support messages reach the site owner.
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName')?.value?.trim() || '';
  const email = document.getElementById('contactEmail')?.value?.trim() || '';
  const message = document.getElementById('contactMessage')?.value?.trim() || '';
  const subject = `BobForge Support Message from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  window.location.href = `mailto:boluamosu4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showMessage('success', 'Your email app is opening with the support message ready to send.');

  const contactModalEl = document.getElementById('contactModal');
  const modalInstance = bootstrap.Modal.getInstance(contactModalEl);
  if (modalInstance) modalInstance.hide();

  // reset whichever support form was submitted
  if (event.currentTarget instanceof HTMLFormElement) {
    event.currentTarget.reset();
  }
}

// Full-page signup handler (used by signup.html)
function handleSignUp(event) {
  event.preventDefault();
  const name = document.getElementById('signupName')?.value?.trim() || '';
  const email = document.getElementById('signupEmail')?.value?.trim() || '';
  const password = document.getElementById('signupPassword')?.value || '';
  const passwordConfirm = document.getElementById('signupPasswordConfirm')?.value || '';

  if (!name || !email || !password) {
    showMessage('danger', 'Please complete all required fields.');
    return;
  }
  if (password !== passwordConfirm) {
    showMessage('danger', 'Passwords do not match.');
    return;
  }

  if (findUserByEmail(email)) {
    showMessage('danger', 'An account with that email already exists.');
    return;
  }

  const user = createUser({ name, email, password });
  if (!user) {
    showMessage('danger', 'Unable to create account.');
    return;
  }

  // Auto sign-in
  setCurrentUser(user.email);
  showMessage('success', `Welcome, ${user.name}! You are now signed in.`);
  // redirect home after a short delay so user sees the message
  setTimeout(() => { window.location.href = 'index.html'; }, 800);
}

// Paystack Inline Payment Gateway Trigger
function openCheckout() {
  if (!cart.length) { showMessage('info', 'Add items to your cart before checking out.'); return; }
  const user = getCurrentUser();
  if (!user) { showMessage('info', 'Please sign in before checking out.'); bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).show(); return; }
  document.getElementById('checkoutName').value = user.name || '';
  document.getElementById('checkoutPhone').value = user.phone || '';
  document.getElementById('checkoutAddress').value = user.address || '';
  renderCheckoutSummary();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('checkoutModal')).show();
}

function applyCoupon() {
  const code = document.getElementById('checkoutCoupon').value.trim().toUpperCase();
  if (code === 'WELCOME10') { appliedCoupon = code; showMessage('success', '10% welcome discount applied.'); }
  else { appliedCoupon = null; showMessage('danger', 'That discount code is not valid.'); }
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const totals = calculateCheckoutTotals();
  const summary = document.getElementById('checkoutSummary');
  if (!summary) return;
  summary.innerHTML = `<div class="d-flex justify-content-between"><span>Subtotal</span><strong>₦${totals.subtotal.toLocaleString()}</strong></div><div class="d-flex justify-content-between"><span>Delivery</span><strong>${totals.delivery ? `₦${totals.delivery.toLocaleString()}` : 'Free'}</strong></div>${totals.discount ? `<div class="d-flex justify-content-between text-success"><span>Discount</span><strong>-₦${totals.discount.toLocaleString()}</strong></div>` : ''}<hr /><div class="d-flex justify-content-between fs-5"><strong>Total</strong><strong class="text-red">₦${totals.total.toLocaleString()}</strong></div>`;
}

function submitCheckout(event) {
  event.preventDefault();
  checkoutDraft = { name: document.getElementById('checkoutName').value.trim(), phone: document.getElementById('checkoutPhone').value.trim(), address: document.getElementById('checkoutAddress').value.trim(), city: document.getElementById('checkoutCity').value.trim(), notes: document.getElementById('checkoutNotes').value.trim() };
  const user = getCurrentUser();
  if (!user) return;
  const totals = calculateCheckoutTotals();
  const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
  if (checkoutModal) checkoutModal.hide();
  initiatePayment(totals.total);
}

function initiatePayment() {
  const totalPrice = arguments[0] || cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (totalPrice === 0) {
    showMessage('info', 'Please add items to your cart before proceeding to payment.');
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    showMessage('info', 'Please sign in before checking out.');
    return;
  }

  const orderReference = 'IV-' + Math.floor((Math.random() * 1000000000) + 1);
  const orderItems = cart.map(item => ({ id: item.id, title: item.title, qty: item.qty, price: item.price }));
  const handler = PaystackPop.setup({
    key: 'pk_test_8889cf42b03b1813c732fcfda20a316bd8260555', // Replace with your real Paystack Test Public Key
    email: user.email,
    amount: totalPrice * 100, // Amount in kobo
    currency: 'NGN',
    ref: orderReference,
    callback: function(response) {
      // Payment Successful Handler
      const cartModalEl = document.getElementById("cartModal");
      const modalInstance = bootstrap.Modal.getInstance(cartModalEl);
      if (modalInstance) modalInstance.hide();

      // Record transaction history
      transactions.unshift({
        reference: response.reference,
        amount: totalPrice,
        status: "Successful",
        date: new Date().toLocaleDateString()
      });
      saveOrder({
        reference: response.reference,
        email: user.email,
        amount: totalPrice,
        status: 'Processing',
        date: new Date().toLocaleDateString(),
        items: orderItems,
        delivery: checkoutDraft
      });

      // Clear state
      cart = [];
      updateCartUI();

      showMessage('success', `Payment successful. Your tracking ID is ${response.reference}. Use Track Order to check it anytime.`);
      showSection("home");
      checkoutDraft = null;
      appliedCoupon = null;
    },
    onClose: function() {
      showMessage('info', 'Payment cancelled.');
    }
  });

  handler.openIframe();
}

function trackOrder(event) {
  event.preventDefault();
  const user = getCurrentUser();
  const reference = document.getElementById('trackingReference').value.trim().toUpperCase();
  const result = document.getElementById('trackingResult');

  if (!user) {
    result.innerHTML = '<div class="alert alert-info mb-0">Please sign in to track your orders.</div>';
    return;
  }

  const order = loadOrders().find(savedOrder => savedOrder.reference.toUpperCase() === reference && savedOrder.email.toLowerCase() === user.email.toLowerCase());
  if (!order) {
    result.innerHTML = '<div class="alert alert-warning mb-0">No order was found for that reference.</div>';
    return;
  }

  result.innerHTML = `
    <div class="order-status-card">
      <strong>Order ${order.reference}</strong>
      <span>Status: ${order.status}</span>
      <span>Placed: ${order.date}</span>
      <span>Total: ₦${order.amount.toLocaleString()}</span>
    </div>
  `;
}

function renderRecentOrders() {
  const recentOrders = document.getElementById('recentOrders');
  if (!recentOrders) return;

  const user = getCurrentUser();
  if (!user) {
    recentOrders.innerHTML = '<div class="alert alert-info mb-0">Sign in to see your recent orders.</div>';
    return;
  }

  const orders = loadOrders()
    .filter(order => order.email && order.email.toLowerCase() === user.email.toLowerCase())
    .slice(0, 3);

  if (orders.length === 0) {
    recentOrders.innerHTML = '<div class="alert alert-secondary mb-0">Your recent orders will appear here after checkout.</div>';
    return;
  }

  recentOrders.innerHTML = `
    <p class="small text-uppercase fw-bold text-muted mb-2">Recent orders</p>
    ${orders.map(order => `
      <div class="recent-order-card">
        <div>
          <strong>Tracking ID: ${order.reference}</strong>
          <span>${order.date} · ₦${order.amount.toLocaleString()}</span>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="useOrderReference('${order.reference}')">Track</button>
      </div>
    `).join('')}
  `;
}

function useOrderReference(reference) {
  const referenceInput = document.getElementById('trackingReference');
  if (referenceInput) referenceInput.value = reference;
  const trackingForm = referenceInput?.form;
  if (trackingForm) trackingForm.requestSubmit();
}

// Update User Dashboard Values
// Wire up modal buttons after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.getElementById('confirmRemoveBtn');
  const moveBtn = document.getElementById('moveToLikedBtn');
  if (confirmBtn) confirmBtn.addEventListener('click', performPendingRemove);
  if (moveBtn) moveBtn.addEventListener('click', movePendingToWishlist);
  const trackingModal = document.getElementById('trackingModal');
  if (trackingModal) trackingModal.addEventListener('show.bs.modal', renderRecentOrders);
  // render liked items and update counter on load
  renderLikedItems();
  updateLikedCounter();
});

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  const toggle = document.getElementById('themeToggle');
  const icon = toggle?.querySelector('i');
  if (!toggle || !icon) return;

  toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  icon.classList.toggle('fa-sun', !isDark);
  icon.classList.toggle('fa-moon', isDark);
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem(LS_THEME, nextTheme);
  applyTheme(nextTheme);
}

function renderProductMedia(product) {
  if (product.id === 11 || product.id === 12) {
    return `
      <video class="card-img-top" autoplay muted loop playsinline preload="metadata" poster="images/product-${product.id}.svg" aria-label="${product.title}">
        <source src="images/product-${product.id}.mp4" type="video/mp4">
        Your browser does not support video playback.
      </video>
    `;
  }

  return `<img src="${product.image}" loading="lazy" class="card-img-top" alt="${product.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/500x350?text=Image+Not+Available'">`;
}

function readJsonStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch (error) { return fallback; }
}

function calculateCheckoutTotals() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const delivery = subtotal >= 200000 ? 0 : 2500;
  const discount = appliedCoupon === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, delivery, discount, total: subtotal + delivery - discount };
}

function rememberRecentlyViewed(productId) {
  const recent = readJsonStorage(LS_RECENT, []).filter(id => id !== productId);
  recent.unshift(productId);
  localStorage.setItem(LS_RECENT, JSON.stringify(recent.slice(0, 6)));
}

function getProductReviews(productId) {
  const reviews = readJsonStorage(LS_REVIEWS, {});
  return Array.isArray(reviews[productId]) ? reviews[productId] : [];
}

function saveProductReview(productId, review) {
  const reviews = readJsonStorage(LS_REVIEWS, {});
  reviews[productId] = reviews[productId] || [];
  reviews[productId].unshift(review);
  localStorage.setItem(LS_REVIEWS, JSON.stringify(reviews));
}

function openProductDetails(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  rememberRecentlyViewed(productId);
  const reviews = getProductReviews(productId);
  document.getElementById('productDetailsTitle').textContent = product.title;
  document.getElementById('productDetailsBody').innerHTML = `
    <div class="row g-4">
      <div class="col-md-5">${renderProductMedia(product)}</div>
      <div class="col-md-7"><p class="section-kicker">BobForge equipment</p><h3>${product.title}</h3><p class="text-muted">${product.description || 'Designed for dependable training at home, in studios, and on busy gym floors.'}</p><p class="price-tag">₦${product.price.toLocaleString()}</p><p class="small text-muted">${product.stock || 10} units available · Rating ${product.rating}/5</p><button class="btn btn-red text-uppercase fw-bold" onclick="addToCart(${product.id})">Add to Cart</button></div>
    </div>
    <hr class="my-4" />
    <h5 class="fw-bold">Customer reviews</h5>
    <div class="review-list mb-3">${reviews.length ? reviews.map(review => `<div class="review-item"><strong>${escapeHtml(review.name)}</strong><span>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span><p>${escapeHtml(review.text)}</p></div>`).join('') : '<p class="text-muted">No reviews yet. Be the first to review this product.</p>'}</div>
    <form onsubmit="submitReview(event, ${product.id})"><div class="row g-2"><div class="col-md-4"><input name="name" class="form-control" placeholder="Your name" required /></div><div class="col-md-3"><select name="rating" class="form-select" required><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></div><div class="col-md-5"><input name="text" class="form-control" placeholder="Write a review" required /></div></div><button class="btn btn-outline-danger mt-2" type="submit">Submit review</button></form>
  `;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('productDetailsModal')).show();
}

function submitReview(event, productId) {
  event.preventDefault();
  const form = event.currentTarget;
  saveProductReview(productId, { name: form.name.value.trim(), rating: Number(form.rating.value), text: form.text.value.trim(), date: new Date().toLocaleDateString() });
  showMessage('success', 'Your review was added.');
  openProductDetails(productId);
}

function openOrderHistory() {
  if (!getCurrentUser()) { showMessage('info', 'Please sign in to see your orders.'); bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).show(); return; }
  const user = getCurrentUser();
  const orders = loadOrders().filter(order => order.email.toLowerCase() === user.email.toLowerCase());
  const body = document.getElementById('orderHistoryBody');
  body.innerHTML = orders.length ? orders.map(order => `<div class="order-history-row"><div><strong>${order.reference}</strong><span>${order.date} · ${order.status}</span></div><strong>₦${order.amount.toLocaleString()}</strong></div>`).join('') : '<p class="text-muted">You have not placed an order yet.</p>';
  bootstrap.Modal.getOrCreateInstance(document.getElementById('orderHistoryModal')).show();
}