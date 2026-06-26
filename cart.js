/* ============================================================
   RANGSAR STUDIO — CART.JS
   Cart · Checkout · Discount Codes · Lightbox · Google Sheets
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   ⚙️  SETTINGS — Only edit values here
────────────────────────────────────────────────────────── */
const SETTINGS = {
  deliveryCharge:    250,
  freeDeliveryAbove: 5000,
  whatsappNumber:    "923217024241",
  storeEmail:        "rangsar.pk@gmail.com",
  jazzCashNumber:    "03248556481",
  jazzCashName:      "Um Hani",
  bankName:          "Meezan Bank",
  bankAccountTitle:  "UME HANI",
  bankAccountNumber: "21010102725045",   // ← Replace with real account number
  bankIBAN:          "PK37MEZN0021010102725045", // ← Replace with real IBAN
  googleScriptURL:   "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec"
};

/* ──────────────────────────────────────────────────────────
   CART STATE
────────────────────────────────────────────────────────── */
let cart            = [];
let appliedDiscount = null;  // { code, type, value, label }

/* ──────────────────────────────────────────────────────────
   ADD TO CART
────────────────────────────────────────────────────────── */
function addToCart(productId, selectedSize) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || product.stock === 0) return;

  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
    showToast("Please select a size first", "warning");
    return;
  }

  const cartKey  = `${productId}-${selectedSize || 'onesize'}`;
  const existing = cart.find(c => c.cartKey === cartKey);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, cartKey, selectedSize: selectedSize || null, qty: 1 });
  }

  updateCartUI();
  openCart();
  showToast(`${product.name} added to bag ✓`);
}

/* ──────────────────────────────────────────────────────────
   QUANTITY CONTROLS
────────────────────────────────────────────────────────── */
function changeQty(cartKey, delta) {
  const item = cart.find(c => c.cartKey === cartKey);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.cartKey !== cartKey);
  updateCartUI();
}

function removeFromCart(cartKey) {
  cart = cart.filter(c => c.cartKey !== cartKey);
  updateCartUI();
}

function clearCart() {
  cart            = [];
  appliedDiscount = null;
  updateCartUI();
}

/* ──────────────────────────────────────────────────────────
   TOTALS
────────────────────────────────────────────────────────── */
function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDiscountAmount() {
  if (!appliedDiscount) return 0;
  const sub = getCartSubtotal();
  return appliedDiscount.type === 'percent'
    ? Math.round(sub * appliedDiscount.value / 100)
    : Math.min(appliedDiscount.value, sub);
}

function getDeliveryCharge() {
  const sub = getCartSubtotal();
  if (SETTINGS.freeDeliveryAbove > 0 && sub >= SETTINGS.freeDeliveryAbove) return 0;
  return cart.length > 0 ? SETTINGS.deliveryCharge : 0;
}

function getCartTotal() {
  return Math.max(0, getCartSubtotal() - getDiscountAmount() + getDeliveryCharge());
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/* ──────────────────────────────────────────────────────────
   DISCOUNT CODE LOGIC
────────────────────────────────────────────────────────── */
function applyDiscountCode() {
  const input = document.getElementById('discount-input');
  const msgEl = document.getElementById('discount-msg');
  if (!input || !msgEl) return;

  const code  = input.value.trim().toUpperCase();
  if (!code) { showDiscountMsg('Please enter a discount code', 'error'); return; }

  const found = DISCOUNT_CODES[code];
  if (!found) {
    input.style.borderColor = '#9b2355';
    showDiscountMsg('❌ Invalid code. Please check and try again.', 'error');
    return;
  }

  appliedDiscount = { code, ...found };
  input.style.borderColor = '#22c55e';
  showDiscountMsg(`✓ "${code}" applied — ${found.label}!`, 'success');
  showToast(`Discount applied: ${found.label} 🎉`);
  updateCartUI();
}

function removeDiscount() {
  appliedDiscount = null;
  const input = document.getElementById('discount-input');
  if (input) { input.value = ''; input.style.borderColor = ''; }
  showDiscountMsg('', '');
  updateCartUI();
  showToast('Discount removed');
}

function showDiscountMsg(msg, type) {
  const el = document.getElementById('discount-msg');
  if (!el) return;
  el.textContent    = msg;
  el.style.color    = type === 'success' ? '#22c55e' : type === 'error' ? '#9b2355' : '';
  el.style.display  = msg ? 'block' : 'none';
}

function handleDiscountKeypress(e) {
  if (e.key === 'Enter') applyDiscountCode();
}

/* ──────────────────────────────────────────────────────────
   UPDATE ALL CART UI
────────────────────────────────────────────────────────── */
function updateCartUI() {
  const count    = getCartCount();
  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryCharge();
  const total    = getCartTotal();
  const fmt      = n => `PKR ${n.toLocaleString()}`;

  // Nav badge
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  // Drawer totals
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('cart-subtotal', fmt(subtotal));
  set('cart-total',    fmt(total));

  const disRow = document.getElementById('discount-row');
  const disTxt = document.getElementById('cart-discount');
  if (disRow) disRow.style.display = appliedDiscount ? 'flex' : 'none';
  if (disTxt) disTxt.textContent   = `− ${fmt(discount)} (${appliedDiscount?.label || ''})`;

  const removeBtn = document.getElementById('remove-discount-btn');
  if (removeBtn) removeBtn.style.display = appliedDiscount ? 'inline-flex' : 'none';

  const delEl = document.getElementById('cart-delivery');
  if (delEl) {
    delEl.textContent = delivery === 0 && cart.length > 0 ? 'FREE 🎉' : fmt(delivery);
    delEl.style.color = delivery === 0 && cart.length > 0 ? '#22c55e' : '';
  }

  // Items list
  const list       = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty');
  const footer     = document.getElementById('cart-footer');

  if (cart.length === 0) {
    if (list)       list.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (footer)     footer.classList.add('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (footer)     footer.classList.remove('hidden');

    if (list) {
      list.innerHTML = cart.map(item => `
        <div class="flex gap-3 items-start py-3 border-b border-rose-dusty/10 last:border-0">
          <!-- Thumbnail -->
          <div class="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
            ${item.useImage && item.image
              ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />`
              : `<div class="w-full h-full flex items-center justify-center font-display text-white/60 text-lg" style="background:${item.bg}">RS</div>`
            }
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-display font-bold text-sm text-ink dark:text-white leading-tight">${item.name}</p>
            ${item.selectedSize ? `<p class="text-[11px] text-gold-brand font-semibold mt-0.5">Size: ${item.selectedSize}</p>` : ''}
            <p class="text-xs text-ink-soft dark:text-rose-light/60 mt-0.5">PKR ${item.price.toLocaleString()} each</p>
            <div class="flex items-center gap-2 mt-2">
              <button onclick="changeQty('${item.cartKey}', -1)"
                class="w-6 h-6 rounded-full border border-rose-dusty/30 text-ink dark:text-white text-sm font-bold flex items-center justify-center hover:bg-crimson-brand hover:text-white hover:border-crimson-brand transition-colors">−</button>
              <span class="text-sm font-semibold text-ink dark:text-white w-5 text-center">${item.qty}</span>
              <button onclick="changeQty('${item.cartKey}', 1)"
                class="w-6 h-6 rounded-full border border-rose-dusty/30 text-ink dark:text-white text-sm font-bold flex items-center justify-center hover:bg-crimson-brand hover:text-white hover:border-crimson-brand transition-colors">+</button>
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
  if (cart.length === 0) { showToast("Your cart is empty", "warning"); return; }
  closeCart();
  syncModalSummary();
  showPaymentInstructions();
  document.getElementById('modal-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    const f = document.getElementById('checkout-form-state');
    const s = document.getElementById('success-state');
    if (f) f.style.display = 'block';
    if (s) s.style.display = 'none';
  }, 350);
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeCheckout();
}

/* ──────────────────────────────────────────────────────────
   PAYMENT INSTRUCTIONS (show/hide panel)
────────────────────────────────────────────────────────── */
function showPaymentInstructions() {
  const method = document.querySelector('input[name="payment_method"]:checked')?.value;
  document.getElementById('jazz-instructions')?.classList.toggle('hidden', method !== 'jazzcash');
  document.getElementById('bank-instructions')?.classList.toggle('hidden', method !== 'bank');
}

/* ──────────────────────────────────────────────────────────
   SYNC MODAL ORDER SUMMARY
────────────────────────────────────────────────────────── */
function syncModalSummary() {
  const container   = document.getElementById('modal-order-items');
  const modalSub    = document.getElementById('modal-subtotal');
  const modalDisRow = document.getElementById('modal-discount-row');
  const modalDis    = document.getElementById('modal-discount');
  const modalDel    = document.getElementById('modal-delivery');
  const modalTotal  = document.getElementById('modal-total');
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="flex justify-between text-xs py-1 border-b border-rose-dusty/10">
      <span class="text-ink-soft dark:text-rose-light/70 truncate max-w-[65%]">
        ${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} × ${item.qty}
      </span>
      <span class="font-semibold text-ink dark:text-white">PKR ${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `).join('') || '<p class="text-xs text-gray-400">No items</p>';

  const sub      = getCartSubtotal();
  const discount = getDiscountAmount();
  const del      = getDeliveryCharge();

  if (modalSub)    modalSub.textContent    = `PKR ${sub.toLocaleString()}`;
  if (modalDisRow) modalDisRow.style.display = appliedDiscount ? 'flex' : 'none';
  if (modalDis)    modalDis.textContent    = `− PKR ${discount.toLocaleString()} (${appliedDiscount?.label || ''})`;
  if (modalDel) {
    modalDel.textContent = del === 0 ? 'FREE 🎉' : `PKR ${del.toLocaleString()}`;
    modalDel.style.color = del === 0 ? '#22c55e' : '';
  }
  if (modalTotal)  modalTotal.textContent  = `PKR ${getCartTotal().toLocaleString()}`;
}

/* ──────────────────────────────────────────────────────────
   ORDER SUBMISSION
────────────────────────────────────────────────────────── */
function submitOrder() {
  const name     = document.getElementById('f-name')?.value.trim();
  const phone    = document.getElementById('f-phone')?.value.trim();
  const email    = document.getElementById('f-email')?.value.trim();
  const street   = document.getElementById('f-street')?.value.trim();
  const city     = document.getElementById('f-city')?.value.trim();
  const province = document.getElementById('f-province')?.value;
  const payment  = document.querySelector('input[name="payment_method"]:checked')?.value;

  document.querySelectorAll('.field-error').forEach(el => el.classList.add('hidden'));

  let ok = true;
  if (!name)                          { showFieldError('err-name',   'Please enter your full name'); ok = false; }
  if (!phone || phone.length < 7)     { showFieldError('err-phone',  'Enter a valid phone number');  ok = false; }
  if (!email || !email.includes('@')) { showFieldError('err-email',  'Enter a valid email');          ok = false; }
  if (!street)                        { showFieldError('err-street', 'Enter your street address');    ok = false; }
  if (!city)                          { showFieldError('err-city',   'Enter your city');              ok = false; }
  if (!ok) return;

  const orderNum     = 'RS-' + Date.now().toString().slice(-6);
  const paymentLabel = { jazzcash: 'JazzCash', bank: 'Bank Deposit' }[payment] || payment;
  const itemsSummary = cart.map(i => `${i.name}${i.selectedSize?` (${i.selectedSize})`:''} x${i.qty}`).join(' | ');
  const discountLine = appliedDiscount
    ? `${appliedDiscount.code}: -PKR ${getDiscountAmount().toLocaleString()}`
    : 'None';

  const orderData = {
    orderNumber:   orderNum,
    name, phone, email,
    address:       `${street}, ${city}, ${province}`,
    paymentMethod: paymentLabel,
    items:         itemsSummary,
    subtotal:      `PKR ${getCartSubtotal().toLocaleString()}`,
    discount:      discountLine,
    delivery:      `PKR ${getDeliveryCharge().toLocaleString()}`,
    total:         `PKR ${getCartTotal().toLocaleString()}`,
    timestamp:     new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
  };

  const btn = document.getElementById('place-order-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Placing Order…'; }

  fetch(SETTINGS.googleScriptURL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(()  => showSuccessState(orderNum, name))
  .catch(()  => showSuccessState(orderNum, name))
  .finally(() => { if (btn) { btn.disabled = false; btn.textContent = 'Place Order Securely ✦'; } });
}

function showSuccessState(orderNum, name) {
  document.getElementById('checkout-form-state').style.display = 'none';
  const s = document.getElementById('success-state');
  if (s) s.style.display = 'flex';
  const on = document.getElementById('success-order-num');
  if (on) on.textContent = `Order #${orderNum}`;
  const sn = document.getElementById('success-name');
  if (sn) sn.textContent = name;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

/* ──────────────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  document.getElementById('rs-toast')?.remove();
  const t = document.createElement('div');
  t.id = 'rs-toast';
  t.textContent = message;
  t.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background:${type === 'warning' ? '#9b2355' : '#3d1a47'};
    color:white; padding:10px 22px; border-radius:99px;
    font-size:13px; font-weight:500; z-index:9999;
    box-shadow:0 4px 20px rgba(0,0,0,0.25);
    animation:toastIn 0.3s ease forwards; white-space:nowrap;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

/* ──────────────────────────────────────────────────────────
   DARK / LIGHT MODE
────────────────────────────────────────────────────────── */
let isDark = false;

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);
  const icon  = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon)  icon.textContent  = isDark ? '🌙' : '☀️';
  if (label) label.textContent = isDark ? 'Dark' : 'Light';
  localStorage.setItem('rs-theme', isDark ? 'dark' : 'light');
}

function initTheme() {
  if (localStorage.getItem('rs-theme') === 'dark') toggleTheme();
}

/* ──────────────────────────────────────────────────────────
   LIGHTBOX — opens full product photo + description
   Works for BOTH real images AND gradient-only cards
────────────────────────────────────────────────────────── */
function openLightbox(src, title, desc, bg) {
  // Remove any existing lightbox
  document.getElementById('rs-lightbox')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'rs-lightbox';
  overlay.style.cssText = `
    position:fixed; inset:0;
    background:rgba(18,8,10,0.94);
    z-index:1000;
    display:flex; align-items:center; justify-content:center;
    padding:1rem;
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    animation:lbFadeIn 0.28s ease;
  `;

  // Build inner content
  const hasImage = src && src.trim() !== '';

  const visualHTML = hasImage
    ? `<div style="border-radius:1.25rem; overflow:hidden; max-height:62vh;
                   box-shadow:0 24px 64px rgba(0,0,0,0.6); margin-bottom:1.25rem;">
         <img src="${src}" alt="${title}"
           style="width:100%; max-height:62vh; object-fit:contain; display:block; background:#1a0d11;" />
       </div>`
    : `<div style="border-radius:1.25rem; overflow:hidden; height:260px; margin-bottom:1.25rem;
                   box-shadow:0 24px 64px rgba(0,0,0,0.5);
                   background:${bg || 'linear-gradient(135deg,#9b2355,#3d1a47)'};
                   display:flex; align-items:center; justify-content:center;">
         <div style="text-align:center;">
           <p style="font-family:'Cormorant Garamond',serif; font-size:3rem; font-weight:900;
                      color:rgba(255,255,255,0.25); letter-spacing:0.15em;">RS</p>
           <p style="font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600;
                      color:rgba(255,255,255,0.7); margin-top:0.5rem; font-style:italic;">
             ${title}
           </p>
         </div>
       </div>`;

  overlay.innerHTML = `
    <div style="max-width:500px; width:100%; text-align:center; cursor:default; position:relative;"
         onclick="event.stopPropagation()">

      <!-- Close button -->
      <button onclick="closeLightbox()" style="
        position:absolute; top:-12px; right:-12px;
        width:36px; height:36px; border-radius:50%;
        background:rgba(255,255,255,0.12);
        border:1.5px solid rgba(255,255,255,0.25);
        color:white; font-size:1rem; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        z-index:10; transition:background 0.2s;">✕</button>

      <!-- Visual -->
      ${visualHTML}

      <!-- Product name -->
      <h3 style="
        font-family:'Cormorant Garamond',Georgia,serif;
        font-size:1.75rem; font-weight:700;
        color:#fff; margin-bottom:0.5rem; line-height:1.2;">
        ${title}
      </h3>

      <!-- Description -->
      <p style="
        font-size:0.85rem; color:rgba(250,240,243,0.72);
        line-height:1.8; max-width:420px; margin:0 auto 1.25rem;">
        ${desc}
      </p>

      <!-- Gold divider -->
      <div style="height:1px; background:linear-gradient(to right,transparent,rgba(201,160,101,0.5),transparent); margin-bottom:1.25rem;"></div>

      <!-- Close hint -->
      <p style="font-size:0.65rem; color:rgba(255,255,255,0.22); letter-spacing:0.15em; text-transform:uppercase;">
        Tap outside or press ESC to close
      </p>
    </div>
  `;

  // Close on background click
  overlay.addEventListener('click', closeLightbox);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Inject keyframe if not present
  if (!document.getElementById('lb-style')) {
    const style = document.createElement('style');
    style.id = 'lb-style';
    style.textContent = '@keyframes lbFadeIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }';
    document.head.appendChild(style);
  }
}

function closeLightbox() {
  document.getElementById('rs-lightbox')?.remove();
  document.body.style.overflow = '';
}

// Escape key closes everything
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeCheckout(); closeCart(); }
});

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
    grid.innerHTML = `
      <div class="col-span-full text-center py-16 text-ink-soft dark:text-rose-light/50">
        <p class="font-display text-2xl italic mb-2">No pieces found</p>
        <p class="text-sm">Try a different category</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isSoldOut  = p.stock === 0;
    const isLowStock = p.stock > 0 && p.stock <= 9;
    const hasSizes   = p.sizes && p.sizes.length > 0;

    // Escape strings for use inside onclick attributes
    const safeTitle = p.name.replace(/'/g, "&#39;").replace(/"/g, '&quot;');
    const safeDesc  = p.desc.replace(/'/g, "&#39;").replace(/"/g, '&quot;');
    const safeBg    = (p.bg || '').replace(/'/g, "&#39;");

    /* ── Stock overlay ── */
    const stockOverlay = isSoldOut
      ? `<div class="absolute inset-0 bg-black/55 flex items-center justify-center z-10" style="border-radius:1.25rem 1.25rem 0 0;">
           <span class="bg-white/95 text-ink font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest shadow">Item Not Available</span>
         </div>`
      : isLowStock
        ? `<div class="absolute top-2 left-2 z-10">
             <span style="background:#9b2355;" class="text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">Only ${p.stock} Left!</span>
           </div>`
        : '';

    /* ── Category/promo badge ── */
    const promoBadge = p.badge
      ? `<div class="absolute top-2 right-2 z-10">
           <span class="text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow"
             style="background:${p.badge==='Sale'?'#dc2626':p.badge==='New'?'#3d1a47':p.badge==='Exclusive'||p.badge==='Premium'?'#c9a065':'#9b2355'}">
             ${p.badge}
           </span>
         </div>`
      : '';

    /* ── View/Zoom icon shown on hover ── */
    const zoomIcon = `
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
           style="background:rgba(18,8,10,0.18);">
        <div style="width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.92);
                    display:flex;align-items:center;justify-content:center;font-size:1.1rem;
                    box-shadow:0 4px 16px rgba(0,0,0,0.3);">🔍</div>
      </div>`;

    /* ── Image area ──
         • Accessories with real image → square (1:1) so earrings don't stretch tall
         • All other real images       → 3:4 portrait (suits look great)
         • Gradient fallback           → 3:4 portrait with RS text
    ── */
    const isAccessory  = p.category === 'accessories';
    const aspectClass  = isAccessory ? '' : '';
    const aspectStyle  = isAccessory
      ? 'aspect-ratio:1/1;'        // square for accessories (earrings, bags etc.)
      : 'aspect-ratio:3/4;';       // portrait for suits/lawn

    const imageArea = p.useImage && p.image
      ? `<div class="relative overflow-hidden group cursor-zoom-in"
              style="${aspectStyle}border-radius:1.25rem 1.25rem 0 0;"
              onclick="openLightbox('${p.image}','${safeTitle}','${safeDesc}','${safeBg}')">
           ${stockOverlay}
           ${promoBadge}
           <img src="${p.image}" alt="${p.name}"
             style="width:100%;height:100%;object-fit:${isAccessory?'contain':'cover'};
                    object-position:center;display:block;padding:${isAccessory?'0.5rem':'0'};
                    background:${isAccessory?'#fff8f9':'transparent'};
                    transition:transform 0.5s ease;"
             class="group-hover:scale-105"
             loading="lazy" />
           ${zoomIcon}
         </div>`
      : `<div class="relative overflow-hidden group cursor-zoom-in"
              style="${aspectStyle}border-radius:1.25rem 1.25rem 0 0;background:${p.bg};"
              onclick="openLightbox('','${safeTitle}','${safeDesc}','${safeBg}')">
           ${stockOverlay}
           ${promoBadge}
           <div class="w-full h-full flex items-center justify-center"
                style="font-family:'Cormorant Garamond',serif;font-size:3.5rem;
                       font-weight:300;color:rgba(255,255,255,0.2);letter-spacing:0.12em;
                       transition:transform 0.5s ease;"
                class="group-hover:scale-105">
             RS
           </div>
           ${zoomIcon}
         </div>`;

    /* ── Size selector (hidden for accessories) ── */
    const sizeSelector = hasSizes
      ? `<div class="mt-2 mb-3">
           <label class="text-[10px] uppercase tracking-widest font-semibold text-gold-brand block mb-1.5">Select Size</label>
           <div class="flex flex-wrap gap-1.5" id="sizes-${p.id}">
             ${p.sizes.map(s => `
               <button type="button" onclick="selectSize(${p.id},'${s}',this)"
                 class="size-btn w-8 h-8 text-[10px] font-bold rounded-lg border border-rose-dusty/30
                        text-ink dark:text-white hover:border-crimson-brand hover:text-crimson-brand transition-colors">
                 ${s}
               </button>`).join('')}
           </div>
         </div>`
      : '';

    /* ── Add to cart button ── */
    const addBtn = isSoldOut
      ? `<button disabled
           class="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider
                  bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed">
           Not Available
         </button>`
      : `<button onclick="handleAddToCart(${p.id})" id="add-btn-${p.id}"
           class="btn-cart w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5">
           + Add to Cart
         </button>`;

    return `
      <div class="product-card card-body flex flex-col" data-product-id="${p.id}">
        ${imageArea}
        <div class="p-4 flex flex-col flex-1">
          <span class="text-[10px] uppercase tracking-widest font-bold text-gold-brand">${p.category}</span>
          <h3 class="font-display font-bold text-base text-ink dark:text-white leading-snug mt-1 mb-1">${p.name}</h3>
          <p class="text-xs text-ink-soft dark:text-rose-light/60 leading-relaxed mb-2 flex-1">${p.desc}</p>
          ${sizeSelector}
          <div class="flex items-center justify-between mt-2 mb-3">
            <span class="font-display font-bold text-lg text-crimson-brand">PKR ${p.price.toLocaleString()}</span>
            <span class="text-[11px] text-gold-brand">★★★★★</span>
          </div>
          ${addBtn}
        </div>
      </div>`;
  }).join('');
}

/* ──────────────────────────────────────────────────────────
   SIZE SELECTION
────────────────────────────────────────────────────────── */
const selectedSizes = {};

function selectSize(productId, size, btn) {
  // Clear all selected for this product
  document.querySelectorAll(`#sizes-${productId} .size-btn`).forEach(b => {
    b.style.background = '';
    b.style.color      = '';
    b.style.borderColor = '';
    b.classList.remove('selected-size');
  });
  // Highlight clicked
  btn.style.background  = '#3d1a47';
  btn.style.color       = '#fff';
  btn.style.borderColor = '#3d1a47';
  btn.classList.add('selected-size');
  selectedSizes[productId] = size;
}

function handleAddToCart(productId) {
  const product  = PRODUCTS.find(p => p.id === productId);
  const hasSizes = product?.sizes && product.sizes.length > 0;
  const chosen   = selectedSizes[productId];

  if (hasSizes && !chosen) {
    const sizesEl = document.getElementById(`sizes-${productId}`);
    if (sizesEl) {
      sizesEl.style.outline      = '2px solid #9b2355';
      sizesEl.style.borderRadius = '8px';
      setTimeout(() => { sizesEl.style.outline = ''; }, 1500);
    }
    showToast("Please select a size first", "warning");
    return;
  }
  addToCart(productId, chosen || null);
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
   SCROLL SHADOW + SCROLL REVEAL
────────────────────────────────────────────────────────── */
function initScrollShadow() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) nav.style.boxShadow = window.scrollY > 20
      ? '0 2px 20px rgba(155,35,85,0.12)'
      : 'none';
  }, { passive: true });
}

function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('rs-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rs-reveal').forEach(el => obs.observe(el));
}

/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProducts('all');
  updateCartUI();
  initScrollReveal();
  initScrollShadow();
});

/* ============================================================
   📊 GOOGLE SHEETS SETUP — paste this in Apps Script
   ============================================================
   function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data  = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.orderNumber,
    data.name,
    data.phone,
    data.email,
    data.address,
    data.paymentMethod,
    data.items,
    data.subtotal,
    data.discount,
    data.delivery,
    data.total,
    data.timestamp
  ]);

  if (data.email) {
    MailApp.sendEmail({
      to: data.email,
      subject: "✦ Order Confirmed — RangSar Studio #" + data.orderNumber,
      body:
          "Assalamu Alaikum " + data.name + ",\n\n"
        + "Your order has been received! 🌸\n\n"
        + "Order #:   " + data.orderNumber + "\n"
        + "Items:     " + data.items + "\n"
        + "Discount:  " + data.discount + "\n"
        + "Total:     " + data.total + "\n\n"
        + "Once you send your payment receipt on WhatsApp (+92 321 7024241),\n"
        + "your order will be dispatched the same day, InshAllah! 🌸\n\n"
        + "Elegance in Every Thread,\n"
        + "RangSar Studio Team 💕\n"
        + "rangsar.pk@gmail.com"
    });
  }

  return ContentService.createTextOutput("OK");
}
   ============================================================ */
