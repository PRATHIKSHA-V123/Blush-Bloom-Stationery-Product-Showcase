/* ---------- Data ---------- */
const products = [
  { name: "Classic Ballpoint Pen",   category: "pens",        description: "Smooth everyday writing",           price: 50,  image: "photo-1583485088034-697b5bc54ccd" },
  { name: "Premium Gel Pen Set",     category: "pens",        description: "Fine tips for neat writing",        price: 149, image: "photo-1455390582262-044cdead277a" },
  { name: "Pastel Colour Pens",      category: "pens",        description: "Colourful pens for notes",          price: 199, image: "photo-1513364776144-60967b0f800f" },
  { name: "Black Ink Pen",           category: "pens",        description: "Simple, professional writing",      price: 40,  image: "photo-1583485088034-697b5bc54ccd" },
  { name: "HB Drawing Pencils",      category: "pencils",     description: "Everyday writing and sketching",    price: 60,  image: "photo-1513364776144-60967b0f800f" },
  { name: "Colour Pencil Set",       category: "pencils",     description: "Creative colours for your ideas",   price: 180, image: "photo-1513364776144-60967b0f800f" },
  { name: "Mechanical Pencil",       category: "pencils",     description: "Precise and comfortable writing",   price: 99,  image: "photo-1455390582262-044cdead277a" },
  { name: "Minimal Pencil Pouch",    category: "pouches",     description: "Keeps stationery neatly organised", price: 249, image: "photo-1544816155-12df9643f363" },
  { name: "Pastel Zipper Pouch",     category: "pouches",     description: "A compact everyday pencil case",    price: 299, image: "photo-1544816155-12df9643f363" },
  { name: "Canvas Stationery Pouch", category: "pouches",     description: "Simple storage for essentials",     price: 349, image: "photo-1544816155-12df9643f363" },
  { name: "A5 Ruled Notebook",       category: "notebooks",   description: "For notes, thoughts and plans",     price: 120, image: "photo-1531346878377-a5be20888e57" },
  { name: "Daily Planner",           category: "notebooks",   description: "Organise your daily schedule",      price: 199, image: "photo-1517842645767-c639042777db" },
  { name: "Sticky Notes Set",        category: "accessories", description: "Mark pages and reminders",          price: 79,  image: "photo-1455390582262-044cdead277a" },
  { name: "Eraser Pack",             category: "accessories", description: "Clean and easy corrections",        price: 30,  image: "photo-1513364776144-60967b0f800f" },
  { name: "Mini Pencil Sharpener",   category: "accessories", description: "A handy desk essential",            price: 35,  image: "photo-1513364776144-60967b0f800f" },
  { name: "Study Desk Organiser",    category: "accessories", description: "Keeps your workspace tidy",         price: 399, image: "photo-1498050108023-c5249f4df085" }
].map(p => ({ ...p, id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));

const categories = ["all", "pens", "pencils", "pouches", "notebooks", "accessories"];

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const money = n => `₹${n}`;
const label = c => c === "all" ? "All items" : c[0].toUpperCase() + c.slice(1);
const byId = id => products.find(p => p.id === id);
const imgUrl = (p, w) => `https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=${w}&q=80`;
const fallback = "this.onerror=null;this.src='https://placehold.co/600x600/f7e4e1/2d2430?text=Stationery'";

function load(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

/* ---------- State ---------- */
let category = "all";
let showSavedOnly = false;
let cart = load("bb-cart", {});          // { productId: quantity }
let saved = new Set(load("bb-saved", []));

/* ---------- Product card ---------- */
function cardHTML(p) {
  const on = saved.has(p.id);
  return `
  <article class="card">
    <a class="card-img" href="#/product/${p.id}" aria-label="View ${p.name}">
      <img src="${imgUrl(p, 600)}" alt="${p.name}" loading="lazy" onerror="${fallback}">
      <button class="heart ${on ? "on" : ""}" data-save="${p.id}" aria-label="${on ? "Remove from" : "Save to"} saved items" aria-pressed="${on}">${on ? "♥" : "♡"}</button>
    </a>
    <div class="card-body">
      <span class="card-cat">${p.category}</span>
      <h3><a href="#/product/${p.id}">${p.name}</a></h3>
      <p>${p.description}</p>
      <div class="card-foot">
        <span class="price">${money(p.price)}</span>
        <button class="add" data-add="${p.id}">Add to cart</button>
      </div>
    </div>
  </article>`;
}

/* ---------- Catalog ---------- */
function renderChips() {
  $("chips").innerHTML = categories.map(c => {
    const n = c === "all" ? products.length : products.filter(p => p.category === c).length;
    return `<button class="chip ${c === category ? "active" : ""}" data-cat="${c}">${label(c)}<em>${n}</em></button>`;
  }).join("");
}

function renderProducts() {
  const term = $("searchInput").value.trim().toLowerCase();
  const sort = $("sortSelect").value;

  let list = products.filter(p =>
    `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term) &&
    (category === "all" || p.category === category) &&
    (!showSavedOnly || saved.has(p.id))
  );

  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  $("productGrid").innerHTML = list.map(cardHTML).join("");
  $("noResults").hidden = list.length > 0;
  $("itemCount").textContent = `${showSavedOnly ? "Saved: " : ""}${list.length} ${list.length === 1 ? "item" : "items"}`;
}

function refreshCatalog() { renderChips(); renderProducts(); }

/* ---------- Product detail page ---------- */
function renderDetail(id) {
  const p = byId(id);
  const view = $("detailView");
  if (!p) {
    view.innerHTML = `<a class="back" href="#/">← Back to shop</a><p>That product could not be found.</p>`;
    return;
  }
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const on = saved.has(p.id);
  view.innerHTML = `
    <a class="back" href="#collection">← Back to shop</a>
    <div class="detail">
      <div class="detail-img"><img src="${imgUrl(p, 1000)}" alt="${p.name}" onerror="${fallback}"></div>
      <div class="detail-info">
        <span class="card-cat">${p.category}</span>
        <h1>${p.name}</h1>
        <p class="lead">${p.description}.</p>
        <div class="detail-price">${money(p.price)}</div>
        <div class="detail-actions">
          <button class="btn" data-add="${p.id}">Add to cart</button>
          <button class="btn ghost ${on ? "on" : ""}" data-save="${p.id}" aria-pressed="${on}">${on ? "♥ Saved" : "♡ Save for later"}</button>
        </div>
      </div>
    </div>
    ${related.length ? `<section class="related"><h2>More from ${label(p.category)}</h2><div class="grid">${related.map(cardHTML).join("")}</div></section>` : ""}`;
  document.title = `${p.name} | Blush & Bloom`;
}

/* ---------- Router (hash based) ---------- */
function route() {
  const hash = location.hash;
  const match = hash.match(/^#\/product\/([\w-]+)/);

  if (match) {
    $("listView").hidden = true;
    $("detailView").hidden = false;
    renderDetail(match[1]);
    window.scrollTo(0, 0);
  } else {
    $("detailView").hidden = true;
    $("listView").hidden = false;
    document.title = "Blush & Bloom | Stationery Showcase";
    const target = hash.length > 1 && !hash.startsWith("#/") ? document.querySelector(hash) : null;
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
  }
}

/* ---------- Cart ---------- */
function cartEntries() {
  return Object.entries(cart).map(([id, qty]) => ({ p: byId(id), qty })).filter(e => e.p);
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((s, e) => s + e.qty, 0);
  const total = entries.reduce((s, e) => s + e.qty * e.p.price, 0);

  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  $("wishCount").textContent = saved.size;

  $("cartItems").innerHTML = entries.length ? entries.map(({ p, qty }) => `
    <div class="line">
      <img src="${imgUrl(p, 150)}" alt="${p.name}" onerror="${fallback}">
      <div>
        <h4>${p.name}</h4>
        <small>${money(p.price)} each</small>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove" data-remove="${p.id}" aria-label="Remove ${p.name}">✕</button>
    </div>`).join("") : `<p class="empty">Your cart is empty.<br>Add something lovely.</p>`;

  save("bb-cart", cart);
  save("bb-saved", [...saved]);
}

function openCart(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", String(!open));
  $("overlay").hidden = !open;
}

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-add],[data-save],[data-cat],[data-inc],[data-dec],[data-remove]");
  if (!el) return;
  const d = el.dataset;

  if (d.add) {
    cart[d.add] = (cart[d.add] || 0) + 1;
    toast(`${byId(d.add).name} added to cart`);
  } else if (d.save) {
    e.preventDefault();
    saved.has(d.save) ? saved.delete(d.save) : saved.add(d.save);
    if (location.hash.startsWith("#/product/")) route(); else renderProducts();
  } else if (d.cat) {
    category = d.cat;
    refreshCatalog();
  } else if (d.inc) {
    cart[d.inc]++;
  } else if (d.dec) {
    cart[d.dec] = Math.max(0, cart[d.dec] - 1);
    if (!cart[d.dec]) delete cart[d.dec];
  } else if (d.remove) {
    delete cart[d.remove];
  }
  renderCart();
});

$("searchInput").addEventListener("input", renderProducts);
$("sortSelect").addEventListener("change", renderProducts);
$("resetBtn").addEventListener("click", () => {
  $("searchInput").value = "";
  $("sortSelect").value = "featured";
  category = "all";
  showSavedOnly = false;
  refreshCatalog();
});

$("wishBtn").addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  if (location.hash.startsWith("#/product/")) location.hash = "#collection";
  refreshCatalog();
  toast(showSavedOnly ? "Showing saved items" : "Showing all items");
  if (showSavedOnly) setTimeout(() => $("collection").scrollIntoView(), 50);
});

$("cartBtn").addEventListener("click", () => openCart(true));
$("closeCart").addEventListener("click", () => openCart(false));
$("overlay").addEventListener("click", () => openCart(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") openCart(false); });
$("clearCart").addEventListener("click", () => { cart = {}; renderCart(); });
$("checkoutBtn").addEventListener("click", () => toast("This is a demo store - checkout is not enabled"));

window.addEventListener("hashchange", route);

/* ---------- Start ---------- */
refreshCatalog();
renderCart();
route();
