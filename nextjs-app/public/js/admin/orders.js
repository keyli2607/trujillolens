/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: LABORATORY ORDERS MODULE
   File: js/admin/orders.js
   Description: Laboratory queue, status updates, order creation,
                Supabase synchronization, and CSV export.
   ========================================================================== */

(function () {
  'use strict';

  async function loadOrders() {
    // 1. Cargar Órdenes de Laboratorio
    try {
      if (window.LG?.supabase?.getOrders) {
        const supaOrders = await window.LG.supabase.getOrders();
        if (supaOrders && Object.keys(supaOrders).length > 0) {
          state.orders = supaOrders;
        } else {
          state.orders = window.DEFAULT_ORDERS || {};
        }
      } else {
        const res = await fetch(window.API_ORDERS_URL, {
          headers: {
            'apikey': window.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`
          }
        });
        if (res.ok) {
          const ordenes = await res.json();
          const mapOrders = {};
          (ordenes || []).forEach(o => {
            mapOrders[o.numero_ticket] = {
              code: o.numero_ticket,
              estado: o.estado,
              urgente: o.urgente,
              service: o.ventas?.montura_descripcion || 'Montura',
              treatment: o.ventas?.luna_descripcion || 'Cristales',
              price: Number(o.ventas?.precio_total) || 0,
              cost: Number(o.ventas?.costo_total) || 0,
              currentStep: o.estado === 'Entregado' ? 5 : o.estado === 'Listo para Recojo' ? 4 : o.estado === 'En Proceso' ? 2 : 1
            };
          });
          state.orders = Object.keys(mapOrders).length > 0 ? mapOrders : (window.DEFAULT_ORDERS || {});
        } else {
          state.orders = window.DEFAULT_ORDERS || {};
        }
      }
    } catch (err) {
      state.orders = window.DEFAULT_ORDERS || {};
    }

    // 2. Cargar Ventas de Supabase
    try {
      if (window.LG?.supabase?.getSales) {
        const supaSales = await window.LG.supabase.getSales();
        if (supaSales && supaSales.length > 0) {
          state.sales = supaSales;
        }
      }
    } catch (err) {
      console.warn('[Admin] Fallback a ventas locales:', err);
    }

    // 3. Cargar Inventario de Supabase
    try {
      if (window.LG?.supabase?.getInventory) {
        const supaInv = await window.LG.supabase.getInventory();
        if (supaInv && supaInv.length > 0) {
          state.inventory = supaInv;
        }
      }
    } catch (err) {
      console.warn('[Admin] Fallback a inventario local:', err);
    }

    if (typeof window.updateMetricsAndDecisions === 'function') window.updateMetricsAndDecisions();
    renderOrdersTable();
    if (typeof window.renderInventory === 'function') window.renderInventory();
    if (typeof window.renderCharts === 'function') window.renderCharts();
    if (typeof window.updateSimulator === 'function') window.updateSimulator();
    if (typeof window.renderSales === 'function') window.renderSales();
    if (typeof window.renderCRM === 'function') window.renderCRM();
  }

  function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const ordersList = Object.values(state.orders || {});

    const filtered = ordersList.filter(order => {
      if (state.currentFilter === 'cola' && order.estado !== 'cola') return false;
      if (state.currentFilter === 'proceso' && order.estado !== 'proceso') return false;
      if (state.currentFilter === 'listo' && order.estado !== 'listo') return false;
      if (state.currentFilter === 'urgente' && !order.urgente) return false;

      if (state.searchQuery) {
        const q = state.searchQuery;
        const match = (order.code && order.code.toLowerCase().includes(q)) ||
                      (order.customer && order.customer.toLowerCase().includes(q)) ||
                      (order.service && order.service.toLowerCase().includes(q)) ||
                      (order.dni && order.dni.includes(q)) ||
                      (order.brand && order.brand.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    // Contadores para pestañas
    const countAll = ordersList.length;
    const countCola = ordersList.filter(o => o.estado === 'cola').length;
    const countProceso = ordersList.filter(o => o.estado === 'proceso').length;
    const countListo = ordersList.filter(o => o.estado === 'listo').length;
    const countUrgente = ordersList.filter(o => o.urgente).length;

    const tAll = document.getElementById('tabCountAll');
    const tCola = document.getElementById('tabCountCola');
    const tProceso = document.getElementById('tabCountProceso');
    const tListo = document.getElementById('tabCountListo');
    const tUrgente = document.getElementById('tabCountUrgente');

    if (tAll) tAll.textContent = countAll;
    if (tCola) tCola.textContent = countCola;
    if (tProceso) tProceso.textContent = countProceso;
    if (tListo) tListo.textContent = countListo;
    if (tUrgente) tUrgente.textContent = countUrgente;

    const sidebarOrderBadge = document.getElementById('sidebarOrdersBadge');
    if (sidebarOrderBadge) {
      sidebarOrderBadge.textContent = countAll;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
            No se encontraron órdenes con los filtros actuales.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(order => {
      const isUrgent = order.urgente;
      let badgeClass = 'badge-cola';
      let badgeText = 'En Cola';
      if (order.estado === 'proceso') {
        badgeClass = 'badge-proceso';
        badgeText = 'En Proceso';
      } else if (order.estado === 'listo') {
        badgeClass = 'badge-listo';
        badgeText = 'Listo para Recojo';
      }

      return `
        <tr>
          <td>
            <strong style="color: var(--admin-text-main); font-family: 'Outfit', sans-serif;">${order.code}</strong>
            ${isUrgent ? `<span class="badge-urgente" style="margin-left: 0.35rem;">URGENTE</span>` : ''}
          </td>
          <td>
            <div style="font-weight: 600; color: var(--admin-text-main);">${order.customer}</div>
            <div style="font-size: 0.75rem; color: var(--admin-text-dim);">DNI: ${order.dni || 'Sin DNI'} · Cel: ${order.phone || '958...'}</div>
          </td>
          <td style="max-width: 260px;">
            <div style="font-weight: 500; font-size: 0.8rem; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${order.service}
            </div>
            <div style="font-size: 0.72rem; color: var(--admin-primary);">${order.treatment || 'Óptica digital'}</div>
          </td>
          <td>
            <span style="font-size: 0.8rem; color: var(--admin-text-muted);">${order.estimatedDate || 'En fecha'}</span>
          </td>
          <td>
            <strong style="color: #34d399;">S/ ${order.price || 450}</strong>
          </td>
          <td>
            <span class="badge-status ${badgeClass}">${badgeText}</span>
          </td>
          <td>
            <select class="select-state" onchange="updateOrderStatus('${order.code}', this.value)">
              <option value="cola" ${order.estado === 'cola' ? 'selected' : ''}>Cola</option>
              <option value="proceso" ${order.estado === 'proceso' ? 'selected' : ''}>Proceso</option>
              <option value="listo" ${order.estado === 'listo' ? 'selected' : ''}>Listo</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.updateOrderStatus = async function(code, newEstado) {
    if (!state.orders[code]) return;

    const currentStep = newEstado === 'cola' ? 1 : (newEstado === 'proceso' ? 2 : 3);
    let statusTitle = 'En Cola de Espera';
    let statusBadgeText = 'Cola';
    let statusDesc = 'Receta registrada y montura asignada. En espera de laboratorio.';
    let showPickupBanner = false;

    if (newEstado === 'proceso') {
      statusTitle = 'En Proceso de Laboratorio';
      statusBadgeText = 'Proceso';
      statusDesc = 'Tallado digital, biselado y control de calidad en laboratorio.';
    } else if (newEstado === 'listo') {
      statusTitle = '¡Listo para Recoger en Tienda!';
      statusBadgeText = 'Listo';
      statusDesc = 'Tu pedido ya está en tienda listo para ser entregado.';
      showPickupBanner = true;
    }

    const updatedFields = {
      estado: newEstado,
      currentStep,
      statusTitle,
      statusBadgeText,
      statusDesc,
      showPickupBanner
    };

    state.orders[code] = { ...state.orders[code], ...updatedFields };

    try {
      if (window.LG?.supabase?.updateOrderStatus) {
        await window.LG.supabase.updateOrderStatus(code, newEstado, state.orders[code]?.urgente);
      } else {
        await fetch(`${window.SUPABASE_URL}/rest/v1/ordenes_laboratorio?numero_ticket=eq.${encodeURIComponent(code)}`, {
          method: 'PATCH',
          headers: {
            'apikey': window.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ estado: newEstado })
        });
      }
    } catch (err) {
      console.warn('Error actualizando orden en Supabase:', err);
    }

    if (typeof window.updateMetricsAndDecisions === 'function') window.updateMetricsAndDecisions();
    renderOrdersTable();
    if (typeof window.renderCharts === 'function') window.renderCharts();
    if (typeof window.showToast === 'function') window.showToast(`Orden ${code} actualizada a: ${newEstado.toUpperCase()}`);
  };

  async function handleCreateOrder(e) {
    e.preventDefault();
    const code = document.getElementById('newOrderCode').value.trim();
    const customer = document.getElementById('newOrderCustomer').value.trim();
    const dni = document.getElementById('newOrderDni').value.trim();
    const phone = document.getElementById('newOrderPhone').value.trim();
    const brand = document.getElementById('newOrderBrand').value;
    const treatment = document.getElementById('newOrderTreatment').value;
    const price = parseFloat(document.getElementById('newOrderPrice').value) || 450;
    const urgente = document.getElementById('newOrderUrgent').checked;

    const today = new Date();
    const optDays = urgente ? 1 : 2;
    const estDate = new Date(today);
    estDate.setDate(estDate.getDate() + optDays);
    
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    const dateStr = `${today.getDate()} de ${meses[today.getMonth()]}, 2026`;
    const estDateStr = `${estDate.getDate()} de ${meses[estDate.getMonth()]}, 2026`;

    const newOrder = {
      code,
      customer,
      dni,
      phone,
      receivedDate: dateStr,
      estimatedDate: estDateStr,
      brand,
      service: `Montura ${brand} + Cristales ${treatment}`,
      treatment,
      price,
      cost: Math.round(price * 0.42),
      branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
      estado: 'cola',
      urgente,
      currentStep: 1,
      statusTitle: 'En Cola de Espera',
      statusBadgeText: 'Cola',
      statusBadgeClass: 'state-badge-progress',
      statusBoxClass: 'status-box-progress',
      statusDesc: 'Receta registrada y montura asignada. En espera de laboratorio.',
      showPickupBanner: false,
      history: [
        { step: 1, name: 'Cola', date: `${dateStr} - Registro inicial`, desc: 'Ingreso al sistema Lens Group Trujillo.' }
      ]
    };

    state.orders[code] = newOrder;

    try {
      if (window.LG?.supabase?.createOrder) {
        await window.LG.supabase.createOrder(newOrder);
      } else {
        await fetch(window.API_ORDERS_URL, {
          method: 'POST',
          headers: { 
            'apikey': window.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(newOrder)
        });
      }
    } catch (err) {
      console.warn('Error guardando en Supabase:', err);
    }

    document.getElementById('modalNewOrder')?.classList.remove('active');
    document.getElementById('formNewOrder')?.reset();

    if (typeof window.updateMetricsAndDecisions === 'function') window.updateMetricsAndDecisions();
    renderOrdersTable();
    if (typeof window.renderCharts === 'function') window.renderCharts();
    if (typeof window.showToast === 'function') window.showToast(`Nueva orden ${code} registrada con éxito`);
  }

  function exportOrdersToCsv() {
    const ordersList = Object.values(state.orders || {});
    if (!ordersList.length) {
      if (typeof window.showToast === 'function') window.showToast('No hay órdenes para exportar');
      return;
    }
    const headers = ['Codigo', 'Cliente', 'DNI', 'Telefono', 'Fecha Recepcion', 'Fecha Entrega', 'Marca', 'Servicio', 'Precio', 'Costo', 'Estado', 'Urgente'];
    const rows = ordersList.map(o => [
      o.code,
      `"${o.customer}"`,
      o.dni,
      o.phone,
      `"${o.receivedDate}"`,
      `"${o.estimatedDate}"`,
      `"${o.brand}"`,
      `"${o.service}"`,
      o.price,
      o.cost,
      o.estado,
      o.urgente ? 'SI' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ordenes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof window.showToast === 'function') window.showToast('Reporte exportado exitosamente');
  }

  window.loadOrders = loadOrders;
  window.renderOrdersTable = renderOrdersTable;
  window.handleCreateOrder = handleCreateOrder;
  window.exportOrdersToCsv = exportOrdersToCsv;
})();
