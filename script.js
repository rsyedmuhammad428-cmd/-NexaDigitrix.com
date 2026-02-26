// ================================================
// NEXA DIGITRIX — Enhanced JavaScript
// ================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- MOBILE HORIZONTAL SCROLL FIX ----
    // Prevents any element from causing left/right page scroll on mobile
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    // Fix: find and clip any element wider than viewport
    function fixOverflow() {
        const vw = window.innerWidth;
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > vw + 5 || rect.left < -5) {
                // Don't touch fixed/absolute positioned overlays
                const pos = window.getComputedStyle(el).position;
                if (pos !== 'fixed' && pos !== 'absolute' && !el.classList.contains('nav-links')) {
                    el.style.maxWidth = '100%';
                }
            }
        });
    }
    // Run after page fully loads
    window.addEventListener('load', () => setTimeout(fixOverflow, 500));

    // ---- PAGE LOADER ----
    const loader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger hero animations after load
            document.querySelectorAll('.hero .reveal-right, .hero .reveal-up').forEach(el => {
                setTimeout(() => el.classList.add('visible'), 100);
            });
        }, 1800);
    });

    // ---- CUSTOM CURSOR ----
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring) {
        let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
        document.addEventListener('mousemove', e => {
            dotX = e.clientX; dotY = e.clientY;
            dot.style.left = dotX + 'px';
            dot.style.top = dotY + 'px';
        });
        function animateRing() {
            ringX += (dotX - ringX) * 0.12;
            ringY += (dotY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        document.querySelectorAll('a, button, .service-card, .feature-card, .portfolio-item, .scroller-item, .pill').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ---- THEME TOGGLE ----
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('nd-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateAllToggleIcons(savedTheme);

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const cur = html.getAttribute('data-theme');
            const next = cur === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('nd-theme', next);
            updateAllToggleIcons(next);
        });
    });

    function updateAllToggleIcons(theme) {
        themeToggles.forEach(btn => {
            const icon = btn.querySelector('i');
            if (!icon) return;
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }

    // ---- HERO CANVAS PARTICLES ----
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let W, H;

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.r = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '0,86,210' : '0,170,255';
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0,170,255,${0.08 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ---- TYPEWRITER ----
    const typeEl = document.getElementById('typewriter');
    if (typeEl) {
        const words = ['Digitally!', 'Boldly!', 'Brilliantly!', 'Strategically!'];
        let wordIndex = 0, charIndex = 0, deleting = false;

        function type() {
            const word = words[wordIndex];
            if (!deleting) {
                typeEl.textContent = word.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex === word.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
            } else {
                typeEl.textContent = word.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(type, deleting ? 60 : 100);
        }
        setTimeout(type, 2200);
    }

    // ---- NAVBAR SCROLL ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ---- ACTIVE NAV LINK ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // ---- MOBILE MENU ----
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');

    function closeMenu() {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuBtn.classList.toggle('open', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    overlay.addEventListener('click', closeMenu);
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ---- SCROLL REVEAL (Fade In Right + Fade In Up) ----
    const revealElements = document.querySelectorAll('.reveal-right, .reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => {
        // Skip hero elements — those are handled after loader
        if (!el.closest('.hero')) revealObserver.observe(el);
    });

    // ---- COUNTER ANIMATION ----
    const counters = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target) || 0;
        let current = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) {
                el.textContent = target;
                clearInterval(interval);
            }
        }, 16);
    }

    // ---- PORTFOLIO HORIZONTAL SCROLLER ----
    const scroller = document.getElementById('portfolioScroller');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('scrollerDots');

    if (scroller && prevBtn && nextBtn) {
        const items = scroller.querySelectorAll('.scroller-item');
        const scrollAmount = 320;

        // Build dots
        if (dotsContainer && items.length) {
            items.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = 'scroller-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => {
                    scroller.scrollTo({ left: i * scrollAmount, behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            });
        }

        prevBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        scroller.addEventListener('scroll', () => {
            const dots = dotsContainer?.querySelectorAll('.scroller-dot');
            if (!dots) return;
            const active = Math.round(scroller.scrollLeft / scrollAmount);
            dots.forEach((d, i) => d.classList.toggle('active', i === active));
        });

        // Touch swipe support
        let touchStartX = 0;
        scroller.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        scroller.addEventListener('touchend', e => {
            const dx = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(dx) > 50) {
                scroller.scrollBy({ left: dx > 0 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
            }
        });
    }

    // ---- LIGHTBOX ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightboxClose');
    let images = [];
    let currentImg = 0;

    // Collect all lightbox-able items
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-full], .scroller-item[data-full]');

    portfolioItems.forEach((item, idx) => {
        images.push(item.getAttribute('data-full'));
        item.addEventListener('click', () => {
            openLightbox(idx);
        });
    });

    function openLightbox(idx) {
        currentImg = idx;
        lightboxImg.src = images[idx];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 400);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    const lbBg = lightbox?.querySelector('.lightbox-bg');
    if (lbBg) lbBg.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
            currentImg = (currentImg + 1) % images.length;
            lightboxImg.src = images[currentImg];
        }
        if (e.key === 'ArrowLeft') {
            currentImg = (currentImg - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImg];
        }
    });

    // ================================================
    // CONTACT FORM — Google Sheets via Apps Script
    // Form name: "Contact_Form"  ← matches name="Contact_Form" in HTML
    // ================================================

    // ✏️  PASTE YOUR DEPLOYED WEB APP URL HERE (the /exec URL from Apps Script)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbztrzRP2bF8-O7W7RqmSMsyUYvxH-PcUSkZGZTpHadINueZchgfKMeIw8pthh_LPXEQ/exec'; // ✅ NEW LIVE URL v2
    // e.g. 'https://script.google.com/macros/s/AKfycb.../exec'

    // Reference the form by its HTML name attribute: name="Contact_Form"
    const form = document.forms['Contact_Form'];
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();

            // --- Read field values ---
            const nameVal = form.elements['name'].value.trim();
            const emailVal = form.elements['email'].value.trim();
            const serviceVal = form.elements['service'].value;
            const messageVal = form.elements['message'].value.trim();

            // --- Client-side validation ---
            clearFieldErrors(form);

            let hasError = false;
            if (!nameVal) {
                showFieldError('c-name', 'Full name is required.');
                hasError = true;
            }
            if (!emailVal) {
                showFieldError('c-email', 'Email address is required.');
                hasError = true;
            } else if (!isValidEmail(emailVal)) {
                showFieldError('c-email', 'Please enter a valid email address.');
                hasError = true;
            }
            if (hasError) {
                shakeForm(form);
                return;
            }

            // --- Button: loading state ---
            const btn = form.querySelector('.form-submit');
            const span = btn.querySelector('span');
            const icon = btn.querySelector('i');
            btn.disabled = true;
            span.textContent = 'Sending…';
            icon.className = 'fas fa-spinner fa-spin';

            // ─────────────────────────────────────────────────────────
            // FIX: Google Apps Script blocks fetch() due to CORS.
            // Solution: convert FormData → URL-encoded string and use
            // fetch with mode:'no-cors'. We can't read the response body
            // in no-cors mode, so we treat any completed request as success.
            // ─────────────────────────────────────────────────────────
            const formData = new FormData(form);
            // Convert to URL-encoded string (Apps Script reads this fine)
            const urlEncoded = new URLSearchParams(formData).toString();

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',   // ← FIXES the CORS / Network error
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlEncoded,
            })
                .then(() => {
                    // no-cors means we can't read the response — but if we get here, it was sent ✅
                    btn.disabled = false;
                    span.textContent = 'Send Message';
                    icon.className = 'fas fa-paper-plane';
                    form.reset();
                    clearFieldErrors(form);
                    showSuccessBanner();
                    console.log('✅ Form data sent to Google Sheets!');
                })
                .catch(error => {
                    // Only real network failures land here (offline, DNS fail, etc.)
                    console.error('Fetch error:', error.message);
                    btn.disabled = false;
                    span.textContent = 'Send Message';
                    icon.className = 'fas fa-paper-plane';
                    showErrorBanner('Could not send. Please email us directly at Nexadigitrix@gmail.com');
                });
        });
    }

    // ---- Helper: email format check ----
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ---- Helper: show inline field error ----
    function showFieldError(fieldId, msg) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        const group = field.closest('.form-group');
        // Remove old error if any
        group.querySelector('.field-error')?.remove();
        if (!msg) { field.style.borderColor = ''; return; }
        // Create error element
        const err = document.createElement('p');
        err.className = 'field-error';
        err.textContent = msg;
        group.appendChild(err);
        field.style.borderColor = '#f87171';
    }

    // ---- Helper: clear all errors in form ----
    function clearFieldErrors(formEl) {
        if (!formEl) return;
        formEl.querySelectorAll('.field-error').forEach(el => el.remove());
        formEl.querySelectorAll('input, textarea, select').forEach(el => {
            el.style.borderColor = '';
        });
    }

    // ---- Helper: shake animation on error ----
    function shakeForm(formEl) {
        formEl.classList.add('form-shake');
        setTimeout(() => formEl.classList.remove('form-shake'), 600);
    }

    // ---- Helper: green success banner ----
    function showSuccessBanner() {
        if (!formSuccess) return;
        formSuccess.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! We\'ll get back to you within 24 hours.';
        formSuccess.style.color = '#22c55e';
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 7000);
    }

    // ---- Helper: red error banner ----
    function showErrorBanner(msg) {
        if (!formSuccess) return;
        formSuccess.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg || 'Something went wrong. Please try again.'}`;
        formSuccess.style.color = '#f87171';
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 7000);
    }

    // ---- BACK TO TOP ----
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('show', window.scrollY > 400);
    });
    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- SMOOTH SCROLL for nav links ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 10;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- SERVICE CARD TILT EFFECT ----
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- FEATURE CARD HOVER RIPPLE ----
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', e => {
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            ripple.style.cssText = `
                position: absolute;
                width: 20px; height: 20px;
                background: rgba(0,170,255,0.3);
                border-radius: 50%;
                left: ${e.clientX - rect.left - 10}px;
                top: ${e.clientY - rect.top - 10}px;
                transform: scale(0);
                animation: ripple-anim 0.6s ease-out forwards;
                pointer-events: none; z-index: 0;
            `;
            // Add ripple keyframe if not exists
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `@keyframes ripple-anim { to { transform: scale(20); opacity: 0; } }`;
                document.head.appendChild(style);
            }
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

});