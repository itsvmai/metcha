/* ============== Shared Data / Config ============== */
// Product list (same as your original)
const products = [
  { id: 1, name: 'Matcha Latte', description: 'Creamy and smooth Japanese matcha', price: 24, emoji: '🍵' },
  { id: 2, name: 'Iced Coffee', description: 'Cold brew perfection', price: 28, emoji: '☕' },
  { id: 3, name: 'Caramel Macchiato', description: 'Sweet and bold espresso', price: 32, emoji: '🥤' },
  { id: 4, name: 'Strawberry Matcha', description: 'Fruity twist on classic matcha', price: 35, emoji: '🍓' },
  { id: 5, name: 'Vanilla Latte', description: 'Smooth vanilla espresso', price: 26, emoji: '🧋' },
  { id: 6, name: 'Mocha Frappé', description: 'Chocolate coffee bliss', price: 38, emoji: '🍫' },
  { id: 7, name: 'Honey Matcha', description: 'Natural sweetness meets green tea', price: 30, emoji: '🍯' },
  { id: 8, name: 'Espresso Shot', description: 'Pure and intense', price: 24, emoji: '☕' },
  { id: 9, name: 'Lavender Latte', description: 'Floral and calming', price: 34, emoji: '💜' },
];

// LocalStorage key for cart
const CART_KEY = 'metcha_cart';

/* ============== Utilities ============== */
// Safely parse JSON
function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

// Read cart from localStorage
function readCart() {
  const raw = localStorage.getItem(CART_KEY);
  const cart = safeParse(raw, []);
  // Ensure numeric quantities to avoid NaN
  return cart.map(item => ({ ...item, quantity: Number(item.quantity || 0) }));
}

// Save cart
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update cart count (called on every page)
function updateCartCount() {
  const cart = readCart();
  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = totalItems;
}

/* ============== Rendering ============== */
// Render products into a container
function renderProducts(container, list) {
  if (!container) return;
  container.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-image">${p.emoji}</div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-description">${p.description}</p>
      <p class="product-price">${p.price} SAR</p>
      <button class="add-to-cart" data-product-id="${p.id}">Add to Cart</button>
    </div>
  `).join('');
}

// Render cart page content
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const emptyBlock = document.getElementById('cart-empty');
  if (!container || !emptyBlock) return;

  const cart = readCart();
  if (cart.length === 0) {
    container.innerHTML = '';
    emptyBlock.classList.remove('hidden');
    return;
  }
  emptyBlock.classList.add('hidden');

  const rows = cart.map(item => `
    <div style="display:grid;grid-template-columns:80px 1fr auto auto;gap:1.5rem;align-items:center;padding:1.5rem;border-bottom:2px solid rgba(199,125,255,0.1);">
      <div style="font-size:3rem;text-align:center;">${item.emoji}</div>
      <div>
        <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:.3rem;color:#333;">${item.name}</h3>
        <p style="color:#666;font-size:.9rem;">${item.description}</p>
        <p style="font-size:1.2rem;font-weight:700;background:linear-gradient(135deg,#ff6b9d,#c77dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-top:.5rem;">${item.price} SAR</p>
      </div>
      <div class="qty-badge">
        <button class="qty-btn" data-act="dec" data-id="${item.id}">−</button>
        <span style="font-weight:700;font-size:1.1rem;min-width:30px;text-align:center;">${item.quantity}</span>
        <button class="qty-btn" data-act="inc" data-id="${item.id}">+</button>
      </div>
      <button class="remove-btn" data-id="${item.id}" style="padding:.8rem 1.5rem;background:rgba(244,67,54,.1);color:#c62828;border:2px solid rgba(244,67,54,.3);border-radius:50px;font-weight:700;cursor:pointer;transition:all .3s ease;">Remove</button>
    </div>
  `).join('');

  const total = getCartSubtotal(cart);
  const totalBlock = `
    <div style="padding:2rem 1.5rem 1rem;display:flex;justify-content:space-between;align-items:center;">
      <h3 style="font-size:1.8rem;font-weight:700;color:#333;">Total:</h3>
      <p style="font-size:2.2rem;font-weight:800;background:linear-gradient(135deg,#ff6b9d,#c77dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${total} SAR</p>
    </div>
    <a href="checkout.html" class="cta-button" style="width:100%;text-align:center;display:block;margin-top:1rem;">Proceed to Checkout</a>
  `;

  container.innerHTML = `<div class="cart-card">${rows}${totalBlock}</div>`;
}

// Render checkout summary
function renderCheckoutSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;

  const cart = readCart();
  const subtotal = getCartSubtotal(cart);
  const tax = +(subtotal * 0.15).toFixed(2);
  const grand = +(subtotal + tax).toFixed(2);

  const lines = cart.map(item => `
    <div style="display:flex;justify-content:space-between;margin-bottom:1rem;">
      <span style="color:#666;">${item.name} × ${item.quantity}</span>
      <span style="font-weight:700;color:#333;">${item.price * item.quantity} SAR</span>
    </div>
  `).join('');

  summary.innerHTML = `
    <div style="border-bottom:2px solid rgba(199,125,255,.1);padding-bottom:1.5rem;margin-bottom:1.5rem;">
      ${lines}
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:1rem;">
      <span style="color:#666;">Subtotal</span>
      <span style="font-weight:700;color:#333;">${subtotal} SAR</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:1rem;">
      <span style="color:#666;">Tax (15%)</span>
      <span style="font-weight:700;color:#333;">${tax} SAR</span>
    </div>
    <div style="border-top:2px solid rgba(199,125,255,.2);padding-top:1.5rem;margin-top:1.5rem;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:1.5rem;font-weight:700;color:#333;">Total</span>
      <span style="font-size:2rem;font-weight:800;background:linear-gradient(135deg,#ff6b9d,#c77dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${grand} SAR</span>
    </div>
  `;
}

/* ============== Cart Logic ============== */
// Add product to cart
function addToCart(productId) {
  const cart = readCart();
  const product = products.find(p => p.id === Number(productId));
  if (!product) return;

  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

// Remove product from cart
function removeFromCart(productId) {
  const cart = readCart().filter(i => i.id !== Number(productId));
  saveCart(cart); updateCartCount(); renderCartPage(); renderCheckoutSummary();
}

// Update quantity (+/-)
function updateQuantity(productId, delta) {
  const cart = readCart();
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;
  item.quantity = Math.max(0, Number(item.quantity || 0) + delta);
  const next = item.quantity === 0 ? cart.filter(i => i.id !== item.id) : cart;
  saveCart(next); updateCartCount(); renderCartPage(); renderCheckoutSummary();
}

// Calculate subtotal safely (avoid NaN)
function getCartSubtotal(cart = readCart()) {
  return cart.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity || 0)), 0);
}

/* ============== Auth / Validation ============== */
// Password rules: 8+ chars, upper, lower, number, special
function validatePassword(password) {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

// Validate email + password pair
function validate(email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = validatePassword(password);
  return { isValid: isEmailValid && isPasswordValid, emailValid: isEmailValid, passwordValid: isPasswordValid };
}

// Run console tests (same cases you requested)
function runTests() {
  const tests = [
    { name: 'Valid credentials', email: 'tester2@example.com', password: 'Tester234!', expectedValid: true, expectedEmailValid: true, expectedPasswordValid: true },
    { name: 'Invalid email format', email: 'invalid-email', password: 'Tester234!', expectedValid: false, expectedEmailValid: false, expectedPasswordValid: true },
    { name: 'Weak password', email: 'tester2@example.com', password: 'pass', expectedValid: false, expectedEmailValid: true, expectedPasswordValid: false },
    { name: 'Empty email', email: '', password: 'Tester234!', expectedValid: false, expectedEmailValid: false, expectedPasswordValid: true },
    { name: 'Empty password', email: 'tester2@example.com', password: '', expectedValid: false, expectedEmailValid: true, expectedPasswordValid: false },
    { name: 'Both invalid', email: 'bad-email', password: 'weak', expectedValid: false, expectedEmailValid: false, expectedPasswordValid: false }
  ];
  let passed = 0, failed = 0;
  console.log('🧪 Running Automated Front-End Tests...\n═══════════════════════════════════════════════════════════');
  tests.forEach((t, idx) => {
    const r = validate(t.email, t.password);
    const ok = r.isValid === t.expectedValid && r.emailValid === t.expectedEmailValid && r.passwordValid === t.expectedPasswordValid;
    if (ok) {
      console.log(`✅ Test ${idx + 1}: ${t.name}`);
      passed++;
    } else {
      console.log(`❌ Test ${idx + 1}: ${t.name}`);
      console.log(`   Expected: V=${t.expectedValid}, E=${t.expectedEmailValid}, P=${t.expectedPasswordValid}`);
      console.log(`   Got:      V=${r.isValid}, E=${r.emailValid}, P=${r.passwordValid}`);
      failed++;
    }
  });
  console.log(`\n📊 Test Summary: Total=${tests.length} | ✅ ${passed} | ❌ ${failed} | Success=${((passed/tests.length)*100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

/* ============== Page Bootstraps ============== */
document.addEventListener('DOMContentLoaded', () => {
  // Parallax scroll (optional visual)
  const bg = document.querySelector('.parallax-bg');
  if (bg) window.addEventListener('scroll', () => { bg.style.transform = `translateY(${window.scrollY * 0.5}px)`; });

  // Global cart badge
  updateCartCount();

  // Products on homepage (featured: first 3)
  if (document.getElementById('featured-products')) {
    renderProducts(document.getElementById('featured-products'), products.slice(0, 3));
  }
  // Products page (all)
  if (document.getElementById('all-products')) {
    renderProducts(document.getElementById('all-products'), products);
  }

  // Delegate Add-to-cart buttons
  document.body.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      const id = addBtn.getAttribute('data-product-id');
      const original = addBtn.innerHTML;
      addBtn.innerHTML = '<span class="spinner"></span>';
      addBtn.disabled = true;
      setTimeout(() => {
        addToCart(Number(id));
        addBtn.innerHTML = '✓ Added!';
        addBtn.style.background = 'linear-gradient(135deg, #4caf50, #8bc34a)';
        setTimeout(() => { addBtn.innerHTML = original; addBtn.style.background = ''; addBtn.disabled = false; }, 1200);
      }, 600);
    }

    // Quantity +/- on cart page
    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      const id = Number(qtyBtn.getAttribute('data-id'));
      const act = qtyBtn.getAttribute('data-act');
      updateQuantity(id, act === 'inc' ? 1 : -1);
    }

    // Remove on cart page
    const rem = e.target.closest('.remove-btn');
    if (rem) removeFromCart(Number(rem.getAttribute('data-id')));
  });

  // Cart page rendering
  if (document.getElementById('cart-items-container')) renderCartPage();

  // Checkout behaviors
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    renderCheckoutSummary();

    // Format card number
    const cardNumber = document.getElementById('card-number');
    cardNumber?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\s/g, '');
      e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
    });

    // Expiry format
    const cardExpiry = document.getElementById('card-expiry');
    cardExpiry?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
      e.target.value = v;
    });

    // CVV numeric only
    const cardCVV = document.getElementById('card-cvv');
    cardCVV?.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, ''); });

    const checkoutMsg = document.getElementById('checkout-message');
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = cardNumber?.value.replace(/\s/g, '') || '';
      const ex = cardExpiry?.value || '';
      const cvv = cardCVV?.value || '';
      if (n.length < 13 || n.length > 19) return checkoutMsg.innerHTML = '<div class="error-message">Please enter a valid card number.</div>';
      if (!/^\d{2}\/\d{2}$/.test(ex)) return checkoutMsg.innerHTML = '<div class="error-message">Please enter a valid expiry date (MM/YY).</div>';
      if (cvv.length !== 3) return checkoutMsg.innerHTML = '<div class="error-message">Please enter a valid CVV.</div>';

      const btn = checkoutForm.querySelector('.submit-button');
      const text = btn.querySelector('.button-text'); const spin = btn.querySelector('.spinner');
      text?.classList.add('hidden'); spin?.classList.remove('hidden'); btn.disabled = true;

      setTimeout(() => {
        checkoutMsg.innerHTML = '<div class="success-message">🎉 Payment successful! Your order has been placed. Thank you for choosing Metcha!</div>';
        text?.classList.remove('hidden'); spin?.classList.add('hidden'); btn.disabled = false;
        checkoutForm.reset();
        // Clear cart then redirect home
        setTimeout(() => { localStorage.setItem(CART_KEY, JSON.stringify([])); updateCartCount(); window.location.href = 'index.html#home'; }, 1800);
      }, 1200);
    });
  }

  // Auth page behaviors
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toggleLink = document.getElementById('toggle-link');
  const toggleText = document.getElementById('toggle-text');
  const authTitle = document.getElementById('auth-title');
  const authMessage = document.getElementById('auth-message');
  const registerPasswordInput = document.getElementById('register-password');
  const passwordRequirements = document.getElementById('password-requirements');

  // Toggle password eye buttons
  document.body.addEventListener('click', (e) => {
    const toggle = e.target.closest('.password-toggle');
    if (toggle) {
      const targetId = toggle.getAttribute('data-target');
      const field = document.getElementById(targetId);
      if (!field) return;
      if (field.type === 'password') { field.type = 'text'; toggle.textContent = '🙈'; }
      else { field.type = 'password'; toggle.textContent = '👁️'; }
    }
  });

  if (registerPasswordInput && passwordRequirements) {
    registerPasswordInput.addEventListener('input', (e) => {
      const pwd = e.target.value;
      if (!pwd.length) {
        passwordRequirements.className = 'password-requirements';
        passwordRequirements.textContent = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
      } else if (validatePassword(pwd)) {
        passwordRequirements.className = 'password-requirements success';
        passwordRequirements.textContent = '✓ Password meets all requirements';
      } else {
        passwordRequirements.className = 'password-requirements error';
        passwordRequirements.textContent = '✗ Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
      }
    });
  }

  if (toggleLink && loginForm && registerForm && toggleText && authTitle) {
    let isLoginMode = true;
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault(); isLoginMode = !isLoginMode;
      if (isLoginMode) {
        loginForm.classList.remove('hidden'); registerForm.classList.add('hidden');
        authTitle.textContent = 'Login'; toggleText.textContent = "Don't have an account?"; toggleLink.textContent = 'Register here';
      } else {
        loginForm.classList.add('hidden'); registerForm.classList.remove('hidden');
        authTitle.textContent = 'Register'; toggleText.textContent = 'Already have an account?'; toggleLink.textContent = 'Login here';
      }
      authMessage.innerHTML = '';
    });
  }

  if (loginForm && authMessage) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const val = validate(email, password);
      if (!val.emailValid) return authMessage.innerHTML = '<div class="error-message">Please enter a valid email address.</div>';
      if (!val.passwordValid) return authMessage.innerHTML = '<div class="error-message">Password does not meet requirements.</div>';

      const btn = loginForm.querySelector('.submit-button');
      const text = btn.querySelector('.button-text'); const spin = btn.querySelector('.spinner');
      text.classList.add('hidden'); spin.classList.remove('hidden'); btn.disabled = true;

      setTimeout(() => {
        authMessage.innerHTML = '<div class="success-message">Login successful! Welcome back to Metcha.</div>';
        text.classList.remove('hidden'); spin.classList.add('hidden'); btn.disabled = false;
        loginForm.reset();
      }, 1000);
    });
  }

  if (registerForm && authMessage) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-password-confirm').value;
      const val = validate(email, password);

      if (!val.emailValid) return authMessage.innerHTML = '<div class="error-message">Please enter a valid email address.</div>';
      if (!val.passwordValid) return authMessage.innerHTML = '<div class="error-message">Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.</div>';
      if (password !== confirm) return authMessage.innerHTML = '<div class="error-message">Passwords do not match!</div>';

      const btn = registerForm.querySelector('.submit-button');
      const text = btn.querySelector('.button-text'); const spin = btn.querySelector('.spinner');
      text.classList.add('hidden'); spin.classList.remove('hidden'); btn.disabled = true;

      try {
        // Send to backend to trigger verification email
        const form = new FormData();
        form.append('email', email);
        form.append('name', document.getElementById('register-name').value.trim() || 'Metcha User');
        const res = await fetch('verify.php', { method: 'POST', body: form });
        if (res.ok) {
          authMessage.innerHTML = `<div class="success-message">Registration successful! We emailed you a link to confirm your account.</div>`;
        } else {
          authMessage.innerHTML = `<div class="error-message">We couldn't send the verification email right now. Please try again.</div>`;
        }
      } catch {
        authMessage.innerHTML = `<div class="error-message">Network error. Please try again.</div>`;
      } finally {
        text.classList.remove('hidden'); spin.classList.add('hidden'); btn.disabled = false;
        registerForm.reset();
        if (passwordRequirements) {
          passwordRequirements.className = 'password-requirements';
          passwordRequirements.textContent = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
        }
      }
    });
  }

  // Contact page: map setup
  if (document.getElementById('map')) {
    // Leaflet map centered on Khobar
    const cafeLocation = [26.2172, 50.1971];
    const map = L.map('map').setView(cafeLocation, 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO', maxZoom: 20, subdomains: 'abcd'
    }).addTo(map);
    L.marker(cafeLocation).addTo(map)
      .bindPopup('<b>Metcha Café</b><br>Khobar, Saudi Arabia<br>Come visit us!')
      .openPopup();

    // Contact form feedback
    const cForm = document.getElementById('contact-form');
    const cMsg = document.getElementById('contact-message');
    if (cForm && cMsg) {
      cForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = cForm.querySelector('.submit-button');
        const text = btn.querySelector('.button-text'); const spin = btn.querySelector('.spinner');
        text.classList.add('hidden'); spin.classList.remove('hidden'); btn.disabled = true;
        setTimeout(() => {
          cMsg.innerHTML = '<div class="success-message">Thanks! We’ll get back to you soon.</div>';
          text.classList.remove('hidden'); spin.classList.add('hidden'); btn.disabled = false;
          cForm.reset();
        }, 900);
      });
    }
  }

  // Run tests in console (for your evidence)
  runTests();
});
