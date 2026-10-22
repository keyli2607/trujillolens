/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: APPLICATION BOOTSTRAPPER
   File: js/admin/app.js
   Description: Main entry point orchestrating all dashboard modules,
                attaching global event listeners, and bootstrapping views.
   ========================================================================== */

(function () {
  'use strict';

  function setupEventListeners() {
    // 1. Formulario login
    const loginForm = document.getElementById('loginForm');
    if (loginForm && window.handleLogin) {
      loginForm.addEventListener('submit', window.handleLogin);
    }

    // 2. Logout en barra lateral
    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn && window.handleLogout) {
      logoutBtn.addEventListener('click', window.handleLogout);
    }

    // 3. Búsqueda de órdenes
    const searchInput = document.getElementById('orderSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        if (typeof window.renderOrdersTable === 'function') window.renderOrdersTable();
      });
    }

    // 4. Pestañas de estado en tabla de órdenes
    const ordersTabs = document.querySelector('#view-orders .table-status-tabs');
    if (ordersTabs) {
      ordersTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          ordersTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.currentFilter = btn.dataset.filter || 'all';
          if (typeof window.renderOrdersTable === 'function') window.renderOrdersTable();
        });
      });
    }

    // 5. Pestañas de estado en tabla CRM
    const crmTabs = document.getElementById('crmStatusTabs');
    if (crmTabs) {
      crmTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          crmTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.crmFilter = btn.dataset.filter || 'all';
          if (typeof window.renderCRM === 'function') window.renderCRM();
        });
      });
    }

    // 6. Búsqueda en CRM
    const crmSearchInput = document.getElementById('crmSearchInput');
    if (crmSearchInput) {
      crmSearchInput.addEventListener('input', (e) => {
        state.crmSearchQuery = e.target.value.toLowerCase().trim();
        if (typeof window.renderCRM === 'function') window.renderCRM();
      });
    }

    // 7. Modal nueva orden
    const btnNewOrder = document.getElementById('btnNewOrder');
    const modalNewOrder = document.getElementById('modalNewOrder');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const formNewOrder = document.getElementById('formNewOrder');

    if (btnNewOrder && modalNewOrder) {
      btnNewOrder.addEventListener('click', () => {
        modalNewOrder.classList.add('active');
        const nextNum = Math.floor(1000 + Math.random() * 9000);
        const codeInput = document.getElementById('newOrderCode');
        if (codeInput) codeInput.value = `LGT-2026-${nextNum}`;
      });
    }

    if (btnCloseModal && modalNewOrder) {
      btnCloseModal.addEventListener('click', () => modalNewOrder.classList.remove('active'));
    }

    if (formNewOrder && window.handleCreateOrder) {
      formNewOrder.addEventListener('submit', window.handleCreateOrder);
    }

    // 8. Sliders de simulador de rentabilidad
    ['simDiscount', 'simPatients', 'simPremium'].forEach(id => {
      const el = document.getElementById(id);
      if (el && window.updateSimulator) el.addEventListener('input', window.updateSimulator);
    });

    // 9. Exportar órdenes a CSV
    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv && window.exportOrdersToCsv) {
      btnExportCsv.addEventListener('click', window.exportOrdersToCsv);
    }

    // 10. Recuperar Contraseña & CAPTCHA
    const btnForgotPassword = document.getElementById('btnForgotPassword');
    const modalRecovery = document.getElementById('modalRecovery');
    const btnCloseRecoveryModal = document.getElementById('btnCloseRecoveryModal');
    const formRecovery = document.getElementById('formRecovery');
    const btnRefreshCaptcha = document.getElementById('btnRefreshCaptcha');

    if (btnForgotPassword && modalRecovery) {
      btnForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        modalRecovery.classList.add('active');
        if (window.refreshCaptcha) window.refreshCaptcha();
      });
    }

    if (btnCloseRecoveryModal && modalRecovery) {
      btnCloseRecoveryModal.addEventListener('click', () => {
        modalRecovery.classList.remove('active');
      });
    }

    if (btnRefreshCaptcha && window.refreshCaptcha) {
      btnRefreshCaptcha.addEventListener('click', window.refreshCaptcha);
    }

    if (formRecovery && window.handleRecoverySubmit) {
      formRecovery.addEventListener('submit', window.handleRecoverySubmit);
    }

    // 11. Filtros de Catálogos (Niños y Adultos)
    ['filterCatalogCategory', 'filterCatalogMaterial', 'filterCatalogAge'].forEach(id => {
      const el = document.getElementById(id);
      if (el && window.renderCatalog) el.addEventListener('change', window.renderCatalog);
    });

    ['filterCatalogAdultCategory', 'filterCatalogAdultMaterial'].forEach(id => {
      const el = document.getElementById(id);
      if (el && window.renderAdultCatalog) el.addEventListener('change', window.renderAdultCatalog);
    });

    // 12. Modal de Inventario
    const formInventory = document.getElementById('formInventory');
    if (formInventory && window.handleSaveInventory) {
      formInventory.addEventListener('submit', window.handleSaveInventory);
    }

    // 13. Chatbot Asistente
    const chatbotForm = document.getElementById('chatbotForm');
    if (chatbotForm && window.handleChatbotSubmit) {
      chatbotForm.addEventListener('submit', window.handleChatbotSubmit);
    }

    // 14. Nueva Venta & Facturación
    const formNewSale = document.getElementById('formNewSale');
    if (formNewSale && window.handleNewSaleSubmit) {
      formNewSale.addEventListener('submit', window.handleNewSaleSubmit);
    }

    // 15. Búsqueda en historial de ventas
    const salesSearchInput = document.getElementById('salesSearchInput');
    if (salesSearchInput) {
      salesSearchInput.addEventListener('input', (e) => {
        state.salesSearchQuery = e.target.value.toLowerCase().trim();
        if (typeof window.renderSales === 'function') window.renderSales();
      });
    }

    // 16. Enter en número de documento para consultar RENIEC / SUNAT
    const saleCustomerDocNumber = document.getElementById('saleCustomerDocNumber');
    if (saleCustomerDocNumber) {
      saleCustomerDocNumber.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (typeof window.handleConsultarFiscal === 'function') window.handleConsultarFiscal();
        }
      });
    }
  }

  function initApp() {
    if (typeof window.initAuth === 'function') {
      window.initAuth();
    }
    setupEventListeners();
    if (typeof window.setupSidebarNavigation === 'function') {
      window.setupSidebarNavigation();
    }
  }

  // Auto-inicialización según el estado del DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Window Exports
  window.setupEventListeners = setupEventListeners;
  window.initApp = initApp;

})();
