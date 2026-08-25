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
  { id: 24, title: "Compact Smith Machine", price: 280000, rating: 5, image: "images/product-24.jpg" }
];

// App State Management
let cart = [];
let transactions = [];
let isAuthModeSignIn = true;
let pendingSectionId = null;
// Local storage keys
const LS_USERS = 'iv_users';
const LS_CURRENT = 'iv_currentUser';
const LS_RATINGS = 'iv_ratings';
const LS_WISHLIST = 'iv_wishlist';
const LS_THEME = 'iv_theme';
let pendingRemoveId = null;

// DOM Load Initialization
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem(LS_THEME) || 'light');
  loadRatings();
  renderProducts(products);
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
  updateUserStateUI();
}

function updateUserStateUI() {
  const user = getCurrentUser();
  const authBtn = document.getElementById('authBtn');
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

  if (authBtn) {
    if (user) {
      authBtn.classList.remove('btn-red');
      authBtn.classList.add('btn-outline-light');
      authBtn.removeAttribute('data-bs-toggle');
      authBtn.removeAttribute('data-bs-target');
      authBtn.onclick = () => showSection('dashboard');
    } else {
      authBtn.classList.remove('btn-outline-light');
      authBtn.classList.add('btn-red');
      authBtn.setAttribute('data-bs-toggle', 'modal');
      authBtn.setAttribute('data-bs-target', '#authModal');
      authBtn.onclick = null;
    }
  }
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
    showMessage('info', 'Item removed from liked items.');
  } else {
    addToWishlist(productId);
    renderLikedItems();
    showMessage('success', 'Item added to liked items.');
  }

  const button = document.getElementById(`wishlistBtn-${productId}`);
  if (button) {
    button.classList.toggle('btn-red', !alreadyLiked);
    button.classList.toggle('btn-outline-danger', alreadyLiked);
    button.innerHTML = alreadyLiked
      ? '<i class="fa-solid fa-heart me-1"></i> Add To Liked'
      : '<i class="fa-solid fa-heart me-1"></i> Liked';
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
    container.innerHTML = `<p class="text-center text-muted">You have no liked items yet.</p>`;
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
    showMessage('info', 'Please sign in to add liked items to your cart.');
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
  showMessage('success', `${product.title} added to cart from liked items.`);
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
              <button id="wishlistBtn-${product.id}" class="btn ${isLiked ? 'btn-outline-danger' : 'btn-red'} w-100 fw-bold text-uppercase" onclick="toggleWishlistFromStore(${product.id})">
                <i class="fa-solid fa-heart me-1"></i> ${isLiked ? 'Liked' : 'Add To Liked'}
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
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(query));
  showSection("store");
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
  if (added) showMessage('success', 'Item moved to liked items.');
  else showMessage('info', 'Item already in liked items.');
}

function updateCartUI() {
  const cartCountEl = document.getElementById("cartCount");
  const mobileCartCountEl = document.getElementById("mobileCartCount");
  const cartBodyEl = document.getElementById("cartBody");
  const cartTotalEl = document.getElementById("cartTotal");

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

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

  // reset form
  document.getElementById('contactForm').reset();
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
function initiatePayment() {
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (totalPrice === 0) {
    showMessage('info', 'Please add items to your cart before proceeding to payment.');
    return;
  }

  const handler = PaystackPop.setup({
    key: 'pk_test_8889cf42b03b1813c732fcfda20a316bd8260555', // Replace with your real Paystack Test Public Key
    email: 'customer@bobforge.com',
    amount: totalPrice * 100, // Amount in kobo
    currency: 'NGN',
    ref: 'IV-' + Math.floor((Math.random() * 1000000000) + 1),
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

      renderDashboard();

      // Clear state
      cart = [];
      updateCartUI();

      showMessage('success', `Payment Successful! Reference ID: ${response.reference}`);
      showSection("dashboard");
    },
    onClose: function() {
      showMessage('info', 'Payment cancelled.');
    }
  });

  handler.openIframe();
}

// Update User Dashboard Values
function renderDashboard() {
  document.getElementById("dashTotalOrders").innerText = transactions.length;

  const historyTable = document.getElementById("transactionHistory");
  if (transactions.length === 0) return;

  historyTable.innerHTML = transactions.map(tx => `
    <tr>
      <td class="fw-bold">${tx.reference}</td>
      <td>₦${tx.amount.toLocaleString()}</td>
      <td><span class="badge bg-success">${tx.status}</span></td>
      <td>${tx.date}</td>
    </tr>
  `).join("");
}

// Wire up modal buttons after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.getElementById('confirmRemoveBtn');
  const moveBtn = document.getElementById('moveToLikedBtn');
  if (confirmBtn) confirmBtn.addEventListener('click', performPendingRemove);
  if (moveBtn) moveBtn.addEventListener('click', movePendingToWishlist);
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