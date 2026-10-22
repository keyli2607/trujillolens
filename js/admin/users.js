/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: USERS & STAFF MANAGEMENT
   File: js/admin/users.js
   Description: User modal, roles assignment, Supabase user synchronization,
                and staff activation status.
   ========================================================================== */

(function () {
  'use strict';

  function openUserModal(userId = null) {
    const modal = document.getElementById('modalNewUser');
    const form = document.getElementById('formNewUser');
    if (!modal) return;
    const title = modal.querySelector('.modal-header h3');
    
    if (userId && form) {
      const user = (state.users || []).find(u => u.id === userId);
      if (user) {
        if (title) title.textContent = 'Editar Usuario';
        const nameEl = document.getElementById('newUserName');
        const userEl = document.getElementById('newUserUsername');
        const roleEl = document.getElementById('newUserRole');
        const branchEl = document.getElementById('newUserBranch');
        const passEl = document.getElementById('newUserPassword');

        if (nameEl) nameEl.value = user.name || '';
        if (userEl) userEl.value = user.username || '';
        if (roleEl) roleEl.value = user.role || 'Staff';
        if (branchEl) branchEl.value = user.branch || '';
        if (passEl) passEl.removeAttribute('required');
        form.dataset.editId = userId;
      }
    } else {
      if (title) title.textContent = 'Crear Nuevo Usuario';
      if (form) {
        form.reset();
        delete form.dataset.editId;
      }
      const passEl = document.getElementById('newUserPassword');
      if (passEl) passEl.setAttribute('required', 'true');
    }
    
    modal.classList.add('active');
  }

  function closeUserModal() {
    document.getElementById('modalNewUser')?.classList.remove('active');
  }

  function handleCreateUser(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const name = document.getElementById('newUserName')?.value.trim();
    const username = document.getElementById('newUserUsername')?.value.trim();
    const role = document.getElementById('newUserRole')?.value;
    const branch = document.getElementById('newUserBranch')?.value;
    
    if (!name || !username) return;

    if (e && e.target && e.target.dataset && e.target.dataset.editId) {
      const user = (state.users || []).find(u => u.id === e.target.dataset.editId);
      if (user) {
        user.name = name;
        user.username = username;
        user.role = role;
        user.branch = branch;
        showToast(`Usuario ${name} actualizado.`);
      }
    } else {
      const newUser = {
        id: 'usr-' + Date.now(),
        name,
        username,
        role,
        branch,
        status: 'activo'
      };
      if (!state.users) state.users = [];
      state.users.push(newUser);
      showToast(`Usuario ${name} creado con éxito.`);
    }

    renderUsersTable();
    closeUserModal();
    const form = document.getElementById('formNewUser');
    if (form) form.reset();
  }

  function toggleUserStatus(userId) {
    const user = (state.users || []).find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'activo' ? 'inactivo' : 'activo';
      renderUsersTable();
      showToast(`Usuario ${user.name} ahora está ${user.status}`);
    }
  }

  function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      state.users = (state.users || []).filter(u => u.id !== userId);
      renderUsersTable();
      showToast('Usuario eliminado del sistema.');
    }
  }

  function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const userList = state.users || [];
    if (userList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
            No hay usuarios registrados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = userList.map(user => {
      const isActivo = user.status === 'activo';
      const badgeClass = isActivo ? 'badge-listo' : 'badge-cola';
      const badgeText = isActivo ? 'Activo' : 'Inactivo';
      const toggleAction = isActivo ? 'Desactivar' : 'Activar';

      return `
        <tr>
          <td>
            <strong style="color: var(--admin-text-main);">${user.name}</strong>
          </td>
          <td>
            <span style="color: var(--admin-text-dim);">${user.username}</span>
          </td>
          <td>
            <span style="font-size: 0.8rem; color: var(--admin-primary); font-weight: 600;">${user.role}</span>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--admin-text-muted);">${user.branch}</span>
          </td>
          <td>
            <span class="badge-status ${badgeClass}">${badgeText}</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
              <button class="btn-decision-action" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: #38bdf8; border-color: rgba(56, 189, 248, 0.2);" onclick="openUserModal('${user.id}')">
                Editar
              </button>
              <button class="btn-decision-action" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="toggleUserStatus('${user.id}')">
                ${toggleAction}
              </button>
              <button class="btn-decision-action" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.2);" onclick="deleteUser('${user.id}')">
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">Cargando usuarios desde Supabase...</td></tr>`;

    try {
      let users = null;
      if (window.LG?.supabase?.getUsers) {
        users = await window.LG.supabase.getUsers();
      } else {
        const res = await fetch(`${window.SUPABASE_URL}/rest/v1/usuarios?select=*`, {
          headers: {
            apikey: window.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`
          }
        });
        if (res.ok) users = await res.json();
      }

      if (!users || users.length === 0) {
        renderUsersTable();
        return;
      }

      const estadoConfig = {
        activo:     { label: 'ACTIVO',     cls: 'user-estado-activo' },
        inactivo:   { label: 'INACTIVO',   cls: 'user-estado-inactivo' },
        suspendido: { label: 'SUSPENDIDO', cls: 'user-estado-suspendido' }
      };

      tbody.innerHTML = users.map(u => {
        const estadoVal = u.estado || (u.activo !== false ? 'activo' : 'inactivo');
        const cfg = estadoConfig[estadoVal] || estadoConfig.activo;
        return `
        <tr>
          <td><strong>${u.nombres || ''} ${u.apellidos || ''}</strong></td>
          <td><code>${u.dni}</code></td>
          <td><span class="stock-pill stock-good">${u.rol || 'Staff'}</span></td>
          <td>Galería San Antonio, Jr. Gamarra N° 778</td>
          <td>
            <select class="user-estado-select ${cfg.cls}" onchange="updateUserEstado('${u.id}', this)">
              <option value="activo"     ${estadoVal === 'activo'     ? 'selected' : ''}>ACTIVO</option>
              <option value="inactivo"   ${estadoVal === 'inactivo'   ? 'selected' : ''}>INACTIVO</option>
              <option value="suspendido" ${estadoVal === 'suspendido' ? 'selected' : ''}>SUSPENDIDO</option>
            </select>
          </td>
          <td style="text-align: right;">
            <span style="font-size: 0.8rem; color: var(--admin-text-dim);">Registrado</span>
          </td>
        </tr>`;
      }).join('');
    } catch (err) {
      renderUsersTable();
    }
  }

  async function updateUserEstado(userId, selectEl) {
    const nuevoEstado = selectEl.value;
    const clsMap = { activo: 'user-estado-activo', inactivo: 'user-estado-inactivo', suspendido: 'user-estado-suspendido' };

    selectEl.className = `user-estado-select ${clsMap[nuevoEstado] || ''}`;

    try {
      const body = {
        estado: nuevoEstado,
        activo: nuevoEstado === 'activo'
      };
      const res = await fetch(`${window.SUPABASE_URL}/rest/v1/usuarios?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          apikey: window.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Error al actualizar');
      showToast(`Estado actualizado a ${nuevoEstado.toUpperCase()}`);
    } catch (err) {
      showToast('Error al guardar el estado: ' + err.message);
    }
  }

  // Bind Form Submit
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('formNewUser')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      const fullName = document.getElementById('newUserName')?.value.trim() || '';
      const [nombres, ...rest] = fullName.split(' ');
      const apellidos = rest.join(' ') || ' ';
      const dni = document.getElementById('newUserUsername')?.value.trim() || '';
      const pin = document.getElementById('newUserPassword')?.value.trim() || '';
      const rol = document.getElementById('newUserRole')?.value || 'Staff';

      try {
        if (window.LG?.supabase?.createUser) {
          await window.LG.supabase.createUser({ nombres, apellidos, dni, pin, rol });
        } else {
          await fetch(`${window.SUPABASE_URL}/rest/v1/usuarios`, {
            method: 'POST',
            headers: {
              apikey: window.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombres, apellidos, dni, pin, rol })
          });
        }

        showToast(`Usuario ${dni} creado con éxito en Supabase`);
        closeUserModal();
        document.getElementById('formNewUser')?.reset();
        renderUsers();
      } catch (err) {
        // Fallback local
        handleCreateUser(e);
      }
    });
  });

  // Window Exports
  window.openUserModal = openUserModal;
  window.closeUserModal = closeUserModal;
  window.handleCreateUser = handleCreateUser;
  window.toggleUserStatus = toggleUserStatus;
  window.deleteUser = deleteUser;
  window.renderUsersTable = renderUsersTable;
  window.renderUsers = renderUsers;
  window.updateUserEstado = updateUserEstado;

})();
