/**
 * main.js — Shared logic across all pages
 * Header behavior, mobile navigation, smooth scroll,
 * scroll-triggered reveals, button ripple, and form handling.
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const toggle = document.querySelector('.header__toggle');
  const overlay = document.getElementById('mobile-menu');
  const overlayLinks = overlay ? overlay.querySelectorAll('a') : [];

  /* ---------- Header scroll state ---------- */
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---------- Mobile navigation ---------- */
  const closeBtn = document.querySelector('.mobnav__close');
  const mobnavScroll = document.querySelector('.mobnav__scroll');
  let touchStartY = 0;
  let touchStartX = 0;
  let isSwiping = false;

  function setMenuOpen(open) {
    if (!header || !toggle) return;
    header.classList.toggle('header--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (overlay) {
      overlay.setAttribute('aria-hidden', String(!open));
      overlay.classList.toggle('header__overlay--open', open);
    }
    document.body.style.overflow = open ? 'hidden' : '';

    if (open && mobnavScroll) {
      mobnavScroll.scrollTop = 0;
    }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.contains('header--open');
      setMenuOpen(!isOpen);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => setMenuOpen(false));
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('mobnav') || e.target.classList.contains('mobnav__scroll')) {
        setMenuOpen(false);
      }
    });
  }

  overlayLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.querySelectorAll('.mobnav__link, .mobnav__card, .mobnav__cta-btn').forEach((el) => {
    el.addEventListener('click', () => setMenuOpen(false));
  });

  if (overlay) {
    overlay.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isSwiping = false;
    }, { passive: true });

    overlay.addEventListener('touchmove', (e) => {
      const deltaY = e.touches[0].clientY - touchStartY;
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        isSwiping = true;
      }
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
      if (isSwiping) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX > 80) {
          setMenuOpen(false);
        }
      }
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header && header.classList.contains('header--open')) {
      setMenuOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      setMenuOpen(false);
    }
  });

  /* ---------- Smooth scroll with offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('reveal--visible'));
  }

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', function (event) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size / 2}px;
        top: ${event.clientY - rect.top - size / 2}px;
        background: rgba(255, 255, 255, 0.35);
        border-radius: 50%;
        transform: scale(0);
        animation: btn-ripple 0.6s linear;
        pointer-events: none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes btn-ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ---------- Simple form feedback ---------- */
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) return;

      const button = form.querySelector('button[type="submit"]');
      const originalContent = button ? button.innerHTML : '';

      if (button) {
        button.innerHTML = '✓';
        button.disabled = true;
      }

      let successMsg = form.parentElement.querySelector('.form-success');
      if (!successMsg) {
        successMsg = document.createElement('p');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Thank you! You\'ve been subscribed.';
        form.parentElement.appendChild(successMsg);
      }
      successMsg.classList.add('form-success--visible');
      form.reset();

      setTimeout(() => {
        successMsg.classList.remove('form-success--visible');
        if (button) {
          button.innerHTML = originalContent;
          button.disabled = false;
        }
      }, 3000);
    });
  });
})();
