/* ========================================
   MEET MY ADVISOR - Main JS
   ======================================== */

/* ── Hamburger Menu ─────────────────────── */
(function () {
  var btn = document.querySelector('.hamburger');
  var menu = document.querySelector('.nav-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    menu.classList.toggle('open');
  });
  // dropdown toggles on mobile
  menu.querySelectorAll('li').forEach(function (li) {
    if (li.querySelector('.nav-dropdown')) {
      li.addEventListener('click', function (e) {
        if (window.innerWidth > 768) return;
        li.classList.toggle('open');
        e.stopPropagation();
      });
    }
  });
  document.addEventListener('click', function () {
    menu.classList.remove('open');
  });
  menu.addEventListener('click', function (e) { e.stopPropagation(); });
})();

/* ── Scroll-to-top ──────────────────────── */
(function () {
  var btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Animated Counters ──────────────────── */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var decimals = (target % 1 !== 0) ? 1 : 0;
    var duration = 2000;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (el) { observer.observe(el); });
})();

/* ── Testimonial Carousel ───────────────── */
(function () {
  var track = document.querySelector('.testi-track');
  if (!track) return;
  var slides = track.querySelectorAll('.testi-slide');
  var dots = document.querySelectorAll('.testi-dot');
  var current = 0;
  var total = slides.length;
  var autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); resetTimer(); }); });

  var prev = document.querySelector('.testi-prev');
  var next = document.querySelector('.testi-next');
  if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

  function resetTimer() { clearInterval(autoTimer); autoTimer = setInterval(function () { goTo(current + 1); }, 5000); }
  resetTimer();
})();

/* ── Hero Slides (if multiple) ──────────── */
(function () {
  var heroSlides = document.querySelectorAll('.hero-slide-bg');
  if (heroSlides.length < 2) return;
  var dots = document.querySelectorAll('.hero-dot');
  var current = 0;

  function show(idx) {
    heroSlides.forEach(function (s, i) { s.style.opacity = i === idx ? '1' : '0'; });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    current = idx;
  }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });
  setInterval(function () { show((current + 1) % heroSlides.length); }, 6000);
})();

/* ── Sticky header shadow on scroll ─────── */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.08)';
  });
})();
