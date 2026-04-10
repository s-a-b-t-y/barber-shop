// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
    }, 80);
});

// ---- PAGE NAVIGATION ----
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(name).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('nav-' + name).classList.add('active');
    window.scrollTo(0, 0);
}

// ---- HAIRSTYLE DATA ----
const hairstyles = [
    { name: 'Classic Side Part', category: 'classic', price: '৳150', duration: '30 min', desc: 'Timeless gentleman\'s cut with a clean side part.', img: 'hs-classic-sidepart.jpg' },
    { name: 'High Skin Fade', category: 'fade', price: '৳200', duration: '40 min', desc: 'Zero to skin fade with crisp line-up.', img: 'hs-highfade.jpg' },
    { name: 'Low Taper Fade', category: 'fade', price: '৳180', duration: '35 min', desc: 'Subtle taper that blends naturally.', img: 'hs-lowtaper.jpg' },
    { name: 'Textured Crop', category: 'modern', price: '৳190', duration: '35 min', desc: 'Modern disconnected undercut with textured top.', img: 'hs-crop.jpg' },
    { name: 'Pompadour Fade', category: 'modern', price: '৳220', duration: '45 min', desc: 'Voluminous top styled back with faded sides.', img: 'hs-pompadour.jpg' },
    { name: 'Buzz Cut', category: 'classic', price: '৳100', duration: '20 min', desc: 'Clean all-around clipped cut for a sharp look.', img: 'hs-buzzcut.jpg' },
    { name: 'Quiff Style', category: 'modern', price: '৳200', duration: '40 min', desc: 'Swept-up front volume with tapered sides.', img: 'hs-quiff.jpg' },
    { name: 'Full Beard Shape', category: 'beard', price: '৳150', duration: '30 min', desc: 'Full beard trim, line-up, and oil treatment.', img: 'hs-beard.jpg' },
    { name: 'Undercut Design', category: 'modern', price: '৳250', duration: '50 min', desc: 'Sharp undercut with custom design on sides.', img: 'hs-undercut.jpg' },
    { name: 'French Crop', category: 'classic', price: '৳160', duration: '30 min', desc: 'Fringe forward, clean sides, structured top.', img: 'hs-frenchcrop.jpg' },
    { name: 'Mid Fade + Beard', category: 'beard', price: '৳280', duration: '55 min', desc: 'Mid fade haircut with full beard sculpt combo.', img: 'hs-midfadebeard.jpg' },
    { name: 'Slick Back', category: 'classic', price: '৳170', duration: '35 min', desc: 'Sleek back-combed style with product finish.', img: 'hs-slickback.jpg' },
];

function renderHS(filter = 'all') {
    const grid = document.getElementById('hsGrid');
    const items = filter === 'all' ? hairstyles : hairstyles.filter(h => h.category === filter);
    grid.innerHTML = items.map(h => `
    <div class="hs-card">
      <div class="hs-img-wrap">
        <img class="hs-img" src="${h.img}" alt="${h.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
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
  `).join('');
}

function filterHS(btn, cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderHS(cat);
}

function bookStyle(name) {
    showPage('booking');
    document.getElementById('bookNote').value = `I'd like the "${name}" hairstyle.`;
}

renderHS();

// ---- PAYMENT LOGIC ----
let paymentMode = 'pay'; // default: pay now
let activeCard = null;

// Set button states on load
document.getElementById('btnPayNow').classList.add('selected');

function setPaymentMode(mode) {
    paymentMode = mode;
    document.getElementById('btnPayNow').classList.toggle('selected', mode === 'pay');
    document.getElementById('btnSkipPay').classList.toggle('selected', mode === 'skip');
    
    const cardsDiv = document.getElementById('paymentCardsDiv');
    if (mode === 'skip') {
        cardsDiv.style.opacity = '0.5';
        cardsDiv.style.pointerEvents = 'none';
        if (activeCard) {
            document.getElementById('card-' + activeCard).classList.remove('active');
            activeCard = null;
        }
    } else {
        cardsDiv.style.opacity = '1';
        cardsDiv.style.pointerEvents = 'auto';
    }
    updateAmounts();
}

function getServicePrice() {
    const sel = document.getElementById('serviceSelect').value;
    const match = sel.match(/৳(\d+)/);
    return match ? parseInt(match[1]) : null;
}

function updateAmounts() {
    const price = getServicePrice();
    const ids = ['bkash-amount', 'nagad-amount'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!price) { el.textContent = '৳ —'; return; }
        el.textContent = '৳ ' + price;
    });
}

document.getElementById('serviceSelect').addEventListener('change', updateAmounts);

function toggleCard(name) {
    if (paymentMode === 'skip') return; // Cannot toggle if skipped
    const card = document.getElementById('card-' + name);
    if (!card) return;
    if (activeCard && activeCard !== name) {
        const activeEl = document.getElementById('card-' + activeCard);
        if (activeEl) activeEl.classList.remove('active');
    }
    if (activeCard === name) {
        card.classList.remove('active');
        activeCard = null;
    } else {
        card.classList.add('active');
        activeCard = name;
        updateAmounts();
    }
}

// ---- BOOKING FUNCTIONS ----
function getBookingMsg() {
    const name = document.getElementById('clientName').value || '(name)';
    const phone = document.getElementById('clientPhone').value || '(phone)';
    const service = document.getElementById('serviceSelect').value || '(service)';
    const date = document.getElementById('bookDate').value || '(date)';
    const time = document.getElementById('bookTime').value || '(time)';
    const note = document.getElementById('bookNote').value;
    const price = getServicePrice();
    
    let payInfo = '';
    if (paymentMode === 'skip') {
        payInfo = price ? `Will pay at shop (৳${price})` : 'Will pay at shop';
    } else {
        let method = activeCard ? (activeCard.charAt(0).toUpperCase() + activeCard.slice(1)) : 'None (Pay Now selected but no card picked)';
        payInfo = price ? `Paid via ${method}: ৳${price}` : `Paid via ${method}`;
    }

    return `🪒 *Redoy Boss Barber Shop — New Booking*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n✂️ Service: ${service}\n📅 Date: ${date}\n⏰ Time: ${time}\n💳 Payment: ${payInfo}${note ? '\n📝 Note: ' + note : ''}\n\nPlease confirm this appointment. Thank you!`;
}

function submitAndSendWhatsApp() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const service = document.getElementById('serviceSelect').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;

    if (!name || !phone || !service || !date || !time) {
        showToast('⚠️ Please fill in all required fields.');
        return;
    }
    
    if (paymentMode === 'pay' && !activeCard) {
        showToast('⚠️ Please select a payment method (bKash/Nagad) or choose "Skip Payment".');
        return;
    }

    const msg = getBookingMsg();
    const encoded = encodeURIComponent(msg);
    const shopPhone = '8801700000000'; // Replace with actual WhatsApp number

    showToast('✅ Booking confirmed! Opening WhatsApp...');
    setTimeout(() => {
        window.open(`https://wa.me/${shopPhone}?text=${encoded}`, '_blank');
    }, 1000);
}

// ---- TOAST ----
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}