/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: CRM & PATIENT CARE MODULE
   File: js/admin/crm.js
   Description: Clinical patient records, optometric prescriptions (Rx),
                post-sale tracking, WhatsApp template triggers, and CSV export.
   ========================================================================== */

(function () {
  'use strict';

  function renderCRM() {
    const tbody = document.getElementById('crmTableBody');
    const patients = state.crmPatients || [];

    // 1. Calcular KPIs
    const total = patients.length;
    const listo = patients.filter(p => p.estado === 'listo').length;
    const adaptacion = patients.filter(p => p.estado === 'adaptacion').length;
    const control = patients.filter(p => p.estado === 'control').length;
    const garantia = patients.filter(p => p.estado === 'garantia').length;
    const fidelizado = patients.filter(p => p.estado === 'fidelizado').length;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('crmKpiTotal', total);
    setEl('crmKpiListo', listo);
    setEl('crmKpiAdaptacion', adaptacion);
    setEl('crmKpiControl', control);
    setEl('crmKpiGarantia', garantia);

    setEl('crmTabCountAll', total);
    setEl('crmTabCountListo', listo);
    setEl('crmTabCountAdaptacion', adaptacion);
    setEl('crmTabCountControl', control);
    setEl('crmTabCountGarantia', garantia);
    setEl('crmTabCountFidelizado', fidelizado);

    // Badge en el panel lateral
    setEl('sidebarCrmBadge', total);

    if (!tbody) return;

    // 2. Filtrar
    let list = [...patients];
    if (state.crmFilter && state.crmFilter !== 'all') {
      list = list.filter(p => p.estado === state.crmFilter);
    }

    if (state.crmSearchQuery) {
      const q = state.crmSearchQuery.toLowerCase();
      list = list.filter(p =>
        (p.nombre && p.nombre.toLowerCase().includes(q)) ||
        (p.dni && p.dni.includes(q)) ||
        (p.telefono && p.telefono.includes(q)) ||
        (p.ticket && p.ticket.toLowerCase().includes(q)) ||
        (p.montura && p.montura.toLowerCase().includes(q)) ||
        (p.lunas && p.lunas.toLowerCase().includes(q)) ||
        (p.direccion && p.direccion.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
            <div style="margin-bottom: 0.5rem; display: flex; justify-content: center;">${LG.icon('search', { size: 32, sw: 1.8 })}</div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--admin-text-main);">No se encontraron pacientes</div>
            <p style="font-size: 0.82rem; margin-top: 0.25rem;">Intenta con otro término de búsqueda o cambia la pestaña de filtro.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(p => {
      const badgeMap = {
        listo: { cls: 'crm-badge-listo', icon: '', text: 'Listo p/ Retiro' },
        adaptacion: { cls: 'crm-badge-adaptacion', icon: '', text: 'En Adaptación' },
        control: { cls: 'crm-badge-control', icon: '', text: 'Control Anual' },
        garantia: { cls: 'crm-badge-garantia', icon: '', text: 'Garantía Vigente' },
        fidelizado: { cls: 'crm-badge-fidelizado', icon: '', text: 'Fidelizado / VIP' }
      };
      const bInfo = badgeMap[p.estado] || badgeMap.listo;
      const cleanPhone = String(p.telefono || '').replace(/\D/g, '');
      const initial = (p.nombre || 'P').trim().charAt(0).toUpperCase();

      // Rx resumen
      const odRx = p.graduacion?.od ? `OD: ${p.graduacion.od.esf || '0.00'} / ${p.graduacion.od.cil || '0.00'}` : 'OD: Normal';
      const oiRx = p.graduacion?.oi ? `OI: ${p.graduacion.oi.esf || '0.00'} / ${p.graduacion.oi.cil || '0.00'}` : 'OI: Normal';

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="crm-avatar">${initial}</div>
              <div>
                <div style="font-weight: 800; color: var(--admin-text-main); font-size: 0.92rem; cursor: pointer;" onclick="openPatientRecordModal('${p.id}')">
                  ${p.nombre}
                </div>
                <div style="font-size: 0.74rem; color: var(--admin-text-muted); display: flex; gap: 0.5rem; align-items: center; margin-top: 0.15rem;">
                  <span style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">DNI: ${p.dni}</span>
                  <span>•</span>
                  <span>${p.edad ? p.edad + ' años' : 'Paciente'}</span>
                  <span>•</span>
                  <span>${p.ocupacion || 'Trujillo'}</span>
                </div>
                <div style="font-size: 0.7rem; color: var(--admin-text-dim); margin-top: 0.1rem;">
                  ${p.direccion || 'Trujillo, Perú'}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;">
              <div style="font-weight: 700; font-family: monospace; font-size: 0.86rem; color: var(--admin-text-main);">
                +51 ${p.telefono}
              </div>
              <div style="display: flex; gap: 0.35rem;">
                <button type="button" class="crm-wa-btn" onclick="sendPatientWhatsApp('${p.id}')" title="Enviar WhatsApp con plantilla personalizada">
                  ${window.LG.icon('whatsapp', { size: 14 })}
                  <span>WhatsApp</span>
                </button>
                <a href="tel:${cleanPhone}" class="btn-table-action" title="Llamar al paciente" style="padding: 0.3rem 0.5rem;">
                  ${window.LG.icon('phone', { size: 13, sw: 2 })}
                </a>
              </div>
            </div>
          </td>
          <td>
            <div style="max-width: 210px;">
              <span style="font-family: monospace; font-size: 0.72rem; font-weight: 800; color: var(--admin-accent-blue); background: rgba(2, 132, 199, 0.12); padding: 0.15rem 0.4rem; border-radius: 4px; display: inline-block; margin-bottom: 0.25rem;">
                ${p.ticket || 'TICKET'}
              </span>
              <div style="font-weight: 700; font-size: 0.84rem; color: var(--admin-text-main); line-height: 1.25;">
                ${p.montura}
              </div>
              <div style="font-size: 0.74rem; color: var(--admin-text-muted); margin-top: 0.2rem; line-height: 1.3;">
                ${p.lunas}
              </div>
            </div>
          </td>
          <td>
            <div class="crm-prescription-box" onclick="openPatientRecordModal('${p.id}')" style="cursor: pointer;" title="Clic para ver receta completa">
              <span style="color: #38bdf8;">${odRx}</span>
              <span style="color: #818cf8;">${oiRx}</span>
              ${p.graduacion?.add ? `<span style="color: #34d399; font-size: 0.7rem;">ADD: ${p.graduacion.add}</span>` : ''}
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;">
              <span class="crm-badge ${bInfo.cls}">
                <span>${bInfo.icon}</span>
                <span>${bInfo.text}</span>
              </span>
              <select class="select-state" onchange="updatePatientStatus('${p.id}', this.value)" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; width: 135px;">
                <option value="listo" ${p.estado === 'listo' ? 'selected' : ''}>Listo p/ Retiro</option>
                <option value="adaptacion" ${p.estado === 'adaptacion' ? 'selected' : ''}>En Adaptación</option>
                <option value="control" ${p.estado === 'control' ? 'selected' : ''}>Control Anual</option>
                <option value="garantia" ${p.estado === 'garantia' ? 'selected' : ''}>Garantía</option>
                <option value="fidelizado" ${p.estado === 'fidelizado' ? 'selected' : ''}>Fidelizado</option>
              </select>
            </div>
          </td>
          <td>
            <div style="font-size: 0.78rem; color: var(--admin-text-main); line-height: 1.35; max-width: 220px;">
              ${p.notaSeguimiento || 'Sin notas registradas.'}
            </div>
            <div style="font-size: 0.7rem; color: var(--admin-text-dim); margin-top: 0.25rem;">
              Revisión: <strong style="color: var(--admin-primary);">${p.proximaRevision || 'Anual'}</strong>
            </div>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
              <button type="button" class="btn-table-action" onclick="openPatientRecordModal('${p.id}')" title="Ver Historial Clínico Completo">
                ${window.LG.icon('fileText', { size: 14, sw: 2 })}
                <span>Ficha</span>
              </button>
              <button type="button" class="btn-table-action" onclick="openAddInteractionModal('${p.id}')" title="Registrar Nota de Contacto">
                ${window.LG.icon('plus', { size: 13, sw: 2.5 })}
                <span>+ Nota</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updatePatientStatus(patientId, newStatus) {
    const p = (state.crmPatients || []).find(x => x.id === patientId);
    if (!p) return;

    const names = {
      listo: 'Listo p/ Retiro',
      adaptacion: 'En Adaptación',
      control: 'Control Anual',
      garantia: 'Garantía Vigente',
      fidelizado: 'Fidelizado / VIP'
    };

    p.estado = newStatus;
    p.estadoTexto = names[newStatus] || newStatus;

    if (!p.timeline) p.timeline = [];
    const now = new Date();
    const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    p.timeline.unshift({
      fecha: fechaStr,
      tipo: 'estado',
      autor: state.session?.name || 'Staff Óptico',
      detalle: `Estado CRM actualizado a: "${p.estadoTexto}".`
    });

    renderCRM();
    showToast(`Estado de ${p.nombre} cambiado a: ${p.estadoTexto}`);
  }

  function sendPatientWhatsApp(patientId, templateKey) {
    const p = (state.crmPatients || []).find(x => x.id === patientId);
    if (!p) return;

    const tKey = templateKey || p.estado || 'listo';
    const cleanPhone = String(p.telefono || '').replace(/\D/g, '');
    const firstName = p.nombre.split(' ')[0] || p.nombre;

    const templates = {
      listo: `¡Hola ${firstName}! Te saludamos de Lens Group Trujillo.\nTe informamos que tus lentes con montura *${p.montura}* y lunas *${p.lunas}* ya se encuentran calibrados y listos en nuestra sede de Jr. Gamarra 778 (Galería San Antonio, Trujillo).\n¡Puedes pasar a recogerlos cuando gustes! Quedamos atentos para atenderte.`,
      adaptacion: `¡Hola ${firstName}! Te saluda el equipo de Lens Group Trujillo.\nQueremos saber cómo te has sentido con tus nuevas lunas *${p.lunas}*. Recuerda que si necesitas algún ajuste en las plaquetas o calibración de la montura, puedes visitarnos en Jr. Gamarra 778 sin ningún costo. ¡Tu confort visual es nuestra prioridad!`,
      control: `¡Hola ${firstName}! Esperamos que te encuentres muy bien. Te escribimos de Lens Group Trujillo.\nRevisando tu historial óptico, ha transcurrido un año desde tu última graduación. Te invitamos a una reevaluación optométrica preventiva gratuita en nuestra sede de Jr. Gamarra 778 para verificar tu agudeza visual. ¿Te gustaría agendar tu cita esta semana?`,
      garantia: `¡Hola ${firstName}! En Lens Group Trujillo te recordamos que tu montura *${p.montura}* cuenta con garantía activa hasta el *${p.fechaGarantia || '2027'}*.\nPuedes visitarnos cuando desees para tu servicio gratuito de limpieza ultrasónica y ajuste de tornillos. ¡Te esperamos en Jr. Gamarra 778!`,
      fidelizado: `¡Hola ${firstName}! Gracias por confiar tu salud visual en Lens Group Trujillo.\nPor ser un paciente preferencial, este mes cuentas con un beneficio exclusivo del 20% de descuento en gafas de sol polarizadas o para un familiar directo. ¡Pregúntanos por los nuevos modelos de catálogo!`
    };

    const text = templates[tKey] || templates.listo;

    if (!p.timeline) p.timeline = [];
    const now = new Date();
    const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    p.timeline.unshift({
      fecha: fechaStr,
      tipo: 'whatsapp',
      autor: state.session?.name || 'CRM WhatsApp',
      detalle: `Mensaje de WhatsApp enviado (${tKey.toUpperCase()}) al +51 ${p.telefono}.`
    });

    const waUrl = `https://api.whatsapp.com/send?phone=51${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    showToast(`Abriendo WhatsApp para ${firstName}...`);
    renderCRM();
  }

  function openPatientRecordModal(patientId) {
    const p = (state.crmPatients || []).find(x => x.id === patientId);
    if (!p) return;

    let modal = document.getElementById('modalPatientRecord');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalPatientRecord';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const od = p.graduacion?.od || { esf: '-', cil: '-', eje: '-', av: '-' };
    const oi = p.graduacion?.oi || { esf: '-', cil: '-', eje: '-', av: '-' };
    const add = p.graduacion?.add || 'No requiere';
    const dp = p.graduacion?.dp || 'Normal';
    const diag = p.graduacion?.diagnostico || 'Evaluación optométrica estándar.';

    const timelineHtml = (p.timeline || []).map(t => `
      <div class="crm-timeline-item">
        <div class="crm-timeline-dot"></div>
        <div class="crm-timeline-header">
          <span class="crm-timeline-badge">${t.tipo}</span>
          <span>${t.fecha}</span>
          <span style="color: var(--admin-primary); font-weight: 700;">${t.autor || 'Staff'}</span>
        </div>
        <div style="color: var(--admin-text-main); font-size: 0.84rem; line-height: 1.4; margin-top: 0.2rem;">
          ${t.detalle}
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 720px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="crm-avatar" style="width: 42px; height: 42px; font-size: 1.1rem;">${p.nombre.charAt(0)}</div>
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--admin-text-main);">${p.nombre}</h3>
              <span style="font-size: 0.78rem; color: var(--admin-text-muted);">Ficha Clínica Oftalmológica &amp; Historial CRM</span>
            </div>
          </div>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('modalPatientRecord').classList.remove('active')">&times;</button>
        </div>

        <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- DATOS PERSONALES -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; background: rgba(15, 23, 42, 0.4); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border); font-size: 0.82rem;">
            <div><strong style="color: var(--admin-text-dim);">DNI:</strong> <span style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">${p.dni}</span></div>
            <div><strong style="color: var(--admin-text-dim);">Celular / WhatsApp:</strong> +51 ${p.telefono}</div>
            <div><strong style="color: var(--admin-text-dim);">Edad / Género:</strong> ${p.edad} años (${p.genero === 'F' ? 'Femenino' : 'Masculino'})</div>
            <div><strong style="color: var(--admin-text-dim);">Ocupación:</strong> ${p.ocupacion}</div>
            <div style="grid-column: 1 / -1;"><strong style="color: var(--admin-text-dim);">Dirección:</strong> ${p.direccion}</div>
          </div>

          <!-- CUADRO DE REFRACCIÓN / RECETA ÓPTICA -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
              <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--admin-text-main);">Prescripción Optométrica</h4>
              <span style="font-size: 0.72rem; color: var(--admin-accent-blue); font-weight: 700;">Ticket: ${p.ticket}</span>
            </div>
            <table class="crm-rx-table">
              <thead>
                <tr>
                  <th>Ojo</th>
                  <th>Esfera (ESF)</th>
                  <th>Cilindro (CIL)</th>
                  <th>Eje (EJE)</th>
                  <th>Agudeza Visual (AV)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 800; color: #38bdf8;">OD (Derecho)</td>
                  <td>${od.esf}</td>
                  <td>${od.cil}</td>
                  <td>${od.eje}</td>
                  <td>${od.av}</td>
                </tr>
                <tr>
                  <td style="font-weight: 800; color: #818cf8;">OI (Izquierdo)</td>
                  <td>${oi.esf}</td>
                  <td>${oi.cil}</td>
                  <td>${oi.eje}</td>
                  <td>${oi.av}</td>
                </tr>
              </tbody>
            </table>
            <div style="display: flex; gap: 1rem; font-size: 0.8rem; background: rgba(2, 6, 23, 0.4); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border); flex-wrap: wrap;">
              <div><strong>Adición (ADD):</strong> <span style="color: #34d399; font-weight: 700;">${add}</span></div>
              <div><strong>Distancia Pupilar (DP):</strong> <span style="color: #38bdf8; font-weight: 700;">${dp}</span></div>
              <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.4rem; color: var(--admin-text-muted);">
                <strong>Diagnóstico:</strong> ${diag}
              </div>
            </div>
          </div>

          <!-- DETALLES DEL PRODUCTO Y GARANTÍA -->
          <div style="background: rgba(13, 148, 136, 0.08); border: 1px solid rgba(13, 148, 136, 0.25); border-radius: var(--radius-sm); padding: 0.9rem; font-size: 0.82rem;">
            <div style="font-weight: 800; color: var(--admin-active-text); margin-bottom: 0.4rem;">Montura &amp; Lunas Adquiridas</div>
            <div><strong>Montura:</strong> ${p.montura}</div>
            <div style="margin-top: 0.2rem;"><strong>Lunas / Tratamiento:</strong> ${p.lunas}</div>
            <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem; font-size: 0.78rem; border-top: 1px dashed rgba(13, 148, 136, 0.2); padding-top: 0.4rem;">
              <div>Garantía hasta: <strong>${p.fechaGarantia}</strong></div>
              <div>Próximo control anual: <strong style="color: var(--admin-accent-amber);">${p.proximaRevision}</strong></div>
            </div>
          </div>

          <!-- BITÁCORA DE SEGUIMIENTO (TIMELINE) -->
          <div>
            <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--admin-text-main); margin-bottom: 0.5rem;">
              Bitácora de Contactos &amp; Postventa
            </h4>
            <div class="crm-timeline">
              ${timelineHtml}
            </div>

            <!-- FORMULARIO AGREGAR INTERACCIÓN -->
            <div style="margin-top: 1rem; background: rgba(15, 23, 42, 0.6); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border);">
              <div style="font-weight: 700; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--admin-text-main);">+ Registrar Nueva Interacción / Nota</div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <select id="modalAddType_${p.id}" class="form-input" style="max-width: 150px; font-size: 0.8rem; padding: 0.4rem;">
                  <option value="whatsapp">WhatsApp</option>
                  <option value="llamada">Llamada</option>
                  <option value="tienda">Visita Tienda</option>
                  <option value="taller">Taller / Ajuste</option>
                  <option value="clinica">Control Médico</option>
                </select>
                <input type="text" id="modalAddText_${p.id}" class="form-input" placeholder="Detalle de la llamada, ajuste o mensaje..." style="flex: 1; font-size: 0.8rem; padding: 0.4rem;">
                <button type="button" class="btn-primary-action" onclick="submitPatientNote('${p.id}')" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                  Guardar Nota
                </button>
              </div>
            </div>
          </div>

          <!-- ACCIONES RÁPIDAS -->
          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--admin-card-border); padding-top: 1rem;">
            <button type="button" class="crm-wa-btn" onclick="sendPatientWhatsApp('${p.id}')" style="padding: 0.5rem 1rem;">
              ${window.LG.icon('whatsapp', { size: 16 })}
              <span>Contactar por WhatsApp</span>
            </button>
            <button type="button" class="btn-header-action" onclick="openCrmTemplatesModal('${p.id}')">
              ${window.LG.icon('chat', { size: 15 })}
              <span>Ver Plantillas</span>
            </button>
            <button type="button" class="btn-header-action" onclick="document.getElementById('modalPatientRecord').classList.remove('active')">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    }, { once: false });
  }

  function submitPatientNote(patientId) {
    const p = (state.crmPatients || []).find(x => x.id === patientId);
    if (!p) return;

    const typeEl = document.getElementById(`modalAddType_${patientId}`);
    const textEl = document.getElementById(`modalAddText_${patientId}`);
    const text = textEl ? textEl.value.trim() : '';

    if (!text) {
      showToast('Escriba el detalle de la interacción antes de guardar');
      return;
    }

    const type = typeEl ? typeEl.value : 'nota';
    if (!p.timeline) p.timeline = [];
    const now = new Date();
    const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

    p.timeline.unshift({
      fecha: fechaStr,
      tipo: type,
      autor: state.session?.name || 'Staff Óptico',
      detalle: text
    });
    p.notaSeguimiento = text;

    showToast('Nota guardada en el historial del paciente');
    renderCRM();
    openPatientRecordModal(patientId);
  }

  function openAddInteractionModal(patientId) {
    openPatientRecordModal(patientId);
    setTimeout(() => {
      const input = document.getElementById(`modalAddText_${patientId}`);
      if (input) input.focus();
    }, 100);
  }

  function openNewPatientModal() {
    let modal = document.getElementById('modalNewPatientCRM');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalNewPatientCRM';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const randomTicket = `LGT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--admin-text-main);">Registrar Nuevo Paciente en CRM</h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('modalNewPatientCRM').classList.remove('active')">&times;</button>
        </div>

        <form id="formNewPatientCRM" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <!-- DNI Y RENIEC -->
          <div style="background: rgba(13, 148, 136, 0.08); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(13, 148, 136, 0.2);">
            <label class="form-label" style="font-weight: 800; color: var(--admin-active-text);">Documento de Identidad (RENIEC)</label>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.35rem;">
              <input type="text" id="newPatDni" class="form-input" placeholder="DNI de 8 dígitos (ej. 45892147)" maxlength="8" style="flex: 1; font-family: monospace;" required>
              <button type="button" class="btn-primary-action" id="btnQueryReniecPat" style="padding: 0 1rem;">
                <span>Consultar RENIEC</span>
              </button>
            </div>
          </div>

          <!-- DATOS PERSONALES -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">Nombres y Apellidos Completos *</label>
              <input type="text" id="newPatNombre" class="form-input" placeholder="Ej. Ana Lucía Morales Chávez" required>
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono Celular / WhatsApp *</label>
              <input type="tel" id="newPatTelefono" class="form-input" placeholder="944123890" maxlength="9" required>
            </div>
            <div class="form-group">
              <label class="form-label">Edad (años)</label>
              <input type="number" id="newPatEdad" class="form-input" placeholder="Ej. 28" min="1" max="110">
            </div>
            <div class="form-group">
              <label class="form-label">Ocupación</label>
              <input type="text" id="newPatOcupacion" class="form-input" placeholder="Ej. Diseñadora, Médico, Estudiante">
            </div>
            <div class="form-group">
              <label class="form-label">Dirección / Distrito en Trujillo</label>
              <input type="text" id="newPatDireccion" class="form-input" placeholder="Ej. Urb. California, Trujillo">
            </div>
          </div>

          <!-- GRADUACIÓN ÓPTICA -->
          <div style="border-top: 1px solid var(--admin-card-border); padding-top: 0.75rem;">
            <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--admin-text-main); margin-bottom: 0.5rem;">Medida de la Vista (Refracción)</h4>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; background: rgba(15, 23, 42, 0.4); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border); font-size: 0.8rem;">
              <div style="grid-column: 1 / -1; font-weight: 700; color: #38bdf8;">Ojo Derecho (OD):</div>
              <input type="text" id="newPatOdEsf" class="form-input" placeholder="Esf (ej. -1.50)">
              <input type="text" id="newPatOdCil" class="form-input" placeholder="Cil (ej. -0.50)">
              <input type="text" id="newPatOdEje" class="form-input" placeholder="Eje (ej. 90°)">
              <input type="text" id="newPatOdAv" class="form-input" placeholder="AV (ej. 20/20)">

              <div style="grid-column: 1 / -1; font-weight: 700; color: #818cf8; margin-top: 0.35rem;">Ojo Izquierdo (OI):</div>
              <input type="text" id="newPatOiEsf" class="form-input" placeholder="Esf (ej. -1.75)">
              <input type="text" id="newPatOiCil" class="form-input" placeholder="Cil (ej. -0.50)">
              <input type="text" id="newPatOiEje" class="form-input" placeholder="Eje (ej. 85°)">
              <input type="text" id="newPatOiAv" class="form-input" placeholder="AV (ej. 20/20)">

              <div style="grid-column: span 2; margin-top: 0.35rem;">
                <label class="form-label">Adición (ADD)</label>
                <input type="text" id="newPatAdd" class="form-input" placeholder="Ej. +1.50 (Opcional)">
              </div>
              <div style="grid-column: span 2; margin-top: 0.35rem;">
                <label class="form-label">Distancia Pupilar (DP)</label>
                <input type="text" id="newPatDp" class="form-input" placeholder="Ej. 62 mm">
              </div>
            </div>
          </div>

          <!-- PRODUCTO & ESTADO CRM -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; border-top: 1px solid var(--admin-card-border); padding-top: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Ticket Asociado</label>
              <input type="text" id="newPatTicket" class="form-input" value="${randomTicket}">
            </div>
            <div class="form-group">
              <label class="form-label">Etapa CRM Inicial *</label>
              <select id="newPatEstado" class="form-input" required>
                <option value="listo">Listo p/ Retiro en Tienda</option>
                <option value="adaptacion" selected>En Adaptación (1 a 15 días)</option>
                <option value="control">Control Anual / Cita</option>
                <option value="garantia">En Garantía</option>
                <option value="fidelizado">Fidelizado / VIP</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Montura</label>
              <input type="text" id="newPatMontura" class="form-input" placeholder="Ej. Ray-Ban Wayfarer Classic" required>
            </div>
            <div class="form-group">
              <label class="form-label">Lunas &amp; Tratamientos</label>
              <input type="text" id="newPatLunas" class="form-input" placeholder="Ej. Antirreflejo HD Blue Protect UV420" required>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">Nota Inicial de Seguimiento</label>
              <input type="text" id="newPatNota" class="form-input" placeholder="Ej. Paciente requiere llamada a los 5 días para verificar confort con lunas">
            </div>
          </div>

          <button type="submit" class="btn-primary-action" style="padding: 0.85rem; justify-content: center; font-weight: 800; margin-top: 0.5rem;">
            Guardar Paciente en el CRM
          </button>
        </form>
      </div>
    `;

    // Listener RENIEC
    const btnReniec = document.getElementById('btnQueryReniecPat');
    if (btnReniec) {
      btnReniec.addEventListener('click', async () => {
        const dni = document.getElementById('newPatDni')?.value.trim();
        if (!dni || dni.length !== 8) {
          showToast('Ingrese un DNI válido de 8 dígitos');
          return;
        }
        btnReniec.textContent = 'Consultando...';
        try {
          const info = await (window.LG?.consultarDNI || window.LG?.fiscal?.consultarDNI)(dni);
          if (info && info.nombreCompleto) {
            document.getElementById('newPatNombre').value = info.nombreCompleto;
            showToast(`Datos RENIEC encontrados: ${info.nombreCompleto}`);
          } else {
            showToast('No se encontró el DNI en RENIEC. Ingréselo manualmente.');
          }
        } catch (err) {
          showToast('No se pudo conectar al servicio RENIEC. Ingréselo manualmente.');
        } finally {
          btnReniec.textContent = 'Consultar RENIEC';
        }
      });
    }

    // Listener submit
    const form = document.getElementById('formNewPatientCRM');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const dni = document.getElementById('newPatDni').value.trim();
        const nombre = document.getElementById('newPatNombre').value.trim();
        const telefono = document.getElementById('newPatTelefono').value.trim();
        const edad = parseInt(document.getElementById('newPatEdad').value, 10) || 30;
        const ocupacion = document.getElementById('newPatOcupacion').value.trim() || 'Particular';
        const direccion = document.getElementById('newPatDireccion').value.trim() || 'Trujillo';
        const ticket = document.getElementById('newPatTicket').value.trim() || randomTicket;
        const estado = document.getElementById('newPatEstado').value;
        const montura = document.getElementById('newPatMontura').value.trim();
        const lunas = document.getElementById('newPatLunas').value.trim();
        const nota = document.getElementById('newPatNota').value.trim() || 'Paciente registrado en el CRM.';

        const odEsf = document.getElementById('newPatOdEsf').value.trim() || '0.00';
        const odCil = document.getElementById('newPatOdCil').value.trim() || '0.00';
        const odEje = document.getElementById('newPatOdEje').value.trim() || '0°';
        const odAv = document.getElementById('newPatOdAv').value.trim() || '20/20';

        const oiEsf = document.getElementById('newPatOiEsf').value.trim() || '0.00';
        const oiCil = document.getElementById('newPatOiCil').value.trim() || '0.00';
        const oiEje = document.getElementById('newPatOiEje').value.trim() || '0°';
        const oiAv = document.getElementById('newPatOiAv').value.trim() || '20/20';

        const addVal = document.getElementById('newPatAdd').value.trim() || null;
        const dpVal = document.getElementById('newPatDp').value.trim() || '62 mm';

        const names = {
          listo: 'Listo p/ Retiro',
          adaptacion: 'En Adaptación',
          control: 'Control Anual',
          garantia: 'Garantía Vigente',
          fidelizado: 'Fidelizado / VIP'
        };

        const now = new Date();
        const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

        const newPat = {
          id: `crm-pat-${Date.now()}`,
          dni,
          nombre,
          edad,
          genero: 'M',
          telefono,
          direccion,
          ocupacion,
          ticket,
          montura,
          lunas,
          graduacion: {
            od: { esf: odEsf, cil: odCil, eje: odEje, av: odAv },
            oi: { esf: oiEsf, cil: oiCil, eje: oiEje, av: oiAv },
            add: addVal,
            dp: dpVal,
            diagnostico: 'Evaluación optométrica y adaptación de fórmula visual.'
          },
          estado,
          estadoTexto: names[estado] || estado,
          fechaEntrega: now.toLocaleDateString('es-PE'),
          fechaGarantia: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear() + 1}`,
          proximaRevision: `${now.getMonth() + 1}/${now.getFullYear() + 1}`,
          notaSeguimiento: nota,
          timeline: [
            {
              fecha: fechaStr,
              tipo: 'registro',
              autor: state.session?.name || 'Staff Óptico',
              detalle: `Paciente dado de alta en CRM con estado "${names[estado]}".`
            }
          ]
        };

        state.crmPatients.unshift(newPat);
        modal.classList.remove('active');
        renderCRM();
        showToast(`Paciente ${nombre} registrado con éxito en el CRM`);
      });
    }

    modal.classList.add('active');
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    }, { once: false });
  }

  function openCrmTemplatesModal(patientId) {
    let modal = document.getElementById('modalCrmTemplates');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalCrmTemplates';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const patients = state.crmPatients || [];
    const selectedPatient = (patientId && patients.find(p => p.id === patientId)) || patients[0] || {
      id: 'pat-def',
      nombre: 'Paciente Ejemplo',
      telefono: '944123890',
      montura: 'Montura Ray-Ban Classic',
      lunas: 'Lunas Antirreflejo UV400'
    };

    const getMsg = (key, p) => {
      const fn = (p.nombre || 'estimado(a) paciente').split(' ')[0];
      switch (key) {
        case 'listo':
          return `¡Hola ${fn}! Te saludamos de Lens Group Trujillo.\nTe informamos que tus lentes con montura *${p.montura}* y lunas *${p.lunas}* ya se encuentran calibrados y listos en nuestra sede de Jr. Gamarra 778 (Galería San Antonio, Trujillo).\n¡Puedes pasar a recogerlos cuando gustes! Quedamos atentos para atenderte.`;
        case 'adaptacion':
          return `¡Hola ${fn}! Te saluda el equipo de Lens Group Trujillo.\nQueremos saber cómo te has sentido con tus nuevas lunas *${p.lunas}*. Recuerda que si necesitas algún ajuste en las plaquetas o calibración de la montura, puedes visitarnos en Jr. Gamarra 778 sin costo alguno. ¡Tu confort visual es nuestra prioridad!`;
        case 'control':
          return `¡Hola ${fn}! Esperamos que te encuentres muy bien. Te escribimos de Lens Group Trujillo.\nRevisando tu historial óptico, ha transcurrido un año desde tu última graduación. Te invitamos a una reevaluación optométrica preventiva gratuita en nuestra sede de Jr. Gamarra 778 para verificar tu agudeza visual. ¿Te gustaría agendar tu cita esta semana?`;
        case 'garantia':
          return `¡Hola ${fn}! En Lens Group Trujillo te recordamos que tu montura *${p.montura}* cuenta con garantía activa hasta el *${p.fechaGarantia || '2027'}*.\nPuedes visitarnos cuando desees para tu servicio gratuito de limpieza ultrasónica y ajuste de tornillos. ¡Te esperamos en Jr. Gamarra 778!`;
        case 'fidelizado':
          return `¡Hola ${fn}! Gracias por confiar tu salud visual en Lens Group Trujillo.\nPor ser un paciente preferencial, este mes cuentas con un beneficio exclusivo del 20% de descuento en gafas de sol polarizadas o para un familiar directo. ¡Pregúntanos por los nuevos modelos de catálogo!`;
        default:
          return '';
      }
    };

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 620px;">
        <div class="modal-header">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--admin-text-main);">Plantillas Oficiales de WhatsApp CRM</h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('modalCrmTemplates').classList.remove('active')">&times;</button>
        </div>

        <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Seleccionar Paciente Destinatario:</label>
            <select id="tplPatientSelect" class="form-input">
              ${patients.map(p => `<option value="${p.id}" ${p.id === selectedPatient.id ? 'selected' : ''}>${p.nombre} — DNI ${p.dni} (${p.telefono})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Tipo de Notificación:</label>
            <select id="tplTypeSelect" class="form-input">
              <option value="listo">1. Notificación de Entrega / Lentes Listos en Tienda</option>
              <option value="adaptacion">2. Seguimiento Postventa / Adaptación y Confort Visual</option>
              <option value="control">3. Recordatorio de Examen Preventivo Anual (1 Año)</option>
              <option value="garantia">4. Garantía Activa / Limpieza Ultrasónica Gratuita</option>
              <option value="fidelizado">5. Promoción de Fidelización / Beneficio VIP</option>
            </select>
          </div>

          <div>
            <label class="form-label">Vista Previa del Mensaje Personalizado:</label>
            <div style="background: #0b141a; border-radius: 12px; padding: 1rem; border: 1px solid rgba(255,255,255,0.08); margin-top: 0.35rem;">
              <div style="background: #005c4b; color: #e9edef; padding: 0.85rem 1rem; border-radius: 8px 8px 0 8px; font-size: 0.85rem; line-height: 1.45; white-space: pre-wrap;" id="tplPreviewText"></div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem;">
            <button type="button" class="btn-header-action" id="btnCopyTpl">
              ${window.LG.icon('fileText', { size: 15 })}
              <span>Copiar Texto</span>
            </button>
            <button type="button" class="crm-wa-btn" id="btnLaunchWa" style="padding: 0.6rem 1.25rem;">
              ${window.LG.icon('whatsapp', { size: 16 })}
              <span>Abrir en WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const selPat = document.getElementById('tplPatientSelect');
    const selType = document.getElementById('tplTypeSelect');
    const prevText = document.getElementById('tplPreviewText');

    const updatePreview = () => {
      const p = patients.find(x => x.id === selPat.value) || selectedPatient;
      const t = selType.value;
      prevText.textContent = getMsg(t, p);
    };

    selPat.addEventListener('change', updatePreview);
    selType.addEventListener('change', updatePreview);
    updatePreview();

    document.getElementById('btnCopyTpl').addEventListener('click', () => {
      navigator.clipboard.writeText(prevText.textContent).then(() => {
        showToast('Mensaje copiado al portapapeles');
      });
    });

    document.getElementById('btnLaunchWa').addEventListener('click', () => {
      const p = patients.find(x => x.id === selPat.value) || selectedPatient;
      const t = selType.value;
      sendPatientWhatsApp(p.id, t);
      modal.classList.remove('active');
    });

    modal.classList.add('active');
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    }, { once: false });
  }

  function exportCrmCsv() {
    const patients = state.crmPatients || [];
    const rows = [
      ['DNI', 'Paciente', 'Celular', 'Edad', 'Ocupacion', 'Direccion', 'Ticket', 'Montura', 'Lunas', 'OD_Esf', 'OD_Cil', 'OD_Eje', 'OI_Esf', 'OI_Cil', 'OI_Eje', 'ADD', 'DP', 'Diagnostico', 'Estado_CRM', 'Proxima_Revision', 'Garantia_Hasta'],
      ...patients.map(p => [
        p.dni,
        `"${p.nombre}"`,
        p.telefono,
        p.edad || '',
        `"${p.ocupacion || ''}"`,
        `"${p.direccion || ''}"`,
        p.ticket || '',
        `"${p.montura || ''}"`,
        `"${p.lunas || ''}"`,
        p.graduacion?.od?.esf || '',
        p.graduacion?.od?.cil || '',
        p.graduacion?.od?.eje || '',
        p.graduacion?.oi?.esf || '',
        p.graduacion?.oi?.cil || '',
        p.graduacion?.oi?.eje || '',
        p.graduacion?.add || '',
        p.graduacion?.dp || '',
        `"${p.graduacion?.diagnostico || ''}"`,
        `"${p.estadoTexto || p.estado}"`,
        `"${p.proximaRevision || ''}"`,
        `"${p.fechaGarantia || ''}"`
      ])
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `crm_pacientes_lens_group_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Cartera de pacientes exportada como CSV');
  }

  // Window Exports
  window.renderCRM = renderCRM;
  window.updatePatientStatus = updatePatientStatus;
  window.sendPatientWhatsApp = sendPatientWhatsApp;
  window.openPatientRecordModal = openPatientRecordModal;
  window.submitPatientNote = submitPatientNote;
  window.openAddInteractionModal = openAddInteractionModal;
  window.openNewPatientModal = openNewPatientModal;
  window.openCrmTemplatesModal = openCrmTemplatesModal;
  window.exportCrmCsv = exportCrmCsv;

})();
