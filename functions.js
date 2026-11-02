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

/* ---------- Gallery lightbox ---------- */
function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.gallery-thumb'));
    var image = lightbox.querySelector('.lightbox-image');
    var caption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var current = 0;
    var lastFocused = null;

    function show(index) {
        current = (index + thumbs.length) % thumbs.length;
        var thumb = thumbs[current];
        image.src = thumb.dataset.full;
        image.alt = thumb.querySelector('img').alt;
        caption.textContent = thumb.dataset.caption + ' (' + (current + 1) + ' of ' + thumbs.length + ')';
    }
    function open(index) {
        lastFocused = document.activeElement;
        show(index);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }
    function close() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    thumbs.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () { open(i); });
    });
    closeBtn.addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
    // Clicking the dark backdrop (not the image or buttons) closes the viewer
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(current - 1);
        else if (e.key === 'ArrowRight') show(current + 1);
    });
}

/* ---------- Interactive Leaflet map ---------- */
function initMap() {
    var mapEl = document.getElementById('store-map');
    if (!mapEl || typeof L === 'undefined') return;
    var store = [-26.1456, 28.0430]; // 50 Bath Avenue, Rosebank, Johannesburg

    var map = L.map(mapEl, { scrollWheelZoom: false }).setView(store, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(store).addTo(map).bindPopup(
        '<strong>Charles Retail Therapy</strong><br>50 Bath Avenue, Rosebank<br>Johannesburg, 2196<br>' +
        '<a href="https://www.google.com/maps/dir/?api=1&destination=' + store.join(',') + '" target="_blank" rel="noopener">Get directions</a>'
    ).openPopup();

    // Only zoom with the scroll wheel once the user has clicked the map
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
}

/* ---------- Shared form validation ---------- */
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// South African numbers: 0XX XXX XXXX or +27 XX XXX XXXX (spaces/dashes allowed)
var SA_PHONE_PATTERN = /^(\+27|0)[1-8]\d{8}$/;

var validators = {
    name: function (v) {
        if (!v) return 'Please enter your full name.';
        if (v.length < 2) return 'Your name must be at least 2 characters.';
        if (!/^[A-Za-zÀ-ſ' -]+$/.test(v)) return 'Your name can only contain letters, spaces, hyphens and apostrophes.';
        return '';
    },
    email: function (v) {
        if (!v) return 'Please enter your email address.';
        return EMAIL_PATTERN.test(v) ? '' : 'Please enter a valid email, e.g. name@example.com.';
    },
    phone: function (v) {
        if (!v) return 'Please enter your phone number.';
        return SA_PHONE_PATTERN.test(v.replace(/[\s-]/g, '')) ? '' : 'Please enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.';
    },
    select: function (v) {
        return v ? '' : 'Please choose an option.';
    },
    quantity: function (v) {
        var n = Number(v);
        if (!v) return 'Please enter how many items you have.';
        if (!Number.isInteger(n) || n < 1 || n > 200) return 'Please enter a whole number between 1 and 200.';
        return '';
    },
    date: function (v) {
        if (!v) return 'Please choose a date.';
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var chosen = new Date(v + 'T00:00:00');
        if (chosen < today) return 'The date cannot be in the past.';
        if (chosen.getDay() === 0) return 'We are closed on Sundays. Please choose another day.';
        return '';
    },
    message: function (v) {
        if (!v) return 'Please enter a message.';
        return v.length < 20 ? 'Please write at least 20 characters (' + v.length + '/20).' : '';
    },
    consent: function (v, field) {
        return field.checked ? '' : 'Please tick the box to give consent.';
    }
};

/* Wires up real-time validation for a form.
   rules maps each field id to a validator name. Returns a function that
   validates every field and reports whether the form is valid. */
function setupValidation(form, rules) {
    function check(id) {
        var field = document.getElementById(id);
        var error = validators[rules[id]](field.value.trim(), field);
        var group = field.closest('.form-group');
        group.classList.toggle('has-error', !!error);
        group.classList.toggle('is-valid', !error);
        field.setAttribute('aria-invalid', String(!!error));
        document.getElementById(id + '-error').textContent = error;
        return !error;
    }

    Object.keys(rules).forEach(function (id) {
        var field = document.getElementById(id);
        var touched = false;
        field.addEventListener('blur', function () { touched = true; check(id); });
        field.addEventListener('input', function () { if (touched) check(id); });
        field.addEventListener('change', function () { touched = true; check(id); });
    });

    return function validateAll() {
        var firstInvalid = null;
        Object.keys(rules).forEach(function (id) {
            if (!check(id) && !firstInvalid) firstInvalid = document.getElementById(id);
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    };
}

function resetValidation(form) {
    form.reset();
    form.querySelectorAll('.form-group').forEach(function (g) { g.classList.remove('has-error', 'is-valid'); });
    form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
}

/* ---------- Supplier enquiry form with payout estimate ---------- */
var ITEM_RATES = { designer: 450, jackets: 250, sportswear: 180, everyday: 60 };
var TYPE_DETAILS = {
    sell: { label: 'Sell my items', multiplier: 1, note: 'paid via EFT once your items pass our quality check' },
    consign: { label: 'Consignment', multiplier: 1.4, note: 'paid as each item sells (you keep 70% of the sale price)' },
    donate: { label: 'Donation', multiplier: 0, note: 'thank you! Donated items fund student fashion vouchers' },
    bulk: { label: 'Bulk / wholesale supply', multiplier: 0.8, note: 'bulk rate, paid on collection' }
};

function initEnquiryForm() {
    var form = document.getElementById('enquiry-form');
    if (!form) return;
    var feedback = document.getElementById('enquiry-feedback');
    var dateField = document.getElementById('drop-off-date');
    dateField.min = new Date().toISOString().split('T')[0];

    var validateAll = setupValidation(form, {
        'name': 'name', 'email': 'email', 'phone': 'phone',
        'enquiry-type': 'select', 'category': 'select', 'quantity': 'quantity',
        'drop-off-date': 'date', 'message': 'message', 'consent': 'consent'
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateAll()) {
            feedback.className = 'form-feedback error';
            feedback.textContent = 'Please fix the highlighted fields before submitting.';
            feedback.hidden = false;
            return;
        }

        var type = TYPE_DETAILS[form.enquiryType.value];
        var categoryText = form.category.options[form.category.selectedIndex].text;
        var qty = Number(form.quantity.value);
        var estimate = Math.round(ITEM_RATES[form.category.value] * qty * type.multiplier);
        if (qty >= 20 && type.multiplier > 0) estimate = Math.round(estimate * 1.1); // 10% volume bonus
        var collection = qty > 15 ? 'We will collect from you (more than 15 items)' : 'Drop-off at our Rosebank store';
        var date = new Date(form.date.value + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        feedback.className = 'form-feedback success';
        feedback.innerHTML =
            '<h4>Thank you, ' + escapeHTML(form.name.value.trim()) + '! Your enquiry has been received.</h4>' +
            '<ul>' +
            '<li><strong>Enquiry:</strong> ' + type.label + ' &ndash; ' + qty + ' &times; ' + escapeHTML(categoryText) + '</li>' +
            '<li><strong>' + collection + ':</strong> ' + date + '</li>' +
            '<li><strong>Estimated payout:</strong> ' + (estimate > 0 ? formatRand(estimate) : 'R0') + ' &ndash; ' + type.note + '</li>' +
            '</ul>' +
            '<p>We will confirm by email at ' + escapeHTML(form.email.value.trim()) + ' within 2 working days.</p>';
        feedback.hidden = false;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        resetValidation(form);
    });
}
