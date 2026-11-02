/* =========================================================
   Charles Retail Therapy – site interactivity
   Each feature checks that its elements exist, so this one
   file can be loaded safely on every page.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initBackToTop();
    initScrollReveal();
    initAccordion();
    initProducts();
    initLightbox();
    initMap();
    initEnquiryForm();
    initContactForm();
});

/* ---------- Responsive hamburger navigation ---------- */
function initNavigation() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    }

    toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Close the menu after choosing a link, pressing Esc, or widening the screen
    nav.addEventListener('click', function (e) {
        if (e.target.matches('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) setOpen(false);
    });
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        btn.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---------- Fade sections in as they scroll into view ---------- */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('.feature-item, .testimonial-card, .benefit-item, .accordion-item, .blog-post');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var expanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!expanded));
            document.getElementById(trigger.getAttribute('aria-controls')).hidden = expanded;
        });
    });
}
