/**
 * 404.js — 404 Error page interactions
 * Floating leaf particles, parallax mouse movement,
 * go-back navigation, and scroll indicator.
 */

(function () {
  'use strict';

  /* ============================================================
     FLOATING PARTICLES (Canvas)
     Lightweight leaf-like particles drifting across screen
     ============================================================ */
  var canvas = document.getElementById('particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 25;
    var animFrame;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /**
     * Particle constructor — creates a small floating element
     * that drifts upward with slight horizontal sway.
     */
    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.01 + 0.005;
      this.swayRadius = Math.random() * 30 + 10;
      // Color: mix of gold and white
      this.color = Math.random() > 0.5
        ? 'rgba(200, 164, 111, ' + this.opacity + ')'
        : 'rgba(255, 255, 255, ' + this.opacity + ')';
    };

    Particle.prototype.update = function () {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.sway) * 0.3;

      if (this.y < -20) {
        this.reset();
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    // Initialize particles
    for (var i = 0; i < particleCount; i++) {
      var p = new Particle();
      p.y = Math.random() * canvas.height; // Spread across screen initially
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < particles.length; j++) {
        particles[j].update();
        particles[j].draw();
      }
      animFrame = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        animateParticles();
      }
    });
  }

  /* ============================================================
     PARALLAX MOUSE MOVEMENT
     Subtle depth effect on background based on cursor position
     ============================================================ */
  var bgImage = document.querySelector('.error__bg-image');
  var content = document.querySelector('.error__content');
  var mouseTick = false;

  document.addEventListener('mousemove', function (e) {
    if (!mouseTick) {
      requestAnimationFrame(function () {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (bgImage) {
          bgImage.style.transform = 'scale(1.08) translate(' + (x * -8) + 'px, ' + (y * -8) + 'px)';
        }

        if (content) {
          content.style.transform = 'translate(' + (x * 4) + 'px, ' + (y * 4) + 'px)';
        }

        mouseTick = false;
      });
      mouseTick = true;
    }
  });

  /* ============================================================
     GO BACK BUTTON
     Uses browser history to navigate back
     ============================================================ */
  var goBackBtn = document.getElementById('go-back');
  if (goBackBtn) {
    goBackBtn.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  /* ============================================================
     SEARCH FORM
     Redirects to homepage with search query
     ============================================================ */
  var searchForm = document.querySelector('.error__search');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input');
      var query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = 'index.html#search=' + encodeURIComponent(query);
      }
    });
  }

  /* ============================================================
     KEYBOARD SHORTCUT
     Press Enter or Escape to go home
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.location.href = 'index.html';
    }
  });
})();
