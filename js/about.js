/**
 * about.js — About page interactions
 * Timeline staggered reveals, animated counters with ring progress,
 * team card hover, approach step animations, and CTA parallax.
 */

(function () {
  'use strict';

  /* ---------- Journey staggered reveal ---------- */
  const journeyItems = document.querySelectorAll('[data-journey]');
  const journeyLineFill = document.querySelector('.journey__line-fill');
  const journeyTrack = document.querySelector('.journey__timeline');

  if ('IntersectionObserver' in window && journeyItems.length) {
    const journeyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('journey--visible');
            journeyObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    );
    journeyItems.forEach((item) => {
      journeyObserver.observe(item);
    });
  }

  function updateJourneyProgress() {
    if (!journeyLineFill || !journeyTrack) return;
    const trackRect = journeyTrack.getBoundingClientRect();
    const trackTop = trackRect.top;
    const trackHeight = trackRect.height;
    const windowHeight = window.innerHeight;

    if (trackTop > windowHeight) {
      journeyLineFill.style.height = '0%';
      return;
    }

    if (trackTop + trackHeight < 0) {
      journeyLineFill.style.height = '100%';
      return;
    }

    const scrolled = windowHeight - trackTop;
    const total = trackHeight + windowHeight;
    const progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);
    journeyLineFill.style.height = progress + '%';
  }

  window.addEventListener('scroll', function () {
    requestAnimationFrame(updateJourneyProgress);
  }, { passive: true });

  updateJourneyProgress();

  /* ---------- Animated counters (about impact) ---------- */
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
      (entries) => {
        entries.forEach((entry) => {
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
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- Impact ring SVG progress ---------- */
  var rings = document.querySelectorAll('.impact__progress');
  if ('IntersectionObserver' in window && rings.length) {
    var ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            var circle = entry.target;
            var pct = parseFloat(circle.dataset.progress) || 0;
            var circumference = 2 * Math.PI * 54; // r=54
            var offset = circumference - (circumference * pct / 100);
            circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            circle.style.strokeDashoffset = offset;
            ringObserver.unobserve(circle);
          }
        });
      },
      { threshold: 0.5 }
    );
    rings.forEach((r) => ringObserver.observe(r));
  }

  /* ---------- Team card staggered reveal ---------- */
  var teamCards = document.querySelectorAll('.team__card');
  if ('IntersectionObserver' in window && teamCards.length) {
    var teamObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            teamObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    teamCards.forEach((card, i) => {
      card.style.transitionDelay = (i * 0.1) + 's';
      teamObserver.observe(card);
    });
  }

  /* ---------- Process step staggered reveal ---------- */
  var processSteps = document.querySelectorAll('[data-process]');
  var processLineFill = document.querySelector('.process__line-fill');
  var processFlow = document.querySelector('.process__flow');

  if ('IntersectionObserver' in window && processSteps.length) {
    var processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('process--visible');
            processObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );
    processSteps.forEach((step) => {
      processObserver.observe(step);
    });
  }

  function updateProcessProgress() {
    if (!processLineFill || !processFlow) return;
    var flowRect = processFlow.getBoundingClientRect();
    var flowTop = flowRect.top;
    var flowHeight = flowRect.height;
    var windowHeight = window.innerHeight;

    if (flowTop > windowHeight) {
      processLineFill.style.height = '0%';
      return;
    }

    if (flowTop + flowHeight < 0) {
      processLineFill.style.height = '100%';
      return;
    }

    var scrolled = windowHeight - flowTop;
    var total = flowHeight + windowHeight;
    var progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);
    processLineFill.style.height = progress + '%';
  }

  window.addEventListener('scroll', function () {
    requestAnimationFrame(updateProcessProgress);
  }, { passive: true });

  updateProcessProgress();

  /* ---------- About CTA parallax ---------- */
  var ctaBg = document.querySelector('.about-cta__bg');
  var ticking = false;

  function updateCtaParallax() {
    if (!ctaBg) return;
    var rect = ctaBg.parentElement.getBoundingClientRect();
    var viewH = window.innerHeight;
    if (rect.top < viewH && rect.bottom > 0) {
      var scrolled = viewH - rect.top;
      ctaBg.style.transform = 'translateY(' + (scrolled * 0.15) + 'px) scale(1.05)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateCtaParallax);
      ticking = true;
    }
  }, { passive: true });

  updateCtaParallax();

  /* ---------- About hero parallax ---------- */
  var heroBg = document.querySelector('.about-hero__bg');
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
})();
