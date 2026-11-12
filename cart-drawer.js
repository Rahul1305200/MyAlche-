(function () {
  'use strict';

  const CART_KEY = 'myalche_cart';
  let checkoutUrl = 'cart redesign.html';
  let productUrl = 'product single redesign.html';

  const style = document.createElement('style');
  style.textContent = `
    html.cart-drawer-open{overflow:hidden;}
    .cart-drawer-backdrop{
      position:fixed;inset:0;background:rgba(30,39,73,.48);
      opacity:0;visibility:hidden;pointer-events:none;
      transition:opacity .28s ease,visibility .28s ease;
      z-index:260;
    }
    .cart-drawer-backdrop.show{opacity:1;visibility:visible;pointer-events:auto;}
    .cart-drawer{
      position:fixed;top:0;right:0;bottom:0;left:auto;
      width:min(420px,100vw);
      background:#fff;
      box-shadow:-8px 0 40px rgba(30,39,73,.18);
      transform:translateX(100%);
      transition:transform .34s cubic-bezier(.4,0,.2,1);
      z-index:270;
      display:flex;flex-direction:column;
      font-family:"Lato",Arial,Helvetica,sans-serif;
    }
    .cart-drawer.open{transform:translateX(0);}
    .cart-drawer-head{
      display:flex;align-items:center;justify-content:space-between;gap:12px;
      padding:20px 22px 16px;border-bottom:1px solid #eeece4;
      flex:none;
    }
    .cart-drawer-head h2{
      margin:0;font-family:"Poppins","Lato",Arial,sans-serif;
      font-size:18px;font-weight:700;color:#1a1f2e;
    }
    .cart-drawer-close{
      width:36px;height:36px;border-radius:999px;
      border:1px solid #e8e6df;background:#fff;color:#5c5e70;
      display:flex;align-items:center;justify-content:center;
      font-size:22px;line-height:1;cursor:pointer;
      transition:border-color .15s,color .15s;
    }
    .cart-drawer-close:hover{border-color:#4a7a2e;color:#4a7a2e;}
    .cart-drawer-body{
      flex:1;overflow-y:auto;padding:8px 22px 16px;
    }
    .cart-drawer-empty{
      text-align:center;padding:48px 12px;color:#5c5e70;
    }
    .cart-drawer-empty p{margin:0 0 16px;font-size:15px;}
    .cart-drawer-empty a{
      display:inline-block;padding:10px 18px;border-radius:999px;
      background:#eaf3dc;color:#4a7a2e;font-weight:700;font-size:13.5px;
    }
    .cart-drawer-item{
      display:grid;grid-template-columns:72px 1fr;gap:14px;
      padding:18px 0;border-bottom:1px solid #f0eee6;
    }
    .cart-drawer-item:last-child{border-bottom:none;}
    .cart-drawer-thumb{
      position:relative;width:72px;height:72px;border-radius:10px;
      overflow:hidden;background:#f7f6f1;flex:none;
    }
    .cart-drawer-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
    .cart-drawer-remove{
      position:absolute;top:-6px;left:-6px;width:22px;height:22px;
      border-radius:999px;background:#fff;border:1px solid #e8e6df;
      color:#5c5e70;font-size:14px;line-height:1;
      display:flex;align-items:center;justify-content:center;cursor:pointer;
      box-shadow:0 2px 6px rgba(0,0,0,.08);
    }
    .cart-drawer-remove:hover{color:#c94b3a;border-color:#c94b3a;}
    .cart-drawer-info{min-width:0;}
    .cart-drawer-row{
      display:flex;align-items:flex-start;justify-content:space-between;gap:10px;
    }
    .cart-drawer-name{
      font-size:14.5px;font-weight:700;color:#1a1f2e;line-height:1.35;
    }
    .cart-drawer-price{
      font-size:14.5px;font-weight:700;color:#1a1f2e;white-space:nowrap;
    }
    .cart-drawer-meta{
      margin-top:6px;font-size:12.5px;color:#8d8fa0;line-height:1.45;
    }
    .cart-drawer-options{
      margin-top:8px;font-size:12.5px;font-weight:700;color:#4a7a2e;
      background:none;border:none;padding:0;cursor:pointer;
    }
    .cart-drawer-options:hover{text-decoration:underline;}
    .cart-drawer-qty{
      margin-top:12px;display:inline-flex;align-items:center;
      border:1px solid #e8e6df;border-radius:999px;overflow:hidden;background:#fff;
    }
    .cart-drawer-qty button{
      width:34px;height:34px;font-size:18px;color:#2f3345;
      display:flex;align-items:center;justify-content:center;cursor:pointer;
    }
    .cart-drawer-qty button:hover{background:#f7f6f1;}
    .cart-drawer-qty span{
      min-width:28px;text-align:center;font-size:14px;font-weight:700;color:#1a1f2e;
    }
    .cart-drawer-foot{
      flex:none;padding:16px 22px 22px;border-top:1px solid #eeece4;
      background:#fff;
    }
    .cart-drawer-coupon{
      margin-bottom:16px;border-bottom:1px solid #f0eee6;padding-bottom:14px;
    }
    .cart-drawer-coupon summary{
      list-style:none;cursor:pointer;font-size:14px;font-weight:600;color:#2f3345;
      display:flex;align-items:center;justify-content:space-between;
    }
    .cart-drawer-coupon summary::-webkit-details-marker{display:none;}
    .cart-drawer-coupon summary::after{
      content:"";width:8px;height:8px;border-right:2px solid #8d8fa0;
      border-bottom:2px solid #8d8fa0;transform:rotate(45deg);margin-top:-4px;
      transition:transform .2s;
    }
    .cart-drawer-coupon[open] summary::after{transform:rotate(-135deg);margin-top:4px;}
    .cart-drawer-coupon-form{
      display:flex;gap:8px;margin-top:12px;
    }
    .cart-drawer-coupon-form input{
      flex:1;height:40px;border:1px solid #e8e6df;border-radius:999px;
      padding:0 14px;font-size:14px;font-family:inherit;
    }
    .cart-drawer-coupon-form input:focus{outline:none;border-color:#83bf40;}
    .cart-drawer-coupon-form button{
      height:40px;padding:0 16px;border-radius:999px;border:none;
      background:#4a7a2e;color:#fff;font-size:13px;font-weight:700;cursor:pointer;
    }
    .cart-drawer-coupon-note{
      margin:8px 0 0;font-size:11.5px;color:#c94b3a;line-height:1.4;
    }
    .cart-drawer-subtotal{
      display:flex;align-items:center;justify-content:space-between;
      font-size:15px;font-weight:700;color:#1a1f2e;margin-bottom:6px;
    }
    .cart-drawer-note{
      margin:0 0 14px;font-size:12px;color:#8d8fa0;line-height:1.4;
    }
    .cart-drawer-checkout{
      display:flex;align-items:center;justify-content:center;gap:10px;
      width:100%;height:50px;border-radius:999px;
      background:#4a7a2e;color:#fff;font-size:15px;font-weight:700;
      text-decoration:none;margin-bottom:12px;
      transition:background .15s;
    }
    .cart-drawer-checkout:hover{background:#3d6627;color:#fff;}
    .cart-drawer-checkout svg{flex:none;}
    .cart-drawer-continue{
      display:block;width:100%;text-align:center;
      font-size:14px;font-weight:600;color:#5c5e70;
      background:none;border:none;padding:8px;cursor:pointer;
    }
    .cart-drawer-continue:hover{color:#4a7a2e;}
    .cart-added-banner{
      position:fixed;top:0;left:0;right:0;z-index:280;
      background:#eaf3dc;color:#4a7a2e;
      padding:12px 20px;font-size:14px;font-weight:600;
      text-align:center;
      transform:translateY(-100%);
      transition:transform .32s ease;
      box-shadow:0 4px 16px rgba(30,39,73,.08);
    }
    .cart-added-banner.show{transform:translateY(0);}
    .cart-added-banner strong{font-weight:800;}
    @media (max-width:480px){
      .cart-drawer{width:100vw;}
    }
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'cart-drawer-backdrop';
  backdrop.id = 'cartDrawerBackdrop';

  const banner = document.createElement('div');
  banner.className = 'cart-added-banner';
  banner.id = 'cartAddedBanner';
  banner.innerHTML = '✓ <strong id="cartAddedName"></strong> has been added to your cart.';

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.id = 'cartDrawer';
  drawer.setAttribute('aria-label', 'Review your cart');
  drawer.innerHTML = `
    <div class="cart-drawer-head">
      <h2>Review Your Cart (<span id="cartDrawerCount">0</span>)</h2>
      <button type="button" class="cart-drawer-close" id="cartDrawerClose" aria-label="Close cart">&times;</button>
    </div>
    <div class="cart-drawer-body" id="cartDrawerBody"></div>
    <div class="cart-drawer-foot">
      <details class="cart-drawer-coupon">
        <summary>Got a discount code?</summary>
        <form class="cart-drawer-coupon-form" id="cartDrawerCouponForm">
          <input type="text" id="cartDrawerCouponInput" placeholder="Coupon Code" autocomplete="off">
          <button type="submit">Apply</button>
        </form>
        <p class="cart-drawer-coupon-note">Discount code is applied for only One Time Purchase.</p>
      </details>
      <div class="cart-drawer-subtotal">
        <span>Subtotal</span>
        <span id="cartDrawerSubtotal">$0.00</span>
      </div>
      <p class="cart-drawer-note">Shipping &amp; taxes may be re-calculated at checkout.</p>
      <a href="${checkoutUrl}" class="cart-drawer-checkout" id="cartDrawerCheckout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6h15l-1.5 9h-11L6 6zm3 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <span>Checkout <span id="cartDrawerCheckoutTotal">$0.00</span></span>
      </a>
      <button type="button" class="cart-drawer-continue" id="cartDrawerContinue">Continue Shopping</button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(banner);
  document.body.appendChild(drawer);

  let bannerTimer;

  function getCart() {
    try { return JSON.parse(sessionStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(items) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function cartCount(cart) {
    return cart.reduce(function (s, i) { return s + (i.qty || 0); }, 0);
  }

  function cartSubtotal(cart) {
    return cart.reduce(function (s, i) { return s + i.price * (i.qty || 0); }, 0);
  }

  function money(n) {
    return '$' + n.toFixed(2);
  }

  function showBanner(title) {
    var nameEl = document.getElementById('cartAddedName');
    if (nameEl) nameEl.textContent = '"' + title + '"';
    banner.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () { banner.classList.remove('show'); }, 3200);
  }

  function render() {
    var cart = getCart();
    var count = cartCount(cart);
    var subtotal = cartSubtotal(cart);
    var body = document.getElementById('cartDrawerBody');
    var countEl = document.getElementById('cartDrawerCount');
    var subEl = document.getElementById('cartDrawerSubtotal');
    var checkoutTotal = document.getElementById('cartDrawerCheckoutTotal');
    var checkoutBtn = document.getElementById('cartDrawerCheckout');

    if (countEl) countEl.textContent = count;
    if (subEl) subEl.textContent = money(subtotal);
    if (checkoutTotal) checkoutTotal.textContent = money(subtotal);
    if (checkoutBtn) checkoutBtn.style.display = count ? '' : 'none';

    if (!body) return;

    if (!cart.length) {
      body.innerHTML = '<div class="cart-drawer-empty"><p>Your cart is empty.</p><a href="#" id="cartDrawerBrowse">Browse products</a></div>';
      var browse = document.getElementById('cartDrawerBrowse');
      if (browse) {
        browse.addEventListener('click', function (e) {
          e.preventDefault();
          close();
        });
      }
      return;
    }

    body.innerHTML = cart.map(function (item) {
      var lineTotal = item.price * (item.qty || 1);
      return '<article class="cart-drawer-item" data-id="' + item.id + '">' +
        '<div class="cart-drawer-thumb">' +
          '<button type="button" class="cart-drawer-remove" data-remove="' + item.id + '" aria-label="Remove item">&times;</button>' +
          '<img src="' + (item.image || '') + '" alt="">' +
        '</div>' +
        '<div class="cart-drawer-info">' +
          '<div class="cart-drawer-row">' +
            '<div class="cart-drawer-name">' + item.title + '</div>' +
            '<div class="cart-drawer-price">' + money(lineTotal) + '</div>' +
          '</div>' +
          '<div class="cart-drawer-meta">Purchase Option: One-Time Purchase</div>' +
          '<button type="button" class="cart-drawer-options" data-view="' + item.id + '">Select options</button>' +
          '<div class="cart-drawer-qty">' +
            '<button type="button" data-qty="' + item.id + '" data-delta="-1" aria-label="Decrease quantity">&minus;</button>' +
            '<span>' + (item.qty || 1) + '</span>' +
            '<button type="button" data-qty="' + item.id + '" data-delta="1" aria-label="Increase quantity">+</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function updateQty(id, delta) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty = Math.max(1, (item.qty || 1) + delta);
    saveCart(cart);
    render();
    document.dispatchEvent(new CustomEvent('cart:updated'));
  }

  function removeItem(id) {
    var cart = getCart().filter(function (i) { return i.id !== id; });
    saveCart(cart);
    render();
    document.dispatchEvent(new CustomEvent('cart:updated'));
  }

  function open(addedTitle) {
    render();
    drawer.classList.add('open');
    backdrop.classList.add('show');
    document.documentElement.classList.add('cart-drawer-open');
    if (addedTitle) showBanner(addedTitle);
  }

  function close() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    document.documentElement.classList.remove('cart-drawer-open');
  }

  function init(opts) {
    if (opts && opts.checkoutUrl) {
      checkoutUrl = opts.checkoutUrl;
      var link = document.getElementById('cartDrawerCheckout');
      if (link) link.href = checkoutUrl;
    }
    if (opts && opts.productUrl) productUrl = opts.productUrl;
  }

  backdrop.addEventListener('click', close);
  document.getElementById('cartDrawerClose').addEventListener('click', close);
  document.getElementById('cartDrawerContinue').addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  document.getElementById('cartDrawerBody').addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      removeItem(removeBtn.getAttribute('data-remove'));
      return;
    }
    var qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      updateQty(qtyBtn.getAttribute('data-qty'), parseInt(qtyBtn.getAttribute('data-delta'), 10));
      return;
    }
    var viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      var id = viewBtn.getAttribute('data-view');
      var item = getCart().find(function (i) { return i.id === id; });
      if (item) {
        sessionStorage.setItem('myalche_pdp', JSON.stringify({
          title: item.title,
          price: item.price,
          image: item.image,
          desc: item.desc || ''
        }));
        window.location.href = productUrl;
      }
    }
  });

  document.getElementById('cartDrawerCouponForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var code = document.getElementById('cartDrawerCouponInput').value.trim();
    if (!code) return;
    if (typeof window.toast === 'function') {
      window.toast('Coupon "' + code + '" applied at checkout preview');
    }
  });

  window.CartDrawer = {
    init: init,
    open: open,
    close: close,
    render: render,
    refresh: render
  };
})();
