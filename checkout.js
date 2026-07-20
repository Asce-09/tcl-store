// ---------------------------------------------------------------------------
// SELLER CONFIG — change this to your own Facebook Page's username so the
// "Place Order" button opens a chat with YOUR page instead of a placeholder.
// Find it in your Page's URL: facebook.com/YOUR-USERNAME
// ---------------------------------------------------------------------------
const MESSENGER_PAGE_USERNAME = "jmappliancesandgadgets";
const STORE_NAME = "TCL Store";
// ---------------------------------------------------------------------------

const root = document.getElementById("checkoutRoot");

function renderCheckout(){
  const entries = Object.entries(cart);

  if(entries.length === 0){
    root.innerHTML = `
      <div class="not-found">
        <h1>Your cart is empty</h1>
        <p>Add a few appliances to your cart before checking out.</p>
        <a class="btn-primary" href="index.html">Browse catalog</a>
      </div>
    `;
    return;
  }

  const lineItems = entries.map(([id, qty]) => {
    const p = findProduct(id);
    return { product: p, qty };
  }).filter(item => item.product);

  root.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Catalog</a>
      <span>/</span>
      <span class="current">Checkout</span>
    </div>

    <h1 class="checkout-title">Checkout</h1>

    <div class="checkout-layout">
      <div class="checkout-form-col">
        <div class="form-section">
          <div class="feature-list-label">Contact information</div>

          <div class="form-group">
            <label for="custName">Full name</label>
            <input type="text" id="custName" placeholder="Juan Dela Cruz" autocomplete="name">
          </div>

          <div class="form-group">
            <label for="custPhone">Contact number</label>
            <input type="tel" id="custPhone" placeholder="09171234567" autocomplete="tel">
          </div>

          <div class="form-group">
            <label for="custAddress">Delivery address</label>
            <textarea id="custAddress" rows="3" placeholder="House/unit no., street, barangay, city, province"></textarea>
          </div>

          <p class="form-error" id="formError"></p>

          <button class="btn-primary place-order-btn" id="placeOrderBtn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.24 2 11.47c0 2.98 1.44 5.63 3.7 7.36V22l3.38-1.86c.9.25 1.87.38 2.92.38 5.52 0 10-4.24 10-9.47S17.52 2 12 2zm1.02 12.77l-2.55-2.72-4.97 2.72 5.47-5.8 2.6 2.72 4.92-2.72-5.47 5.8z"/></svg>
            Place Order via Messenger
          </button>
          <p class="checkout-note">This opens Messenger with your order pre-filled — you'll confirm availability with us there. No payment is collected on this page.</p>
        </div>
      </div>

      <div class="checkout-summary-col">
        <div class="order-summary">
          <div class="feature-list-label">Order summary</div>
          <div class="order-summary-items">
            ${lineItems.map(item => `
              <div class="order-summary-item">
                <div class="order-summary-media">${productImage(item.product)}</div>
                <div class="order-summary-info">
                  <div class="order-summary-name">${item.product.name}</div>
                  <div class="order-summary-qty">Qty: ${item.qty}</div>
                </div>
                <div class="order-summary-price">$${(item.product.price * item.qty).toLocaleString()}</div>
              </div>
            `).join("")}
          </div>
          <div class="subtotal-row">
            <span class="label">Subtotal</span>
            <span class="val">$${cartSubtotal().toLocaleString()}</span>
          </div>
        </div>
        <a class="back-link" href="index.html">&larr; Back to catalog</a>
      </div>
    </div>
  `;

  document.getElementById("placeOrderBtn").onclick = () => placeOrder(lineItems);
}

function placeOrder(lineItems){
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const errorEl = document.getElementById("formError");

  if(!name || !phone || !address){
    errorEl.textContent = "Please fill in your name, contact number, and address.";
    return;
  }

  if(!MESSENGER_PAGE_USERNAME || MESSENGER_PAGE_USERNAME === "yourpagehere"){
    errorEl.textContent = "This store hasn't been set up to receive orders yet (missing Messenger page username in checkout.js). Nothing will happen if you click Place Order.";
    return;
  }

  errorEl.textContent = "";

  const message = buildOrderMessage(name, phone, address, lineItems);
  const url = `https://m.me/${encodeURIComponent(MESSENGER_PAGE_USERNAME)}?text=${encodeURIComponent(message)}`;

  // Clear the cart now that the order's been captured in the message below.
  cart = {};
  saveCart();
  updateCartUI();

  // A real <a> click is handled more reliably by mobile browsers for
  // handing off to an installed app than a JS-only location.href redirect
  // (this matters especially inside in-app browsers like Facebook/Instagram's).
  openLink(url);

  renderPostOrderScreen(url, message);
}

function openLink(url){
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  if(!isMobileDevice()) a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function renderPostOrderScreen(url, message){
  root.innerHTML = `
    <div class="not-found">
      <h1>Almost done!</h1>
      <p>We tried opening Messenger with your order filled in. If it didn't open automatically, use the button below.</p>
      <a class="btn-primary" href="${url}" rel="noopener" ${isMobileDevice() ? "" : 'target="_blank"'}>Open Messenger</a>
      <button class="btn-ghost copy-msg-btn" id="copyMsgBtn">Copy order message instead</button>
      <a class="back-link" href="index.html">&larr; Back to catalog</a>
    </div>
  `;

  document.getElementById("copyMsgBtn").onclick = () => {
    navigator.clipboard.writeText(message).then(() => {
      showToast("Order message copied — paste it in Messenger");
    }).catch(() => {
      showToast("Couldn't copy automatically — please select and copy the text manually");
    });
  };
}

function isMobileDevice(){
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function buildOrderMessage(name, phone, address, lineItems){
  const productLines = lineItems.map((item, i) =>
    `${i + 1}.\n${item.product.name}\nQty: ${item.qty}`
  ).join("\n\n");

  return [
    `Hello ${STORE_NAME}!`,
    ``,
    `I'd like to place an order.`,
    ``,
    `Customer Name:`,
    name,
    ``,
    `Contact Number:`,
    phone,
    ``,
    `Address:`,
    address,
    ``,
    `Products`,
    ``,
    productLines,
    ``,
    `Please confirm availability.`,
    ``,
    `Thank you!`
  ].join("\n");
}

renderCheckout();
