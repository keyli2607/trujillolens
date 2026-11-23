/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: AUTHENTICATION & ACCESS CONTROL
   File: js/admin/auth.js
   Description: Login, logout, session persistence, role-based view visibility,
                and password recovery mechanisms.
   ========================================================================== */

(function () {
  'use strict';

  let currentCaptcha = '';

  function isUserClinical() {
    if (!state.session) return false;
    const role = String(state.session.role || '').toLowerCase().trim();
    return role.includes('laborat') || role.includes('clinic') || role.includes('clínic') || 
           role.includes('optom') || role.includes('taller');
  }

  function isUserSeller() {
    if (!state.session) return false;
    if (state.session.isSuperAdmin === true) return false;
    if (isUserClinical()) return false;
    const role = String(state.session.role || '').toLowerCase().trim();
    if (role.includes('vent') || role.includes('vendedor') || role.includes('seller') || role.includes('comercial')) {
      return true;
    }
    const isManagementOrClinical = role.includes('admin') || role.includes('geren') || role.includes('direc') || 
                                   role.includes('optom') || role.includes('laborat') || role.includes('jefe');
    if (!isManagementOrClinical) {
      return true;
    }
    return false;
  }

  function showLoginView() {
    const login = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboardScreen');
    if (login) login.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }

  function showDashboardView() {
    const login = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboardScreen');
    if (login) login.style.display = 'none';
    if (dashboard) dashboard.style.display = 'flex';
    
    if (state.session) {
      // Laboratorio y Clínica nunca es super admin
      if (isUserClinical()) {
        state.session.isSuperAdmin = false;
      }

      const displayName = state.session.name || 'Gerente General';
      const displayRole = state.session.role || 'Director Ejecutivo';
      const isSuperAdmin = state.session.isSuperAdmin === true;
      const isSeller = isUserSeller();
      const isClinical = isUserClinical();
      
      const elName = document.getElementById('sidebarUserName');
      const elRole = document.getElementById('sidebarUserRole');
      const elAvatar = document.getElementById('sidebarUserAvatar');
      if (elName) elName.textContent = displayName;
      if (elRole) elRole.textContent = displayRole;
      if (elAvatar) elAvatar.textContent = displayName.charAt(0).toUpperCase();

      // Filtro de roles en el Sidebar y elementos de la interfaz
      document.querySelectorAll('[data-roles]').forEach(el => {
        const allowedRoles = (el.dataset.roles || '').split(',').map(r => r.trim().toLowerCase());
        
        if (isSuperAdmin) {
          el.style.display = '';
        } else if (isSeller) {
          if (allowedRoles.includes('seller') || allowedRoles.includes('vendedor')) {
            el.style.display = '';
          } else {
            el.style.display = 'none';
          }
        } else if (isClinical) {
          if (allowedRoles.includes('clinical') || allowedRoles.includes('clinica')) {
            el.style.display = '';
          } else {
            el.style.display = 'none';
          }
        } else {
          if (allowedRoles.includes('superadmin') && !allowedRoles.includes('admin') && !allowedRoles.includes('all')) {
            el.style.display = 'none';
          } else {
            el.style.display = '';
          }
        }
      });

      // Chatbot reservado para administradores
      const chatbotBtn = document.getElementById('chatbotBtn');
      if (chatbotBtn) {
        chatbotBtn.style.display = (isSuperAdmin) ? '' : 'none';
      }

      const SELLER_ALLOWED = ['sales', 'catalog', 'catalog-adult', 'inventory', 'cardex'];
      const CLINICAL_ALLOWED = ['orders', 'postventa'];

      if (isSeller) {
        if (!SELLER_ALLOWED.includes(state.currentCategory)) {
          state.currentCategory = 'sales';
        }
        if (typeof window.switchCategory === 'function') {
          window.switchCategory(state.currentCategory);
        }
      } else if (isClinical) {
        if (!CLINICAL_ALLOWED.includes(state.currentCategory)) {
          state.currentCategory = 'orders';
        }
        if (typeof window.switchCategory === 'function') {
          window.switchCategory(state.currentCategory);
        }
      } else {
        if (!isSuperAdmin && ['users', 'audit'].includes(state.currentCategory)) {
          state.currentCategory = 'overview';
        }
        if (typeof window.switchCategory === 'function') {
          window.switchCategory(state.currentCategory || 'overview');
        }
        if (isSuperAdmin && typeof window.renderUsers === 'function') {
          window.renderUsers();
        }
      }
    }
  }

  function initAuth() {
    const saved = localStorage.getItem(window.ADMIN_STORAGE_KEY);
    if (saved) {
      try {
        state.session = JSON.parse(saved);
        showDashboardView();
        if (typeof window.loadOrders === 'function') {
          window.loadOrders();
        }
        return;
      } catch (e) {
        localStorage.removeItem(window.ADMIN_STORAGE_KEY);
      }
    }
    showLoginView();
  }

  window.quickLogin = function (u, p) {
    const userInput = document.getElementById('adminUsername');
    const passInput = document.getElementById('adminPassword');
    if (userInput && passInput) {
      userInput.value = u;
      passInput.value = p;
      const form = document.getElementById('loginForm');
      if (form) {
        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        } else {
          handleLogin({ preventDefault: () => {} });
        }
      }
    }
  };

  async function handleLogin(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const errorEl = document.getElementById('loginErrorMsg');
    if (errorEl) errorEl.style.display = 'none';

    const u = (document.getElementById('adminUsername')?.value || '').trim();
    const p = (document.getElementById('adminPassword')?.value || '').trim();

    if (!u || !p) {
      if (errorEl) {
        errorEl.textContent = 'Por favor ingresa usuario y contraseña.';
        errorEl.style.display = 'block';
      }
      return;
    }

    // 1. Acceso de Super Admin local
    const isSuperKeyli = u.toLowerCase() === 'keyli' && p === '2607';
    const isDefaultAdmin = (u.toLowerCase() === 'admin' && (p === 'admin' || p === '1234' || p === '2607')) ||
                           (u === '12345678' && (p === '1234' || p === 'admin'));

    if (isSuperKeyli || isDefaultAdmin) {
      state.session = {
        name: isSuperKeyli ? 'Super Admin' : 'Dr. Carlos Miranda',
        role: isSuperKeyli ? 'Acceso Total' : 'Gerente General',
        branch: 'Todas las Sedes',
        isSuperAdmin: true
      };
      try {
        localStorage.setItem(window.ADMIN_STORAGE_KEY, JSON.stringify(state.session));
      } catch (err) {}
      showDashboardView();
      if (typeof window.loadOrders === 'function') window.loadOrders();
      if (typeof window.showToast === 'function') window.showToast(`¡Bienvenido ${state.session.name}!`);
      return;
    }

    // 2. Consulta en Supabase
    try {
      const res = await fetch(`${window.API_LOGIN_URL}?select=*&or=(dni.eq.${encodeURIComponent(u)},nombres.ilike.${encodeURIComponent(u)})&pin=eq.${encodeURIComponent(p)}&limit=1`, {
        method: 'GET',
        headers: { 
          'apikey': window.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json' 
        }
      });
      
      if (res.ok) {
        const users = await res.json();
        if (users && users.length > 0) {
          const user = users[0];
          const isSuper = user.rol === 'admin' || user.rol === 'Super Admin' || user.rol === 'Acceso Total' || user.rol === 'Gerente General';
          state.session = {
            name: `${user.nombres || ''} ${user.apellidos || ''}`.trim() || user.dni,
            role: user.rol || 'Staff',
            branch: 'Galería San Antonio, Jr. Gamarra 778',
            isSuperAdmin: isSuper
          };
          try {
            localStorage.setItem(window.ADMIN_STORAGE_KEY, JSON.stringify(state.session));
          } catch (err) {}
          showDashboardView();
          if (typeof window.loadOrders === 'function') window.loadOrders();
          if (typeof window.showToast === 'function') window.showToast(`¡Bienvenido ${state.session.name}!`);
          return;
        }
      }
    } catch (err) {
      console.warn('[Auth] Consulta remota falló, verificando credenciales locales:', err);
    }

    // 3. Fallback de usuarios mock
    const localMatch = (state.users || []).find(usr => usr.username.toLowerCase() === u.toLowerCase());
    if (localMatch && (p === 'admin' || p === '1234' || p === '2607')) {
      state.session = {
        name: localMatch.name,
        role: localMatch.role,
        branch: localMatch.branch,
        isSuperAdmin: localMatch.role === 'Gerente General'
      };
      try {
        localStorage.setItem(window.ADMIN_STORAGE_KEY, JSON.stringify(state.session));
      } catch (err) {}
      showDashboardView();
      if (typeof window.loadOrders === 'function') window.loadOrders();
      if (typeof window.showToast === 'function') window.showToast(`¡Bienvenido ${state.session.name}!`);
      return;
    }

    if (errorEl) {
      errorEl.textContent = 'Usuario o contraseña incorrecta. Usa: keyli / 2607 o admin / admin';
      errorEl.style.display = 'block';
    }
  }

  function handleLogout() {
    localStorage.removeItem(window.ADMIN_STORAGE_KEY);
    state.session = null;
    showLoginView();
    if (typeof window.showToast === 'function') window.showToast('Sesión cerrada correctamente.');
  }

  function refreshCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = result;
    const captchaText = document.getElementById('captchaText');
    if (captchaText) {
      captchaText.textContent = result;
      captchaText.style.letterSpacing = Math.floor(Math.random() * 4 + 2) + 'px';
      captchaText.style.transform = `rotate(${Math.floor(Math.random() * 6 - 3)}deg)`;
    }
    const input = document.getElementById('captchaInput');
    if (input) input.value = '';
    const err = document.getElementById('captchaError');
    if (err) err.style.display = 'none';
  }

  function handleRecoverySubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const input = (document.getElementById('captchaInput')?.value || '').toUpperCase();
    const errorEl = document.getElementById('captchaError');
    
    if (input !== currentCaptcha) {
      if (errorEl) errorEl.style.display = 'block';
      refreshCaptcha();
      return;
    }
    
    if (errorEl) errorEl.style.display = 'none';
    if (typeof window.showToast === 'function') window.showToast('Enlace de recuperación enviado al correo registrado.');
    document.getElementById('modalRecovery')?.classList.remove('active');
    document.getElementById('formRecovery')?.reset();
  }

  // Exposición en espacio global y Admin namespace
  window.initAuth = initAuth;
  window.isUserClinical = isUserClinical;
  window.isUserSeller = isUserSeller;
  window.showLoginView = showLoginView;
  window.showDashboardView = showDashboardView;
  window.handleLogin = handleLogin;
  window.handleLogout = handleLogout;
  window.refreshCaptcha = refreshCaptcha;
  window.handleRecoverySubmit = handleRecoverySubmit;
})();
