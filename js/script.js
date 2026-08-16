/* ═══════════════════════════════════════════════════════════
   SHARED SCRIPT — HAMBURGER · REVEAL · FORM
   ═══════════════════════════════════════════════════════════ */

(function () {
  /* ── Nav scroll (hero pages only) ─────────────────────── */
  const nav = document.getElementById('nav');
  if (nav && nav.classList.contains('nav--hero')) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Hamburger menu ────────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const menuOverlay  = document.getElementById('menu-overlay');
  const menuBackdrop = document.getElementById('menu-backdrop');

  function openMenu() {
    hamburger.classList.add('open');
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Highlight active page in menu */
  const menuLinks = document.querySelectorAll('.menu-nav a');
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && window.location.pathname.endsWith(href)) {
      link.classList.add('active');
    }
  });

  /* ── Intersection Observer (reveal) ────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Form submission ────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      /* honeypot check */
      const botcheck = form.querySelector('[name="botcheck"]');
      if (botcheck && botcheck.checked) return;

      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Отправляем...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
          successMsg.style.display = 'block';
          form.reset();
          btn.textContent = 'Отправлено ✓';
        } else {
          btn.textContent = 'Ошибка. Попробуйте снова';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Ошибка. Попробуйте снова';
        btn.disabled = false;
      }
    });
  }
})();
