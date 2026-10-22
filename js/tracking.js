/* ==========================================================================
   LENS GROUP TRUJILLO — SISTEMA DE SEGUIMIENTO DE PEDIDOS
   ========================================================================== */

const WHATSAPP_STORE_PHONE = '51958169535';
const ADMIN_CREDENTIALS = { username: 'optometrista', password: 'lensgroup2026' };
const ORDERS_STORAGE_KEY = 'lens_group_orders_v1';
const ADMIN_SESSION_KEY = 'lens_group_optometrista_session';
const ORDERS_API_URL = '/api/orders';

const ORDER_STATUS_DEFS = {
  1: {
    key: 'cola',
    statusTitle: 'En Cola de Espera',
    statusBadgeText: 'Cola',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Receta registrada y montura asignada. En espera de laboratorio.',
    showPickupBanner: false
  },
  2: {
    key: 'proceso',
    statusTitle: 'En Proceso de Laboratorio',
    statusBadgeText: 'Proceso',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Tallado digital, biselado y control de calidad en laboratorio.',
    showPickupBanner: false
  },
  3: {
    key: 'listo',
    statusTitle: '¡Listo para Recoger en Tienda!',
    statusBadgeText: 'Listo',
    statusBadgeClass: 'state-badge-ready',
    statusBoxClass: 'status-box-ready',
    statusDesc: 'Tu pedido ya está en tienda listo para ser entregado.',
    showPickupBanner: true
  }
};

function mapStatusToStep(val) {
  if (typeof val === 'number') {
    if (val <= 1) return 1;
    if (val === 2 || val === 3) return 2;
    return 3;
  }
  if (!val) return 1;
  const s = String(val).toLowerCase().trim();
  if (s.includes('cola')) return 1;
  if (s.includes('proceso') || s.includes('taller') || s.includes('calidad') || s.includes('laboratorio')) return 2;
  if (s.includes('listo') || s.includes('recojo') || s.includes('entrega')) return 3;
  return 1;
}

// Mock Database de Órdenes Reales para Lens Group Trujillo (Flujo 3 Pasos)
const ORDERS_DB = {
  'LGT-2025-0342': {
    code: 'LGT-2025-0342',
    customer: 'Carlos Mendoza Quispe',
    receivedDate: '08 de Marzo, 2026',
    estimatedDate: '10 de Marzo, 2026',
    service: 'Montura Ray-Ban Round Metal + Cristales Antirreflejo Blue Protect UV400',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    currentStep: 3,
    statusTitle: '¡Listo para Recoger en Tienda!',
    statusBadgeText: 'Listo',
    statusBadgeClass: 'state-badge-ready',
    statusBoxClass: 'status-box-ready',
    statusDesc: 'Tu pedido ya está en tienda listo para ser entregado.',
    showPickupBanner: true,
    history: [
      { step: 1, name: 'Cola', date: '08 Mar - 10:30 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '08 Mar - 03:15 PM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: '10 Mar - 09:00 AM', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },

  'LGT-2025-0210': {
    code: 'LGT-2025-0210',
    customer: 'Roberto Castillo Díaz',
    receivedDate: '09 de Marzo, 2026',
    estimatedDate: '11 de Marzo, 2026',
    service: 'Cristales Fotocromáticos Transition Gen 8 + Montura Titanio Flexible',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    currentStep: 2,
    statusTitle: 'En Proceso de Laboratorio',
    statusBadgeText: 'Proceso',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Tallado digital, biselado y control de calidad en laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: '09 Mar - 11:00 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '09 Mar - 05:20 PM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Estimado: 11 Mar', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },

  'LGT-2025-0105': {
    code: 'LGT-2025-0105',
    customer: 'Mariana Paredes Silva',
    receivedDate: '09 de Marzo, 2026',
    estimatedDate: '12 de Marzo, 2026',
    service: 'Lunas Progresivas Digitales FreeForm + Montura Vogue Eyewear',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    currentStep: 2,
    statusTitle: 'En Proceso de Laboratorio',
    statusBadgeText: 'Proceso',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Tallado digital, biselado y control de calidad en laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: '09 Mar - 04:00 PM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '10 Mar - 08:30 AM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Estimado: 12 Mar', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },

  'LGT-2025-0450': {
    code: 'LGT-2025-0450',
    customer: 'Andrea Fernández Ruiz',
    receivedDate: '10 de Marzo, 2026',
    estimatedDate: '13 de Marzo, 2026',
    service: 'Gafas de Sol Oakley Polarizadas con Graduación Espejada',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    currentStep: 1,
    statusTitle: 'En Cola de Espera',
    statusBadgeText: 'Cola',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Receta registrada y montura asignada. En espera de laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: '10 Mar - 09:45 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: 'Estimado: 11 Mar', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Estimado: 13 Mar', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },

  'LGT-2025-0500': {
    code: 'LGT-2025-0500',
    customer: 'Jorge Luis Vásquez',
    receivedDate: '04 de Marzo, 2026',
    estimatedDate: '07 de Marzo, 2026',
    service: 'Montura Ultraligera de Titanio + Cristales Monofocales Crizal',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    currentStep: 3,
    statusTitle: '¡Listo para Recoger en Tienda!',
    statusBadgeText: 'Listo',
    statusBadgeClass: 'state-badge-ready',
    statusBoxClass: 'status-box-ready',
    statusDesc: 'Tu pedido ya está en tienda listo para ser entregado.',
    showPickupBanner: true,
    history: [
      { step: 1, name: 'Cola', date: '04 Mar - 11:15 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '05 Mar - 02:30 PM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: '07 Mar - 10:00 AM', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  }
};

function normalizeOrder(order) {
  const safeStep = mapStatusToStep(order.estado || order.currentStep);
  const currentStatus = ORDER_STATUS_DEFS[safeStep];

  // Construir historial limpio de 3 pasos
  const history = [
    {
      step: 1,
      name: 'Cola',
      date: order.history?.[0]?.date || order.receivedDate || 'Registrado',
      desc: 'Receta registrada y montura asignada. En espera de laboratorio.'
    },
    {
      step: 2,
      name: 'Proceso',
      date: order.history?.[1]?.date || (safeStep >= 2 ? 'En taller' : 'Estimado: ' + (order.estimatedDate || 'Pronto')),
      desc: 'Tallado digital, biselado y control de calidad en laboratorio.'
    },
    {
      step: 3,
      name: 'Listo',
      date: order.history?.[2]?.date || (safeStep >= 3 ? 'En tienda' : 'Estimado: ' + (order.estimatedDate || 'Por confirmar')),
      desc: 'Tu pedido ya está en tienda listo para ser entregado.'
    }
  ];

  return {
    ...order,
    estado: currentStatus.key,
    currentStep: safeStep,
    statusTitle: currentStatus.statusTitle,
    statusBadgeText: currentStatus.statusBadgeText,
    statusBadgeClass: currentStatus.statusBadgeClass,
    statusBoxClass: currentStatus.statusBoxClass,
    statusDesc: currentStatus.statusDesc,
    showPickupBanner: currentStatus.showPickupBanner,
    history
  };
}

function getOrdersData() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      return Object.fromEntries(Object.entries(saved).map(([code, order]) => [code, normalizeOrder(order)]));
    }
  } catch (error) {
    console.warn('No se pudo cargar la base de órdenes guardada.', error);
  }

  return Object.fromEntries(Object.entries(ORDERS_DB).map(([code, order]) => [code, normalizeOrder(order)]));
}

function persistOrdersData(ordersObject) {
  if (!ordersObject || typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersObject));
}

async function loadServerOrders() {
  if (typeof window === 'undefined') return;

  // 1. Sincronización directa con Supabase en tiempo real
  if (window.LG?.supabase?.getOrders) {
    try {
      const supaOrders = await window.LG.supabase.getOrders();
      if (supaOrders && Object.keys(supaOrders).length > 0) {
        const merged = { ...getOrdersData(), ...supaOrders };
        persistOrdersData(merged);
        return;
      }
    } catch (err) {
      console.warn('Aviso: no se pudo sincronizar con Supabase:', err);
    }
  }

  // 2. Fallback a endpoint local si existe servidor activo
  if (window.fetch) {
    try {
      const response = await fetch(ORDERS_API_URL, { cache: 'no-store' });
      if (!response.ok) return;
      const serverOrders = await response.json();
      if (!serverOrders || typeof serverOrders !== 'object') return;
      persistOrdersData({ ...getOrdersData(), ...serverOrders });
    } catch (error) {
      // Silencioso: en páginas estáticas usa la base local/supabase
    }
  }
}

async function saveOrderToServer(order) {
  if (!order || typeof window === 'undefined') return false;

  // 1. Guardar o actualizar directamente en Supabase
  if (window.LG?.supabase?.updateOrderStatus) {
    try {
      await window.LG.supabase.updateOrderStatus(order.code, order.estado, order.urgente);
    } catch (err) {
      console.warn('Error guardando orden en Supabase:', err);
    }
  }

  // 2. Intentar endpoint secundario
  if (window.fetch) {
    try {
      await fetch(ORDERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (error) {}
  }

  return true;
}

function ensureOrdersPersisted() {
  const orders = getOrdersData();
  persistOrdersData(orders);
  return orders;
}

// Íconos SVG para cada uno de los 3 pasos (1: Cola, 2: Proceso, 3: Listo)
const STEP_ICONS = {
  1: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  2: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  3: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`
};

const CHECK_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

document.addEventListener('DOMContentLoaded', async () => {
  ensureOrdersPersisted();
  await loadServerOrders();
  initTrackingApp();
  initOptometristaPanel();
});

function normalizeTrackingCode(rawValue) {
  if (!rawValue || typeof rawValue !== 'string') return '';

  const trimmed = rawValue.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    const codeFromUrl = parsed.searchParams.get('codigo') || parsed.searchParams.get('code');
    if (codeFromUrl) return codeFromUrl.trim().toUpperCase();
  } catch (error) {
    // No es una URL completa; seguimos con la lógica de texto plano.
  }

  return trimmed.toUpperCase();
}

function initTrackingApp() {
  const form = document.getElementById('trackingForm');
  const input = document.getElementById('trackingCodeInput');
  const chipButtons = document.querySelectorAll('.tracking-chip-btn');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = normalizeTrackingCode(input.value);
      input.value = code;
      executeSearch(code);
    });

    // Handle chips click
    chipButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleCode = btn.getAttribute('data-code');
        if (sampleCode) {
          const normalizedCode = normalizeTrackingCode(sampleCode);
          input.value = normalizedCode;
          executeSearch(normalizedCode);
        }
      });
    });

    // Los enlaces compartidos consultan el pedido automáticamente.
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('codigo') || urlParams.get('code');
    if (codeParam) {
      const normalizedCode = normalizeTrackingCode(codeParam);
      if (normalizedCode) {
        input.value = normalizedCode;
        window.requestAnimationFrame(() => executeSearch(normalizedCode));
      }
    }
  }
}

function initOptometristaPanel() {
  const loginForm = document.getElementById('optometristaLoginForm');
  const dashboard = document.getElementById('optometristaDashboard');
  const loginModal = document.getElementById('optometristaLoginModal');
  const closeBtn = document.getElementById('optometristaClose');
  const currentPath = window.location.pathname.toLowerCase();
  const isOptometristaPage = currentPath.endsWith('/optometrista.html') || currentPath.endsWith('/optometrista');

  if (!isOptometristaPage) return;

  const session = localStorage.getItem(ADMIN_SESSION_KEY);

  const setPublicTrackingVisibility = (showPublic) => {
    const publicSections = document.querySelectorAll('.tracking-hero, .tracking-search-card, .tracking-faq-section, #trackingResultArea, #trackingErrorArea');
    publicSections.forEach((element) => {
      if (element) {
        element.style.display = showPublic ? '' : 'none';
      }
    });
  };

  const openLoginModal = () => {
    if (!loginModal) return;

    loginModal.classList.remove('hidden');
    loginModal.setAttribute('aria-hidden', 'false');
    loginModal.style.display = 'flex';

    setTimeout(() => {
      const userInput = document.getElementById('optometristaUser');
      if (userInput) userInput.focus();
    }, 120);
  };

  const closeLoginModal = () => {
    if (loginModal) {
      loginModal.classList.add('hidden');
      loginModal.setAttribute('aria-hidden', 'true');
      loginModal.style.display = 'none';
    }
  };

  const shouldOpenOptometristaLogin = () => {
    return false;
  };

  if (isOptometristaPage) {
    const dashboard = document.getElementById('optometristaDashboard');
    const session = localStorage.getItem(ADMIN_SESSION_KEY);

    if (session === 'true') {
      renderOptometristaDashboard();
    } else {
      if (dashboard) dashboard.style.display = 'none';
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLoginModal);
  }

  if (loginModal) {
    loginModal.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        closeLoginModal();
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('optometristaUser')?.value.trim();
      const password = document.getElementById('optometristaPass')?.value.trim();

      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        closeLoginModal();
        setPublicTrackingVisibility(false);
        renderOptometristaDashboard();
        return;
      }

      const existingError = loginForm.querySelector('.optometrista-error');
      if (existingError) existingError.remove();

      const error = document.createElement('p');
      error.className = 'optometrista-error';
      error.textContent = 'Credenciales inválidas.';
      loginForm.appendChild(error);
    });
  }

  if (session === 'true') {
    closeLoginModal();
    renderOptometristaDashboard();
  } else if (dashboard) {
    dashboard.style.display = 'none';
  }
}

function buildTrackingLink(code) {
  const storedPublicOrigin = localStorage.getItem('lens_public_tracking_base_url');
  const currentProtocol = window.location.protocol;
  const siteOrigin = storedPublicOrigin || (
    currentProtocol === 'http:' || currentProtocol === 'https:'
      ? window.location.origin
      : 'http://localhost:8080'
  );
  const trackingUrl = new URL('/seguimiento.html', siteOrigin);
  trackingUrl.hash = '';
  trackingUrl.searchParams.set('codigo', code);
  return trackingUrl.toString();
}

function generateUniqueOrderCode() {
  const orders = getOrdersData();
  const year = new Date().getFullYear();

  let candidate = '';
  let attempts = 0;

  do {
    const randomNumber = 1000 + Math.floor(Math.random() * 9000);
    candidate = `LGT-${year}-${String(randomNumber).padStart(4, '0')}`;
    attempts += 1;
  } while (orders[candidate] && attempts < 50);

  return candidate;
}

function createNewOrderRecord({ customer, service, phone, dni, notes }) {
  const code = generateUniqueOrderCode();
  const now = new Date();
  const receivedDate = now.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  const estimatedDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  const firstStatus = ORDER_STATUS_DEFS[1];

  return {
    code,
    customer,
    phone: phone || '',
    dni: dni || '',
    notes: notes || '',
    receivedDate,
    estimatedDate,
    service,
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'cola',
    currentStep: 1,
    statusTitle: firstStatus.statusTitle,
    statusBadgeText: firstStatus.statusBadgeText,
    statusBadgeClass: firstStatus.statusBadgeClass,
    statusBoxClass: firstStatus.statusBoxClass,
    statusDesc: firstStatus.statusDesc,
    showPickupBanner: firstStatus.showPickupBanner,
    history: [
      { step: 1, name: 'Cola', date: 'Hoy', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: 'Pendiente', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Pendiente', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  };
}

function renderOptometristaDashboard() {
  const dashboard = document.getElementById('optometristaDashboard');
  const loginFormCard = document.querySelector('.optometrista-login-card');

  if (!dashboard) return;

  const orders = Object.values(getOrdersData());
  const adminHeader = `
    <div class="optometrista-dashboard-header">
      <div>
        <div class="optometrista-tag">Optometrista</div>
        <h3>Gestión de pedidos</h3>
      </div>
      <button type="button" class="btn btn-outline optometrista-logout" data-action="logout">Cerrar sesión</button>
    </div>
  `;

  const newOrderForm = `
    <div class="optometrista-new-order">
      <div class="optometrista-dashboard-header optometrista-dashboard-header-compact">
        <div>
          <div class="optometrista-tag">Nuevo paciente</div>
          <h3>Registrar pedido</h3>
        </div>
      </div>
      <form id="optometristaNewOrderForm" class="optometrista-new-order-form">
        <input type="text" name="customer" placeholder="Nombre del paciente" required />
        <input type="text" name="dni" placeholder="DNI" />
        <input type="tel" name="phone" placeholder="Teléfono" />
        <input type="text" name="service" placeholder="Servicio / producto" required />
        <textarea name="notes" rows="2" placeholder="Notas del optometrista"></textarea>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
    </div>
  `;

  const rows = orders.map((order) => {
    const canAdvance = order.currentStep < 5;
    const canGoBack = order.currentStep > 1;
    const trackingLink = buildTrackingLink(order.code);

    return `
      <div class="optometrista-order-card">
        <div class="optometrista-order-top">
          <div>
            <div class="optometrista-order-code">${order.code}</div>
            <div class="optometrista-order-customer">${order.customer}</div>
          </div>
          <span class="tracking-state-badge ${order.statusBadgeClass}">${order.statusBadgeText}</span>
        </div>

        <div class="optometrista-order-meta">
          <span>${order.service}</span>
          <span>Etapa: ${order.currentStep}/5</span>
        </div>

        <div class="optometrista-link-box">
          <span class="optometrista-link-label">Link de seguimiento</span>
          <div class="optometrista-link-row">
            <input type="text" class="optometrista-link-input" value="${trackingLink}" readonly aria-label="Link de seguimiento del pedido ${order.code}" />
            <div class="optometrista-link-actions">
              <button type="button" class="btn btn-outline btn-sm" data-role="order-link" data-action="copy" data-code="${order.code}">Copiar</button>
              <button type="button" class="btn btn-primary btn-sm" data-role="order-link" data-action="open" data-code="${order.code}">Abrir</button>
            </div>
          </div>
        </div>

        <div class="optometrista-order-actions">
          <button type="button" class="btn btn-outline btn-sm optometrista-link-inline" data-role="order-link" data-action="copy" data-code="${order.code}" aria-label="Copiar link de seguimiento de ${order.code}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L12 4"></path><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12 20"></path></svg>
            Link
          </button>
          <button type="button" class="btn btn-outline btn-sm" data-role="order-step" data-action="back" data-code="${order.code}" ${canGoBack ? '' : 'disabled'}>Retroceder</button>
          <button type="button" class="btn btn-primary btn-sm" data-role="order-step" data-action="advance" data-code="${order.code}" ${canAdvance ? '' : 'disabled'}>Avanzar etapa</button>
        </div>
      </div>
    `;
  }).join('');

  dashboard.innerHTML = `${adminHeader}${newOrderForm}<div class="optometrista-order-list">${rows}</div>`;
  dashboard.style.display = 'block';

  const newOrderFormElement = dashboard.querySelector('#optometristaNewOrderForm');
  newOrderFormElement?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(newOrderFormElement);
    const customer = String(formData.get('customer') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const dni = String(formData.get('dni') || '').trim();
    const notes = String(formData.get('notes') || '').trim();

    if (!customer || !service) return;

    const ordersMap = getOrdersData();
    const newOrder = createNewOrderRecord({ customer, service, phone, dni, notes });
    ordersMap[newOrder.code] = newOrder;
    persistOrdersData(ordersMap);
    await saveOrderToServer(newOrder);

    renderOptometristaDashboard();
  });

  if (loginFormCard) {
    loginFormCard.style.display = 'none';
  }

  const loginModal = document.getElementById('optometristaLoginModal');
  if (loginModal) {
    loginModal.classList.add('hidden');
    loginModal.setAttribute('aria-hidden', 'true');
  }

  dashboard.querySelectorAll('[data-role="order-step"]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const code = button.dataset.code;
      updateOrderStep(code, action === 'advance' ? 1 : -1);
    });
  });

  dashboard.querySelectorAll('[data-role="order-link"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.dataset.action;
      const code = button.dataset.code;
      const link = buildTrackingLink(code);

      if (action === 'open') {
        window.location.assign(link);
        return;
      }

      try {
        await navigator.clipboard.writeText(link);
        const originalText = button.textContent;
        button.textContent = 'Copiado';
        setTimeout(() => { button.textContent = originalText; }, 1200);
      } catch (error) {
        const input = dashboard.querySelector(`.optometrista-link-input[value="${link}"]`);
        if (input) {
          input.focus();
          input.select();
          document.execCommand('copy');
        }
      }
    });
  });

  dashboard.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    dashboard.style.display = 'none';

    if (loginFormCard) {
      loginFormCard.style.display = 'block';
      const form = document.getElementById('optometristaLoginForm');
      form.reset();
      const error = form.querySelector('.optometrista-error');
      if (error) error.remove();
    }
  });
}

function updateOrderStep(code, delta) {
  const orders = getOrdersData();
  const order = orders[code];
  if (!order) return;

  const nextStep = Math.min(3, Math.max(1, Number(order.currentStep) + delta));
  const nextStatus = ORDER_STATUS_DEFS[nextStep];

  orders[code] = {
    ...order,
    currentStep: nextStep,
    estado: nextStatus.key,
    ...nextStatus
  };

  persistOrdersData(orders);
  saveOrderToServer(orders[code]);
  renderOptometristaDashboard();
  const result = document.getElementById('trackingResultArea');
  if (result && result.style.display !== 'none') {
    executeSearch(code);
  }
}

async function executeSearch(rawCode) {
  const resultContainer = document.getElementById('trackingResultArea');
  const errorContainer = document.getElementById('trackingErrorArea');
  const input = document.getElementById('trackingCodeInput');

  if (!rawCode) {
    if (input) input.focus();
    return;
  }

  // Normalizar código
  const normalized = normalizeTrackingCode(rawCode);

  // 1. Buscar en la base local primero
  let order = getOrdersData()[normalized];

  // 2. Si no se encuentra, consultar directamente a Supabase en tiempo real
  if (!order && window.LG?.supabase?.getOrderByCode) {
    try {
      const supaOrder = await window.LG.supabase.getOrderByCode(normalized);
      if (supaOrder) {
        order = normalizeOrder(supaOrder);
        const currentOrders = getOrdersData();
        currentOrders[normalized] = order;
        persistOrdersData(currentOrders);
      }
    } catch (err) {
      console.warn('Error consultando Supabase en búsqueda:', err);
    }
  }

  if (order) {
    // Ocultar error
    if (errorContainer) errorContainer.style.display = 'none';

    // Renderizar resultados
    renderOrderResult(order);

    if (resultContainer) {
      resultContainer.style.display = 'block';
      setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  } else {
    // Código no encontrado
    if (resultContainer) resultContainer.style.display = 'none';
    renderNotFound(normalized);

    if (errorContainer) {
      errorContainer.style.display = 'block';
      setTimeout(() => {
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}

function renderOrderResult(order) {
  const resultContainer = document.getElementById('trackingResultArea');
  if (!resultContainer) return;

  // Armar enlace de WhatsApp para consultar sobre esta orden
  const waMsg = `Hola Lens Group Trujillo, tengo una consulta sobre mi pedido *${order.code}* a nombre de *${order.customer}* (${order.service}).`;
  const waUrl = `https://wa.me/${WHATSAPP_STORE_PHONE}?text=${encodeURIComponent(waMsg)}`;

  // Porcentaje para la barra de progreso (1 a 3 pasos -> 0%, 50%, 100%)
  const progressPercent = ((order.currentStep - 1) / 2) * 100;

  // Determinar si en móvil debe ser altura en vez de ancho
  const isMobile = window.innerWidth <= 768;

  // Generar pasos HTML
  const stepsHTML = order.history.map(item => {
    let stepClass = 'timeline-step';
    let nodeIcon = STEP_ICONS[item.step];

    if (item.step < order.currentStep) {
      stepClass += ' is-completed';
      nodeIcon = CHECK_ICON;
    } else if (item.step === order.currentStep) {
      stepClass += ' is-active';
    } else {
      stepClass += ' is-pending';
    }

    return `
      <li class="${stepClass}">
        <div class="timeline-node">
          ${nodeIcon}
        </div>
        <div class="timeline-step-info">
          <div class="timeline-step-label">${item.name}</div>
          <div class="timeline-step-desc">${item.desc}</div>
          <div style="font-size: 0.725rem; font-weight: 700; color: var(--color-teal-700); margin-top: 0.2rem;">${item.date}</div>
        </div>
      </li>
    `;
  }).join('');

  // Generar HTML completo de la tarjeta
  resultContainer.innerHTML = `
    <div class="tracking-result-card">
      <!-- Encabezado del Pedido -->
      <div class="tracking-result-header">
        <div>
          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-teal-300); margin-bottom: 0.35rem; font-weight: 700;">
            Código de Orden Oficial
          </div>
          <div class="tracking-code-pill">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>
            ${order.code}
          </div>
        </div>

        <div>
          <span class="tracking-state-badge ${order.statusBadgeClass}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${order.statusBadgeText}
          </span>
        </div>
      </div>

      <!-- Datos Principales de la Orden -->
      <div class="tracking-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Cliente Titular</span>
          <span class="meta-value">${order.customer}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Fecha de Recepción</span>
          <span class="meta-value">${order.receivedDate}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Entrega Estimada</span>
          <span class="meta-value meta-value-highlight">${order.estimatedDate}</span>
        </div>
        <div class="meta-item" style="grid-column: 1 / -1;">
          <span class="meta-label">Tipo de Servicio / Producto</span>
          <span class="meta-value" style="font-size: 1rem; color: var(--color-dark-800);">${order.service}</span>
        </div>
        <div class="meta-item" style="grid-column: 1 / -1;">
          <span class="meta-label">Sede de Entrega en Trujillo</span>
          <span class="meta-value" style="font-size: 0.95rem; font-weight: 600; color: var(--color-dark-700);">
            ${order.branch} (Horario: Lun-Sáb 9am–9pm / Dom 9:30am–2pm)
          </span>
        </div>
      </div>

      <!-- Línea de Tiempo de 3 Estados (Cola -> Proceso -> Listo) -->
      <div class="tracking-timeline-section">
        <div class="timeline-header-row">
          <div>
            <h3 class="timeline-title">Progreso del Pedido</h3>
            <p style="font-size: 0.9rem; color: var(--color-dark-500); margin-top: 0.2rem;">Línea de tiempo auditada en laboratorio</p>
          </div>
          <div class="timeline-estimated-pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Fecha Estimada: <strong>${order.estimatedDate}</strong>
          </div>
        </div>

        <div class="timeline-track-wrap">
          <div class="timeline-track-bar">
            <div class="timeline-progress-bar" id="timelineProgressBar" style="${isMobile ? `height: ${progressPercent}%; width: 5px;` : `width: ${progressPercent}%;`}"></div>
          </div>
          <ul class="timeline-steps">
            ${stepsHTML}
          </ul>
        </div>

        <!-- Mensaje de Estado Actual Destacado -->
        <div class="tracking-status-box ${order.statusBoxClass}">
          <div class="status-box-icon">
            ${STEP_ICONS[order.currentStep]}
          </div>
          <div style="flex: 1;">
            <div class="status-box-title">${order.statusTitle}</div>
            <div class="status-box-desc">${order.statusDesc}</div>

            ${order.showPickupBanner ? `
              <div class="status-box-pickup-info">
                <span class="status-box-pickup-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Galería San Antonio, Jr. Gamarra N° 778
                </span>
                <span class="status-box-pickup-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Lunes a Sábado: 9:00 AM – 9:00 PM
                </span>
                <span class="status-box-pickup-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line></svg>
                  Presentar DNI o comprobante de compra
                </span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Acciones Inferiores -->
      <div class="tracking-result-actions">
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="flex: 1; max-width: 460px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z"/></svg>
          Consultar por WhatsApp sobre este pedido
        </a>

        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn btn-outline" onclick="resetTrackingSearch()">
            Nueva Consulta
          </button>
        </div>
      </div>
    </div>
  `;

  // Animate progress bar
  setTimeout(() => {
    const bar = document.getElementById('timelineProgressBar');
    if (bar) {
      if (window.innerWidth <= 768) {
        bar.style.height = `${progressPercent}%`;
        bar.style.width = '5px';
      } else {
        bar.style.width = `${progressPercent}%`;
      }
    }
  }, 150);
}

function renderNotFound(searchedCode) {
  const errorContainer = document.getElementById('trackingErrorArea');
  if (!errorContainer) return;

  const waNotFoundMsg = `Hola Lens Group Trujillo, no encuentro el código de mi orden *${searchedCode}* en el sistema de seguimiento y quisiera consultar el estado de mis lentes.`;
  const waNotFoundUrl = `https://wa.me/${WHATSAPP_STORE_PHONE}?text=${encodeURIComponent(waNotFoundMsg)}`;

  errorContainer.innerHTML = `
    <div class="tracking-error-card">
      <div class="tracking-error-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <h3 class="tracking-error-title">No encontramos ese código (${searchedCode})</h3>
      <p class="tracking-error-text">
        No encontramos ese código, verifica o contáctanos por WhatsApp. Si acabas de realizar tu pedido en tienda hoy, recuerda que el registro en laboratorio puede tomar unos minutos en reflejarse.
      </p>

      <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <a href="${waNotFoundUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z"/></svg>
          Consultar por WhatsApp
        </a>
        <button type="button" class="btn btn-outline" onclick="resetTrackingSearch()">
          Intentar con otro código
        </button>
      </div>
    </div>
  `;
}

function resetTrackingSearch() {
  const resultContainer = document.getElementById('trackingResultArea');
  const errorContainer = document.getElementById('trackingErrorArea');
  const input = document.getElementById('trackingCodeInput');

  if (resultContainer) resultContainer.style.display = 'none';
  if (errorContainer) errorContainer.style.display = 'none';
  if (input) {
    input.value = '';
    input.focus();
  }

  // Scroll back to the tracking section
  const section = document.getElementById('seguimiento');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Window resize listener to recalculate progress bar orientation
window.addEventListener('resize', () => {
  const bar = document.getElementById('timelineProgressBar');
  if (!bar) return;

  const activeStepEl = document.querySelector('.timeline-step.is-active');
  if (!activeStepEl) return;

  // Re-read active step
  const steps = Array.from(document.querySelectorAll('.timeline-step'));
  const activeIndex = steps.indexOf(activeStepEl);
  if (activeIndex >= 0) {
    const progressPercent = (activeIndex / 4) * 100;
    if (window.innerWidth <= 768) {
      bar.style.height = `${progressPercent}%`;
      bar.style.width = '5px';
    } else {
      bar.style.width = `${progressPercent}%`;
      bar.style.height = '100%';
    }
  }
});
