/* ================================================================
   Redoy Boss Barber Shop — index.js
   ================================================================ */

// ---- CUSTOM CURSOR (desktop only) ----
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");

if (cursor && ring) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    setTimeout(() => {
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    }, 80);
  });
}

// ---- HAMBURGER MENU ----
function toggleMenu() {
  const overlay = document.getElementById("mobileMenuOverlay");
  const btn = document.getElementById("hamburger");
  const open = overlay.classList.toggle("open");
  btn.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function closeMenu() {
  const overlay = document.getElementById("mobileMenuOverlay");
  const btn = document.getElementById("hamburger");
  if (overlay) overlay.classList.remove("open");
  if (btn) btn.classList.remove("open");
  document.body.style.overflow = "";
}

// Clicking the dark backdrop (not a child) closes the menu
function handleNavOverlayClick(e) {
  if (e.target === document.getElementById("mobileMenuOverlay")) {
    closeMenu();
  }
}

// ESC key closes menu or popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    closeBookingPopup();
  }
});

// ---- PAGE NAVIGATION ----
function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const page = document.getElementById(name);
  if (page) page.classList.add("active");

  // Update active link in BOTH desktop nav and mobile menu
  document.querySelectorAll(".nav-links a, .mobile-menu-links a").forEach((a) => a.classList.remove("active"));
  const desktopLink = document.getElementById("nav-" + name);
  const mobileLink = document.getElementById("mob-nav-" + name);
  if (desktopLink) desktopLink.classList.add("active");
  if (mobileLink) mobileLink.classList.add("active");

  window.scrollTo(0, 0);
}


// ---- HAIRSTYLE DATA ----
const hairstyles = [
  { name: "Classic Side Part", category: "classic", price: "৳100", duration: "30 min", desc: "Timeless gentleman's cut with a clean side part.", img: "library/haircutAlbum/classic/side-part.webp" },
  { name: "High Skin Fade", category: "fade", price: "৳200", duration: "40 min", desc: "Zero to skin fade with crisp line-up.", img: "library/haircutAlbum/Fade/high-skin-fade.webp" },
  { name: "Low Taper Fade Over Combo", category: "fade", price: "৳180", duration: "35 min", desc: "Subtle taper that blends naturally.", img: "library/haircutAlbum/Fade/low-taper-fade-over.webp" },
  { name: "High Fade Textured Crop", category: "modern", price: "৳190", duration: "35 min", desc: "Modern disconnected undercut with textured top.", img: "library/haircutAlbum/Modern/high-fade-textured-crop.webp" },
  { name: "Pompadour Fade", category: "modern", price: "৳220", duration: "45 min", desc: "Voluminous top styled back with faded sides.", img: "library/haircutAlbum/Modern/pompadour-fade.jpg" },
  { name: "Buzz Cut", category: "classic", price: "৳100", duration: "20 min", desc: "Clean all-around clipped cut for a sharp look.", img: "library/haircutAlbum/classic/buzz.webp" },
  { name: "Quiff Style", category: "modern", price: "৳200", duration: "40 min", desc: "Swept-up front volume with tapered sides.", img: "library/haircutAlbum/Modern/Textured-Quiff.webp" },
  { name: "Full Beard Shape", category: "beard", price: "৳150", duration: "30 min", desc: "Full beard trim, line-up, and oil treatment.", img: "library/haircutAlbum/Beard/full-beard-shape.webp" },
  { name: "Undercut Design", category: "modern", price: "৳250", duration: "50 min", desc: "Sharp undercut with custom design on sides.", img: "library/haircutAlbum/Modern/undercut-haircut.webp" },
  { name: "French Crop", category: "classic", price: "৳160", duration: "30 min", desc: "Fringe forward, clean sides, structured top.", img: "library/haircutAlbum/classic/Classic-French-Crop.webp" },
  { name: "Mid Fade + Beard", category: "beard", price: "৳280", duration: "55 min", desc: "Mid fade haircut with full beard sculpt combo.", img: "library/haircutAlbum/Beard/mid-fade-with-beard.jpg" },
  { name: "Slick Back", category: "classic", price: "৳170", duration: "35 min", desc: "Sleek back-combed style with product finish.", img: "library/haircutAlbum/classic/slick-back.jpg" },
];

function renderHS(filter = "all") {
  const grid = document.getElementById("hsGrid");
  if (!grid) return;
  const items = filter === "all" ? hairstyles : hairstyles.filter((h) => h.category === filter);

  grid.innerHTML = items.map((h) => `
    <div class="hs-card">
      <div class="hs-img-wrap">
        <img class="hs-img" src="${h.img}" alt="${h.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
        <div class="hs-placeholder" style="display:none;">
          <div class="hs-placeholder-text">Add Photo</div>
        </div>
        <div class="hs-overlay">
          <button class="hs-overlay-btn" onclick="bookStyle('${h.name}')">Book This Style</button>
        </div>
      </div>
      <div class="hs-info">
        <div class="hs-badge">${h.category}</div>
        <div class="hs-name">${h.name}</div>
        <div class="hs-desc">${h.desc}</div>
        <div class="hs-price-row">
          <div class="hs-price">${h.price}</div>
          <div class="hs-duration">⏱ ${h.duration}</div>
        </div>
      </div>
    </div>
  `).join("");
}

function filterHS(btn, cat) {
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderHS(cat);
}

function bookStyle(name) {
  openBookingPopup();
  setTimeout(() => {
    const note = document.getElementById("bookNote");
    if (note) note.value = `I'd like the "${name}" hairstyle.`;
  }, 100);
}

renderHS();

// ================================================================
// ---- BOOKING POPUP ----
// ================================================================
let currentPayTab = "bkash"; // "bkash" | "nagad" | "skip"

function openBookingPopup() {
  showPage("home"); // ensure we're on a page (popup is overlay)
  const overlay = document.getElementById("bookingOverlay");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  // Always start at booking step
  showStep("stepBooking");
  // Hide nav booking link active state since it's a popup
  document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
}

function closeBookingPopup() {
  const overlay = document.getElementById("bookingOverlay");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function closeBookingPopupOnBackdrop(e) {
  if (e.target === document.getElementById("bookingOverlay")) {
    closeBookingPopup();
  }
}

// Allow ESC key to close popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBookingPopup();
});

function showStep(stepId) {
  document.querySelectorAll(".popup-step").forEach((s) => s.style.display = "none");
  const step = document.getElementById(stepId);
  if (step) step.style.display = "block";
}

// ---- STEP NAVIGATION ----
function goToPaymentStep() {
  // Validate form first
  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const service = document.getElementById("serviceSelect").value;
  const date = document.getElementById("bookDate").value;
  const time = document.getElementById("bookTime").value;

  if (!name || !phone || !service || !date || !time) {
    showToast("⚠️ Please fill in all required fields.");
    return;
  }

  // Update payment amounts
  updatePayAmounts();

  showStep("stepPayment");
  document.getElementById("bookingPopup").scrollTop = 0;
}

function goToBookingStep() {
  showStep("stepBooking");
  document.getElementById("bookingPopup").scrollTop = 0;
}

function goToMessageStep() {
  // Build and display message preview
  const msg = buildBookingMessage();
  const preview = document.getElementById("msgPreview");
  if (preview) preview.textContent = msg;

  showStep("stepMessage");
  document.getElementById("bookingPopup").scrollTop = 0;
}

// ---- PAYMENT TAB LOGIC ----
function switchPayTab(tab) {
  currentPayTab = tab;

  // Update tab button states
  document.querySelectorAll(".pay-tab").forEach((t) => t.classList.remove("active"));
  const activeTab = document.getElementById("tab-" + tab);
  if (activeTab) activeTab.classList.add("active");

  // Show the right panel
  ["bkash", "nagad", "skip"].forEach((p) => {
    const panel = document.getElementById("panel-" + p);
    if (panel) panel.style.display = p === tab ? "block" : "none";
  });
}

function getServicePrice() {
  const sel = document.getElementById("serviceSelect").value;
  const match = sel.match(/৳(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function updatePayAmounts() {
  const price = getServicePrice();
  const display = price ? `৳ ${price}` : "৳ —";
  ["bkash-amt", "nagad-amt"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = display;
  });
}

document.getElementById("serviceSelect").addEventListener("change", updatePayAmounts);

// ---- MESSAGE BUILDER ----
function buildBookingMessage() {
  const name = document.getElementById("clientName").value.trim() || "(name)";
  const phone = document.getElementById("clientPhone").value.trim() || "(phone)";
  const service = document.getElementById("serviceSelect").value || "(service)";
  const date = document.getElementById("bookDate").value || "(date)";
  const time = document.getElementById("bookTime").value || "(time)";
  const note = document.getElementById("bookNote").value.trim();
  const price = getServicePrice();

  let payInfo = "";

  if (currentPayTab === "skip") {
    payInfo = price
      ? `❌ *Payment not made* — Will pay at shop (৳${price})`
      : "❌ *Payment not made* — Will pay at shop";
  } else {
    const method = currentPayTab.charAt(0).toUpperCase() + currentPayTab.slice(1);
    const txInput = document.getElementById(currentPayTab + "TxId");
    const txId = txInput ? txInput.value.trim() : "";

    if (txId) {
      payInfo = price
        ? `✅ *Paid via ${method}* — ৳${price} | TXN ID: ${txId}`
        : `✅ *Paid via ${method}* | TXN ID: ${txId}`;
    } else {
      // Payment method selected but no TXN ID provided
      payInfo = price
        ? `⏳ *Payment via ${method}* (৳${price}) — TXN ID not provided`
        : `⏳ *Payment via ${method}* — TXN ID not provided`;
    }
  }

  // Format date nicely if possible
  let formattedDate = date;
  if (date && date.includes("-")) {
    try {
      const d = new Date(date + "T00:00:00");
      formattedDate = d.toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch (e) { /* keep raw */ }
  }

  let msg = `🪒 *Redoy Boss Barber Shop — New Booking*

👤 Name: ${name}
📞 Phone: ${phone}
✂️ Service: ${service}
📅 Date: ${formattedDate}
⏰ Time: ${time}
💳 Payment: ${payInfo}`;

  if (note) msg += `\n📝 Note: ${note}`;

  msg += `\n\nPlease confirm this appointment. I'll be there on time \n Thank you! 🙏`;

  return msg;
}

// ---- SEND TO WHATSAPP ----
function sendToWhatsApp() {
  const msg = buildBookingMessage();
  const encoded = encodeURIComponent(msg);
  const shopPhone = "8801916401604";

  showToast("✅ Opening WhatsApp...");
  setTimeout(() => {
    window.open(`https://wa.me/${shopPhone}?text=${encoded}`, "_blank");
  }, 600);
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}
