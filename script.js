document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileItems = document.querySelectorAll('.mobile-nav-item');
  const sectionOrder = ['hero', 'about', 'showcase', 'timeline', 'team', 'sponsorship', 'socials', 'contact'];

  function setMenu(open) {
    if (!hamburgerBtn || !mobileNav || !drawerOverlay) return;
    hamburgerBtn.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    mobileNav.classList.toggle('active', open);
    drawerOverlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function isTypingTarget(target) {
    return Boolean(target && target.closest('input, textarea, select, button, [contenteditable="true"]'));
  }

  function goToSection(direction) {
    const sections = sectionOrder
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const midpoint = window.scrollY + window.innerHeight * 0.4;
    let currentIndex = sections.findIndex(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      return midpoint >= top && midpoint < bottom;
    });

    if (currentIndex === -1) {
      currentIndex = sections.findIndex(section => section.getBoundingClientRect().top > 0);
      if (currentIndex === -1) currentIndex = sections.length - 1;
    }

    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
    const targetSection = sections[nextIndex];

    if (targetSection) {
      setMenu(false);
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${targetSection.id}`);
    }
  }

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (isTypingTarget(event.target)) return;

    const key = event.key.toLowerCase();
    const direction = key === 'arrowdown' || key === 's' || key === 'arrowright' || key === 'd'
      ? 1
      : key === 'arrowup' || key === 'w' || key === 'arrowleft' || key === 'a'
        ? -1
        : 0;

    if (!direction) return;

    event.preventDefault();
    goToSection(direction);
  });

  hamburgerBtn?.addEventListener('click', () => {
    setMenu(hamburgerBtn.getAttribute('aria-expanded') !== 'true');
  });
  drawerOverlay?.addEventListener('click', () => setMenu(false));
  mobileItems.forEach(item => item.addEventListener('click', () => setMenu(false)));

  const specTabs = document.querySelectorAll('.spec-tab-btn');
  const specPanels = document.querySelectorAll('.spec-panel');
  specTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('aria-controls');
      specTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      specPanels.forEach(panel => {
        const active = panel.id === target;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    });
  });

  document.querySelectorAll('.stat-number').forEach(stat => {
    const raw = stat.getAttribute('data-target') || '0';
    stat.textContent = raw === '014' ? '0.14' : raw;
  });

  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (formFeedback) {
      formFeedback.textContent = 'Thanks. Your enquiry is ready to send to milanoracing10@gmail.com';
    }
  });
});
