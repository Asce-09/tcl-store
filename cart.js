// ---------- Cart state ----------
const CART_STORAGE_KEY = "tcl-cart";

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}
function saveCart(){
  try{
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }catch(e){
    // storage unavailable (private browsing, etc.) — cart just won't persist
  }
}

let cart = loadCart(); // id -> qty

function addToCart(id, qty){
  qty = qty || 1;
  cart[id] = (cart[id] || 0) + qty;
  saveCart();
  updateCartUI();
  showToast("Added to cart");
}
function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart();
  updateCartUI();
}
function removeItem(id){
  delete cart[id];
  saveCart();
  updateCartUI();
}
function cartTotalQty(){
  return Object.values(cart).reduce((a,b)=>a+b,0);
}
function cartSubtotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const p = findProduct(id);
    return sum + (p ? p.price*qty : 0);
  },0);
}

function updateCartUI(){
  document.getElementById("cartCount").textContent = cartTotalQty();
  const itemsEl = document.getElementById("drawerItems");
  const footEl = document.getElementById("drawerFoot");
  const entries = Object.entries(cart);

  if(entries.length === 0){
    itemsEl.innerHTML = `<div class="empty-cart">
      <svg width="40" height="40" viewBox="0 0 90 100" fill="none" stroke="var(--text-faint)" stroke-width="2.2">
        <rect x="8" y="6" width="74" height="88" rx="6"/><circle cx="45" cy="60" r="20"/>
      </svg>
      <span>YOUR CART IS EMPTY</span>
    </div>`;
    footEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = entries.map(([id,qty])=>{
    const p = findProduct(id);
    return `
    <div class="cart-item">
      <div class="cart-item-media">${productImage(p)}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">$${p.price.toLocaleString()}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty('${id}',-1)">&minus;</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${id}',1)">+</button>
          <span class="remove-link" onclick="removeItem('${id}')">Remove</span>
        </div>
      </div>
    </div>`;
  }).join("");

  footEl.innerHTML = `
    <div class="subtotal-row">
      <span class="label">Subtotal</span>
      <span class="val">$${cartSubtotal().toLocaleString()}</span>
    </div>
    <button class="checkout-btn" onclick="window.location.href='checkout.html'">Checkout</button>
    <p class="checkout-note">Enter your details on the next step, then confirm via Messenger</p>
  `;
}

// ---------- Drawer ----------
function openDrawer(){
  document.getElementById("drawer").classList.add("open");
  document.getElementById("scrim").classList.add("open");
}
function closeDrawer(){
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("scrim").classList.remove("open");
}

// ---------- Toast ----------
let toastTimer;
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove("show"), 1800);
}

// ---------- Wire up shared header controls ----------
document.getElementById("cartBtn").onclick = openDrawer;
document.getElementById("drawerClose").onclick = closeDrawer;
document.getElementById("scrim").onclick = closeDrawer;

updateCartUI();
