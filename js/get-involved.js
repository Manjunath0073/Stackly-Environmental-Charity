/**
 * get-involved.js — Get Involved page interactions
 * Volunteer filtering, donation tier interaction, testimonial carousel,
 * animated counters, progress bar fills, parallax, and staggered reveals.
 */

(function () {
  'use strict';

  /* ---------- Volunteer Category Filtering ---------- */
  var vTabs = document.querySelectorAll('.volunteer__tab');
  var vCards = document.querySelectorAll('.volunteer__card');

  function filterVolunteers(type) {
    vCards.forEach(function (card) {
      var match = type === 'all' || card.dataset.type === type;
      if (match) {
        card.classList.remove('hidden');
        card.style.position = '';
        card.style.visibility = '';
      } else {
        card.classList.add('hidden');
        setTimeout(function () {
          if (card.classList.contains('hidden')) {
            card.style.position = 'absolute';
            card.style.visibility = 'hidden';
          }
        }, 400);
      }
    });
  }

  vTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      vTabs.forEach(function (t) {
        t.classList.remove('volunteer__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('volunteer__tab--active');
      this.setAttribute('aria-selected', 'true');
      filterVolunteers(this.dataset.filter);
    });
  });

  /* ---------- Animated Counters ---------- */
  function formatCount(value, suffix) {
    var display;
    if (value >= 1000000) {
      display = (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1000) {
      display = Math.round(value).toLocaleString();
    } else {
      display = Math.round(value).toLocaleString();
    }
    return display + (suffix || '');
  }

  function animateCounter(el, target, suffix) {
    var duration = 2200;
    var startTime = performance.now();
    function step(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = formatCount(target * eased, suffix);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(target, suffix);
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseFloat(el.dataset.target) || 0;
            var suffix = el.dataset.suffix || '';
            animateCounter(el, target, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ---------- Progress Bar Fills ---------- */
  var progressBars = document.querySelectorAll('.fundraise__example-fill');
  if ('IntersectionObserver' in window && progressBars.length) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            var value = bar.dataset.progress || '0';
            bar.style.width = value + '%';
            barObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );
    progressBars.forEach(function (bar) { barObserver.observe(bar); });
  }

  /* ---------- Staggered Reveal for Cards ---------- */
  var allCards = document.querySelectorAll('.ways__card, .donate__card, .volunteer__card, .fundraise__example');
  if ('IntersectionObserver' in window && allCards.length) {
    var cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    allCards.forEach(function (card, i) {
      card.style.transitionDelay = (i % 4 * 0.1) + 's';
      cardObserver.observe(card);
    });
  }

  /* ---------- Hero Parallax ---------- */
  var heroBg = document.querySelector('.gii-hero__bg');
  var heroTick = false;

  function updateHeroParallax() {
    if (!heroBg) return;
    var scrollY = window.scrollY;
    if (scrollY <= 600) {
      heroBg.style.transform = 'translateY(' + (scrollY * 0.25) + 'px) scale(1.05)';
    }
    heroTick = false;
  }

  window.addEventListener('scroll', function () {
    if (!heroTick) {
      requestAnimationFrame(updateHeroParallax);
      heroTick = true;
    }
  }, { passive: true });

  updateHeroParallax();

  /* ---------- CTA Parallax ---------- */
  var ctaBg = document.querySelector('.gii-cta__bg');
  var ctaTick = false;

  function updateCtaParallax() {
    if (!ctaBg) return;
    var rect = ctaBg.parentElement.getBoundingClientRect();
    var viewH = window.innerHeight;
    if (rect.top < viewH && rect.bottom > 0) {
      var scrolled = viewH - rect.top;
      ctaBg.style.transform = 'translateY(' + (scrolled * 0.15) + 'px) scale(1.05)';
    }
    ctaTick = false;
  }

  window.addEventListener('scroll', function () {
    if (!ctaTick) {
      requestAnimationFrame(updateCtaParallax);
      ctaTick = true;
    }
  }, { passive: true });

  updateCtaParallax();

  /* ---------- Testimonial Carousel ---------- */
  var slider = document.getElementById('stories-slider');
  if (slider) {
    var track = slider.querySelector('.stories__track');
    var slides = Array.from(track.children);
    var prevBtn = slider.querySelector('.stories__btn--prev');
    var nextBtn = slider.querySelector('.stories__btn--next');
    var dotsContainer = slider.querySelector('.stories__dots');
    var currentIdx = 0;
    var autoplayTimer;

    slides.forEach(function (_, index) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to story ' + (index + 1));
      dot.addEventListener('click', function () { goTo(index); });
      dotsContainer.appendChild(dot);
    });

    var dots = Array.from(dotsContainer.children);

    function updateSlider() {
      track.style.transform = 'translateX(-' + (currentIdx * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIdx);
        dot.setAttribute('aria-current', i === currentIdx ? 'true' : 'false');
      });
    }

    function goTo(index) {
      currentIdx = (index + slides.length) % slides.length;
      updateSlider();
      resetAutoplay();
    }

    function next() { goTo(currentIdx + 1); }
    function prev() { goTo(currentIdx - 1); }

    function startAutoplay() { autoplayTimer = setInterval(next, 6000); }
    function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    slider.addEventListener('mouseenter', function () { clearInterval(autoplayTimer); });
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('touchstart', function () { clearInterval(autoplayTimer); }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    updateSlider();
    startAutoplay();
  }

  /* ---------- Donation Card Hover Glow ---------- */
  var donateCards = document.querySelectorAll('.donate__card');
  donateCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });
})();
