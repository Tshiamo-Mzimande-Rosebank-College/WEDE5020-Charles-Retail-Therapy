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

/* ---------- Dynamic product catalogue with live search ---------- */
var PRODUCTS = [
    { name: 'Nike Bomber Jacket', brand: 'Nike', category: 'Jackets', price: 899, tag: 'VINTAGE', condition: 'Very good', image: 'nike-jacket', alt: 'Rust-coloured Nike bomber jacket on a hanger' },
    { name: 'Gucci Quilted Handbag', brand: 'Gucci', category: 'Bags', price: 1299, tag: 'PREMIUM', condition: 'Excellent', image: 'gucci-handbag', alt: 'Black quilted Gucci crossbody bag with gold chain' },
    { name: 'Adidas Running Sneakers', brand: 'Adidas', category: 'Shoes', price: 799, tag: 'ORIGINAL', condition: 'Like new', image: 'sneakers', alt: 'Red running sneaker on a red background' },
    { name: "Levi's 501 Jeans", brand: "Levi's", category: 'Denim', price: 650, tag: 'CLASSIC', condition: 'Good', image: 'levis-jeans', alt: "Three pairs of folded Levi's jeans" },
    { name: 'Coach Leather Bag', brand: 'Coach', category: 'Bags', price: 950, tag: 'LUXURY', condition: 'Excellent', image: 'coach-bag', alt: 'Red leather Coach top-handle handbag' },
    { name: 'Leather Biker Jacket', brand: 'Zara', category: 'Jackets', price: 720, tag: 'TRENDING', condition: 'Very good', image: 'leather-jacket', alt: 'Black leather biker jacket on a hanger' },
    { name: 'Puma Logo T-Shirt', brand: 'Puma', category: 'Tops', price: 249, tag: 'BASICS', condition: 'Like new', image: 'puma-tshirt', alt: 'Folded Puma cotton t-shirt' },
    { name: 'Graphic Tee Bundle', brand: 'Mixed', category: 'Tops', price: 399, tag: 'BUNDLE', condition: 'Good', image: 'tshirt-rack', alt: 'Rack of colourful t-shirts on hangers' }
];

function formatRand(amount) {
    return 'R' + amount.toLocaleString('en-ZA').replace(/\s/g, ',');
}

function escapeHTML(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initProducts() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    var search = document.getElementById('product-search');
    var count = document.getElementById('results-count');
    var buttons = document.querySelectorAll('.filter-btn');
    var activeCategory = 'all';

    function render() {
        var query = search.value.trim().toLowerCase();
        var results = PRODUCTS.filter(function (p) {
            var inCategory = activeCategory === 'all' || p.category === activeCategory;
            var haystack = (p.name + ' ' + p.brand + ' ' + p.category).toLowerCase();
            return inCategory && haystack.indexOf(query) !== -1;
        });

        count.textContent = 'Showing ' + results.length + ' of ' + PRODUCTS.length + ' products';
        if (results.length === 0) {
            grid.innerHTML = '<div class="no-results"><p>Sorry, no products match &ldquo;' + escapeHTML(search.value) +
                '&rdquo;. Try another brand or choose &ldquo;All&rdquo;.</p></div>';
            return;
        }
        grid.innerHTML = results.map(function (p) {
            return '<div class="product-item">' +
                '<div class="product-image">' +
                '<img src="images/' + p.image + '.jpg" srcset="images/' + p.image + '-480.jpg 480w, images/' + p.image + '.jpg 900w" ' +
                'sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px" alt="' + p.alt + '" loading="lazy">' +
                '<span class="image-tag">' + p.tag + '</span></div>' +
                '<h3 class="h4">' + p.name + '</h3>' +
                '<p class="brand">' + p.brand + ' &middot; ' + p.category + '</p>' +
                '<p class="condition">Condition: ' + p.condition + '</p>' +
                '<p class="price">' + formatRand(p.price) + '</p>' +
                '<a href="contact.html" class="btn-small">Enquire</a>' +
                '</div>';
        }).join('');
    }

    search.addEventListener('input', render);
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            activeCategory = btn.dataset.category;
            buttons.forEach(function (b) {
                b.classList.toggle('is-active', b === btn);
                b.setAttribute('aria-pressed', String(b === btn));
            });
            render();
        });
    });
    render();
}
