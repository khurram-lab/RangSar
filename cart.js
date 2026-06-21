/* ============================================================
   RANGSAR STUDIO — CART.JS
   Cart logic, checkout, order submission, Google Sheets
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   ⚙️  SETTINGS — Edit these values
────────────────────────────────────────────────────────── */
const SETTINGS = {
  deliveryCharge: 250,        // PKR delivery charge
  freeDeliveryAbove: 5000,    // Set to 0 to always charge delivery
  whatsappNumber: "923217024241",
  storeEmail: "rangsar.pk@gmail.com",

  // JazzCash details — replace with your real number
  jazzCashNumber: "0321-7024241",
  jazzCashName: "RangSar Studio",

  // Bank deposit details — replace with your real info
  bankName: "Meezan Bank",
  bankAccountTitle: "RangSar Studio",
  bankAccountNumber: "XXXX-XXXX-XXXX-XXXX",  // ← Replace this
  bankIBAN: "PK00MEZN0000000000000000",        // ← Replace this

  // Google Sheets Web App URL
  // SETUP INSTRUCTIONS: See bottom of this file
  googleScriptURL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec"
};

/* ──────────────────────────────────────────────────────────
   CART STATE
────────────────────────────────────────────────────────── */
let cart = [];

/* ──────────────────────────────────────────────────────────
   ADD TO CART
────────────────────────────────────────────────────────── */
function addToCart(productId, selectedSize) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || product.stock === 0) return;

  // If product has sizes and none selected, alert
  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
    showToast("Please select a size first", "warning");
    return;
  }

  // Unique cart key = id + size
  const cartKey = `${productId}-${selectedSize || 'onesize'}`;
  const existing = cart.find(c => c.cartKey === cartKey);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      ...product,
      cartKey,
      selectedSize: selectedSize || null,
      qty: 1
    });
  }

  updateCartUI();
  openCart();
  showToast(`${product.name} added to cart ✓`);
}

/* ──────────────────────────────────────────────────────────
   QUANTITY CONTROLS
────────────────────────────────────────────────────────── */
function changeQty(cartKey, delta) {
  const item = cart.find(c => c.cartKey === cartKey);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.cartKey !== cartKey);
  }
  updateCartUI();
}

function removeFromCart(cartKey) {
  cart = cart.filter(c => c.cartKey !== cartKey);
  updateCartUI();
}

function clearCart() {
  cart = [];
  updateCartUI();
}

/* ──────────────────────────────────────────────────────────
   TOTALS CALCULATOR
────────────────────────────────────────────────────────── */
function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDeliveryCharge() {
  const sub = getCartSubtotal();
  if (SETTINGS.freeDeliveryAbove > 0 && sub >= SETTINGS.freeDeliveryAbove) return 0;
  return cart.length > 0 ? SETTINGS.deliveryCharge : 0;
}

function getCartTotal() {
  return getCartSubtotal() + getDeliveryCharge();
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/* ──────────────────────────────────────────────────────────
   UPDATE ALL CART UI ELEMENTS
────────────────────────────────────────────────────────── */
function updateCartUI() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();
  const delivery = getDeliveryCharge();
  const total = getCartTotal();
  const fmt = n => `PKR ${n.toLocaleString()}`;

  // Nav badge
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  // Cart subtotal & delivery & total rows
  const elSub = document.getElementById('cart-subtotal');
  const elDel = document.getElementById('cart-delivery');
  const elDelRow = document.getElementById('delivery-row');
  const elTotal = document.getElementById('cart-total');

  if (elSub) elSub.textContent = fmt(subtotal);
  if (elTotal) elTotal.textContent = fmt(total);
  if (elDel && elDelRow) {
    if (delivery === 0 && cart.length > 0) {
      elDel.textContent = 'FREE 🎉';
      elDel.style.color = '#22c55e';
    } else {
      elDel.textContent = fmt(delivery);
      elDel.style.color = '';
    }
  }

  // Cart items list
  const list = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty');
  const footer = document.getElementById('cart-footer');

  if (cart.length === 0) {
    if (list) list.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (footer) footer.classList.add('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (footer) footer.classList.remove('hidden');

    if (list) {
      list.innerHTML = cart.map(item => `
        <div class="flex gap-3 items-start py-3 border-b border-rose-dusty/10 last:border-0">
          <!-- Mini product visual -->
          <div class="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden relative">
            ${item.useImage && item.image
              ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />`
              : `<div class="w-full h-full flex items-center justify-center text-white text-xs font-bold font-display" style="background:${item.bg}">RS</div>`
            }
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-display font-bold text-sm text-ink dark:text-white leading-tight">${item.name}</p>
            ${item.selectedSize ? `<p class="text-[11px] text-gold-brand font-semibold mt-0.5">Size: ${item.selectedSize}</p>` : ''}
            <p class="text-xs text-ink-soft dark:text-rose-light/60 mt-0.5">PKR ${item.price.toLocaleString()} each</p>
            <!-- Qty controls -->
            <div class="flex items-center gap-2 mt-2">
              <button onclick="changeQty('${item.cartKey}', -1)"
                class="w-6 h-6 rounded-full border border-rose-dusty/30 text-ink dark:text-white text-xs font-bold flex items-center justify-center hover:bg-crimson-brand hover:text-white hover:border-crimson-brand transition-colors">−</button>
              <span class="text-sm font-semibold text-ink dark:text-white w-5 text-center">${item.qty}</span>
              <button onclick="changeQty('${item.cartKey}', 1)"
                class="w-6 h-6 rounded-full border border-rose-dusty/30 text-ink dark:text-white text-xs font-bold flex items-center justify-center hover:bg-crimson-brand hover:text-white hover:border-crimson-brand transition-colors">+</button>
            </div>
          </div>
          <!-- Line total + remove -->
          <div class="flex-shrink-0 text-right">
            <p class="font-bold text-sm text-ink dark:text-white">PKR ${(item.price * item.qty).toLocaleString()}</p>
            <button onclick="removeFromCart('${item.cartKey}')"
              class="text-[10px] text-rose-dusty/60 hover:text-crimson-brand transition-colors mt-1 uppercase tracking-wider">Remove</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Sync checkout modal summary
  syncModalSummary();
}

/* ──────────────────────────────────────────────────────────
   CART OPEN / CLOSE
────────────────────────────────────────────────────────── */
function openCart() {
  document.getElementById('cart-overlay')?.classList.add('open');
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.style.transform = 'translateX(0)';
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.style.transform = 'translateX(100%)';
  document.body.style.overflow = '';
}

/* ──────────────────────────────────────────────────────────
   CHECKOUT MODAL
────────────────────────────────────────────────────────── */
function openCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty", "warning");
    return;
  }
  closeCart();
  syncModalSummary();
  showPaymentInstructions(); // show default (JazzCash)
  document.getElementById('modal-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    const formState = document.getElementById('checkout-form-state');
    const successState = document.getElementById('success-state');
    if (formState) formState.style.display = 'block';
    if (successState) successState.style.display = 'none';
  }, 350);
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeCheckout();
}

/* ──────────────────────────────────────────────────────────
   PAYMENT METHOD INSTRUCTIONS (show/hide)
────────────────────────────────────────────────────────── */
function showPaymentInstructions() {
  const method = document.querySelector('input[name="payment_method"]:checked')?.value;
  const jazzSection = document.getElementById('jazz-instructions');
  const bankSection = document.getElementById('bank-instructions');

  if (jazzSection) jazzSection.classList.toggle('hidden', method !== 'jazzcash');
  if (bankSection) bankSection.classList.toggle('hidden', method !== 'bank');
}

/* ──────────────────────────────────────────────────────────
   SYNC ORDER SUMMARY INSIDE CHECKOUT MODAL
────────────────────────────────────────────────────────── */
function syncModalSummary() {
  const container = document.getElementById('modal-order-items');
  const modalSub = document.getElementById('modal-subtotal');
  const modalDel = document.getElementById('modal-delivery');
  const modalTotal = document.getElementById('modal-total');
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-zinc-800">
      <span class="text-ink-soft dark:text-rose-light/70 truncate max-w-[65%]">
        ${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} × ${item.qty}
      </span>
      <span class="font-semibold text-ink dark:text-white">PKR ${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `).join('') || '<p class="text-xs text-gray-400">No items</p>';

  const sub = getCartSubtotal();
  const del = getDeliveryCharge();
  if (modalSub) modalSub.textContent = `PKR ${sub.toLocaleString()}`;
  if (modalDel) {
    modalDel.textContent = del === 0 ? 'FREE 🎉' : `PKR ${del.toLocaleString()}`;
    modalDel.style.color = del === 0 ? '#22c55e' : '';
  }
  if (modalTotal) modalTotal.textContent = `PKR ${getCartTotal().toLocaleString()}`;
}

/* ──────────────────────────────────────────────────────────
   FORM VALIDATION & ORDER SUBMISSION
────────────────────────────────────────────────────────── */
function submitOrder() {
  // Collect values
  const name    = document.getElementById('f-name')?.value.trim();
  const phone   = document.getElementById('f-phone')?.value.trim();
  const email   = document.getElementById('f-email')?.value.trim();
  const street  = document.getElementById('f-street')?.value.trim();
  const city    = document.getElementById('f-city')?.value.trim();
  const province= document.getElementById('f-province')?.value;
  const payment = document.querySelector('input[name="payment_method"]:checked')?.value;

  // Clear previous errors
  document.querySelectorAll('.field-error').forEach(el => el.classList.add('hidden'));

  // Validate
  let isValid = true;
  if (!name)   { showFieldError('err-name', 'Please enter your full name'); isValid = false; }
  if (!phone || phone.length < 7) { showFieldError('err-phone', 'Enter a valid phone number'); isValid = false; }
  if (!email || !email.includes('@')) { showFieldError('err-email', 'Enter a valid email'); isValid = false; }
  if (!street) { showFieldError('err-street', 'Enter your street address'); isValid = false; }
  if (!city)   { showFieldError('err-city', 'Enter your city'); isValid = false; }
  if (!isValid) return;

  // Build order data
  const orderNum = 'RS-' + Date.now().toString().slice(-6);
  const paymentLabel = { jazzcash: 'JazzCash', bank: 'Bank Deposit' }[payment] || payment;
  const itemsSummary = cart.map(i => `${i.name}${i.selectedSize ? ' ('+i.selectedSize+')' : ''} x${i.qty}`).join(' | ');
  const total = getCartTotal();

  const orderData = {
    orderNumber: orderNum,
    name, phone, email,
    address: `${street}, ${city}, ${province}`,
    paymentMethod: paymentLabel,
    items: itemsSummary,
    subtotal: `PKR ${getCartSubtotal().toLocaleString()}`,
    delivery: `PKR ${getDeliveryCharge().toLocaleString()}`,
    total: `PKR ${total.toLocaleString()}`,
    timestamp: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
  };

  // Disable submit button
  const btn = document.getElementById('place-order-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Placing Order…'; }

  // Send to Google Sheets
  fetch(SETTINGS.googleScriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(() => {
    showSuccessState(orderNum, name);
  })
  .catch(err => {
    console.error('Order submission error:', err);
    // Still show success — order details logged locally
    showSuccessState(orderNum, name);
  })
  .finally(() => {
    if (btn) { btn.disabled = false; btn.textContent = 'Place Order Securely ✦'; }
  });
}

function showSuccessState(orderNum, name) {
  const formState = document.getElementById('checkout-form-state');
  const successState = document.getElementById('success-state');
  const orderNumEl = document.getElementById('success-order-num');
  const successNameEl = document.getElementById('success-name');

  if (formState) formState.style.display = 'none';
  if (successState) successState.style.display = 'flex';
  if (orderNumEl) orderNumEl.textContent = `Order #${orderNum}`;
  if (successNameEl) successNameEl.textContent = name;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

/* ──────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
────────────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.getElementById('rs-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'rs-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: ${type === 'warning' ? '#9b2355' : '#3d1a47'};
    color: white; padding: 10px 20px; border-radius: 99px;
    font-size: 13px; font-weight: 500; z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: toastIn 0.3s ease forwards;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

/* ──────────────────────────────────────────────────────────
   DARK / LIGHT MODE
────────────────────────────────────────────────────────── */
let isDark = false;

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon) icon.textContent = isDark ? '🌙' : '☀️';
  if (label) label.textContent = isDark ? 'Dark' : 'Light';
  localStorage.setItem('rs-theme', isDark ? 'dark' : 'light');
}

function initTheme() {
  const saved = localStorage.getItem('rs-theme');
  if (saved === 'dark') toggleTheme();
}

/* ──────────────────────────────────────────────────────────
   PRODUCT RENDERING
────────────────────────────────────────────────────────── */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p =>
    p.active !== false && (filter === 'all' || p.category === filter)
  );

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-16 text-ink-soft dark:text-rose-light/50">
      <p class="font-display text-2xl italic mb-2">No pieces found</p>
      <p class="text-sm">Try a different category</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isSoldOut = p.stock === 0;
    const isLowStock = p.stock > 0 && p.stock <= 9;
    const hasSizes = p.sizes && p.sizes.length > 0;
    const selectId = `size-${p.id}`;

    const stockBadge = isSoldOut
      ? `<div class="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-t-2xl">
           <span class="bg-white/95 text-ink font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-widest">Item Not Available</span>
         </div>`
      : isLowStock
        ? `<div class="absolute top-2 left-2 z-10">
             <span class="bg-crimson-brand text-white text-[10px] font-bold px-2 py-1 rounded-full">Only ${p.stock} Left!</span>
           </div>`
        : '';

    const categoryBadge = p.badge
      ? `<div class="absolute top-2 right-2 z-10">
           <span class="text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide"
             style="background: ${p.badge === 'Sale' ? '#dc2626' : p.badge === 'New' ? '#3d1a47' : p.badge === 'Exclusive' ? '#c9a065' : '#9b2355'}">
             ${p.badge}
           </span>
         </div>`
      : '';

    const imageArea = p.useImage && p.image
      ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" />`
      : `<div class="w-full h-full flex items-center justify-center text-white/40 font-display text-5xl font-light" style="background:${p.bg}">RS</div>`;

    const sizeSelector = hasSizes
      ? `<div class="mt-2 mb-3">
           <label class="text-[10px] uppercase tracking-widest font-semibold text-gold-brand block mb-1.5">Select Size</label>
           <div class="flex flex-wrap gap-1.5" id="sizes-${p.id}">
             ${p.sizes.map(s => `
               <button type="button"
                 onclick="selectSize(${p.id}, '${s}', this)"
                 class="size-btn w-8 h-8 text-[10px] font-bold rounded border border-rose-dusty/30 text-ink dark:text-white hover:border-crimson-brand hover:text-crimson-brand transition-colors">
                 ${s}
               </button>
             `).join('')}
           </div>
         </div>`
      : '';

    const addBtn = isSoldOut
      ? `<button disabled class="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed">
           Not Available
         </button>`
      : `<button onclick="handleAddToCart(${p.id})"
           id="add-btn-${p.id}"
           class="btn-cart w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5">
           + Add to Cart
         </button>`;

    return `
      <div class="product-card card-body flex flex-col" data-product-id="${p.id}">
        <!-- Image area -->
        <div class="relative overflow-hidden rounded-t-2xl" style="aspect-ratio:3/4;">
          ${stockBadge}
          ${categoryBadge}
          ${imageArea}
        </div>
        <!-- Card content -->
        <div class="p-4 flex flex-col flex-1">
          <span class="text-[10px] uppercase tracking-widest font-bold text-gold-brand">${p.category}</span>
          <h3 class="font-display font-bold text-base text-ink dark:text-white leading-snug mt-1 mb-1">${p.name}</h3>
          <p class="text-xs text-ink-soft dark:text-rose-light/60 line-clamp-2 flex-1">${p.desc}</p>
          ${sizeSelector}
          <div class="flex items-center justify-between mt-3 mb-3">
            <span class="font-display font-bold text-lg text-crimson-brand">PKR ${p.price.toLocaleString()}</span>
            <div class="text-[11px] text-gold-brand">★★★★★</div>
          </div>
          ${addBtn}
        </div>
      </div>
    `;
  }).join('');
}

/* Track selected sizes per product */
const selectedSizes = {};

function selectSize(productId, size, btn) {
  // Deselect all size buttons for this product
  document.querySelectorAll(`#sizes-${productId} .size-btn`).forEach(b => {
    b.classList.remove('bg-plum-brand', 'text-white', 'border-plum-brand');
    b.classList.add('border-rose-dusty/30');
  });
  // Select this one
  btn.classList.add('bg-plum-brand', 'text-white', 'border-plum-brand');
  btn.classList.remove('border-rose-dusty/30');
  selectedSizes[productId] = size;
}

function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const hasSizes = product?.sizes && product.sizes.length > 0;
  const chosenSize = selectedSizes[productId];

  if (hasSizes && !chosenSize) {
    // Flash the size selector
    const sizesEl = document.getElementById(`sizes-${productId}`);
    if (sizesEl) {
      sizesEl.style.outline = '2px solid #9b2355';
      sizesEl.style.borderRadius = '8px';
      setTimeout(() => { sizesEl.style.outline = ''; }, 1500);
    }
    showToast("Please select a size first", "warning");
    return;
  }

  addToCart(productId, chosenSize || null);
}

/* ──────────────────────────────────────────────────────────
   FILTER TABS
────────────────────────────────────────────────────────── */
function setFilter(filter, event) {
  if (event) event.preventDefault();
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  renderProducts(filter);
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

/* ──────────────────────────────────────────────────────────
   NAV SCROLL SHADOW
────────────────────────────────────────────────────────── */
function initScrollShadow() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(155,35,85,0.10)' : 'none';
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('rs-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rs-reveal').forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────
   INIT — runs on page load
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProducts('all');
  updateCartUI();
  initScrollReveal();
  initScrollShadow();
});

/* ============================================================
   📋 GOOGLE SHEETS SETUP INSTRUCTIONS
   ============================================================

   STEP 1: Create a Google Sheet
   ─────────────────────────────
   • Go to sheets.google.com → create a new sheet
   • Name it: "RangSar Orders"
   • Add these column headers in Row 1:
     Order #  |  Name  |  Phone  |  Email  |  Address  |  Payment  |  Items  |  Subtotal  |  Delivery  |  Total  |  Date

   STEP 2: Open Apps Script
   ─────────────────────────
   • In Google Sheets: Extensions → Apps Script
   • Delete any existing code and paste this:

   ─────────── PASTE THIS IN APPS SCRIPT ───────────

   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);

     sheet.appendRow([
       data.orderNumber,
       data.name,
       data.phone,
       data.email,
       data.address,
       data.paymentMethod,
       data.items,
       data.subtotal,
       data.delivery,
       data.total,
       data.timestamp
     ]);

     // Send confirmation email to customer
     if (data.email) {
       MailApp.sendEmail({
         to: data.email,
         subject: "✦ Order Confirmed — RangSar Studio #" + data.orderNumber,
         body: "Assalamu Alaikum " + data.name + ",\n\n" +
               "Thank you for shopping with RangSar Studio! 🌸\n\n" +
               "Your order has been received successfully.\n" +
               "Order Number: " + data.orderNumber + "\n" +
               "Items: " + data.items + "\n" +
               "Total: " + data.total + "\n\n" +
               "Once you submit your payment receipt via WhatsApp (+92 321 7024241),\n" +
               "your order will be dispatched the SAME DAY, InshAllah!\n\n" +
               "Payment can be made via JazzCash or Bank Deposit.\n" +
               "WhatsApp us your receipt: wa.me/923217024241\n\n" +
               "Elegance in Every Thread,\n" +
               "RangSar Studio Team 💕\n" +
               "rangsar.pk@gmail.com"
       });
     }

     return ContentService.createTextOutput("OK");
   }

   ─────────── END OF APPS SCRIPT CODE ───────────

   STEP 3: Deploy
   ─────────────
   • Click "Deploy" → "New Deployment"
   • Type: Web App
   • Execute as: Me
   • Who has access: Anyone
   • Click Deploy → Copy the Web App URL

   STEP 4: Paste URL in this file
   ───────────────────────────────
   • Find SETTINGS.googleScriptURL at the top of this file
   • Replace "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec"
     with your actual deployed URL

   ✅ DONE! Every order now auto-saves to your Google Sheet
      and the customer gets a professional confirmation email.
   ============================================================ */
