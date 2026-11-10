/* ==========================================================================
   LENS GROUP TRUJILLO — CLIENTE NATIVO DE SUPABASE (BROWSER / REST)
   --------------------------------------------------------------------------
   Conexión directa desde JavaScript del navegador hacia la API de Supabase:
   - No requiere servidor Node ni dependencias pesadas.
   - Funciona en GitHub Pages, Vercel, hosting estático o con doble clic local.
   - Sincroniza en tiempo real:
       * Órdenes de laboratorio y estado de tickets para seguimiento.
       * Catálogo de monturas y stock de inventario.
       * Autenticación institucional y gestión de usuarios.
       * Registro de ventas, comprobantes y kardex.
       * Registro de citas y prospectos de pacientes.
   ========================================================================== */
(function () {
  'use strict';

  const LG = (window.LG = window.LG || {});

  const CONFIG = {
    url: 'https://rsjondlejagmnjrmbolf.supabase.co',
    anonKey: 'sb_publishable_A86Q2r3lrF6z14HunWuuwQ_Y-G8ziVV'
  };

  /**
   * Petición REST directa a Supabase PostgREST API
   */
  async function supabaseRequest(endpoint, options = {}) {
    if (!CONFIG.url || !CONFIG.anonKey) {
      throw new Error('Supabase no está configurado');
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${CONFIG.url}/rest/v1/${cleanEndpoint}`;

    const headers = {
      apikey: CONFIG.anonKey,
      Authorization: `Bearer ${CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (options.method === 'POST' || options.method === 'PATCH') {
      if (!headers['Prefer']) {
        headers['Prefer'] = 'return=representation';
      }
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg = data?.message || data?.error || `Error ${response.status} en Supabase`;
      throw new Error(msg);
    }

    return data;
  }

  // ========================================================================
  // 1. API DE ÓRDENES Y SEGUIMIENTO (LABORATORIO)
  // ========================================================================

  async function getOrders() {
    try {
      const rows = await supabaseRequest('ordenes_laboratorio?select=*,ventas(*)&order=creado_en.desc');
      if (!Array.isArray(rows) || rows.length === 0) return null;

      const map = {};
      rows.forEach((o) => {
        const ticket = o.numero_ticket;
        if (!ticket) return;

        let step = 1;
        const est = String(o.estado || '').toLowerCase();
        if (est.includes('cola')) step = 1;
        else if (est.includes('proceso') || est.includes('taller')) step = 2;
        else if (est.includes('listo') || est.includes('recojo')) step = 3;
        else if (est.includes('entregado')) step = 4;

        map[ticket] = {
          code: ticket,
          customer: o.ventas?.paciente_nombre || o.notas_taller || 'Paciente Lens Group',
          dni: o.ventas?.paciente_dni || '',
          phone: o.ventas?.paciente_telefono || '',
          brand: o.ventas?.montura_marca || '',
          service: o.ventas?.montura_descripcion || 'Montura y cristales oftálmicos',
          treatment: o.ventas?.luna_descripcion || 'Tratamiento óptico computarizado',
          price: Number(o.ventas?.precio_total) || 0,
          cost: Number(o.ventas?.costo_total) || 0,
          estado: o.estado || 'En Cola',
          urgente: Boolean(o.urgente),
          currentStep: step,
          receivedDate: o.creado_en ? new Date(o.creado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Reciente',
          estimatedDate: o.completado_en ? new Date(o.completado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Coordinado en tienda'
        };
      });

      return map;
    } catch (err) {
      console.warn('[LGSupabase] No se pudieron cargar órdenes de Supabase:', err.message);
      return null;
    }
  }

  async function getOrderByCode(code) {
    if (!code) return null;
    const cleanCode = String(code).trim().toUpperCase();

    try {
      const rows = await supabaseRequest(
        `ordenes_laboratorio?numero_ticket=eq.${encodeURIComponent(cleanCode)}&select=*,ventas(*)&limit=1`
      );

      if (!rows || rows.length === 0) return null;
      const o = rows[0];

      let step = 1;
      const est = String(o.estado || '').toLowerCase();
      if (est.includes('cola')) step = 1;
      else if (est.includes('proceso') || est.includes('taller')) step = 2;
      else if (est.includes('listo') || est.includes('recojo')) step = 3;
      else if (est.includes('entregado')) step = 4;

      return {
        code: o.numero_ticket,
        customer: o.ventas?.paciente_nombre || o.notas_taller || 'Paciente Lens Group',
        service: o.ventas?.montura_descripcion || 'Montura y cristales oftálmicos',
        treatment: o.ventas?.luna_descripcion || 'Tratamiento óptico computarizado',
        estado: o.estado || 'En Cola',
        urgente: Boolean(o.urgente),
        currentStep: step,
        receivedDate: o.creado_en ? new Date(o.creado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Reciente',
        estimatedDate: o.completado_en ? new Date(o.completado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Coordinado en tienda'
      };
    } catch (err) {
      console.warn('[LGSupabase] Error consultando ticket:', err.message);
      return null;
    }
  }

  async function updateOrderStatus(code, estado, urgente = false) {
    if (!code) return null;
    try {
      const payload = {
        estado: estado,
        urgente: Boolean(urgente)
      };
      if (String(estado).toLowerCase().includes('listo')) {
        payload.completado_en = new Date().toISOString();
      }

      const updated = await supabaseRequest(
        `ordenes_laboratorio?numero_ticket=eq.${encodeURIComponent(code)}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload)
        }
      );
      return updated?.[0] || true;
    } catch (err) {
      console.warn('[LGSupabase] Error actualizando orden:', err.message);
      return false;
    }
  }

  async function createOrder(order) {
    if (!order || !order.code) throw new Error('Se requiere código de orden');

    try {
      const ventaPayload = {
        numero_ticket: order.code,
        paciente_nombre: order.customer || '',
        paciente_dni: order.dni || '',
        paciente_telefono: order.phone || '',
        montura_marca: order.brand || '',
        montura_descripcion: `${order.brand || ''} ${order.service || ''}`.trim(),
        luna_descripcion: order.treatment || '',
        precio_total: Number(order.price) || 0,
        costo_total: Number(order.cost) || 0,
        tipo_pedido: order.urgente ? 'Urgente' : 'Normal',
        estado_entrega: order.estado || 'Por Entregar'
      };

      let ventaId = null;
      try {
        const ventaRes = await supabaseRequest('ventas', {
          method: 'POST',
          body: JSON.stringify(ventaPayload)
        });
        ventaId = ventaRes?.[0]?.id || null;
      } catch (e) {
        console.warn('[LGSupabase] Advertencia creando venta:', e.message);
      }

      const ordenPayload = {
        numero_ticket: order.code,
        estado: order.estado || 'En Cola',
        urgente: Boolean(order.urgente),
        notas_taller: `${order.customer || ''} - Tel: ${order.phone || ''}`.trim(),
        venta_id: ventaId
      };

      const ordenRes = await supabaseRequest('ordenes_laboratorio', {
        method: 'POST',
        body: JSON.stringify(ordenPayload)
      });

      return ordenRes?.[0] || order;
    } catch (err) {
      console.error('[LGSupabase] Error creando orden en Supabase:', err);
      throw err;
    }
  }

  // ========================================================================
  // 2. API DE VENTAS Y COMPROBANTES
  // ========================================================================

  async function getSales() {
    try {
      const rows = await supabaseRequest('ventas?select=*&order=creado_en.desc&limit=100');
      if (!Array.isArray(rows) || rows.length === 0) return null;
      return rows.map(v => ({
        id: v.id,
        correlativo: v.numero_ticket,
        tipoDoc: v.tipo_doc || 'boleta',
        clienteDocTipo: 'DNI',
        clienteDocNumero: v.paciente_dni || '',
        clienteNombre: v.paciente_nombre || 'Cliente',
        clienteTelefono: v.paciente_telefono || '',
        monturaNombre: v.montura_descripcion || '',
        monturaPrecio: Number(v.precio_total) || 0,
        lunasNombre: v.luna_descripcion || '',
        lunasPrecio: 0,
        total: Number(v.precio_total) || 0,
        metodoPago: v.metodo_pago || 'Efectivo',
        condicionPago: v.condicion_pago || 'Pagado 100%',
        fechaHora: v.creado_en ? new Date(v.creado_en).toLocaleString('es-PE') : 'Hoy',
        timestamp: v.creado_en ? new Date(v.creado_en).getTime() : Date.now()
      }));
    } catch (err) {
      console.warn('[LGSupabase] Error obteniendo ventas:', err.message);
      return null;
    }
  }

  async function createSale(sale) {
    try {
      const payload = {
        numero_ticket: sale.correlativo || `B001-${Date.now().toString().slice(-6)}`,
        tipo_doc: sale.tipoDoc || 'boleta',
        paciente_dni: sale.clienteDocNumero || '',
        paciente_nombre: sale.clienteNombre || '',
        paciente_telefono: sale.clienteTelefono || '',
        montura_descripcion: sale.monturaNombre || '',
        luna_descripcion: sale.lunasNombre || '',
        precio_total: Number(sale.total) || 0,
        metodo_pago: sale.metodoPago || 'Efectivo',
        condicion_pago: sale.condicionPago || 'Pagado 100%'
      };
      return await supabaseRequest('ventas', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('[LGSupabase] Error creando venta:', err.message);
      throw err;
    }
  }

  // ========================================================================
  // 3. API DE INVENTARIO Y CATÁLOGO
  // ========================================================================

  async function getInventory() {
    try {
      const rows = await supabaseRequest('inventario_monturas?select=*&order=actualizado_en.desc');
      if (!Array.isArray(rows) || rows.length === 0) return null;
      return rows.map(i => ({
        id: i.id,
        brand: i.marca,
        model: i.modelo,
        stock: Number(i.cantidad) || 0,
        threshold: Number(i.umbral_minimo) || 3,
        category: i.categoria || 'Oftálmico',
        cost: Number(i.costo) || 0,
        price: Number(i.precio_venta) || 0,
        status: (Number(i.cantidad) <= Number(i.umbral_minimo)) ? 'critical' : (Number(i.cantidad) <= Number(i.umbral_minimo) * 2 ? 'medium' : 'good')
      }));
    } catch (err) {
      console.warn('[LGSupabase] Error obteniendo inventario:', err.message);
      return null;
    }
  }

  async function getCatalog(categoria) {
    try {
      let endpoint = 'catalogo_mercaderia?select=*&order=creado_en.asc';
      if (categoria) {
        endpoint += `&categoria=eq.${encodeURIComponent(categoria)}`;
      }
      const rows = await supabaseRequest(endpoint);
      if (!Array.isArray(rows) || rows.length === 0) return null;
      return rows.map(c => ({
        id: c.id,
        sku: c.codigo_sistema,
        brand: c.nombre_autogenerado?.split(' ')?.[0] || 'Lens Group',
        model: c.modelo,
        material: c.material,
        category: c.categoria,
        price: Number(c.precio_venta) || 0,
        stock: 10,
        image: c.imagen || 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80'
      }));
    } catch (err) {
      console.warn('[LGSupabase] Error obteniendo catálogo:', err.message);
      return null;
    }
  }

  async function getLenses() {
    try {
      const rows = await supabaseRequest('banco_lunas?select=*&order=actualizado_en.desc');
      if (!Array.isArray(rows) || rows.length === 0) return null;
      return rows;
    } catch (err) {
      console.warn('[LGSupabase] Error obteniendo banco de lunas:', err.message);
      return null;
    }
  }

  // ========================================================================
  // 4. API DE AUTENTICACIÓN Y USUARIOS
  // ========================================================================

  async function loginUser(usernameOrDni, passwordOrPin) {
    const u = String(usernameOrDni || '').trim().toLowerCase();
    const p = String(passwordOrPin || '').trim();

    try {
      let users = await supabaseRequest(
        `usuarios?select=*&dni=eq.${encodeURIComponent(u)}&pin=eq.${encodeURIComponent(p)}&limit=1`
      );

      if (!users || users.length === 0) {
        users = await supabaseRequest(
          `usuarios?select=*&pin=eq.${encodeURIComponent(p)}&limit=5`
        );
        users = (users || []).filter((usr) => String(usr.dni).toLowerCase() === u);
      }

      if (users && users.length > 0) {
        const usr = users[0];
        return {
          success: true,
          user: {
            id: usr.id,
            dni: usr.dni,
            name: `${usr.nombres || ''} ${usr.apellidos || ''}`.trim() || usr.dni,
            role: usr.rol || 'admin',
            branch: 'Sede Jr. Gamarra 778'
          }
        };
      }

      return { success: false, error: 'Credenciales inválidas en Supabase' };
    } catch (err) {
      console.warn('[LGSupabase] Error en login contra Supabase:', err.message);
      return { success: false, error: err.message };
    }
  }

  async function getUsers() {
    try {
      return await supabaseRequest('usuarios?select=*&order=creado_en.asc');
    } catch (err) {
      console.warn('[LGSupabase] Error obteniendo usuarios:', err.message);
      return null;
    }
  }

  async function createUser(userData) {
    try {
      return await supabaseRequest('usuarios', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (err) {
      console.error('[LGSupabase] Error creando usuario:', err);
      throw err;
    }
  }

  // ========================================================================
  // 5. API DE PACIENTES Y CITAS
  // ========================================================================

  async function getPatients() {
    try {
      return await supabaseRequest('pacientes?select=*&order=creado_en.desc&limit=100');
    } catch (err) {
      console.warn('[LGSupabase] Error obteniendo pacientes:', err.message);
      return null;
    }
  }

  async function registerAppointment(appt) {
    try {
      const [nombres, ...apellidos] = (appt.name || '').trim().split(' ');
      const payload = {
        dni: `CIT-${Date.now().toString().slice(-6)}`,
        nombres: nombres || appt.name || 'Paciente',
        apellido_paterno: apellidos.join(' ') || 'Pendiente',
        apellido_materno: '',
        celular: appt.phone || '',
        ocupacion: `${appt.service || 'Cita general'} | Fecha: ${appt.date || ''} (${appt.time || ''}) | ${appt.notes || ''}`.trim()
      };

      return await supabaseRequest('pacientes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('[LGSupabase] Advertencia registrando cita en pacientes:', err.message);
      return null;
    }
  }

  // Exportar en el namespace global
  LG.supabase = {
    config: CONFIG,
    request: supabaseRequest,
    getOrders,
    getOrderByCode,
    updateOrderStatus,
    createOrder,
    getSales,
    createSale,
    getInventory,
    getCatalog,
    getLenses,
    loginUser,
    getUsers,
    createUser,
    getPatients,
    registerAppointment
  };
})();
