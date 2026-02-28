/**
 * Mirawotech Solutions - Premium UX: scroll reveal, sticky CTA, form success, a11y
 */
(function () {
  'use strict';

  var HEADER = document.getElementById('header');
  var NAV_TOGGLE = document.getElementById('nav-toggle');
  var NAV_MENU = document.getElementById('nav-menu');
  var NAV_LINKS = document.querySelectorAll('.nav__link');
  var STICKY_CTA = document.getElementById('sticky-cta');
  var CONTACT_FORM = document.getElementById('contact-form');
  var FORM_SUCCESS = document.getElementById('form-success');
  var YEAR_SPAN = document.getElementById('year');

  function initHeaderScroll() {
    if (!HEADER) return;
    function onScroll() {
      HEADER.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initStickyCta() {
    if (!STICKY_CTA) return;
    var hero = document.getElementById('home');
    if (!hero) return;
    var heroBottom = hero.offsetHeight - 100;

    function onScroll() {
      if (window.scrollY > heroBottom) {
        STICKY_CTA.classList.add('visible');
      } else {
        STICKY_CTA.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initMobileMenu() {
    if (!NAV_TOGGLE || !NAV_MENU) return;

    function closeMenu() {
      NAV_MENU.classList.remove('active');
      NAV_TOGGLE.classList.remove('active');
      NAV_TOGGLE.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMenu() {
      NAV_MENU.classList.add('active');
      NAV_TOGGLE.classList.add('active');
      NAV_TOGGLE.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function toggleMenu() {
      if (NAV_MENU.classList.contains('active')) closeMenu();
      else openMenu();
    }

    NAV_TOGGLE.addEventListener('click', toggleMenu);

    NAV_LINKS.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeMenu();
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      var href = anchor.getAttribute('href');
      if (href === '#') return;
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initContactForm() {
    if (!CONTACT_FORM) return;

    CONTACT_FORM.addEventListener('submit', function (e) {
      e.preventDefault();
      var formEl = CONTACT_FORM;
      var btn = formEl.querySelector('button[type="submit"]');
      var wrapper = formEl.closest('.contact__form-wrapper');

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send Message';
        }
        formEl.reset();
        if (FORM_SUCCESS && wrapper) {
          wrapper.classList.add('is-success');
          FORM_SUCCESS.removeAttribute('hidden');
          FORM_SUCCESS.setAttribute('tabindex', '-1');
          FORM_SUCCESS.focus({ preventScroll: true });
        }
        setTimeout(function () {
          if (FORM_SUCCESS) FORM_SUCCESS.setAttribute('hidden', '');
          if (wrapper) wrapper.classList.remove('is-success');
        }, 4000);
      }, 600);
    });
  }

  function initStatsCounter() {
    var items = document.querySelectorAll('.stats__number[data-count]');
    if (!items.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;
          var duration = 1200;
          var start = 0;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easeOut = 1 - Math.pow(1 - progress, 2);
            var current = Math.floor(start + (target - start) * easeOut);
            el.textContent = current;
            if (progress < 1) window.requestAnimationFrame(step);
            else el.textContent = target;
          }
          window.requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function setFooterYear() {
    if (YEAR_SPAN) YEAR_SPAN.textContent = new Date().getFullYear();
  }

  function init() {
    initHeaderScroll();
    initStickyCta();
    initScrollReveal();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initStatsCounter();
    setFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
