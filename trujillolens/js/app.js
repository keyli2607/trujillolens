document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initMobileActionBar();
  updateStoreStatus();
  initCatalogoNinos();
});

// 1. Sticky Header Effect
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Menu Drawer — con overlay y botón cerrar
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu   = document.getElementById('navMenu');
  const overlay   = document.getElementById('navMenuOverlay');
  const closeBtn  = document.getElementById('mobileCloseBtn');
  if (!toggleBtn || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  navMenu.querySelectorAll('.nav-link, .drawer-contact-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// 3. Smooth Scroll and Active Navigation State
function initSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop    = current.offsetTop - 120;
      const sectionId     = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// 4. Mobile Action Bar — resaltado de sección activa
function initMobileActionBar() {
  const sections   = document.querySelectorAll('section[id]');
  const mabButtons = document.querySelectorAll('.mobile-action-btn[href^="#"]');
  if (!mabButtons.length) return;

  function updateActiveTab() {
    const scrollY = window.pageYOffset + window.innerHeight * 0.4;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        mabButtons.forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('href') === `#${id}`) {
            btn.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab();
}

// 5. Live Store Status (Trujillo Timezone UTC-5)
function updateStoreStatus() {
  const badge = document.getElementById('storeStatusBadge');
  if (!badge) return;

  const now      = new Date();
  const peruTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
  const day      = peruTime.getDay();
  const hour     = peruTime.getHours();
  const minutes  = peruTime.getMinutes();
  const currentTime = hour + minutes / 60;

  let isOpen = false;
  let closingInfo = '';

  if (day >= 1 && day <= 6) {
    if (currentTime >= 9 && currentTime < 21) {
      isOpen = true;
      closingInfo = 'Abierto hoy hasta las 9:00 PM';
    } else if (currentTime < 9) {
      closingInfo = 'Cerrado ahora • Abre hoy a las 9:00 AM';
    } else {
      closingInfo = day === 6
        ? 'Cerrado ahora • Abre domingo 9:30 AM'
        : 'Cerrado ahora • Abre mañana 9:00 AM';
    }
  } else {
    if (currentTime >= 9.5 && currentTime < 14) {
      isOpen = true;
      closingInfo = 'Abierto hoy hasta las 2:00 PM';
    } else if (currentTime < 9.5) {
      closingInfo = 'Cerrado ahora • Abre hoy a las 9:30 AM';
    } else {
      closingInfo = 'Cerrado ahora • Abre lunes 9:00 AM';
    }
  }

  if (isOpen) {
    badge.innerHTML = `<span class="dot"></span> ${closingInfo}`;
    badge.className = 'hours-status-badge';
    badge.style.background  = '';
    badge.style.color       = '';
    badge.style.borderColor = '';
  } else {
    badge.innerHTML = `<span class="dot" style="background:#ef4444;box-shadow:0 0 0 2px rgba(239,68,68,0.3)"></span> ${closingInfo}`;
    badge.className = 'hours-status-badge';
    badge.style.background  = '#fef2f2';
    badge.style.color       = '#b91c1c';
    badge.style.borderColor = '#fecaca';
  }
}

// 6. Catálogo de Niños — Filtros por categoría y búsqueda aislada
function initCatalogoNinos() {
  const sectionNinos = document.getElementById('catalogo-ninos');
  const searchInput = document.getElementById('search-ninos');
  const filtrosContainer = document.getElementById('filtros-ninos');
  const gridContainer = document.getElementById('grid-ninos');
  const emptyState = document.getElementById('empty-state-ninos');

  if (!sectionNinos || !filtrosContainer || !gridContainer) return;

  const filterBtns = filtrosContainer.querySelectorAll('button');
  const productCards = gridContainer.querySelectorAll('.product-card-ninos');

  let currentCategory = 'todos';
  let searchQuery = '';

  function applyKidsFilters() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase().trim();
      const cardTitle = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const cardSpecs = Array.from(card.querySelectorAll('.spec-chip'))
        .map(chip => chip.textContent.toLowerCase())
        .join(' ');
      const cardNameAttr = (card.getAttribute('data-name') || '').toLowerCase();

      const fullText = `${cardTitle} ${cardSpecs} ${cardNameAttr} ${cardCategory}`;

      const matchesCategory = (currentCategory === 'todos') || (cardCategory === currentCategory);
      const matchesSearch = !searchQuery || fullText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  // Event listeners para botones de categorías infantiles
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = (btn.getAttribute('data-category') || 'todos').toLowerCase().trim();
      applyKidsFilters();
    });
  });

  // Event listener para búsqueda en tiempo real de productos infantiles
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyKidsFilters();
    });
  }
}