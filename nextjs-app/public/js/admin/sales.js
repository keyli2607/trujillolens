/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: SALES & INVOICING MODULE
   File: js/admin/sales.js
   Description: Point of Sale (POS), electronic invoicing (Boleta/Factura/Nota),
                SUNAT/RENIEC lookup, ticket rendering, printing, and CSV export.
   ========================================================================== */

(function () {
  'use strict';

  function numeroALetras(amount) {
    const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    
    const entero = Math.floor(amount);
    const centavos = Math.round((amount - entero) * 100);
    const centavosStr = String(centavos).padStart(2, '0');
    
    if (entero === 0) return `CERO CON ${centavosStr}/100 SOLES`;
    if (entero === 100) return `CIEN CON ${centavosStr}/100 SOLES`;
    
    let texto = '';
    if (entero >= 1000) {
      const miles = Math.floor(entero / 1000);
      texto += (miles === 1 ? 'MIL ' : units[miles] + ' MIL ');
    }
    const resto1000 = entero % 1000;
    if (resto1000 >= 100) {
      const c = Math.floor(resto1000 / 100);
      texto += hundreds[c] + ' ';
    }
    const resto100 = resto1000 % 100;
    if (resto100 >= 10 && resto100 <= 19) {
      texto += teens[resto100 - 10] + ' ';
    } else if (resto100 >= 20) {
      const d = Math.floor(resto100 / 10);
      const u = resto100 % 10;
      if (d === 2 && u > 0) {
        texto += 'VEINTI' + units[u] + ' ';
      } else {
        texto += tens[d] + (u > 0 ? ' Y ' + units[u] : '') + ' ';
      }
    } else if (resto100 > 0) {
      texto += units[resto100] + ' ';
    }
    
    return (texto.trim() + ` CON ${centavosStr}/100 SOLES`).toUpperCase();
  }

  function renderSales() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;

    let list = state.sales || [];
    if (state.salesSearchQuery) {
      const q = state.salesSearchQuery.toLowerCase();
      list = list.filter(s =>
        (s.correlativo && s.correlativo.toLowerCase().includes(q)) ||
        (s.clienteNombre && s.clienteNombre.toLowerCase().includes(q)) ||
        (s.clienteDocNumero && s.clienteDocNumero.includes(q)) ||
        (s.monturaNombre && s.monturaNombre.toLowerCase().includes(q))
      );
    }

    // KPIs
    const totalDay = state.sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
    const salesTotalDayEl = document.getElementById('salesTotalDay');
    if (salesTotalDayEl) {
      salesTotalDayEl.textContent = `S/ ${totalDay.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const salesFramesDayEl = document.getElementById('salesFramesDay');
    if (salesFramesDayEl) {
      salesFramesDayEl.textContent = state.sales.length;
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
            No se encontraron ventas con los criterios de búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(s => {
      const isPaid = s.estado === 'Pagado';
      const badgeClass = isPaid ? 'badge-listo' : 'badge-proceso';
      const docPillColor = s.clienteDocTipo === 'RUC' ? '#0284c7' : '#059669';
      const docPillBg = s.clienteDocTipo === 'RUC' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(5, 150, 105, 0.12)';

      return `
        <tr>
          <td style="white-space: nowrap;">
            <div style="font-weight: 800; font-family: monospace; color: var(--admin-primary); font-size: 0.92rem; letter-spacing: 0.02em;">
              ${s.correlativo}
            </div>
            <span style="font-size: 0.7rem; color: var(--admin-text-dim); text-transform: uppercase; font-weight: 600; display: block; margin-top: 0.15rem;">
              ${s.tipoDoc === 'factura' ? 'Factura Electrónica' : s.tipoDoc === 'boleta' ? 'Boleta Electrónica' : 'Nota de Venta'}
            </span>
          </td>
          <td style="white-space: nowrap;">
            <span style="font-size: 0.84rem; color: var(--admin-text-muted); font-weight: 600;">${s.fechaHora}</span>
          </td>
          <td style="min-width: 200px;">
            <div style="font-weight: 700; color: var(--admin-text-main); font-size: 0.88rem; line-height: 1.3;">
              ${s.clienteNombre}
            </div>
            ${s.clienteTelefono ? `
              <div style="font-size: 0.76rem; color: var(--admin-text-dim); margin-top: 0.2rem; display: inline-flex; align-items: center; gap: 0.3rem;">
                <span>${LG.icon('phone', { size: 14, sw: 2 })}</span>
                <span style="font-weight: 500;">${s.clienteTelefono}</span>
              </div>
            ` : ''}
          </td>
          <td style="white-space: nowrap;">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              <code style="font-size: 0.84rem; color: var(--admin-text-main); font-weight: 700; background: var(--admin-bg-alt); padding: 0.2rem 0.45rem; border-radius: 4px; border: 1px solid var(--admin-card-border); letter-spacing: 0.03em;">${s.clienteDocNumero}</code>
              <span style="font-size: 0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; background: ${docPillBg}; color: ${docPillColor}; font-weight: 800; border: 1px solid ${docPillColor}33;">
                ${s.clienteDocTipo}
              </span>
            </div>
          </td>
          <td style="min-width: 220px;">
            <div style="font-size: 0.84rem; color: var(--admin-text-main); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;" title="${s.monturaNombre}">
              ${s.monturaNombre}
            </div>
            <div style="font-size: 0.74rem; color: var(--admin-primary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; margin-top: 0.15rem;" title="${s.lunasNombre}">
              ${s.lunasNombre}
            </div>
          </td>
          <td style="white-space: nowrap;">
            <strong style="color: #10b981; font-size: 0.95rem; font-weight: 800;">S/ ${Number(s.total).toFixed(2)}</strong>
            <div style="font-size: 0.72rem; color: var(--admin-text-dim); font-weight: 600; text-transform: capitalize;">${s.metodoPago}</div>
          </td>
          <td style="white-space: nowrap;">
            <span class="badge-status ${badgeClass}">${s.estado}</span>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
              <button type="button" class="btn-table-action" title="Ver Comprobante Electrónico" onclick="openInvoiceModal('${s.id}')">
                Ver
              </button>
              <button type="button" class="btn-table-action btn-wa" title="Enviar por WhatsApp" onclick="sendInvoiceWhatsApp('${s.id}')">
                WA
              </button>
              <button type="button" class="btn-table-action" title="Imprimir Comprobante" onclick="printInvoiceById('${s.id}')">
                ${LG.icon('printer', { size: 14, sw: 2 })}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function setSaleDocType(type) {
    const btnBoleta = document.getElementById('btnTypeBoleta');
    const btnFactura = document.getElementById('btnTypeFactura');
    const btnNota = document.getElementById('btnTypeNota');
    const docTypeInput = document.getElementById('saleDocType');
    const correlativoText = document.getElementById('saleCorrelativoText');
    const docTypeSelect = document.getElementById('saleCustomerDocType');
    const labelCustomerName = document.getElementById('labelCustomerName');
    const addressGroup = document.getElementById('fieldCustomerAddressGroup');
    const docNumberInput = document.getElementById('saleCustomerDocNumber');
    const btnFiscalLookupText = document.getElementById('btnFiscalLookupText');

    [btnBoleta, btnFactura, btnNota].forEach(b => b?.classList.remove('active'));

    if (docTypeInput) docTypeInput.value = type;

    if (type === 'factura') {
      btnFactura?.classList.add('active');
      if (correlativoText) correlativoText.textContent = `F001-${String(state.salesCorrelative.factura).padStart(6, '0')}`;
      if (docTypeSelect) docTypeSelect.value = 'RUC';
      if (labelCustomerName) labelCustomerName.textContent = 'Razón Social de la Empresa';
      if (docNumberInput) {
        docNumberInput.placeholder = 'Ingresa RUC (11 dígitos)';
        docNumberInput.maxLength = 11;
      }
      if (btnFiscalLookupText) btnFiscalLookupText.textContent = 'Consultar SUNAT';
      if (addressGroup) addressGroup.style.display = 'block';
    } else if (type === 'nota') {
      btnNota?.classList.add('active');
      if (correlativoText) correlativoText.textContent = `NV01-${String(state.salesCorrelative.nota).padStart(6, '0')}`;
      if (labelCustomerName) labelCustomerName.textContent = 'Cliente';
      if (docNumberInput) {
        docNumberInput.placeholder = 'DNI o documento';
        docNumberInput.maxLength = 15;
      }
      if (btnFiscalLookupText) btnFiscalLookupText.textContent = 'Consultar RENIEC';
      if (addressGroup) addressGroup.style.display = 'none';
    } else {
      // Boleta
      btnBoleta?.classList.add('active');
      if (correlativoText) correlativoText.textContent = `B001-${String(state.salesCorrelative.boleta).padStart(6, '0')}`;
      if (docTypeSelect) docTypeSelect.value = 'DNI';
      if (labelCustomerName) labelCustomerName.textContent = 'Nombres y Apellidos del Paciente';
      if (docNumberInput) {
        docNumberInput.placeholder = 'Ingresa DNI (8 dígitos)';
        docNumberInput.maxLength = 8;
      }
      if (btnFiscalLookupText) btnFiscalLookupText.textContent = 'Consultar RENIEC';
      if (addressGroup) addressGroup.style.display = 'none';
    }

    const feedback = document.getElementById('saleDocFeedback');
    if (feedback) feedback.innerHTML = '';
  }

  function handleDocTypeSelectChange() {
    const docTypeEl = document.getElementById('saleCustomerDocType');
    if (!docTypeEl) return;
    const docType = docTypeEl.value;
    const docNumberInput = document.getElementById('saleCustomerDocNumber');
    const btnFiscalLookupText = document.getElementById('btnFiscalLookupText');
    const addressGroup = document.getElementById('fieldCustomerAddressGroup');
    const labelCustomerName = document.getElementById('labelCustomerName');

    if (docType === 'RUC') {
      if (docNumberInput) {
        docNumberInput.placeholder = 'Ingresa RUC (11 dígitos)';
        docNumberInput.maxLength = 11;
      }
      if (btnFiscalLookupText) btnFiscalLookupText.textContent = 'Consultar SUNAT';
      if (labelCustomerName) labelCustomerName.textContent = 'Razón Social de la Empresa';
      if (addressGroup) addressGroup.style.display = 'block';
    } else {
      if (docNumberInput) {
        docNumberInput.placeholder = 'Ingresa DNI (8 dígitos)';
        docNumberInput.maxLength = 8;
      }
      if (btnFiscalLookupText) btnFiscalLookupText.textContent = 'Consultar RENIEC';
      if (labelCustomerName) labelCustomerName.textContent = 'Nombres y Apellidos del Paciente';
      if (addressGroup && document.getElementById('saleDocType')?.value !== 'factura') {
        addressGroup.style.display = 'none';
      }
    }

    const feedback = document.getElementById('saleDocFeedback');
    if (feedback) feedback.innerHTML = '';
  }

  async function handleConsultarFiscal() {
    const docTypeEl = document.getElementById('saleCustomerDocType');
    const docNumberEl = document.getElementById('saleCustomerDocNumber');
    const feedbackEl = document.getElementById('saleDocFeedback');
    const nameInput = document.getElementById('saleCustomerName');
    const addressInput = document.getElementById('saleCustomerAddress');
    const btnLookup = document.getElementById('btnFiscalLookup');
    const btnText = document.getElementById('btnFiscalLookupText');

    if (!docNumberEl || !docTypeEl) return;
    const docType = docTypeEl.value;
    const docNumber = docNumberEl.value.trim();

    if (!docNumber) {
      showToast('Ingresa un número de documento para consultar.');
      return;
    }

    const prevText = btnText ? btnText.textContent : 'Consultar';
    if (btnLookup) btnLookup.disabled = true;
    if (btnText) btnText.textContent = 'Consultando...';

    try {
      if (docType === 'RUC' || docNumber.length === 11) {
        if (docNumber.length !== 11) throw new Error('El RUC debe tener 11 dígitos.');
        const data = await window.LG.fiscal.consultarRUC(docNumber);
        if (nameInput) nameInput.value = data.razonSocial || '';
        if (addressInput) addressInput.value = data.direccion || 'TRUJILLO, LA LIBERTAD';
        if (feedbackEl) {
          feedbackEl.innerHTML = `
            <div class="verified-badge success">
              ${LG.icon('check', { size: 14, sw: 2.5 })}
              <span><strong>SUNAT:</strong> ${data.razonSocial} (${data.estado || 'ACTIVO'} - ${data.condicion || 'HABIDO'})</span>
            </div>
          `;
        }
        showToast(`RUC ${docNumber} verificado ante SUNAT`);
      } else {
        if (docNumber.length !== 8) throw new Error('El DNI debe tener 8 dígitos.');
        const data = await window.LG.fiscal.consultarDNI(docNumber);
        if (nameInput) nameInput.value = data.nombreCompleto || '';
        if (feedbackEl) {
          feedbackEl.innerHTML = `
            <div class="verified-badge success">
              ${LG.icon('check', { size: 14, sw: 2.5 })}
              <span><strong>RENIEC:</strong> ${data.nombreCompleto}</span>
            </div>
          `;
        }
        showToast(`DNI ${docNumber} verificado ante RENIEC`);
      }
    } catch (err) {
      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="verified-badge warning">
            <span>${err.message} Puedes ingresar los datos manualmente.</span>
          </div>
        `;
      }
      showToast(err.message);
    } finally {
      if (btnLookup) btnLookup.disabled = false;
      if (btnText) btnText.textContent = prevText;
    }
  }

  function handleFrameSelectChange() {
    const select = document.getElementById('saleFrameSelect');
    const priceInput = document.getElementById('saleFramePrice');
    const customFrameGroup = document.getElementById('fieldCustomFrameDesc');
    if (!select || !priceInput) return;

    const selectedOpt = select.options[select.selectedIndex];
    if (!selectedOpt) return;

    const price = parseFloat(selectedOpt.dataset.price) || 0;
    priceInput.value = price;

    if (select.value === 'custom') {
      if (customFrameGroup) customFrameGroup.style.display = 'block';
    } else {
      if (customFrameGroup) customFrameGroup.style.display = 'none';
    }

    calculateNewSaleTotals();
  }

  function handleLensTreatmentChange() {
    const select = document.getElementById('saleLensTreatment');
    const priceInput = document.getElementById('saleLensPrice');
    if (!select || !priceInput) return;

    const selectedOpt = select.options[select.selectedIndex];
    if (!selectedOpt) return;

    const price = parseFloat(selectedOpt.dataset.price) || 0;
    priceInput.value = price;

    calculateNewSaleTotals();
  }

  function calculateNewSaleTotals() {
    const framePrice = parseFloat(document.getElementById('saleFramePrice')?.value) || 0;
    const lensPrice = parseFloat(document.getElementById('saleLensPrice')?.value) || 0;
    const discount = parseFloat(document.getElementById('saleDiscount')?.value) || 0;

    const subtotalNeto = framePrice + lensPrice;
    const total = Math.max(0, subtotalNeto - discount);
    const baseGravada = total / 1.18;
    const igv = total - baseGravada;

    const subtotalEl = document.getElementById('saleSubtotalDisplay');
    const igvEl = document.getElementById('saleIgvDisplay');
    const discountEl = document.getElementById('saleDiscountDisplay');
    const totalEl = document.getElementById('saleTotalDisplay');

    if (subtotalEl) subtotalEl.textContent = `S/ ${baseGravada.toFixed(2)}`;
    if (igvEl) igvEl.textContent = `S/ ${igv.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `- S/ ${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `S/ ${total.toFixed(2)}`;
  }

  function openNewSaleModal(frameId = null) {
    const modal = document.getElementById('modalNewSale');
    const form = document.getElementById('formNewSale');
    if (!modal || !form) return;

    form.reset();
    setSaleDocType('boleta');

    const frameSelect = document.getElementById('saleFrameSelect');
    if (frameId) {
      if (frameSelect) {
        frameSelect.value = frameId;
        handleFrameSelectChange();
      }
    } else {
      if (frameSelect && frameSelect.options.length > 1) {
        frameSelect.selectedIndex = 1;
        handleFrameSelectChange();
      }
    }

    calculateNewSaleTotals();
    modal.classList.add('active');
  }

  function closeNewSaleModal() {
    document.getElementById('modalNewSale')?.classList.remove('active');
  }

  function startSale(frameId) {
    openNewSaleModal(frameId);
  }

  function closeSaleModal() {
    closeNewSaleModal();
  }

  async function handleNewSaleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const docType = document.getElementById('saleDocType')?.value || 'boleta';
    const customerDocType = document.getElementById('saleCustomerDocType')?.value || 'DNI';
    const customerDocNumber = document.getElementById('saleCustomerDocNumber')?.value.trim() || '00000000';
    const customerName = document.getElementById('saleCustomerName')?.value.trim() || 'Cliente General';
    const customerAddress = document.getElementById('saleCustomerAddress')?.value.trim() || 'Trujillo, La Libertad';
    const customerPhone = document.getElementById('saleCustomerPhone')?.value.trim() || '944123890';
    const customerEmail = document.getElementById('saleCustomerEmail')?.value.trim() || '';

    const frameSelect = document.getElementById('saleFrameSelect');
    let frameName = frameSelect?.options[frameSelect.selectedIndex]?.dataset.name || 'Montura Oftálmica';
    if (frameSelect && frameSelect.value === 'custom') {
      const customName = document.getElementById('saleCustomFrameName')?.value.trim();
      if (customName) frameName = customName;
    }
    const framePrice = parseFloat(document.getElementById('saleFramePrice')?.value) || 0;

    const lensSelect = document.getElementById('saleLensTreatment');
    const lensName = lensSelect?.options[lensSelect.selectedIndex]?.text || 'Solo Montura';
    const lensPrice = parseFloat(document.getElementById('saleLensPrice')?.value) || 0;

    const rxOD = document.getElementById('saleRxOD')?.value.trim() || '';
    const rxOI = document.getElementById('saleRxOI')?.value.trim() || '';
    const rxDNP = document.getElementById('saleRxDNP')?.value.trim() || '';

    const discount = parseFloat(document.getElementById('saleDiscount')?.value) || 0;
    const total = Math.max(0, (framePrice + lensPrice) - discount);
    const subtotal = total / 1.18;
    const igv = total - subtotal;

    const paymentMethod = document.getElementById('salePaymentMethod')?.value || 'Efectivo';
    const paymentCondition = document.getElementById('salePaymentCondition')?.value || '100% Contado';
    const isPaid = paymentCondition.includes('100%');

    // Correlativo según tipo
    let correlativo = '';
    if (docType === 'factura') {
      correlativo = `F001-${String(state.salesCorrelative.factura).padStart(6, '0')}`;
      state.salesCorrelative.factura++;
    } else if (docType === 'nota') {
      correlativo = `NV01-${String(state.salesCorrelative.nota).padStart(6, '0')}`;
      state.salesCorrelative.nota++;
    } else {
      correlativo = `B001-${String(state.salesCorrelative.boleta).padStart(6, '0')}`;
      state.salesCorrelative.boleta++;
    }

    const now = new Date();
    const horaStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const fechaStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const saleId = 'sale-' + Date.now();
    const newSale = {
      id: saleId,
      correlativo,
      tipoDoc: docType,
      clienteDocTipo: customerDocType,
      clienteDocNumero: customerDocNumber,
      clienteNombre: customerName,
      clienteDireccion: customerAddress,
      clienteTelefono: customerPhone,
      clienteEmail: customerEmail,
      monturaNombre: frameName,
      monturaPrecio: framePrice,
      lunasNombre: lensName,
      lunasPrecio: lensPrice,
      rx: { od: rxOD, oi: rxOI, dnp: rxDNP },
      descuento: discount,
      subtotal: Number(subtotal.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      total: Number(total.toFixed(2)),
      totalEnLetras: numeroALetras(total),
      metodoPago: paymentMethod,
      condicionPago: paymentCondition,
      estado: isPaid ? 'Pagado' : 'Adelanto 50%',
      fechaHora: `Hoy ${horaStr}`,
      fechaCompleta: `${fechaStr} ${horaStr}`,
      timestamp: Date.now(),
      tallerGenerado: document.getElementById('saleCreateWorkshopOrder')?.checked || false
    };

    // Guardar en estado de ventas
    state.sales.unshift(newSale);
    try {
      if (window.LG?.supabase?.createSale) {
        window.LG.supabase.createSale(newSale).catch(err => console.warn('[Supabase] Venta no guardada en nube:', err));
      }
    } catch (e) {}

    // Si se marcó orden de taller automática, generarla
    if (newSale.tallerGenerado) {
      const isUrgent = document.getElementById('saleWorkshopUrgency')?.value === 'urgente';
      const orderNum = Math.floor(1000 + Math.random() * 9000);
      const orderCode = `LGT-2026-${orderNum}`;
      
      state.orders[orderCode] = {
        code: orderCode,
        customer: customerName,
        dni: customerDocNumber,
        phone: customerPhone,
        receivedDate: `${now.getDate()} de Marzo, 2026`,
        estimatedDate: `${now.getDate() + (isUrgent ? 1 : 2)} de Marzo, 2026`,
        brand: frameName.split(' ')[0] || 'LensGroup',
        service: `${frameName} + ${lensName}`,
        treatment: lensName,
        price: total,
        cost: Math.round(total * 0.4),
        estado: 'cola',
        urgente: isUrgent,
        currentStep: 1
      };

      // Intentar sincronizar con Supabase
      try {
        if (window.LG?.supabase?.createOrder) {
          window.LG.supabase.createOrder({
            numero_ticket: orderCode,
            estado: 'cola',
            urgente: isUrgent,
            paciente: customerName,
            dni: customerDocNumber,
            telefono: customerPhone,
            montura: frameName,
            luna: lensName,
            total: total
          }).catch(() => {});
        }
      } catch (e) {}
    }

    // Descontar inventario si coincide con catálogo
    if (frameSelect) {
      const catalogArr = window.MOCK_CATALOG || [];
      const adultArr = window.MOCK_CATALOG_ADULT || [];
      const matchedFrame = catalogArr.find(f => f.id === frameSelect.value) || adultArr.find(f => f.id === frameSelect.value);
      if (matchedFrame && matchedFrame.stock > 0) {
        matchedFrame.stock -= 1;
        if (typeof window.renderCatalog === 'function') window.renderCatalog();
        if (typeof window.renderAdultCatalog === 'function') window.renderAdultCatalog();
      }
    }

    closeNewSaleModal();
    renderSales();
    if (typeof window.renderOrdersTable === 'function') window.renderOrdersTable();
    showToast(`¡${correlativo} emitido con éxito!`);

    // Abrir visualizador e impresión del comprobante de inmediato
    openInvoiceModal(newSale);
  }

  function openInvoiceModal(saleOrId) {
    let sale = saleOrId;
    if (typeof saleOrId === 'string') {
      sale = state.sales.find(s => s.id === saleOrId);
    }
    if (!sale) return;

    state.currentInvoice = sale;
    const ticketContent = document.getElementById('ticketContent');
    if (!ticketContent) return;

    const docTitle = sale.tipoDoc === 'factura' 
      ? 'FACTURA ELECTRÓNICA' 
      : sale.tipoDoc === 'nota' 
        ? 'NOTA DE VENTA' 
        : 'BOLETA DE VENTA ELECTRÓNICA';

    ticketContent.innerHTML = `
      <div class="ticket-header">
        <h4>LENS GROUP TRUJILLO S.A.C.</h4>
        <div>R.U.C. 20609502623</div>
        <div>Jr. Gamarra N° 778 Int. 12 (Galería San Antonio)</div>
        <div>Centro Histórico — Trujillo, La Libertad</div>
        <div>WhatsApp: 944 123 890</div>
        <div class="ticket-doc-box">
          ${docTitle}<br>
          <strong>${sale.correlativo}</strong>
        </div>
      </div>

      <div class="ticket-meta">
        <div><strong>FECHA EMISIÓN:</strong> ${sale.fechaCompleta || sale.fechaHora}</div>
        <div><strong>CLIENTE:</strong> ${sale.clienteNombre}</div>
        <div><strong>${sale.clienteDocTipo}:</strong> ${sale.clienteDocNumero}</div>
        ${sale.clienteDireccion ? `<div><strong>DIRECCIÓN:</strong> ${sale.clienteDireccion}</div>` : ''}
        <div><strong>MONEDA:</strong> SOLES (PEN)</div>
        <div><strong>FORMA DE PAGO:</strong> ${sale.metodoPago} (${sale.condicionPago})</div>
      </div>

      <table class="ticket-items-table">
        <thead>
          <tr>
            <th>CANT</th>
            <th>DESCRIPCIÓN</th>
            <th style="text-align: right;">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <strong>${sale.monturaNombre}</strong>
              ${sale.rx && (sale.rx.od || sale.rx.oi) ? `<div style="font-size: 10px; color: #475569;">Rx OD:${sale.rx.od || '-'} OI:${sale.rx.oi || '-'}</div>` : ''}
            </td>
            <td style="text-align: right;">S/ ${Number(sale.monturaPrecio).toFixed(2)}</td>
          </tr>
          ${sale.lunasPrecio > 0 ? `
          <tr>
            <td>1</td>
            <td>${sale.lunasNombre}</td>
            <td style="text-align: right;">S/ ${Number(sale.lunasPrecio).toFixed(2)}</td>
          </tr>` : ''}
          ${sale.descuento > 0 ? `
          <tr>
            <td></td>
            <td style="color: #dc2626;">Descuento Promocional</td>
            <td style="text-align: right; color: #dc2626;">- S/ ${Number(sale.descuento).toFixed(2)}</td>
          </tr>` : ''}
        </tbody>
      </table>

      <div class="ticket-totals">
        <div class="ticket-totals-row">
          <span>OP. GRAVADA:</span>
          <span>S/ ${Number(sale.subtotal).toFixed(2)}</span>
        </div>
        <div class="ticket-totals-row">
          <span>I.G.V. (18%):</span>
          <span>S/ ${Number(sale.igv).toFixed(2)}</span>
        </div>
        <div class="ticket-totals-row grand">
          <span>TOTAL A PAGAR:</span>
          <span>S/ ${Number(sale.total).toFixed(2)}</span>
        </div>
      </div>

      <div style="margin-top: 8px; font-size: 11px; text-align: center; font-weight: 700;">
        SON: ${sale.totalEnLetras || numeroALetras(sale.total)}
      </div>

      <div class="ticket-footer">
        <!-- Código QR Simulado SVG para validación fiscal -->
        <svg class="ticket-qr" viewBox="0 0 100 100" fill="#0f172a">
          <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
          <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
          <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
          <rect x="45" y="10" width="8" height="8" />
          <rect x="45" y="25" width="8" height="15" />
          <rect x="60" y="45" width="15" height="8" />
          <rect x="80" y="45" width="10" height="15" />
          <rect x="45" y="60" width="8" height="30" />
          <rect x="60" y="70" width="30" height="8" />
          <rect x="75" y="82" width="15" height="8" />
        </svg>
        <div>Código Hash: <strong>qL8v92H/LtG-OptTruj=${sale.correlativo.slice(-4)}</strong></div>
        <div style="margin-top: 4px;">Representación impresa de la ${docTitle}. Puede verificar su validez electrónica ante SUNAT.</div>
        <div style="margin-top: 6px; font-weight: 700;">¡Gracias por cuidar su salud visual con Lens Group!</div>
      </div>
    `;

    document.getElementById('modalInvoiceViewer')?.classList.add('active');
  }

  function closeInvoiceModal() {
    document.getElementById('modalInvoiceViewer')?.classList.remove('active');
  }

  function printCurrentInvoice() {
    window.print();
  }

  function printInvoiceById(saleId) {
    openInvoiceModal(saleId);
    setTimeout(() => window.print(), 250);
  }

  function sendInvoiceWhatsApp(saleId) {
    openInvoiceModal(saleId);
    sendCurrentInvoiceWhatsApp();
  }

  function sendCurrentInvoiceWhatsApp() {
    const sale = state.currentInvoice;
    if (!sale) return;

    const phone = (sale.clienteTelefono || '').replace(/\D/g, '');
    const cleanPhone = phone.length === 9 ? `51${phone}` : phone.length === 11 ? phone : '51944123890';

    const docTitle = sale.tipoDoc === 'factura' ? 'Factura Electrónica' : 'Boleta de Venta Electrónica';
    const msg = [
      `*LENS GROUP TRUJILLO*`,
      `Hola ${sale.clienteNombre}, adjuntamos su comprobante de pago:`,
      ``,
      `*${docTitle}:* ${sale.correlativo}`,
      `*Cliente:* ${sale.clienteNombre} (${sale.clienteDocTipo}: ${sale.clienteDocNumero})`,
      `*Fecha:* ${sale.fechaCompleta || sale.fechaHora}`,
      `--------------------------------`,
      `• Montura: ${sale.monturaNombre} (S/ ${Number(sale.monturaPrecio).toFixed(2)})`,
      sale.lunasPrecio > 0 ? `• Lunas: ${sale.lunasNombre} (S/ ${Number(sale.lunasPrecio).toFixed(2)})` : null,
      sale.descuento > 0 ? `• Descuento: - S/ ${Number(sale.descuento).toFixed(2)}` : null,
      `--------------------------------`,
      `*TOTAL PAGADO: S/ ${Number(sale.total).toFixed(2)}*`,
      `*Método de Pago:* ${sale.metodoPago}`,
      ``,
      `Sede: Jr. Gamarra N° 778 Int. 12 (Galería San Antonio), Trujillo`,
      `Consulte el estado de su orden en: https://lensgrouptrujillo.com/seguimiento.html`,
      `¡Gracias por su preferencia!`
    ].filter(Boolean).join('\n');

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  function copyInvoiceText() {
    const sale = state.currentInvoice;
    if (!sale) return;
    const text = `Comprobante: ${sale.correlativo}\nCliente: ${sale.clienteNombre}\nDoc: ${sale.clienteDocNumero}\nTotal: S/ ${sale.total.toFixed(2)}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Datos del comprobante copiados al portapapeles');
    });
  }

  function exportSalesToCsv() {
    const sales = state.sales || [];
    if (!sales.length) return showToast('No hay ventas para exportar');

    const headers = ['Comprobante', 'Tipo', 'Doc Tipo', 'Doc Numero', 'Cliente', 'Telefono', 'Montura', 'Lunas', 'Subtotal', 'IGV', 'Total', 'Metodo Pago', 'Estado', 'Fecha'];
    const rows = sales.map(s => [
      `"${s.correlativo}"`,
      `"${s.tipoDoc}"`,
      `"${s.clienteDocTipo}"`,
      `"${s.clienteDocNumero}"`,
      `"${s.clienteNombre}"`,
      `"${s.clienteTelefono || ''}"`,
      `"${s.monturaNombre}"`,
      `"${s.lunasNombre}"`,
      s.subtotal,
      s.igv,
      s.total,
      `"${s.metodoPago}"`,
      `"${s.estado}"`,
      `"${s.fechaCompleta || s.fechaHora}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ventas_LensGroup_Trujillo_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Historial de ventas exportado a CSV');
  }

  // Window Exports
  window.numeroALetras = numeroALetras;
  window.renderSales = renderSales;
  window.setSaleDocType = setSaleDocType;
  window.handleDocTypeSelectChange = handleDocTypeSelectChange;
  window.handleConsultarFiscal = handleConsultarFiscal;
  window.handleFrameSelectChange = handleFrameSelectChange;
  window.handleLensTreatmentChange = handleLensTreatmentChange;
  window.calculateNewSaleTotals = calculateNewSaleTotals;
  window.openNewSaleModal = openNewSaleModal;
  window.closeNewSaleModal = closeNewSaleModal;
  window.startSale = startSale;
  window.closeSaleModal = closeSaleModal;
  window.handleNewSaleSubmit = handleNewSaleSubmit;
  window.openInvoiceModal = openInvoiceModal;
  window.closeInvoiceModal = closeInvoiceModal;
  window.printCurrentInvoice = printCurrentInvoice;
  window.printInvoiceById = printInvoiceById;
  window.sendInvoiceWhatsApp = sendInvoiceWhatsApp;
  window.sendCurrentInvoiceWhatsApp = sendCurrentInvoiceWhatsApp;
  window.copyInvoiceText = copyInvoiceText;
  window.exportSalesToCsv = exportSalesToCsv;

})();
