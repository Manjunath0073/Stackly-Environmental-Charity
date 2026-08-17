/**
 * contact.js — Contact page interactions
 * Strict form validation (name, email, phone, message),
 * success message animation, parallax, and staggered reveals.
 */

(function () {
  'use strict';

  /* ---------- DOM Elements ---------- */
  var form = document.getElementById('contact-form');
  var successMsg = document.getElementById('form-success');
  var nameInput = document.getElementById('ct-name');
  var emailInput = document.getElementById('ct-email');
  var phoneInput = document.getElementById('ct-phone');
  var messageInput = document.getElementById('ct-message');

  /* ---------- Validation Helpers ---------- */

  /**
   * Validate name: only alphabets and spaces allowed.
   * Minimum 2 characters.
   */
  function validateName(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your name.' };
    }
    if (trimmed.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters.' };
    }
    // Only alphabets and spaces
    if (!/^[A-Za-z\s]+$/.test(trimmed)) {
      return { valid: false, message: 'Name can only contain letters and spaces.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validate email: must follow standard email format.
   */
  function validateEmail(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your email address.' };
    }
    // RFC-compliant email regex
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validate phone: only numeric characters allowed.
   * Optional field — valid if empty.
   */
  function validatePhone(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return { valid: true, message: '' }; // Optional field
    }
    // Only digits, spaces, dashes, parentheses, plus sign
    if (!/^[\d\s\-+()]+$/.test(trimmed)) {
      return { valid: false, message: 'Phone number can only contain digits, spaces, and +()-' };
    }
    // At least 7 digits
    var digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      return { valid: false, message: 'Phone number must have at least 7 digits.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validate message: minimum 10 characters.
   */
  function validateMessage(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter a message.' };
    }
    if (trimmed.length < 10) {
      return { valid: false, message: 'Message must be at least 10 characters long.' };
    }
    return { valid: true, message: '' };
  }

  /* ---------- UI State Helpers ---------- */

  function setFieldState(field, state, message) {
    var fieldDiv = field.closest('.ct-form__field');
    var errorSpan = fieldDiv.querySelector('.ct-form__error');

    // Reset states
    fieldDiv.classList.remove('ct-form__field--error', 'ct-form__field--valid');

    if (state === 'error') {
      fieldDiv.classList.add('ct-form__field--error');
      errorSpan.textContent = message;
    } else if (state === 'valid') {
      fieldDiv.classList.add('ct-form__field--valid');
      errorSpan.textContent = '';
    } else {
      errorSpan.textContent = '';
    }
  }

  function clearAllStates() {
    document.querySelectorAll('.ct-form__field').forEach(function (fieldDiv) {
      fieldDiv.classList.remove('ct-form__field--error', 'ct-form__field--valid');
      var errorSpan = fieldDiv.querySelector('.ct-form__error');
      if (errorSpan) errorSpan.textContent = '';
    });
  }

  /* ---------- Real-time Validation on Blur ---------- */

  if (nameInput) {
    nameInput.addEventListener('blur', function () {
      var result = validateName(this.value);
      setFieldState(this, result.valid ? 'valid' : 'error', result.message);
    });
    // Restrict non-alpha characters on input
    nameInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      var result = validateEmail(this.value);
      setFieldState(this, result.valid ? 'valid' : 'error', result.message);
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', function () {
      var result = validatePhone(this.value);
      setFieldState(this, result.valid ? 'valid' : 'error', result.message);
    });
    // Restrict non-numeric characters on input
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d\s\-+()]/g, '');
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', function () {
      var result = validateMessage(this.value);
      setFieldState(this, result.valid ? 'valid' : 'error', result.message);
    });
  }

  /* ---------- Form Submission ---------- */

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Validate all fields
      var nameResult = validateName(nameInput.value);
      var emailResult = validateEmail(emailInput.value);
      var phoneResult = validatePhone(phoneInput.value);
      var messageResult = validateMessage(messageInput.value);

      // Set all field states
      setFieldState(nameInput, nameResult.valid ? 'valid' : 'error', nameResult.message);
      setFieldState(emailInput, emailResult.valid ? 'valid' : 'error', emailResult.message);
      setFieldState(phoneInput, phoneResult.valid ? 'valid' : 'error', phoneResult.message);
      setFieldState(messageInput, messageResult.valid ? 'valid' : 'error', messageResult.message);

      // Check if all valid
      var allValid = nameResult.valid && emailResult.valid && phoneResult.valid && messageResult.valid;

      if (!allValid) {
        // Scroll to first error
        var firstError = form.querySelector('.ct-form__field--error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show loading state
      var submitBtn = form.querySelector('.ct-form__submit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      // Simulate send (1.5s delay)
      setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;

        // Show success message
        successMsg.classList.add('is-visible');

        // Reset form
        form.reset();
        clearAllStates();

        // Auto-hide success after 3 seconds
        setTimeout(function () {
          successMsg.style.animation = 'fadeSlideOut 0.4s ease forwards';
          setTimeout(function () {
            successMsg.classList.remove('is-visible');
            successMsg.style.animation = '';
          }, 400);
        }, 3000);
      }, 1500);
    });
  }

  /* ---------- Hero Parallax ---------- */
  var heroBg = document.querySelector('.ct-hero__bg');
  var heroTick = false;

  function updateHeroParallax() {
    if (!heroBg) return;
    var scrollY = window.scrollY;
    if (scrollY <= 500) {
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
  var ctaBg = document.querySelector('.ct-cta__bg');
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

  /* ---------- Staggered Reveal for Info Cards ---------- */
  var infoCards = document.querySelectorAll('.ct-info__card');
  if ('IntersectionObserver' in window && infoCards.length) {
    var cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    infoCards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.1) + 's';
      cardObserver.observe(card);
    });
  }
})();
