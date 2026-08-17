/**
 * home.js — Homepage interactions
 * Hero parallax, animated counters, campaign progress bars,
 * and custom testimonial carousel.
 */

(function () {
  'use strict';

  /* ---------- Hero parallax ---------- */
  const heroBg = document.querySelector('.hero__bg');
  let ticking = false;

  function updateHeroParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroHeight = heroBg.parentElement ? heroBg.parentElement.offsetHeight : window.innerHeight;
    if (scrollY <= heroHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.08)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  }, { passive: true });

  updateHeroParallax();

  /* ---------- Animated counters ---------- */
  function formatCount(value, suffix) {
    let display;
    if (value >= 1000000) {
      display = (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1000) {
      display = Math.round(value).toLocaleString();
    } else {
      display = Math.round(value).toLocaleString();
    }
    return display + (suffix || '');
  }

  function animateCounter(element, target, suffix) {
    const duration = 2000;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;
      element.textContent = formatCount(current, suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatCount(target, suffix);
      }
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.target) || 0;
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => {
      const target = parseFloat(counter.dataset.target) || 0;
      const suffix = counter.dataset.suffix || '';
      counter.textContent = formatCount(target, suffix);
    });
  }

  /* ---------- Campaign progress bars ---------- */
  const progressBars = document.querySelectorAll('.progress__fill, .impact-bar__fill');
  if ('IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const value = bar.dataset.progress || '0';
            bar.style.width = value + '%';
            progressObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );
    progressBars.forEach((bar) => progressObserver.observe(bar));
  } else {
    progressBars.forEach((bar) => {
      bar.style.width = (bar.dataset.progress || '0') + '%';
    });
  }

  /* ---------- Testimonial marquee handled by CSS animation ---------- */
})();
