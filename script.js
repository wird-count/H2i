<<<<<<< HEAD
// ====== CONFIG : remplace par ton numéro WhatsApp (format international, sans +) ======
const WHATSAPP = "213555000000";

// ====== PRODUITS : ajoute / modifie ici ======
const SIZES = {
  Hauts: ["S", "M", "L", "XL"],
  Vestes: ["S", "M", "L", "XL"],
  Robes: ["S", "M", "L"],
  Pantalons: ["38", "40", "42", "44"]
};

const PRODUCTS = [
  { id: 1,  name: "T-shirt coton épais",   cat: "Hauts",     price: 2200, color: "#28407a", type: "tee" },
  { id: 2,  name: "T-shirt écru",          cat: "Hauts",     price: 2000, color: "#d8cfbd", type: "tee" },
  { id: 3,  name: "Chemise lin",           cat: "Hauts",     price: 3800, color: "#8fb3a3", type: "tee" },
  { id: 4,  name: "Pull maille fine",      cat: "Hauts",     price: 4500, color: "#b9483a", type: "tee" },
  { id: 5,  name: "Jean droit",            cat: "Pantalons", price: 5500, color: "#3f5f9a", type: "pants" },
  { id: 6,  name: "Pantalon chino",        cat: "Pantalons", price: 4800, color: "#a58b64", type: "pants" },
  { id: 7,  name: "Pantalon large noir",   cat: "Pantalons", price: 5200, color: "#2b2f3a", type: "pants" },
  { id: 8,  name: "Veste en jean",         cat: "Vestes",    price: 7500, color: "#4d6fae", type: "jacket" },
  { id: 9,  name: "Veste coupe-vent",      cat: "Vestes",    price: 8200, color: "#e0a02b", type: "jacket" },
  { id: 10, name: "Manteau laine",         cat: "Vestes",    price: 12500, color: "#6b5b52", type: "jacket" },
  { id: 11, name: "Robe lin longue",       cat: "Robes",     price: 6800, color: "#c97b63", type: "dress" },
  { id: 12, name: "Robe d'été",            cat: "Robes",     price: 5900, color: "#7fa6c9", type: "dress" }
];

// ====== Illustrations vectorielles (remplace par de vraies photos si tu en as) ======
const SHAPES = {
  tee: "M30 14 L42 10 Q50 18 58 10 L70 14 L90 32 L80 44 L72 38 L72 90 L28 90 L28 38 L20 44 L10 32 Z",
  pants: "M30 8 H70 L75 92 H54 L50 40 L46 92 H25 Z",
  jacket: "M32 12 L44 8 L50 16 L56 8 L68 12 L90 36 L88 88 L76 88 L72 50 L72 92 L28 92 L28 50 L24 88 L12 88 L10 36 Z",
  dress: "M38 8 L46 8 L50 16 L54 8 L62 8 L66 36 L58 46 L84 92 H16 L42 46 L34 36 Z"
};

function garment(type, color) {
  const extra = type === "jacket" ? '<path d="M50 16 V92" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>' : "";
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${SHAPES[type]}" fill="${color}"/>${extra}</svg>`;
}

function tint(hex) {
  // fond clair dérivé de la couleur du vêtement
  const n = parseInt(hex.slice(1), 16);
  const mix = c => Math.round(c + (255 - c) * 0.82);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

// ====== Utilitaires ======
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("fr-FR") + " DA";
let cart = [];
let filter = "Tout";

function load() {
  try { cart = JSON.parse(localStorage.getItem("indigo-cart")) || []; } catch (e) { cart = []; }
}
function save() {
  try { localStorage.setItem("indigo-cart", JSON.stringify(cart)); } catch (e) {}
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("show"), 1800);
}

// ====== Affichage ======
function renderHero() {
  const picks = [PRODUCTS[7], PRODUCTS[0], PRODUCTS[10]];
  $("#heroArt").innerHTML = picks
    .map(p => `<div class="tile" style="background:${tint(p.color)}">${garment(p.type, p.color)}</div>`)
    .join("");
}

function renderFilters() {
  const cats = ["Tout", ...Object.keys(SIZES)];
  $("#filters").innerHTML = cats
    .map(c => `<button class="chip" data-cat="${c}" aria-pressed="${c === filter}">${c}</button>`)
    .join("");
}

function renderGrid() {
  const list = PRODUCTS.filter(p => filter === "Tout" || p.cat === filter);
  $("#grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="card-img" style="background:${tint(p.color)}">${garment(p.type, p.color)}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <span class="price">${fmt(p.price)}</span>
        <div class="card-row">
          <select aria-label="Taille pour ${p.name}" id="size-${p.id}">
            ${SIZES[p.cat].map(s => `<option>${s}</option>`).join("")}
          </select>
          <button class="btn" data-add="${p.id}">Ajouter</button>
        </div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + i.qty * i.price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = fmt(total);

  if (!cart.length) {
    $("#cartItems").innerHTML = '<p class="empty">Votre panier est vide. Choisissez un article dans la collection.</p>';
    return;
  }
  $("#cartItems").innerHTML = cart.map((i, idx) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return `
    <div class="item">
      <div class="item-img" style="background:${tint(p.color)}">${garment(p.type, p.color)}</div>
      <div>
        <h4>${i.name}</h4>
        <small>Taille ${i.size} · ${fmt(i.price)}</small>
        <div class="qty">
          <button data-dec="${idx}" aria-label="Retirer une unité">−</button>
          <span>${i.qty}</span>
          <button data-inc="${idx}" aria-label="Ajouter une unité">+</button>
        </div>
      </div>
      <button class="rm" data-rm="${idx}">Retirer</button>
    </div>`;
  }).join("");
}

// ====== Panier ======
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const size = $("#size-" + id).value;
  const found = cart.find(i => i.id === id && i.size === size);
  if (found) found.qty++;
  else cart.push({ id, name: p.name, price: p.price, size, qty: 1 });
  save();
  renderCart();
  toast(`${p.name} (${size}) ajouté au panier`);
}

function openCart(open) {
  $("#cart").classList.toggle("open", open);
  $("#overlay").classList.toggle("open", open);
  $("#cart").setAttribute("aria-hidden", String(!open));
}

function checkout() {
  if (!cart.length) return toast("Votre panier est vide");
  const lines = cart.map(i => `• ${i.qty} × ${i.name} (taille ${i.size}) – ${fmt(i.qty * i.price)}`);
  const total = cart.reduce((a, i) => a + i.qty * i.price, 0);
  const msg = `Bonjour, je souhaite commander :\n${lines.join("\n")}\n\nTotal : ${fmt(total)}\n\nNom :\nWilaya :\nAdresse :`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

// ====== Événements ======
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.cat) { filter = t.dataset.cat; renderFilters(); renderGrid(); }
  if (t.dataset.add) addToCart(Number(t.dataset.add));
  if (t.dataset.inc !== undefined) { cart[t.dataset.inc].qty++; save(); renderCart(); }
  if (t.dataset.dec !== undefined) {
    const i = cart[t.dataset.dec];
    i.qty--;
    if (i.qty <= 0) cart.splice(t.dataset.dec, 1);
    save(); renderCart();
  }
  if (t.dataset.rm !== undefined) { cart.splice(t.dataset.rm, 1); save(); renderCart(); }
  if (t.closest("#nav a")) closeMenu();
});

function closeMenu() {
  $("#nav").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
}

$("#menuBtn").addEventListener("click", () => {
  const open = $("#nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", String(open));
});
$("#cartBtn").addEventListener("click", () => openCart(true));
$("#closeCart").addEventListener("click", () => openCart(false));
$("#overlay").addEventListener("click", () => openCart(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") openCart(false); });
$("#checkout").addEventListener("click", checkout);
$("#clearCart").addEventListener("click", () => { cart = []; save(); renderCart(); });

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = `Bonjour, je m'appelle ${$("#cName").value}.\n${$("#cMsg").value}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

// ====== Démarrage ======
load();
$("#year").textContent = new Date().getFullYear();
renderHero();
renderFilters();
renderGrid();
renderCart();

// Header scroll effect
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  const header = $("#header");

  if (currentScroll <= 0) {
    header.classList.remove("scrolled");
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains("scrolled")) {
    // scrolling down
    header.classList.add("scrolled");
  } else if (currentScroll < lastScroll && header.classList.contains("scrolled")) {
    // scrolling up
    header.classList.remove("scrolled");
  }
  lastScroll = currentScroll;
});

// Section entrance animations
const sections = document.querySelectorAll(".section");
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

sections.forEach(section => {
  sectionObserver.observe(section);
});

=======
// ====== CONFIG : remplace par ton numéro WhatsApp (format international, sans +) ======
const WHATSAPP = "213555000000";

// ====== PRODUITS : ajoute / modifie ici ======
const SIZES = {
  Hauts: ["S", "M", "L", "XL"],
  Vestes: ["S", "M", "L", "XL"],
  Robes: ["S", "M", "L"],
  Pantalons: ["38", "40", "42", "44"]
};

const PRODUCTS = [
  { id: 1,  name: "T-shirt coton épais",   cat: "Hauts",     price: 2200, color: "#28407a", type: "tee" },
  { id: 2,  name: "T-shirt écru",          cat: "Hauts",     price: 2000, color: "#d8cfbd", type: "tee" },
  { id: 3,  name: "Chemise lin",           cat: "Hauts",     price: 3800, color: "#8fb3a3", type: "tee" },
  { id: 4,  name: "Pull maille fine",      cat: "Hauts",     price: 4500, color: "#b9483a", type: "tee" },
  { id: 5,  name: "Jean droit",            cat: "Pantalons", price: 5500, color: "#3f5f9a", type: "pants" },
  { id: 6,  name: "Pantalon chino",        cat: "Pantalons", price: 4800, color: "#a58b64", type: "pants" },
  { id: 7,  name: "Pantalon large noir",   cat: "Pantalons", price: 5200, color: "#2b2f3a", type: "pants" },
  { id: 8,  name: "Veste en jean",         cat: "Vestes",    price: 7500, color: "#4d6fae", type: "jacket" },
  { id: 9,  name: "Veste coupe-vent",      cat: "Vestes",    price: 8200, color: "#e0a02b", type: "jacket" },
  { id: 10, name: "Manteau laine",         cat: "Vestes",    price: 12500, color: "#6b5b52", type: "jacket" },
  { id: 11, name: "Robe lin longue",       cat: "Robes",     price: 6800, color: "#c97b63", type: "dress" },
  { id: 12, name: "Robe d'été",            cat: "Robes",     price: 5900, color: "#7fa6c9", type: "dress" }
];

// ====== Illustrations vectorielles (remplace par de vraies photos si tu en as) ======
const SHAPES = {
  tee: "M30 14 L42 10 Q50 18 58 10 L70 14 L90 32 L80 44 L72 38 L72 90 L28 90 L28 38 L20 44 L10 32 Z",
  pants: "M30 8 H70 L75 92 H54 L50 40 L46 92 H25 Z",
  jacket: "M32 12 L44 8 L50 16 L56 8 L68 12 L90 36 L88 88 L76 88 L72 50 L72 92 L28 92 L28 50 L24 88 L12 88 L10 36 Z",
  dress: "M38 8 L46 8 L50 16 L54 8 L62 8 L66 36 L58 46 L84 92 H16 L42 46 L34 36 Z"
};

function garment(type, color) {
  const extra = type === "jacket" ? '<path d="M50 16 V92" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>' : "";
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${SHAPES[type]}" fill="${color}"/>${extra}</svg>`;
}

function tint(hex) {
  // fond clair dérivé de la couleur du vêtement
  const n = parseInt(hex.slice(1), 16);
  const mix = c => Math.round(c + (255 - c) * 0.82);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

// ====== Utilitaires ======
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("fr-FR") + " DA";
let cart = [];
let filter = "Tout";

function load() {
  try { cart = JSON.parse(localStorage.getItem("indigo-cart")) || []; } catch (e) { cart = []; }
}
function save() {
  try { localStorage.setItem("indigo-cart", JSON.stringify(cart)); } catch (e) {}
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("show"), 1800);
}

// ====== Affichage ======
function renderHero() {
  const picks = [PRODUCTS[7], PRODUCTS[0], PRODUCTS[10]];
  $("#heroArt").innerHTML = picks
    .map(p => `<div class="tile" style="background:${tint(p.color)}">${garment(p.type, p.color)}</div>`)
    .join("");
}

function renderFilters() {
  const cats = ["Tout", ...Object.keys(SIZES)];
  $("#filters").innerHTML = cats
    .map(c => `<button class="chip" data-cat="${c}" aria-pressed="${c === filter}">${c}</button>`)
    .join("");
}

function renderGrid() {
  const list = PRODUCTS.filter(p => filter === "Tout" || p.cat === filter);
  $("#grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="card-img" style="background:${tint(p.color)}">${garment(p.type, p.color)}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <span class="price">${fmt(p.price)}</span>
        <div class="card-row">
          <select aria-label="Taille pour ${p.name}" id="size-${p.id}">
            ${SIZES[p.cat].map(s => `<option>${s}</option>`).join("")}
          </select>
          <button class="btn" data-add="${p.id}">Ajouter</button>
        </div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + i.qty * i.price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = fmt(total);

  if (!cart.length) {
    $("#cartItems").innerHTML = '<p class="empty">Votre panier est vide. Choisissez un article dans la collection.</p>';
    return;
  }
  $("#cartItems").innerHTML = cart.map((i, idx) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return `
    <div class="item">
      <div class="item-img" style="background:${tint(p.color)}">${garment(p.type, p.color)}</div>
      <div>
        <h4>${i.name}</h4>
        <small>Taille ${i.size} · ${fmt(i.price)}</small>
        <div class="qty">
          <button data-dec="${idx}" aria-label="Retirer une unité">−</button>
          <span>${i.qty}</span>
          <button data-inc="${idx}" aria-label="Ajouter une unité">+</button>
        </div>
      </div>
      <button class="rm" data-rm="${idx}">Retirer</button>
    </div>`;
  }).join("");
}

// ====== Panier ======
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const size = $("#size-" + id).value;
  const found = cart.find(i => i.id === id && i.size === size);
  if (found) found.qty++;
  else cart.push({ id, name: p.name, price: p.price, size, qty: 1 });
  save();
  renderCart();
  toast(`${p.name} (${size}) ajouté au panier`);
}

function openCart(open) {
  $("#cart").classList.toggle("open", open);
  $("#overlay").classList.toggle("open", open);
  $("#cart").setAttribute("aria-hidden", String(!open));
}

function checkout() {
  if (!cart.length) return toast("Votre panier est vide");
  const lines = cart.map(i => `• ${i.qty} × ${i.name} (taille ${i.size}) – ${fmt(i.qty * i.price)}`);
  const total = cart.reduce((a, i) => a + i.qty * i.price, 0);
  const msg = `Bonjour, je souhaite commander :\n${lines.join("\n")}\n\nTotal : ${fmt(total)}\n\nNom :\nWilaya :\nAdresse :`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

// ====== Événements ======
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.cat) { filter = t.dataset.cat; renderFilters(); renderGrid(); }
  if (t.dataset.add) addToCart(Number(t.dataset.add));
  if (t.dataset.inc !== undefined) { cart[t.dataset.inc].qty++; save(); renderCart(); }
  if (t.dataset.dec !== undefined) {
    const i = cart[t.dataset.dec];
    i.qty--;
    if (i.qty <= 0) cart.splice(t.dataset.dec, 1);
    save(); renderCart();
  }
  if (t.dataset.rm !== undefined) { cart.splice(t.dataset.rm, 1); save(); renderCart(); }
  if (t.closest("#nav a")) closeMenu();
});

function closeMenu() {
  $("#nav").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
}

$("#menuBtn").addEventListener("click", () => {
  const open = $("#nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", String(open));
});
$("#cartBtn").addEventListener("click", () => openCart(true));
$("#closeCart").addEventListener("click", () => openCart(false));
$("#overlay").addEventListener("click", () => openCart(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") openCart(false); });
$("#checkout").addEventListener("click", checkout);
$("#clearCart").addEventListener("click", () => { cart = []; save(); renderCart(); });

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = `Bonjour, je m'appelle ${$("#cName").value}.\n${$("#cMsg").value}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

// ====== Démarrage ======
load();
$("#year").textContent = new Date().getFullYear();
renderHero();
renderFilters();
renderGrid();
renderCart();
>>>>>>> 25582820ee8aaccb2e5b98595a81467216231234
