/**
 * projects.js — Projects page interactions
 * Project filtering, animated counters, progress bar fills,
 * staggered reveals, hero/CTA parallax, and map marker hover.
 */

(function () {
  'use strict';

  /* ---------- Project Category Filtering ---------- */
  var tabs = document.querySelectorAll('.filter__tab');
  var cards = document.querySelectorAll('.filter__card');
  var grid = document.getElementById('filter-grid');

  function filterProjects(category) {
    cards.forEach(function (card) {
      var match = category === 'all' || card.dataset.category === category;
      if (match) {
        card.classList.remove('hidden');
        card.style.position = '';
        card.style.visibility = '';
      } else {
        card.classList.add('hidden');
        // Delay removal from flow for animation
        setTimeout(function () {
          if (card.classList.contains('hidden')) {
            card.style.position = 'absolute';
            card.style.visibility = 'hidden';
          }
        }, 400);
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('filter__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('filter__tab--active');
      this.setAttribute('aria-selected', 'true');
      filterProjects(this.dataset.filter);
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
  var progressBars = document.querySelectorAll(
    '.featured__progress-fill, .status__progress-fill, .metrics__bar-fill'
  );
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

  /* ---------- Staggered Reveal for Filter Cards ---------- */
  var filterCards = document.querySelectorAll('.filter__card');
  if ('IntersectionObserver' in window && filterCards.length) {
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
    filterCards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.08) + 's';
      cardObserver.observe(card);
    });
  }

  /* ---------- Staggered Reveal for Status Cards ---------- */
  var statusCards = document.querySelectorAll('.status__card');
  if ('IntersectionObserver' in window && statusCards.length) {
    var statusObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            statusObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    statusCards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.1) + 's';
      statusObserver.observe(card);
    });
  }

  /* ---------- Hero Parallax ---------- */
  var heroBg = document.querySelector('.proj-hero__bg');
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
  var ctaBg = document.querySelector('.proj-cta__bg');
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

  /* ---------- Map Marker Hover Cards ---------- */
  var markers = document.querySelectorAll('.gmap__marker');
  var mapCards = document.querySelectorAll('.gmap__card');

  markers.forEach(function (marker) {
    marker.addEventListener('mouseenter', function () {
      var region = this.dataset.region;
      mapCards.forEach(function (card) {
        if (card.textContent.indexOf(region) !== -1) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    });
    marker.addEventListener('mouseleave', function () {
      mapCards.forEach(function (card) {
        card.style.opacity = '';
        card.style.transform = '';
      });
    });
  });

  /* ---------- Deep Dive Sticky Visual ---------- */
  var deepdiveVisual = document.querySelector('.deepdive__visual');
  if (deepdiveVisual && window.innerWidth > 1024) {
    // Sticky effect is handled by CSS position: sticky
    // Add a subtle fade on scroll
    var ddTick = false;
    function updateDeepdiveFade() {
      if (!deepdiveVisual) return;
      var rect = deepdiveVisual.getBoundingClientRect();
      var viewH = window.innerHeight;
      if (rect.top < 0) {
        deepdiveVisual.style.opacity = Math.max(0.4, 1 + rect.top / 400);
      } else {
        deepdiveVisual.style.opacity = '1';
      }
      ddTick = false;
    }
    window.addEventListener('scroll', function () {
      if (!ddTick) {
        requestAnimationFrame(updateDeepdiveFade);
        ddTick = true;
      }
    }, { passive: true });
  }
})();
