/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: LENSBOT ASSISTANT MODULE
   File: js/admin/chatbot.js
   Description: Intelligent assistant (LensBot) analyzing real-time sales,
                inventory, lab orders, stock warnings, and business KPIs.
   ========================================================================== */

(function () {
  'use strict';

  function toggleChatbot() {
    const win = document.getElementById('chatbotWindow');
    if (!win) return;
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
  }

  function handleChatbotSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    // Add user message
    const msgsDiv = document.getElementById('chatbotMessages');
    if (!msgsDiv) return;

    msgsDiv.innerHTML += `
      <div style="align-self: flex-end; background: var(--admin-primary); padding: 0.75rem; border-radius: 8px 8px 0 8px; color: #fff; max-width: 85%;">
        ${msg}
      </div>
    `;
    input.value = '';
    msgsDiv.scrollTop = msgsDiv.scrollHeight;

    // Indicador de "escribiendo..."
    const typingId = 'typing-' + Date.now();
    msgsDiv.innerHTML += `
      <div id="${typingId}" style="align-self: flex-start; background: var(--admin-bg-alt); padding: 0.6rem 0.9rem; border-radius: 8px 8px 8px 0; border: 1px solid var(--admin-card-border); color: var(--admin-text-muted, #888); font-style: italic; font-size: 0.85rem;">
        LensBot está escribiendo...
      </div>
    `;
    msgsDiv.scrollTop = msgsDiv.scrollHeight;

    setTimeout(() => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      let reply;
      try {
        reply = generateBotReply(msg);
      } catch (err) {
        reply = 'Tuve un problema procesando los datos. Intenta de nuevo, por favor.';
      }

      msgsDiv.innerHTML += `
        <div style="align-self: flex-start; background: var(--admin-bg-alt); padding: 0.75rem; border-radius: 8px 8px 8px 0; border: 1px solid var(--admin-card-border); color: var(--admin-text-main); max-width: 85%; line-height: 1.45;">
          ${reply}
        </div>
      `;
      msgsDiv.scrollTop = msgsDiv.scrollHeight;
    }, 600 + Math.random() * 500);
  }

  // --------------------------------------------------------------------------
  // Motor de respuestas de LensBot (usa los datos reales del dashboard)
  // --------------------------------------------------------------------------
  const BOT_MONEY = n => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const BOT_HL = t => `<span style='color: var(--admin-accent); font-weight: bold;'>${t}</span>`;
  const BOT_NORM = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function botHas(text, words) {
    return words.some(w => text.includes(w));
  }

  function botData() {
    const orders = Object.values(state.orders && Object.keys(state.orders).length ? state.orders : (window.DEFAULT_ORDERS || {}));
    const inventory = state.inventory || window.INVENTORY_DB || [];
    const kids = window.MOCK_CATALOG || [];
    const adults = window.MOCK_CATALOG_ADULT || [];
    const revenue = orders.reduce((s, o) => s + (Number(o.price) || 0), 0);
    const cost = orders.reduce((s, o) => s + (Number(o.cost) || 0), 0);
    return { orders, inventory, kids, adults, revenue, cost, profit: revenue - cost };
  }

  function botTopBrands(orders) {
    const map = {};
    orders.forEach(o => {
      const b = o.brand || 'Otros';
      map[b] = map[b] || { brand: b, count: 0, total: 0 };
      map[b].count++;
      map[b].total += Number(o.price) || 0;
    });
    return Object.values(map).sort((a, b) => b.count - a.count || b.total - a.total);
  }

  function generateBotReply(rawMsg) {
    const t = BOT_NORM(rawMsg);
    const d = botData();
    const statusLabel = { cola: 'En cola', proceso: 'En proceso', listo: 'Listo para entrega' };

    // 1. Saludos / cortesía
    if (/^(hola|buenas|buenos|hey|hi|que tal|saludos)/.test(t)) {
      const h = new Date().getHours();
      const saludo = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
      return `${saludo} Soy <strong>LensBot</strong>. Puedo responderte sobre ventas, ganancias, lentes más vendidos, stock, órdenes, clientes, catálogo y más. ¿Qué necesitas?`;
    }
    if (botHas(t, ['gracias', 'thank'])) return '¡Con gusto! Si necesitas algo más, aquí estoy.';
    if (botHas(t, ['adios', 'chau', 'hasta luego', 'bye'])) return '¡Hasta luego! Que tengas excelentes ventas.';
    if (botHas(t, ['quien eres', 'que eres', 'como te llamas', 'tu nombre'])) {
      return 'Soy <strong>LensBot</strong>, el asistente inteligente de Lens Group Trujillo. Analizo en tiempo real las órdenes, el inventario y los catálogos del sistema.';
    }
    if (botHas(t, ['ayuda', 'que puedes', 'que sabes', 'opciones', 'comandos', 'help'])) {
      return `Puedo ayudarte con:<br>
        • <em>"ventas totales"</em>, <em>"ganancias"</em><br>
        • <em>"lentes más vendidos"</em>, <em>"mejor marca"</em><br>
        • <em>"stock crítico"</em>, <em>"inventario"</em><br>
        • <em>"órdenes pendientes"</em>, <em>"urgentes"</em>, <em>"listos"</em><br>
        • <em>"clientes"</em> o busca por nombre/DNI/código<br>
        • <em>"catálogo niños"</em>, <em>"catálogo adultos"</em><br>
        • <em>"recomendaciones"</em>, <em>"hora"</em>, <em>"fecha"</em>`;
    }

    // 2. Hora / fecha
    if (/\b(que hora|hora es|la hora)\b/.test(t)) return `Son las ${BOT_HL(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }))}.`;
    if (botHas(t, ['fecha', 'que dia es', 'dia es hoy'])) return `Hoy es ${BOT_HL(new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}.`;

    // 3. Búsqueda por código de orden o DNI
    const codeMatch = t.match(/lgt-\d{4}-\d{3,4}/);
    const dniMatch = t.match(/\b\d{8}\b/);
    if (codeMatch || dniMatch) {
      const o = d.orders.find(x => (codeMatch && BOT_NORM(x.code) === codeMatch[0]) || (dniMatch && x.dni === dniMatch[0]));
      if (o) {
        return `<strong>Orden ${o.code}</strong><br>Cliente: ${o.customer} (DNI ${o.dni})<br>Servicio: ${o.service}<br>Entrega: ${o.estimatedDate}<br>Estado: ${BOT_HL(statusLabel[o.estado] || o.estado)}${o.urgente ? ' [Urgente]' : ''}<br>Total: ${BOT_MONEY(o.price)}`;
      }
      return 'No encontré ninguna orden con ese código o DNI. Verifica el dato e inténtalo de nuevo.';
    }

    // 4. Búsqueda por nombre de cliente
    const byName = d.orders.find(o => BOT_NORM(o.customer).split(' ').some(p => p.length > 3 && t.split(/\s+/).includes(p)));
    if (byName && !botHas(t, ['marca'])) {
      return `Encontré a <strong>${byName.customer}</strong>:<br>Orden: ${byName.code}<br>Servicio: ${byName.service}<br>Estado: ${BOT_HL(statusLabel[byName.estado] || byName.estado)}<br>Teléfono: ${byName.phone}`;
    }

    // 5. Más vendidos / ranking
    if (botHas(t, ['mas vendid', 'mas se vende', 'top', 'ranking', 'popular', 'mejor marca', 'mejores', 'favorit'])) {
      const top = botTopBrands(d.orders).slice(0, 5);
      const medals = ['1.', '2.', '3.', '4.', '5.'];
      return `<strong>Lentes / marcas más vendidos:</strong><br>` +
        top.map((b, i) => `${medals[i]} ${b.brand} — ${b.count} venta(s) · ${BOT_MONEY(b.total)}`).join('<br>') +
        `<br><br>Líder: ${BOT_HL(top[0].brand)}. Puedes ver el gráfico de barras en <em>Analítica & Gráficos BI</em>.`;
    }

    // 6. Menos vendidos
    if (botHas(t, ['menos vendid', 'no se vende', 'peor'])) {
      const all = botTopBrands(d.orders);
      const low = all.slice(-3).reverse();
      return `<strong>Menor rotación:</strong><br>` + low.map(b => `• ${b.brand} — ${b.count} venta(s)`).join('<br>') +
        `<br>Considera promociones o combos para estas marcas.`;
    }

    // 7. Ganancias / utilidad / margen
    if (botHas(t, ['ganancia', 'utilidad', 'margen', 'rentab', 'beneficio', 'profit'])) {
      const margin = d.revenue ? (d.profit / d.revenue * 100).toFixed(1) : 0;
      return `<strong>Rentabilidad:</strong><br>Ingresos: ${BOT_MONEY(d.revenue)}<br>Costos: ${BOT_MONEY(d.cost)}<br>Utilidad neta: ${BOT_HL(BOT_MONEY(d.profit))}<br>Margen: <strong>${margin}%</strong>`;
    }

    // 8. Ventas / ingresos
    if (botHas(t, ['venta', 'vendi', 'ingreso', 'factur', 'dinero', 'plata', 'cuanto', 'total', 'caja', 'hoy', 'semana', 'resumen', 'mes'])) {
      const avg = d.orders.length ? d.revenue / d.orders.length : 0;
      const best = [...d.orders].sort((a, b) => b.price - a.price)[0];
      return `<strong>Resumen de ventas:</strong><br>Órdenes registradas: <strong>${d.orders.length}</strong><br>Ingresos totales: ${BOT_HL(BOT_MONEY(d.revenue))}<br>Ticket promedio: ${BOT_MONEY(avg)}<br>Venta más alta: ${best ? `${best.customer} (${BOT_MONEY(best.price)})` : '-'}`;
    }

    // 9. Órdenes por estado
    if (botHas(t, ['urgente'])) {
      const u = d.orders.filter(o => o.urgente);
      return u.length ? `<strong>Órdenes urgentes (${u.length}):</strong><br>` + u.map(o => `• ${o.code} — ${o.customer} (${statusLabel[o.estado]})`).join('<br>') : 'No hay órdenes urgentes en este momento.';
    }
    if (botHas(t, ['listo', 'entrega', 'recoger', 'terminad'])) {
      const l = d.orders.filter(o => o.estado === 'listo');
      return `<strong>Listos para entrega (${l.length}):</strong><br>` + (l.map(o => `• ${o.code} — ${o.customer} · Tel: ${o.phone}`).join('<br>') || 'Ninguno por ahora.');
    }
    if (botHas(t, ['orden', 'pedido', 'pendiente', 'proceso', 'taller', 'laboratorio', 'cola', 'trabajo'])) {
      const c = s => d.orders.filter(o => o.estado === s).length;
      return `<strong>Estado del laboratorio:</strong><br>En cola: <strong>${c('cola')}</strong><br>En proceso: <strong>${c('proceso')}</strong><br>Listos: <strong>${c('listo')}</strong><br>Urgentes: <strong>${d.orders.filter(o => o.urgente).length}</strong>`;
    }

    // 10. Clientes / pacientes
    if (botHas(t, ['cliente', 'paciente', 'persona', 'comprador'])) {
      const names = d.orders.slice(0, 6).map(o => `• ${o.customer}`).join('<br>');
      return `Tenemos <strong>${d.orders.length}</strong> clientes con órdenes registradas:<br>${names}<br>Escríbeme un nombre, DNI o código (ej. LGT-2025-0342) para ver el detalle.`;
    }

    // 11. Catálogos
    if (botHas(t, ['nino', 'nina', 'infantil', 'kids', 'junior'])) {
      const stock = d.kids.reduce((s, f) => s + f.stock, 0);
      const out = d.kids.filter(f => f.stock === 0);
      return `<strong>Catálogo de Niños:</strong><br>${d.kids.length} modelos · ${BOT_HL(stock + ' unidades')} en stock<br>` +
        d.kids.map(f => `• ${f.brand} ${f.model} — ${f.stock} u. · ${BOT_MONEY(f.price)}`).join('<br>') +
        (out.length ? `<br>Agotados: ${out.map(f => f.model).join(', ')}` : '');
    }
    if (botHas(t, ['adulto', 'dama', 'caballero', 'hombre', 'mujer'])) {
      const stock = d.adults.reduce((s, f) => s + f.stock, 0);
      const out = d.adults.filter(f => f.stock === 0);
      return `<strong>Catálogo de Adultos:</strong><br>${d.adults.length} modelos · ${BOT_HL(stock + ' unidades')} en stock<br>` +
        d.adults.map(f => `• ${f.brand} ${f.model} — ${f.stock} u. · ${BOT_MONEY(f.price)}`).join('<br>') +
        (out.length ? `<br>Agotados: ${out.map(f => f.model).join(', ')}` : '');
    }

    // 12. Stock / inventario
    if (botHas(t, ['agotad', 'critico', 'falta', 'reponer', 'comprar', 'bajo'])) {
      const crit = d.inventory.filter(i => i.stock <= i.threshold);
      return `<strong>Productos a reponer (${crit.length}):</strong><br>` +
        crit.map(i => `• ${i.brand} ${i.model} — ${i.stock}/${i.threshold} u.`).join('<br>');
    }
    if (botHas(t, ['stock', 'inventario', 'montura', 'catalogo', 'producto', 'unidades', 'existencia', 'lente', 'luna', 'cristal', 'gafa'])) {
      const total = d.inventory.reduce((s, i) => s + i.stock, 0);
      const value = d.inventory.reduce((s, i) => s + i.stock * i.cost, 0);
      const crit = d.inventory.filter(i => i.stock <= i.threshold).length;
      const kidsStock = d.kids.reduce((s, f) => s + f.stock, 0);
      const adultStock = d.adults.reduce((s, f) => s + f.stock, 0);
      return `<strong>Inventario general:</strong><br>Productos: ${d.inventory.length} · Unidades: <strong>${total}</strong><br>Valor en stock: ${BOT_HL(BOT_MONEY(value))}<br>En nivel crítico: <strong>${crit}</strong><br>Monturas niños: ${kidsStock} u. · Adultos: ${adultStock} u.`;
    }

    // 13. Precios
    if (botHas(t, ['precio', 'caro', 'barato', 'cuesta', 'vale'])) {
      const all = [...d.inventory, ...d.kids, ...d.adults];
      const sorted = [...all].sort((a, b) => b.price - a.price);
      return `Mayor precio: <strong>${sorted[0].brand} ${sorted[0].model}</strong> (${BOT_MONEY(sorted[0].price)})<br>Menor precio: <strong>${sorted.at(-1).brand} ${sorted.at(-1).model}</strong> (${BOT_MONEY(sorted.at(-1).price)})`;
    }

    // 14. Búsqueda por marca o modelo
    const allProducts = [...d.inventory, ...d.kids, ...d.adults];
    const prodHits = allProducts.filter(p => {
      const name = BOT_NORM(`${p.brand} ${p.model}`);
      return t.split(/\s+/).some(w => w.length > 3 && name.includes(w));
    });
    if (prodHits.length) {
      return `<strong>Encontré ${prodHits.length} producto(s):</strong><br>` +
        prodHits.slice(0, 6).map(p => `• ${p.brand} ${p.model} — ${p.stock} u. · ${BOT_MONEY(p.price)}`).join('<br>');
    }

    // 15. Recomendaciones / decisiones
    if (botHas(t, ['recomienda', 'consejo', 'sugerencia', 'que hago', 'decision', 'mejorar', 'estrategia', 'idea'])) {
      const crit = d.inventory.filter(i => i.stock <= i.threshold);
      const top = botTopBrands(d.orders)[0] || { brand: 'Ray-Ban' };
      return `<strong>Recomendaciones:</strong><br>1. Reponer ${crit.length} producto(s) críticos (ej. ${crit[0] ? crit[0].brand + ' ' + crit[0].model : '-'}).<br>2. Potenciar ${top.brand}, tu marca líder, con exhibición destacada.<br>3. Ofrecer combos montura + tratamiento Blue Protect para subir el ticket.<br>4. Contactar a los clientes con órdenes listas para acelerar la entrega.`;
    }

    // 16. Usuarios / personal
    if (botHas(t, ['usuario', 'personal', 'empleado', 'trabajador', 'equipo'])) {
      return `<strong>Personal:</strong><br>` + (state.users || []).map(u => `• ${u.name} — ${u.role} (${u.status})`).join('<br>');
    }

    // 17. Preguntas generales sobre ópticas
    if (botHas(t, ['miopia', 'astigmat', 'hipermetrop', 'presbicia', 'vista', 'ojo', 'vision'])) {
      return 'Para problemas visuales recomendamos un examen optométrico completo. Ofrecemos lunas monofocales, bifocales, progresivas FreeForm, fotocromáticas y con filtro Blue Protect para pantallas.';
    }
    if (botHas(t, ['horario', 'abren', 'cierran', 'direccion', 'ubicacion', 'donde'])) {
      return 'Galería San Antonio, Jr. Gamarra N° 778 – Trujillo.<br>Lunes a sábado de 9:00 a.m. a 8:00 p.m.';
    }

    // 18. Respuesta general (siempre útil, nunca "no entendí")
    const d2 = d.orders.filter(o => o.estado !== 'listo').length;
    const topBrand = botTopBrands(d.orders)[0] || { brand: 'Ray-Ban' };
    return `Buena pregunta. Te comparto un panorama rápido del negocio:<br>Ingresos: ${BOT_HL(BOT_MONEY(d.revenue))} · Utilidad: ${BOT_MONEY(d.profit)}<br>Órdenes activas: <strong>${d2}</strong><br>Marca líder: <strong>${topBrand.brand}</strong><br><br>Puedes preguntarme por ventas, ganancias, stock, clientes, órdenes, catálogo o pedirme recomendaciones.`;
  }

  // Window Exports
  window.toggleChatbot = toggleChatbot;
  window.handleChatbotSubmit = handleChatbotSubmit;
  window.generateBotReply = generateBotReply;

})();
