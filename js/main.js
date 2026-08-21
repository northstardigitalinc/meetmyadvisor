/* ========================================
   MEET MY ADVISOR - Main JS
   Transitions match original: fade hero 500ms,
   slide testimonials 500ms, fadeIn scroll anims,
   counters 2000ms, dropdowns 300ms ease-out
   ======================================== */

/* ── Hamburger Menu ─────────────────────── */
(function () {
  var btn = document.querySelector('.hamburger');
  var menu = document.querySelector('.nav-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open'));
  });
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
    btn.setAttribute('aria-expanded', 'false');
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

/* ── Sticky header shadow ───────────────── */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.14)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
    }
  }, { passive: true });
})();

/* ── Hero Background Slideshow (fade, 5s, 500ms) ── */
(function () {
  var slides = document.querySelectorAll('.hero-slide-bg');
  if (!slides.length) return;
  var dots = document.querySelectorAll('.hero-dot');
  var current = 0;
  var total = slides.length;

  function show(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  slides[0].classList.add('active');
  dots[0] && dots[0].classList.add('active');
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); resetHero(); }); });

  var heroTimer;
  function resetHero() {
    clearInterval(heroTimer);
    heroTimer = setInterval(function () { show(current + 1); }, 5000);
  }
  resetHero();
})();

/* ── Animated Counters (2000ms, ease-out cubic) ── */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

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
      var current = target * easeOutCubic(progress);
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (el) { counterObs.observe(el); });
})();

/* ── Testimonial Carousel (slide, 500ms, 5s autoplay, 2-per-view) ── */
(function () {
  var track = document.querySelector('.testi-track');
  if (!track) return;
  var slides = track.querySelectorAll('.testi-slide');
  var dots = document.querySelectorAll('.testi-dot');
  var current = 0;
  var total = slides.length;
  var isAnimating = false;
  var autoTimer;

  track.style.transition = 'transform 500ms ease';

  function goTo(idx, skipAnim) {
    if (isAnimating && !skipAnim) return;
    isAnimating = true;
    current = ((idx % total) + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    setTimeout(function () { isAnimating = false; }, 520);
  }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); resetTimer(); });
  });

  var prev = document.querySelector('.testi-prev');
  var next = document.querySelector('.testi-next');
  if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

  // Touch/swipe support
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); resetTimer(); }
  });

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
  }
  resetTimer();
})();

/* ── Scroll Reveal Animations (fadeInLeft/Up/Right/fadeIn) ── */
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var animEls = document.querySelectorAll('[data-anim]');
  if (!animEls.length) return;

  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var anim = el.dataset.anim || 'fadeInUp';
        var delay = el.dataset.animDelay || '0';
        el.style.animationDelay = delay + 'ms';
        el.classList.add('anim-' + anim, 'anim-running');
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(function (el) {
    el.classList.add('anim-hidden');
    revealObs.observe(el);
  });
})();

/* ── Partner Logos Marquee (infinite scroll) ── */
(function () {
  var strip = document.querySelector('.partners-logo-strip');
  if (!strip) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Clone logos for seamless loop
  var origLogos = Array.from(strip.children);
  origLogos.forEach(function (logo) {
    var clone = logo.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    strip.appendChild(clone);
  });
  strip.classList.add('marquee-active');
})();
