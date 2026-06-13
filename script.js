document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileItems = document.querySelectorAll('.mobile-nav-item');

  function setMenu(open) {
    if (!hamburgerBtn || !mobileNav || !drawerOverlay) return;
    hamburgerBtn.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    mobileNav.classList.toggle('active', open);
    drawerOverlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

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
