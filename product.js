// Returns to wherever the shopper came from (preserving the catalog's
// filter and scroll position via the browser's back-forward cache) when
// that's possible; falls back to a plain link to the catalog otherwise.
function goBack(e) {
  if (window.history.length > 1 && document.referrer) {
    e.preventDefault();
    window.history.back();
    return false;
  }
  return true;
}

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = findProduct(productId);

const currentIndex = PRODUCTS.findIndex(p => p.id === productId);
const prevProduct = currentIndex > -1 ? PRODUCTS[(currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length] : null;
const nextProduct = currentIndex > -1 ? PRODUCTS[(currentIndex + 1) % PRODUCTS.length] : null;

const root = document.getElementById("detailRoot");

if (!product) {
  root.innerHTML = `
    <div class="not-found">
      <h1>Product not found</h1>
      <p>We couldn't find that item in the catalog.</p>
      <a class="btn-primary" href="index.html">Back to catalog</a>
    </div>
  `;
} else {
  document.title = `${product.name} — TCL Store`;

  let qty = 1;

  root.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Catalog</a>
      <span>/</span>
      <a href="index.html?cat=${product.cat}">${CAT_LABEL[product.cat]}</a>
      <span>/</span>
      <span class="current">${product.name}</span>
    </div>

    <div class="detail-layout">
      <div class="detail-media">
        <span class="card-tag">${CAT_LABEL[product.cat]}</span>
        <button class="media-nav prev" id="prevProductBtn" aria-label="Previous appliance" title="${prevProduct.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>
        </button>
        ${productImage(product)}
        ${product.cat === "tv" ? `<div class="zonegrid detail-zonegrid">${zoneGridHTML(64)}</div>` : ""}
        <button class="media-nav next" id="nextProductBtn" aria-label="Next appliance" title="${nextProduct.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
        <span class="media-counter">${currentIndex + 1} / ${PRODUCTS.length}</span>
      </div>

      <div class="detail-info">
        <h1 class="detail-name">${product.name}</h1>
        <div class="detail-price">$${product.price.toLocaleString()}</div>
        <p class="detail-desc">${product.description}</p>

        <div class="feature-list">
          <div class="feature-list-label">Specs & features</div>
          <ul>
            ${product.features.map(f => `<li>${f}</li>`).join("")}
          </ul>
        </div>

        <div class="qty-select-row">
          <span class="qty-select-label">Quantity</span>
          <div class="qty-select">
            <button class="qty-btn" id="qtyMinus">&minus;</button>
            <span class="qty-val" id="qtyVal">1</span>
            <button class="qty-btn" id="qtyPlus">+</button>
          </div>
        </div>

        <button class="btn-primary detail-add-btn" id="detailAddBtn">Add to cart</button>
        <a class="back-link" href="index.html" onclick="return goBack(event)">&larr; Back to catalog</a>
      </div>
    </div>
  `;

  const qtyVal = document.getElementById("qtyVal");
  document.getElementById("qtyMinus").onclick = () => {
    qty = Math.max(1, qty - 1);
    qtyVal.textContent = qty;
  };
  document.getElementById("qtyPlus").onclick = () => {
    qty = qty + 1;
    qtyVal.textContent = qty;
  };
  document.getElementById("detailAddBtn").onclick = () => {
    addToCart(product.id, qty);
  };

  document.getElementById("prevProductBtn").onclick = () => {
    window.location.href = `product.html?id=${encodeURIComponent(prevProduct.id)}`;
  };
  document.getElementById("nextProductBtn").onclick = () => {
    window.location.href = `product.html?id=${encodeURIComponent(nextProduct.id)}`;
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") window.location.href = `product.html?id=${encodeURIComponent(prevProduct.id)}`;
    if (e.key === "ArrowRight") window.location.href = `product.html?id=${encodeURIComponent(nextProduct.id)}`;
  });
}
