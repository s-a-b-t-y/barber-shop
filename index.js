/**
 * BLADE & CO. — Main JavaScript
 * Handles: Custom cursor, Canvas background, Navbar scroll,
 *          Mobile menu, Stat counters, Scroll reveal, Smooth UX
 */

/* ================================================
   1. WAIT FOR DOM READY
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {

    /* ================================================
       2. CUSTOM CURSOR (desktop only)
       ================================================ */
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    // Only activate cursor on non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Move main cursor dot instantly
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Follower uses RAF for smooth lag effect
        function animateCursor() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .service-card, .atm-card, .testi-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    /* ================================================
       3. HERO CANVAS — Animated Particle Grid
       Creates a barber-shop inspired animated grid of
       fine lines and golden particles on the dark bg.
       ================================================ */
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [], gridLines = [];
        const GOLD = 'rgba(201,168,76,';

        // Resize handler — keeps canvas pixel-perfect
        function resizeCanvas() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
            initGrid();
        }

        // Build the grid lines (subtle) and particles
        function initGrid() {
            gridLines = [];
            // Vertical lines
            const colCount = Math.floor(W / 80);
            for (let i = 0; i <= colCount; i++) {
                gridLines.push({ x: i * 80, vertical: true });
            }
            // Horizontal lines
            const rowCount = Math.floor(H / 80);
            for (let i = 0; i <= rowCount; i++) {
                gridLines.push({ y: i * 80, vertical: false });
            }

            // Spawn particles
            particles = [];
            const count = Math.min(Math.floor((W * H) / 18000), 50);
            for (let i = 0; i < count; i++) {
                particles.push(spawnParticle());
            }
        }

        // Create a single particle object
        function spawnParticle(forced = false) {
            return {
                x: forced ? Math.random() * W : Math.random() * W,
                y: forced ? Math.random() * H : Math.random() * H,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI * 2,   // phase for pulsing
            };
        }

        // Slow sine-wave offset for the grid distortion effect
        let tick = 0;

        function draw() {
            tick += 0.008;

            // Clear with slight trail for motion blur feel
            ctx.fillStyle = 'rgba(6,6,8,0.85)';
            ctx.fillRect(0, 0, W, H);

            // --- Draw grid lines ---
            ctx.lineWidth = 0.3;
            gridLines.forEach(line => {
                const wave = Math.sin(tick + (line.vertical ? line.x : line.y) * 0.01) * 4;
                ctx.beginPath();
                ctx.strokeStyle = GOLD + '0.06)';

                if (line.vertical) {
                    ctx.moveTo(line.x + wave, 0);
                    ctx.lineTo(line.x + wave, H);
                } else {
                    ctx.moveTo(0, line.y + wave);
                    ctx.lineTo(W, line.y + wave);
                }
                ctx.stroke();
            });

            // --- Draw diagonal accent lines ---
            ctx.save();
            ctx.lineWidth = 0.5;
            const diags = [
                { x1: W * 0.1, y1: 0, x2: W * 0.45, y2: H },
                { x1: W * 0.55, y1: 0, x2: W * 0.9, y2: H },
            ];
            diags.forEach(d => {
                const gradient = ctx.createLinearGradient(d.x1, d.y1, d.x2, d.y2);
                gradient.addColorStop(0, GOLD + '0)');
                gradient.addColorStop(0.4, GOLD + '0.12)');
                gradient.addColorStop(0.6, GOLD + '0.12)');
                gradient.addColorStop(1, GOLD + '0)');
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(d.x1, d.y1);
                ctx.lineTo(d.x2, d.y2);
                ctx.stroke();
            });
            ctx.restore();

            // --- Draw & update particles ---
            particles.forEach(p => {
                p.pulse += 0.025;
                const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = GOLD + alpha + ')';
                ctx.fill();

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;
            });

            // --- Radial vignette overlay ---
            const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85);
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, W, H);

            requestAnimationFrame(draw);
        }

        // Kick off
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();
    }

    /* ================================================
       4. NAVBAR — Scroll State
       Adds .scrolled class after user scrolls down
       ================================================ */
    const navbar = document.getElementById('navbar');

    const handleNavbarScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // run once on load

    /* ================================================
       5. MOBILE MENU TOGGLE
       ================================================ */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        hamburger.classList.add('open');
        navLinks.classList.add('open');
        navOverlay.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // prevent scroll behind menu
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close when overlay is clicked
    navOverlay?.addEventListener('click', closeMenu);

    // Close on nav link click (mobile)
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMenu();
        });
    });

    /* ================================================
       6. ANIMATED STAT COUNTERS
       Counts up when the stats strip enters viewport
       ================================================ */
    const statNums = document.querySelectorAll('.stat-num');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800; // ms
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    // Trigger counters on scroll (once)
    let countersStarted = false;
    const statsStrip = document.querySelector('.stats-strip');

    if (statsStrip) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    statNums.forEach(el => animateCounter(el));
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsStrip);
    }

    /* ================================================
       7. SCROLL REVEAL ANIMATION
       Adds 'reveal' class to elements and triggers
       .visible when they enter the viewport
       ================================================ */
    const revealTargets = [
        '.service-card',
        '.atm-card',
        '.testi-card',
        '.about-content',
        '.about-img-wrap',
        '.section-header',
        '.cta-content',
    ];

    // Add reveal class to all targets
    revealTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            // Stagger delay for grid children
            const delay = (i % 4) * 0.1;
            el.style.transitionDelay = delay + 's';
        });
    });

    // Observe and trigger
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // fire once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ================================================
       8. ACTIVE NAV LINK (highlight current section)
       ================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}` ||
                        (id === 'home' && link.getAttribute('href') === 'index.html')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ================================================
       9. HERO PARALLAX on scroll (subtle)
       ================================================ */
    const heroContent = document.querySelector('.hero-content');
    const heroLines = document.querySelector('.hero-lines');

    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (heroContent) heroContent.style.transform = `translateY(${sy * 0.15}px)`;
        if (heroLines) heroLines.style.transform = `translateY(${sy * 0.08}px)`;
    }, { passive: true });

    /* ================================================
       10. SMOOTH ANCHOR SCROLLING
       For same-page hash links
       ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ================================================
       11. GOLD GLOW on service card hover (JS-enhanced)
       Adds a subtle mouse-tracking glow effect inside cards
       ================================================ */
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });

    /* ================================================
       12. LOADING ANIMATION (page entrance)
       Fades out a loading overlay on page load
       ================================================ */
    // Add loader element to DOM
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
    <svg viewBox="0 0 160 44" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto;">
      <polygon points="22,4 38,22 22,40 6,22" fill="none" stroke="#c9a84c" stroke-width="1.5"/>
      <line x1="22" y1="4" x2="22" y2="40" stroke="#c9a84c" stroke-width="1"/>
      <circle cx="22" cy="22" r="2.5" fill="#c9a84c"/>
      <text x="50" y="17" font-family="Bebas Neue, sans-serif" font-size="18" fill="#ffffff" letter-spacing="3">Redoy Boss</text>
      <text x="50" y="34" font-family="Rajdhani, sans-serif" font-size="10" fill="#c9a84c" letter-spacing="6" font-weight="300">Barber Shop</text>
    </svg>
  `;

    // Inject styles for loader
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
    #pageLoader {
      position: fixed;
      inset: 0;
      background: #060608;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.8s ease, visibility 0.8s ease;
    }
    #pageLoader.done {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
  `;
    document.head.appendChild(loaderStyle);
    document.body.appendChild(loader);

    // Trigger fade-out after a short delay
    setTimeout(() => {
        loader.classList.add('done');
        // Remove from DOM after animation
        setTimeout(() => loader.remove(), 800);
    }, 700);

}); // end DOMContentLoaded

/* ================================================
   13. HAIRSTYLE PAGE — Booking form UX
   (Defined globally so hairstyle.html can use it)
   ================================================ */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn--primary');
        btn.textContent = 'BOOKING CONFIRMED ✦';
        btn.style.background = 'linear-gradient(135deg, #2a5a2a, #1a3a1a)';
        btn.style.color = '#7dff7d';
        setTimeout(() => {
            btn.textContent = 'BOOK SESSION';
            btn.style.background = '';
            btn.style.color = '';
            form.reset();
        }, 3500);
    });
}

// Run booking form init if on hairstyle page
document.addEventListener('DOMContentLoaded', initBookingForm);