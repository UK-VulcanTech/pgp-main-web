/* Peak Global Partners — site behavior */

(function () {
  // Mark JS-enabled so .reveal hides only when JS will reveal it
  document.documentElement.classList.add('js');
  // ---------- Theme toggle ----------
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  let mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', mode);
  if (toggle) {
    toggle.innerHTML = mode === 'dark' ? sunSvg : moonSvg;
    toggle.setAttribute('aria-label', 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.addEventListener('click', () => {
      mode = mode === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', mode);
      toggle.innerHTML = mode === 'dark' ? sunSvg : moonSvg;
      toggle.setAttribute('aria-label', 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  // ---------- Sticky header shadow on scroll ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile menu ----------
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
    });
    // close menu when a leaf link is clicked
    nav.querySelectorAll('a').forEach(a => {
      const isInDropdownPanel = !!a.closest('.mega-menu');
      const isDropdownTrigger = a.classList.contains('nav-dropdown__trigger');
      if (!isDropdownTrigger || isInDropdownPanel) {
        a.addEventListener('click', () => nav.classList.remove('open'));
      }
    });
  }

  // ---------- Dropdown toggle (caret-button click) ----------
  const dropdowns = document.querySelectorAll('[data-nav-dropdown]');
  const closeAllDropdowns = (except) => {
    dropdowns.forEach(d => {
      if (d !== except && d.classList.contains('open')) {
        d.classList.remove('open');
        const c = d.querySelector('.nav-dropdown__caret');
        if (c) c.setAttribute('aria-expanded', 'false');
      }
    });
  };
  dropdowns.forEach(dropdown => {
    const caret = dropdown.querySelector('.nav-dropdown__caret');
    if (!caret) return;
    caret.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !dropdown.classList.contains('open');
      closeAllDropdowns(dropdown);
      dropdown.classList.toggle('open', willOpen);
      caret.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-nav-dropdown]')) closeAllDropdowns(null);
  });
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns(null);
  });

  // ---------- Reveal on scroll ----------
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && els.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in'));
  }

  // ---------- Resources filtering ----------
  const resourceGrid = document.querySelector('[data-resource-grid]');
  if (resourceGrid) {
    const items = Array.from(resourceGrid.querySelectorAll('.resource'));
    const empty = document.querySelector('[data-empty-state]');
    const state = { topic: 'all', audience: 'all' };

    const apply = () => {
      let visible = 0;
      items.forEach(it => {
        const topics = (it.dataset.topics || '').split(' ');
        const audiences = (it.dataset.audiences || '').split(' ');
        const match = (state.topic === 'all' || topics.includes(state.topic))
                   && (state.audience === 'all' || audiences.includes(state.audience));
        it.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
      // No initial state needed — CSS hides it; JS only shows when zero matches.
    };

    document.querySelectorAll('[data-filter-topic]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-topic]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.topic = btn.dataset.filterTopic;
        apply();
      });
    });
    document.querySelectorAll('[data-filter-audience]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-audience]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.audience = btn.dataset.filterAudience;
        apply();
      });
    });
  }

  // ---------- Careers filtering ----------
  const roleList = document.querySelector('[data-role-list]');
  if (roleList) {
    const roles = Array.from(roleList.querySelectorAll('.role'));
    document.querySelectorAll('[data-filter-team]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-team]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const team = btn.dataset.filterTeam;
        roles.forEach(r => {
          r.style.display = (team === 'all' || r.dataset.team === team) ? '' : 'none';
        });
      });
    });
  }

  // ---------- Contact form (Formspree wired) ----------
  const form = document.querySelector('.contact-form');
  if (form) {
    const statusEl = form.querySelector('[data-form-status]');
    const setStatus = (kind, msg) => {
      if (!statusEl) return;
      statusEl.classList.remove('success', 'error');
      statusEl.textContent = '';
      if (kind) {
        statusEl.classList.add(kind);
        statusEl.textContent = msg;
      }
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('', '');
      const submit = form.querySelector('button[type="submit"]');
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'Sending\u2026';
      try {
        const data = new FormData(form);
        const action = form.getAttribute('action');
        if (action && action.indexOf('formspree.io') > -1) {
          const res = await fetch(action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error('Network');
        } else {
          await new Promise(r => setTimeout(r, 600));
          console.log('Contact form submission:', Object.fromEntries(data.entries()));
        }
        form.reset();
        setStatus('success', 'Thanks \u2014 your inquiry was received. A member of the PGP team will be in touch within two business days.');
        statusEl && statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        setStatus('error', 'Something went wrong sending your message. Please try again or email info@peakglobalpartners.com directly.');
      } finally {
        submit.disabled = false;
        submit.innerHTML = original;
      }
    });
  }

  // ---------- Insights chip filtering (visual only — no items yet) ----------
  document.querySelectorAll('.category-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ---------- Year stamp ----------
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
