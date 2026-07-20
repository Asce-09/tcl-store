let activeCat = "all";

// ---------- Render nav ----------
const catnav = document.getElementById("catnav");
CATS.forEach(c => {
  const b = document.createElement("button");
  b.textContent = c.label;
  b.dataset.cat = c.key;
  if (c.key === "all") b.classList.add("active");
  b.onclick = () => filterCategory(c.key);
  catnav.appendChild(b);
});

function filterCategory(cat) {
  activeCat = cat;
  [...catnav.children].forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
  renderGrid();
}

// ---------- Render grid ----------
function renderGrid() {
  const grid = document.getElementById("grid");
  const items = activeCat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
  document.getElementById("resultCount").textContent = `${items.length} product${items.length !== 1 ? "s" : ""}`;
  grid.innerHTML = items.map(p => `
    <div class="card" data-id="${p.id}" role="link" tabindex="0" aria-label="View details for ${p.name}">
      <div class="card-media">
        <span class="card-tag">${CAT_LABEL[p.cat]}</span>
        ${productImage(p)}
        ${p.cat === "tv" ? `<div class="zonegrid">${zoneGridHTML(48)}</div>` : ""}
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-spec">${p.spec}</div>
        <div class="card-footer">
          <div class="card-price">$${p.price.toLocaleString()}</div>
          <button class="add-btn" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    </div>
  `).join("");

  // Clicking anywhere on the card (except the add-to-cart button) opens the detail page
  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => goToProduct(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToProduct(card.dataset.id); }
    });
  });

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation(); // don't trigger the card's navigation
      addToCart(btn.dataset.id, 1);
      btn.textContent = "Added";
      btn.classList.add("added");
      setTimeout(() => { btn.textContent = "Add to cart"; btn.classList.remove("added"); }, 1100);
    };
  });
}

function goToProduct(id) {
  window.location.href = `product.html?id=${encodeURIComponent(id)}`;
}

// ---------- Init ----------
// Support arriving at index.html?cat=tv (e.g. from a detail page's breadcrumb)
const initialCat = new URLSearchParams(window.location.search).get("cat");
if (initialCat && CATS.some(c => c.key === initialCat)) {
  filterCategory(initialCat);
} else {
  renderGrid();
}
