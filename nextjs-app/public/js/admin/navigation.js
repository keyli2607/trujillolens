/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: NAVIGATION & UI ROUTING
   File: js/admin/navigation.js
   Description: Sidebar category switching, responsive drawer, notifications,
                and active section routing.
   ========================================================================== */

(function () {
  'use strict';

  function closeMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }

  function setupSidebarNavigation() {
    const navBtns = document.querySelectorAll('.sidebar-nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.view;
        if (category) {
          switchCategory(category);
          closeMobileSidebar();
        }
      });
    });

    // Toggle móvil del sidebar
    const btnToggle = document.getElementById('btnSidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (btnToggle && sidebar && overlay) {
      btnToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', closeMobileSidebar);
    }
  }

  function switchCategory(categoryId) {
    const isSeller = typeof window.isUserSeller === 'function' && window.isUserSeller();
    const isClinical = typeof window.isUserClinical === 'function' && window.isUserClinical();
    const SELLER_ALLOWED = ['sales', 'catalog', 'catalog-adult', 'inventory', 'cardex'];
    const CLINICAL_ALLOWED = ['orders', 'postventa'];

    // Vendedor limitado a ventas, catálogos e inventario
    if (isSeller && !SELLER_ALLOWED.includes(categoryId)) {
      if (typeof window.showToast === 'function') {
        window.showToast('Vista restringida: Tu perfil solo tiene acceso a Ventas, Catálogos e Inventario.');
      }
      categoryId = 'sales';
    }

    // Laboratorio y clínica limitado a órdenes y postventa
    if (isClinical && !CLINICAL_ALLOWED.includes(categoryId)) {
      if (typeof window.showToast === 'function') {
        window.showToast('Vista restringida: Tu perfil solo tiene acceso a Atención & Pacientes (Órdenes y Postventa).');
      }
      categoryId = 'orders';
    }

    state.currentCategory = categoryId;

    // Actualizar botones del sidebar
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      if (btn.dataset.view === categoryId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Actualizar vistas principales
    document.querySelectorAll('.dash-view').forEach(view => {
      if (view.id === `view-${categoryId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Llamadas de renderizado según categoría
    if (categoryId === 'catalog' && typeof window.renderCatalog === 'function') {
      window.renderCatalog();
    } else if (categoryId === 'catalog-adult' && typeof window.renderAdultCatalog === 'function') {
      window.renderAdultCatalog();
    } else if (categoryId === 'users' && typeof window.renderUsers === 'function') {
      window.renderUsers();
    } else if (categoryId === 'sales' && typeof window.renderSales === 'function') {
      window.renderSales();
    } else if (categoryId === 'inventory' && typeof window.renderInventory === 'function') {
      window.renderInventory();
    } else if (categoryId === 'cardex' && typeof window.renderCardex === 'function') {
      window.renderCardex();
    } else if (categoryId === 'postventa' && typeof window.renderCRM === 'function') {
      window.renderCRM();
    } else if (categoryId === 'orders' && typeof window.renderOrdersTable === 'function') {
      window.renderOrdersTable();
    }

    // Actualizar Breadcrumb
    const breadcrumb = document.getElementById('activeCategoryBreadcrumb');
    if (breadcrumb) {
      breadcrumb.textContent = (window.CATEGORY_NAMES && window.CATEGORY_NAMES[categoryId]) || 'Historial de Ventas';
    }

    // Si entra a la vista de analítica, visión general, o ventas, forzar re-renderizado / resize de Chart.js
    if (categoryId === 'analytics' || categoryId === 'overview' || categoryId === 'sales') {
      setTimeout(() => {
        if (typeof window.renderCharts === 'function') window.renderCharts();
      }, 50);
    }

    // Scroll suave al tope del área de contenido
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showToast(msg) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToast';
      toast.className = 'admin-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eead4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${msg}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  window.closeMobileSidebar = closeMobileSidebar;
  window.setupSidebarNavigation = setupSidebarNavigation;
  window.switchCategory = switchCategory;
  window.showToast = showToast;
})();
