/*!
 * Checkbox.ai landing page — repetitive requests campaign
 * Namespace: .cbx-r (Webflow embed safe)
 *
 * Handles:
 *   - Smooth scroll for in-page anchor links
 *   - Single-open behavior on the "What 'repetitive' actually means" accordion
 *   - Book a demo modal: open / close / Escape / outside-click
 *
 * Does NOT include the HubSpot form embed or ChiliPiper router —
 * those load directly in the Webflow embed alongside this file.
 *
 * Pair with checkbox-landing.css
 * Used by: /checkbox-repetitive-requests embed
 */

(function() {
  var anchors = document.querySelectorAll('.cbx-r a[href^="#"]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  anchors.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // Problem section: enforce only one open at a time
  var problemItems = document.querySelectorAll('.cbx-r__problem-item');
  problemItems.forEach(function(item) {
    item.addEventListener('toggle', function() {
      if (item.open) {
        problemItems.forEach(function(other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  // Book a demo modal: open / close / Escape / outside-click
  var modal = document.querySelector('[data-cbx-r-modal]');
  var openTriggers = document.querySelectorAll('[data-cbx-r-open-modal]');
  var closeTrigger = modal ? modal.querySelector('[data-cbx-r-close-modal]') : null;
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.dataset.open = 'true';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cbx-r-modal-open');
    if (closeTrigger) closeTrigger.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!modal) return;
    modal.dataset.open = 'false';
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cbx-r-modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  }

  openTriggers.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });
  if (closeTrigger) closeTrigger.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.dataset.open === 'true') closeModal();
  });
})();
