/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD V3 (MODULAR LOADER)
   File: js/admin-dashboard-v3.js
   Description: Modular entry point. The monolith was separated into 11
                clean English modules under 'js/admin/' for maintainability:
                1. state.js       - Core state, database models, and constants
                2. auth.js        - User authentication, roles, and session
                3. navigation.js  - Sidebar routing, view switcher, and toasts
                4. orders.js      - Laboratory orders, status, and CSV export
                5. sales.js       - Point of sale, SUNAT/RENIEC, tickets, and billing
                6. inventory.js   - Inventory CRUD, catalogs, and cardex ledger
                7. crm.js         - Patient clinical records and WhatsApp post-sale
                8. analytics.js   - Executive KPIs, Chart.js, and what-if simulator
                9. users.js       - Staff user management and Supabase sync
                10. chatbot.js    - LensBot NLP assistant
                11. app.js        - Main bootstrapper and event listeners
   ========================================================================== */

(function () {
  'use strict';

  // If already loaded via individual script tags, do not re-execute
  if (window.__ADMIN_DASHBOARD_LOADED__) return;
  window.__ADMIN_DASHBOARD_LOADED__ = true;

  // If state is already defined, modules were loaded directly by HTML
  if (typeof window.state !== 'undefined') return;

  const MODULES = [
    'js/admin/state.js',
    'js/admin/auth.js',
    'js/admin/navigation.js',
    'js/admin/orders.js',
    'js/admin/sales.js',
    'js/admin/inventory.js',
    'js/admin/crm.js',
    'js/admin/analytics.js',
    'js/admin/users.js',
    'js/admin/chatbot.js',
    'js/admin/app.js'
  ];

  function loadScriptSequence(index) {
    if (index >= MODULES.length) return;
    const s = document.createElement('script');
    s.src = MODULES[index];
    s.onload = () => loadScriptSequence(index + 1);
    s.onerror = (e) => console.error(`[Admin Loader] Failed to load ${MODULES[index]}`, e);
    document.head.appendChild(s);
  }

  loadScriptSequence(0);
})();
