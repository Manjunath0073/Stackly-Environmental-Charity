/**
 * auth.js — Login & Signup page interactions
 * Strict form validation, password strength indicator,
 * password visibility toggle, success message animations.
 */

(function () {
  'use strict';

  /* ============================================================
     PASSWORD VISIBILITY TOGGLE
     ============================================================ */
  document.querySelectorAll('.auth__toggle-pw').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.dataset.target;
      var input = document.getElementById(targetId);
      if (!input) return;

      var eyeOpen = this.querySelector('.auth__eye-open');
      var eyeClosed = this.querySelector('.auth__eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
    });
  });

  /* ============================================================
     PASSWORD STRENGTH INDICATOR (Signup only)
     ============================================================ */
  var signupPassword = document.getElementById('signup-password');
  var strengthContainer = document.getElementById('password-strength');
  var strengthFill = document.getElementById('strength-fill');
  var strengthText = document.getElementById('strength-text');

  /**
   * Check password strength based on:
   * - Uppercase letter
   * - Lowercase letter
   * - Number
   * - Special character
   * - Minimum 8 characters
   */
  function checkPasswordStrength(password) {
    var checks = {
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      length: password.length >= 8,
    };

    var score = 0;
    if (checks.upper) score++;
    if (checks.lower) score++;
    if (checks.number) score++;
    if (checks.special) score++;
    if (checks.length) score++;

    var level = 'none';
    if (score >= 5) level = 'strong';
    else if (score >= 3) level = 'medium';
    else if (score >= 1) level = 'weak';

    return { checks: checks, level: level, score: score };
  }

  function updateStrengthUI(password) {
    if (!strengthContainer || !strengthFill || !strengthText) return;

    if (!password) {
      strengthContainer.style.display = 'none';
      return;
    }

    strengthContainer.style.display = 'block';
    var result = checkPasswordStrength(password);

    // Update bar
    strengthFill.className = 'auth__strength-fill';
    if (result.level === 'weak') {
      strengthFill.classList.add('auth__strength-fill--weak');
      strengthText.textContent = 'Weak password';
      strengthText.className = 'auth__strength-text auth__strength-text--weak';
    } else if (result.level === 'medium') {
      strengthFill.classList.add('auth__strength-fill--medium');
      strengthText.textContent = 'Medium strength';
      strengthText.className = 'auth__strength-text auth__strength-text--medium';
    } else if (result.level === 'strong') {
      strengthFill.classList.add('auth__strength-fill--strong');
      strengthText.textContent = 'Strong password';
      strengthText.className = 'auth__strength-text auth__strength-text--strong';
    }

    // Update checklist
    document.querySelectorAll('.auth__check').forEach(function (el) {
      var checkName = el.dataset.check;
      if (result.checks[checkName]) {
        el.classList.add('auth__check--met');
      } else {
        el.classList.remove('auth__check--met');
      }
    });
  }

  if (signupPassword) {
    signupPassword.addEventListener('input', function () {
      updateStrengthUI(this.value);
    });
  }

  /* ============================================================
     VALIDATION HELPERS
     ============================================================ */

  /** Name: only alphabets and spaces, min 2 chars */
  function validateName(value) {
    var t = value.trim();
    if (!t) return { valid: false, message: 'Please enter your name.' };
    if (t.length < 2) return { valid: false, message: 'Name must be at least 2 characters.' };
    if (!/^[A-Za-z\s]+$/.test(t)) return { valid: false, message: 'Name can only contain letters and spaces.' };
    return { valid: true, message: '' };
  }

  /** Email: valid format */
  function validateEmail(value) {
    var t = value.trim();
    if (!t) return { valid: false, message: 'Please enter your email address.' };
    var regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!regex.test(t)) return { valid: false, message: 'Please enter a valid email address.' };
    return { valid: true, message: '' };
  }

  /** Phone: only numbers, 10 digits */
  function validatePhone(value) {
    var t = value.trim();
    if (!t) return { valid: true, message: '' }; // Optional
    var digits = t.replace(/\D/g, '');
    if (digits.length < 7) return { valid: false, message: 'Phone number must have at least 7 digits.' };
    if (digits.length > 15) return { valid: false, message: 'Phone number is too long.' };
    return { valid: true, message: '' };
  }

  /** Password (Login): min 6 chars */
  function validateLoginPassword(value) {
    if (!value) return { valid: false, message: 'Please enter your password.' };
    if (value.length < 6) return { valid: false, message: 'Password must be at least 6 characters.' };
    return { valid: true, message: '' };
  }

  /** Password (Signup): min 8 chars, uppercase, lowercase, number, special */
  function validateSignupPassword(value) {
    if (!value) return { valid: false, message: 'Please create a password.' };
    if (value.length < 8) return { valid: false, message: 'Password must be at least 8 characters.' };
    if (!/[A-Z]/.test(value)) return { valid: false, message: 'Password must include an uppercase letter.' };
    if (!/[a-z]/.test(value)) return { valid: false, message: 'Password must include a lowercase letter.' };
    if (!/[0-9]/.test(value)) return { valid: false, message: 'Password must include a number.' };
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return { valid: false, message: 'Password must include a special character.' };
    return { valid: true, message: '' };
  }

  /** Confirm Password: must match */
  function validateConfirmPassword(password, confirm) {
    if (!confirm) return { valid: false, message: 'Please confirm your password.' };
    if (password !== confirm) return { valid: false, message: 'Passwords do not match.' };
    return { valid: true, message: '' };
  }

  /* ============================================================
     UI STATE HELPERS
     ============================================================ */
  function setFieldState(input, state, message) {
    var field = input.closest('.auth__field');
    var errorSpan = field.querySelector('.auth__error');
    field.classList.remove('auth__field--error', 'auth__field--valid');
    if (state === 'error') {
      field.classList.add('auth__field--error');
      errorSpan.textContent = message;
    } else if (state === 'valid') {
      field.classList.add('auth__field--valid');
      errorSpan.textContent = '';
    } else {
      errorSpan.textContent = '';
    }
  }

  function clearAllStates(form) {
    form.querySelectorAll('.auth__field').forEach(function (field) {
      field.classList.remove('auth__field--error', 'auth__field--valid');
      var errorSpan = field.querySelector('.auth__error');
      if (errorSpan) errorSpan.textContent = '';
    });
  }

  /* ============================================================
     LOGIN FORM
     ============================================================ */
  var loginForm = document.getElementById('login-form');
  var loginEmail = document.getElementById('login-email');
  var loginPassword = document.getElementById('login-password');
  var loginSuccess = document.getElementById('login-success');

  if (loginForm) {
    // Real-time validation on blur
    loginEmail.addEventListener('blur', function () {
      var r = validateEmail(this.value);
      setFieldState(this, r.valid ? 'valid' : 'error', r.message);
    });

    loginPassword.addEventListener('blur', function () {
      var r = validateLoginPassword(this.value);
      setFieldState(this, r.valid ? 'valid' : 'error', r.message);
    });

    // Submit
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var emailResult = validateEmail(loginEmail.value);
      var passResult = validateLoginPassword(loginPassword.value);

      setFieldState(loginEmail, emailResult.valid ? 'valid' : 'error', emailResult.message);
      setFieldState(loginPassword, passResult.valid ? 'valid' : 'error', passResult.message);

      if (!emailResult.valid || !passResult.valid) {
        var firstError = loginForm.querySelector('.auth__field--error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Loading state
      var submitBtn = loginForm.querySelector('.auth__submit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;

        // Show success
        loginSuccess.classList.add('is-visible');

        // Save user data to localStorage
        var email = loginEmail ? loginEmail.value : 'guardian@stacklyearth.org';
        var name = email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        var roleRadio = loginForm.querySelector('input[name="role"]:checked');
        var role = roleRadio ? roleRadio.value : 'guardian';
        localStorage.setItem('stackly_user', JSON.stringify({
          name: name,
          email: email,
          role: role
        }));

        // Clear form
        loginForm.reset();
        clearAllStates(loginForm);

        // Redirect based on role
        var dashboardUrl = role === 'champion' ? '../dashboard/champion.html' : '../dashboard/guardian.html';
        setTimeout(function () {
          window.location.href = dashboardUrl;
        }, 3000);
      }, 1500);
    });
  }

  /* ============================================================
     SIGNUP FORM
     ============================================================ */
  var signupForm = document.getElementById('signup-form');
  var signupName = document.getElementById('signup-name');
  var signupEmail = document.getElementById('signup-email');
  var signupPhone = document.getElementById('signup-phone');
  var signupConfirm = document.getElementById('signup-confirm');
  var signupSuccess = document.getElementById('signup-success');

  if (signupForm) {
    // Restrict name to alpha only
    if (signupName) {
      signupName.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
      });
      signupName.addEventListener('blur', function () {
        var r = validateName(this.value);
        setFieldState(this, r.valid ? 'valid' : 'error', r.message);
      });
    }

    // Email validation
    if (signupEmail) {
      signupEmail.addEventListener('blur', function () {
        var r = validateEmail(this.value);
        setFieldState(this, r.valid ? 'valid' : 'error', r.message);
      });
    }

    // Phone: numeric only
    if (signupPhone) {
      signupPhone.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d\s\-+()]/g, '');
      });
      signupPhone.addEventListener('blur', function () {
        var r = validatePhone(this.value);
        setFieldState(this, r.valid ? 'valid' : 'error', r.message);
      });
    }

    // Confirm password: check match on blur
    if (signupConfirm) {
      signupConfirm.addEventListener('blur', function () {
        var pw = signupPassword ? signupPassword.value : '';
        var r = validateConfirmPassword(pw, this.value);
        setFieldState(this, r.valid ? 'valid' : 'error', r.message);
      });
    }

    // Submit
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameResult = validateName(signupName.value);
      var emailResult = validateEmail(signupEmail.value);
      var phoneResult = validatePhone(signupPhone.value);
      var passResult = validateSignupPassword(signupPassword.value);
      var confirmResult = validateConfirmPassword(signupPassword.value, signupConfirm.value);

      setFieldState(signupName, nameResult.valid ? 'valid' : 'error', nameResult.message);
      setFieldState(signupEmail, emailResult.valid ? 'valid' : 'error', emailResult.message);
      setFieldState(signupPhone, phoneResult.valid ? 'valid' : 'error', phoneResult.message);
      setFieldState(signupPassword, passResult.valid ? 'valid' : 'error', passResult.message);
      setFieldState(signupConfirm, confirmResult.valid ? 'valid' : 'error', confirmResult.message);

      var allValid = nameResult.valid && emailResult.valid && phoneResult.valid && passResult.valid && confirmResult.valid;

      if (!allValid) {
        var firstError = signupForm.querySelector('.auth__field--error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Loading state
      var submitBtn = signupForm.querySelector('.auth__submit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;

        // Show success
        signupSuccess.classList.add('is-visible');

        // Save user data to localStorage
        var name = signupName ? signupName.value : 'Champion';
        var email = signupEmail ? signupEmail.value : '';
        var roleRadio = signupForm.querySelector('input[name="role"]:checked');
        var role = roleRadio ? roleRadio.value : 'champion';
        localStorage.setItem('stackly_user', JSON.stringify({
          name: name,
          email: email,
          role: role
        }));

        // Clear form
        signupForm.reset();
        clearAllStates(signupForm);

        // Reset password strength
        if (strengthContainer) strengthContainer.style.display = 'none';
        document.querySelectorAll('.auth__check').forEach(function (el) {
          el.classList.remove('auth__check--met');
        });

        // Redirect based on role
        var dashboardUrl = role === 'champion' ? '../dashboard/champion.html' : '../dashboard/guardian.html';
        setTimeout(function () {
          window.location.href = dashboardUrl;
        }, 3000);
        setTimeout(function () {
          window.location.href = '../dashboard/guardian.html';
        }, 3000);
      }, 1500);
    });
  }

  /* ============================================================
     VISUAL PANEL PARALLAX
     ============================================================ */
  var visualBg = document.querySelector('.auth__visual-bg');
  var tick = false;

  function updateParallax() {
    if (!visualBg) return;
    var scrollY = window.scrollY;
    if (scrollY <= 500) {
      visualBg.style.transform = 'translateY(' + (scrollY * 0.15) + 'px) scale(1.05)';
    }
    tick = false;
  }

  window.addEventListener('scroll', function () {
    if (!tick) {
      requestAnimationFrame(updateParallax);
      tick = true;
    }
  }, { passive: true });

  updateParallax();
})();
