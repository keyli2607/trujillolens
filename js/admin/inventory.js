/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: INVENTORY, CATALOGS & CARDEX
   File: js/admin/inventory.js
   Description: Stock management, product CRUD, children & adult frame catalogs,
                physical cardex movements ledger, and stock replenishment.
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. INVENTORY GRID & CRUD
  // --------------------------------------------------------------------------
  function renderInventory() {
    const container = document.getElementById('inventoryGrid');
    if (!container) return;

    container.innerHTML = (state.inventory || []).map(item => {
      let pillClass = 'stock-good';
      let pillText = 'En Stock';
      if (item.status === 'critical') {
        pillClass = 'stock-critical';
        pillText = 'Crítico';
      } else if (item.status === 'medium') {
        pillClass = 'stock-medium';
        pillText = 'Reposición';
      }

      return `
        <div class="inventory-card">
          <div class="inventory-card-header">
            <span style="font-size: 0.75rem; color: var(--admin-primary); font-weight: 700; text-transform: uppercase;">
              ${item.category}
            </span>
            <span class="stock-pill ${pillClass}">${pillText}</span>
          </div>
          <div style="font-size: 1rem; font-weight: 700; color: var(--admin-text-main);">${item.brand}</div>
          <div style="font-size: 0.82rem; color: var(--admin-text-muted);">${item.model}</div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
            <div>
              <div style="font-size: 0.7rem; color: var(--admin-text-dim);">DISPONIBLE</div>
              <div class="stock-count-number">${item.stock} <span style="font-size: 0.85rem; font-weight: 500; color: var(--admin-text-dim);">uds</span></div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.7rem; color: var(--admin-text-dim);">PRECIO VENTA</div>
              <div style="font-size: 1rem; font-weight: 700; color: #34d399;">S/ ${item.price}</div>
            </div>
          </div>
          ${window.isUserSeller && window.isUserSeller() ? `
            <div style="margin-top: 0.5rem;">
              <button type="button" class="btn-primary-action" style="width: 100%; padding: 0.5rem; font-size: 0.85rem;" onclick="startSale('${item.id}')">
                Vender este Producto
              </button>
            </div>
          ` : `
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <button type="button" class="btn-decision-action" style="flex: 1;" onclick="replenishStock('${item.id}')">
                +5 uds
              </button>
              <button type="button" class="btn-header-action" style="flex: 1;" onclick="openInventoryModal('${item.id}')">
                Editar
              </button>
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  function openInventoryModal(itemId = null) {
    if (window.isUserSeller && window.isUserSeller()) {
      showToast('Solo los administradores pueden registrar o editar productos de inventario.');
      return;
    }
    const modal = document.getElementById('modalInventory');
    const form = document.getElementById('formInventory');
    if (!modal || !form) return;
    
    form.reset();
    
    if (itemId) {
      const item = state.inventory.find(i => i.id === itemId);
      if (item) {
        document.getElementById('modalInventoryTitle').textContent = 'Editar Producto';
        document.getElementById('btnSaveInventoryText').textContent = 'Guardar Cambios';
        document.getElementById('invItemId').value = item.id;
        document.getElementById('invCategory').value = item.category;
        document.getElementById('invBrand').value = item.brand;
        document.getElementById('invModel').value = item.model;
        document.getElementById('invStock').value = item.stock;
        document.getElementById('invCost').value = item.cost;
        document.getElementById('invPrice').value = item.price;
      }
    } else {
      document.getElementById('modalInventoryTitle').textContent = 'Nuevo Producto';
      document.getElementById('btnSaveInventoryText').textContent = 'Crear Producto';
      document.getElementById('invItemId').value = '';
    }
    
    modal.classList.add('active');
  }

  function handleSaveInventory(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    const id = document.getElementById('invItemId')?.value;
    const category = document.getElementById('invCategory')?.value || 'Oftálmico';
    const brand = document.getElementById('invBrand')?.value || 'Genérico';
    const model = document.getElementById('invModel')?.value || 'Modelo General';
    const stock = parseInt(document.getElementById('invStock')?.value || '0', 10);
    const cost = parseFloat(document.getElementById('invCost')?.value || '0');
    const price = parseFloat(document.getElementById('invPrice')?.value || '0');
    
    let status = 'good';
    if (stock <= 3) status = 'critical';
    else if (stock <= 6) status = 'medium';

    if (id) {
      const idx = state.inventory.findIndex(i => i.id === id);
      if (idx !== -1) {
        state.inventory[idx] = { ...state.inventory[idx], category, brand, model, stock, cost, price, status };
        showToast('Producto actualizado correctamente');
      }
    } else {
      const newId = 'inv-' + Date.now();
      state.inventory.unshift({ id: newId, category, brand, model, stock, cost, price, status, threshold: 5 });
      showToast('Nuevo producto agregado');
    }
    
    document.getElementById('modalInventory')?.classList.remove('active');
    renderInventory();
  }

  function replenishStock(itemId) {
    const item = state.inventory.find(i => i.id === itemId);
    if (item) {
      item.stock += 5;
      item.status = item.stock > (item.threshold || 5) ? 'good' : 'medium';
      renderInventory();
      showToast(`Reabastecido: +5 unidades de ${item.brand} ${item.model}`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. PRODUCT CATALOGS (KIDS & ADULTS)
  // --------------------------------------------------------------------------
  function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    const catFilter = document.getElementById('filterCatalogCategory')?.value || 'all';
    const matFilter = document.getElementById('filterCatalogMaterial')?.value || 'all';
    const ageFilter = document.getElementById('filterCatalogAge')?.value || 'all';

    let filtered = window.MOCK_CATALOG || [];
    
    if (catFilter !== 'all') filtered = filtered.filter(item => item.category === catFilter);
    if (matFilter !== 'all') filtered = filtered.filter(item => item.material.includes(matFilter) || matFilter.includes(item.material));
    if (ageFilter !== 'all') filtered = filtered.filter(item => item.age === ageFilter);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">No se encontraron monturas con esos filtros.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const isOutOfStock = item.stock <= 0;
      const stockBadge = isOutOfStock 
        ? `<span class="badge-status badge-urgente" style="position: absolute; top: 1rem; right: 1rem;">Agotado</span>`
        : `<span class="badge-status badge-listo" style="position: absolute; top: 1rem; right: 1rem;">${item.stock} en stock</span>`;
        
      const btnSell = isOutOfStock
        ? `<button class="btn-decision-action" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled>Sin Stock</button>`
        : `<button class="btn-primary-action" style="flex: 1; padding: 0.5rem;" onclick="startSale('${item.id}')">Vender</button>`;

      const isSeller = window.isUserSeller ? window.isUserSeller() : false;

      return `
        <div class="catalog-card" style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: 12px; overflow: hidden; position: relative; box-shadow: var(--admin-shadow);">
          ${stockBadge}
          <div style="height: 180px; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--admin-card-border);">
            <img src="${item.image}" alt="${item.model}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 1.5rem;">
            <div style="font-size: 0.75rem; color: var(--admin-primary); font-weight: 800; margin-bottom: 0.25rem; text-transform: uppercase;">${item.brand} | ${item.sku}</div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; color: var(--admin-text-main); font-weight: 700;">${item.model}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
              <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.category}</span>
              <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.age}</span>
              <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.material}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="color: var(--admin-text-dim); font-size: 0.85rem; font-weight: 500;">Color: ${item.color}</span>
              <strong style="font-size: 1.35rem; color: var(--admin-accent);">S/ ${item.price.toFixed(2)}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              ${btnSell}
              ${!isSeller ? `<button class="btn-header-action" style="padding: 0.5rem 1rem;" onclick="showToast('Abriendo editor de producto...')">Editar</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAdultCatalog() {
    const grid = document.getElementById('catalogAdultGrid');
    if (!grid) return;

    const catFilter = document.getElementById('filterCatalogAdultCategory')?.value || 'all';
    const matFilter = document.getElementById('filterCatalogAdultMaterial')?.value || 'all';

    let filtered = window.MOCK_CATALOG_ADULT || [];
    
    if (catFilter !== 'all') filtered = filtered.filter(item => item.category === catFilter);
    if (matFilter !== 'all') filtered = filtered.filter(item => item.material.includes(matFilter) || matFilter.includes(item.material));

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">No se encontraron monturas con esos filtros.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const isOutOfStock = item.stock <= 0;
      const stockBadge = isOutOfStock 
        ? `<span class="badge-status badge-urgente" style="position: absolute; top: 1rem; right: 1rem;">Agotado</span>`
        : `<span class="badge-status badge-listo" style="position: absolute; top: 1rem; right: 1rem;">${item.stock} en stock</span>`;
        
      const btnSell = isOutOfStock
        ? `<button class="btn-decision-action" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled>Sin Stock</button>`
        : `<button class="btn-primary-action" style="flex: 1; padding: 0.5rem;" onclick="startSale('${item.id}')">Vender</button>`;

      const isSeller = window.isUserSeller ? window.isUserSeller() : false;

      return `
        <div class="catalog-card" style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: 12px; overflow: hidden; position: relative; box-shadow: var(--admin-shadow);">
          ${stockBadge}
          <div style="height: 180px; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--admin-card-border);">
            <img src="${item.image}" alt="${item.model}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 1.5rem;">
            <div style="font-size: 0.75rem; color: var(--admin-primary); font-weight: 800; margin-bottom: 0.25rem; text-transform: uppercase;">${item.brand} | ${item.sku}</div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; color: var(--admin-text-main); font-weight: 700;">${item.model}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
              <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.category}</span>
              <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.material}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="color: var(--admin-text-dim); font-size: 0.85rem; font-weight: 500;">Color: ${item.color}</span>
              <strong style="font-size: 1.35rem; color: var(--admin-accent);">S/ ${item.price.toFixed(2)}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              ${btnSell}
              ${!isSeller ? `<button class="btn-header-action" style="padding: 0.5rem 1rem;" onclick="showToast('Abriendo editor de producto...')">Editar</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 3. CARDEX MOVEMENTS LEDGER
  // --------------------------------------------------------------------------
  function renderCardex() {
    const tbody = document.getElementById('cardexTableBody');
    if (!tbody) return;

    // Populate product filter
    const productSelect = document.getElementById('cardexFilterProduct');
    if (productSelect && productSelect.options.length <= 1) {
      const products = [...new Set(state.cardex.map(m => m.product))].sort();
      products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p.length > 36 ? p.substring(0, 34) + '…' : p;
        productSelect.appendChild(opt);
      });
    }

    _renderCardexTable(state.cardex);
    _updateCardexKpis(state.cardex);
  }

  function _renderCardexTable(movements) {
    const tbody = document.getElementById('cardexTableBody');
    if (!tbody) return;

    if (!movements.length) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2.5rem;color:var(--admin-text-muted);">No se encontraron movimientos con los filtros aplicados.</td></tr>`;
      return;
    }

    const TYPE_META = {
      entrada: { label: 'Entrada', cls: 'cardex-badge-entrada', symbol: '+' },
      salida:  { label: 'Salida',  cls: 'cardex-badge-salida',  symbol: '−' },
      ajuste:  { label: 'Ajuste',  cls: 'cardex-badge-ajuste',  symbol: '±' },
      merma:   { label: 'Merma',   cls: 'cardex-badge-merma',   symbol: '↓' },
    };

    tbody.innerHTML = movements
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(m => {
        const meta = TYPE_META[m.type] || TYPE_META.ajuste;
        const absQty = Math.abs(m.qty);
        const qtySign = m.qty > 0 ? '+' : '−';
        const qtyColor = m.type === 'entrada'
          ? '#10b981'
          : m.type === 'salida'
            ? '#ef4444'
            : m.type === 'merma'
              ? '#f97316'
              : '#f59e0b';
        return `
          <tr>
            <td><code style="font-size:0.78rem;background:rgba(255,255,255,0.05);padding:2px 7px;border-radius:4px;">${m.ref}</code></td>
            <td><span class="cardex-type-badge ${meta.cls}">${meta.symbol} ${meta.label}</span></td>
            <td style="font-weight:600;color:var(--admin-text-main);">${m.product}</td>
            <td><span style="font-size:0.78rem;color:var(--admin-text-muted);">${m.category}</span></td>
            <td style="text-align:center;color:var(--admin-text-muted);">${m.prev}</td>
            <td style="text-align:center;font-weight:700;font-size:1.05rem;color:${qtyColor};">${qtySign}${absQty}</td>
            <td style="text-align:center;font-weight:700;">${m.current}</td>
            <td style="font-size:0.82rem;color:var(--admin-text-muted);max-width:180px;">${m.reason}</td>
            <td style="font-size:0.82rem;">${m.responsible}</td>
            <td style="font-size:0.82rem;white-space:nowrap;">${m.date}</td>
          </tr>`;
      }).join('');
  }

  function _updateCardexKpis(movements) {
    const ins  = movements.filter(m => m.type === 'entrada').reduce((s, m) => s + Math.abs(m.qty), 0);
    const outs = movements.filter(m => m.type === 'salida').reduce((s, m) => s + Math.abs(m.qty), 0);
    const adjs = movements.filter(m => m.type === 'ajuste' || m.type === 'merma').reduce((s, m) => s + Math.abs(m.qty), 0);
    const net  = ins - outs;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('cardexInCount',   ins  + ' uds');
    set('cardexOutCount',  outs + ' uds');
    set('cardexAdjCount',  adjs + ' uds');
    set('cardexNetBalance', (net >= 0 ? '+' : '') + net + ' uds');

    const netEl = document.getElementById('cardexNetBalance');
    if (netEl) netEl.style.color = net >= 0 ? '#10b981' : '#ef4444';
  }

  function filterCardex() {
    const search  = (document.getElementById('cardexSearch')?.value || '').toLowerCase();
    const type    = document.getElementById('cardexFilterType')?.value || 'all';
    const product = document.getElementById('cardexFilterProduct')?.value || 'all';

    const filtered = (state.cardex || []).filter(m => {
      const matchSearch  = !search || m.product.toLowerCase().includes(search) || m.ref.toLowerCase().includes(search) || m.reason.toLowerCase().includes(search);
      const matchType    = type === 'all'    || m.type === type;
      const matchProduct = product === 'all' || m.product === product;
      return matchSearch && matchType && matchProduct;
    });

    _renderCardexTable(filtered);
    _updateCardexKpis(filtered);
  }

  function openCardexModal() {
    let modal = document.getElementById('modalCardex');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalCardex';
      modal.className = 'modal-overlay';
      const inventoryList = window.INVENTORY_DB || state.inventory || [];
      modal.innerHTML = `
        <div class="modal-card" style="max-width:540px;">
          <div class="modal-header">
            <h3 style="font-size:1.15rem;font-weight:800;color:var(--admin-text-main);">Registrar Movimiento de Stock</h3>
            <button type="button" class="modal-close-btn" onclick="document.getElementById('modalCardex').classList.remove('active')">&times;</button>
          </div>
          <form id="formCardex" style="display:flex;flex-direction:column;gap:1rem;padding:1.5rem;">
            <div class="form-group">
              <label class="form-label">Tipo de Movimiento</label>
              <select id="cdxType" class="form-input" required>
                <option value="entrada">Entrada (Compra / Reposición)</option>
                <option value="salida">Salida (Venta / Despacho)</option>
                <option value="ajuste">Ajuste (Corrección de conteo)</option>
                <option value="merma">Merma (Daño / Pérdida)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Producto</label>
              <select id="cdxProduct" class="form-input" required>
                ${inventoryList.map(i => `<option value="${i.model}" data-cat="${i.category}">${i.brand} — ${i.model}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Cantidad (unidades)</label>
              <input type="number" id="cdxQty" class="form-input" min="1" max="999" placeholder="Ej. 5" required>
            </div>
            <div class="form-group">
              <label class="form-label">Motivo / Detalle</label>
              <input type="text" id="cdxReason" class="form-input" placeholder="Ej. Reposición semanal desde almacén central" required>
            </div>
            <button type="submit" class="btn-primary-action" style="width:100%;justify-content:center;padding:0.85rem;">Guardar Movimiento</button>
          </form>
        </div>`;
      document.body.appendChild(modal);

      document.getElementById('formCardex').addEventListener('submit', function(e) {
        e.preventDefault();
        const type    = document.getElementById('cdxType').value;
        const product = document.getElementById('cdxProduct');
        const qty     = parseInt(document.getElementById('cdxQty').value, 10);
        const reason  = document.getElementById('cdxReason').value.trim();
        const cat     = product.options[product.selectedIndex]?.dataset.cat || '';

        const lastMov = state.cardex.filter(m => m.product === product.value).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const prev    = lastMov ? lastMov.current : 0;
        const finalQty = (type === 'salida' || type === 'merma') ? -qty : qty;
        const current  = Math.max(0, prev + finalQty);

        const newId  = 'CDX-' + String(state.cardex.length + 1).padStart(3, '0');
        const today  = new Date().toISOString().split('T')[0];
        const user   = state.session?.name || 'Administrador';

        state.cardex.unshift({
          id: newId, ref: 'CDX-2026-' + String(state.cardex.length + 1).padStart(3, '0'),
          type, product: product.value, category: cat,
          prev, qty: finalQty, current, reason, responsible: user, date: today
        });

        // Sync with inventory
        const invItem = state.inventory.find(i => i.model === product.value);
        if (invItem) { invItem.stock = current; }

        // Refresh product filter
        const sel = document.getElementById('cardexFilterProduct');
        if (sel) {
          while (sel.options.length > 1) sel.remove(1);
          [...new Set(state.cardex.map(m => m.product))].sort().forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p.length > 36 ? p.substring(0, 34) + '…' : p;
            sel.appendChild(opt);
          });
        }

        modal.classList.remove('active');
        this.reset();
        filterCardex();
        showToast('Movimiento registrado exitosamente en el Cardex');
      });
    }
    modal.classList.add('active');
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.classList.remove('active'); }, { once: false });
  }

  function exportCardexCsv() {
    const rows = [
      ['Referencia','Tipo','Producto','Categoría','Cant. Anterior','Movimiento','Cant. Actual','Motivo','Responsable','Fecha'],
      ...state.cardex.map(m => [m.ref, m.type, `"${m.product}"`, m.category, m.prev, m.qty, m.current, `"${m.reason}"`, m.responsible, m.date])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `cardex_lens_group_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Cardex exportado como CSV');
  }

  // Window Exports
  window.renderInventory = renderInventory;
  window.openInventoryModal = openInventoryModal;
  window.handleSaveInventory = handleSaveInventory;
  window.replenishStock = replenishStock;
  window.renderCatalog = renderCatalog;
  window.renderAdultCatalog = renderAdultCatalog;
  window.renderCardex = renderCardex;
  window._renderCardexTable = _renderCardexTable;
  window._updateCardexKpis = _updateCardexKpis;
  window.filterCardex = filterCardex;
  window.openCardexModal = openCardexModal;
  window.exportCardexCsv = exportCardexCsv;

})();
