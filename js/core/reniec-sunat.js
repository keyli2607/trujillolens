/* ==========================================================================
   LENS GROUP TRUJILLO — SERVICIO DE CONSULTA RENIEC (DNI) Y SUNAT (RUC)
   --------------------------------------------------------------------------
   Permite autocompletar en un clic los datos del cliente al emitir boletas
   o registrar pacientes:
   - DNI (8 dígitos) -> Nombres y apellidos completos desde RENIEC.
   - RUC (11 dígitos) -> Razón social, dirección fiscal y estado desde SUNAT.
   ========================================================================== */
(function () {
  'use strict';

  const LG = (window.LG = window.LG || {});

  // 1. Caché en memoria + persistencia en localStorage para evitar re-consultar
  const memoryCacheDni = {};
  const memoryCacheRuc = {};

  function getFromStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  }

  /**
   * Consulta datos de DNI ante RENIEC (API gratuita multi-proveedor)
   * @param {string|number} dni - 8 dígitos numéricos
   * @returns {Promise<Object>} Datos del ciudadano (nombres, apellidoPaterno, apellidoMaterno, nombreCompleto)
   */
  async function consultarDNI(dni) {
    const clean = String(dni || '').trim().replace(/\D/g, '');
    if (clean.length !== 8) {
      throw new Error('El DNI debe contener exactamente 8 dígitos.');
    }

    // 1. Revisar caché en memoria o localStorage
    if (memoryCacheDni[clean]) return memoryCacheDni[clean];
    const cached = getFromStorage('lens_cache_dni_' + clean);
    if (cached) {
      memoryCacheDni[clean] = cached;
      return cached;
    }

    // 2. Intentar servicio backend interno (sin problemas de CORS)
    try {
      const res = await fetch(`/api/consulta-documento?tipo=dni&numero=${clean}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.nombreCompleto || data.nombres)) {
          memoryCacheDni[clean] = data;
          saveToStorage('lens_cache_dni_' + clean, data);
          return data;
        }
      } else if (res.status === 404) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `DNI ${clean} no encontrado en RENIEC.`);
      }
    } catch (e) {
      if (e.message && e.message.includes('no encontrado')) throw e;
      // Continuar al fallback público si el backend local no responde
    }

    // 3. Fallback directo desde el navegador a APIs públicas gratuitas con CORS
    const token = localStorage.getItem('lens_apis_token') || 'apis-token-1.aTSI10NVAlmq0zAcGQ0UsYYYFetGm0Da';
    const publicEndpoints = [
      {
        url: `https://api.apis.net.pe/v2/reniec/dni?numero=${clean}`,
        headers: { 'Authorization': `Bearer ${token}` },
        parse: (d) => {
          if (!d || (!d.nombres && !d.nombreCompleto)) return null;
          const nombres = (d.nombres || '').trim();
          const apePat = (d.apellidoPaterno || '').trim();
          const apeMat = (d.apellidoMaterno || '').trim();
          return {
            dni: clean,
            nombres,
            apellidoPaterno: apePat,
            apellidoMaterno: apeMat,
            nombreCompleto: d.nombreCompleto || `${nombres} ${apePat} ${apeMat}`.trim()
          };
        }
      },
      {
        url: `https://dniruc.apisperu.net/api/v1/dni/${clean}`,
        headers: {},
        parse: (d) => {
          const r = d.data || d;
          if (!r || !r.nombres) return null;
          const nombres = (r.nombres || '').trim();
          const apePat = (r.apellidoPaterno || r.apellido_paterno || '').trim();
          const apeMat = (r.apellidoMaterno || r.apellido_materno || '').trim();
          return {
            dni: clean,
            nombres,
            apellidoPaterno: apePat,
            apellidoMaterno: apeMat,
            nombreCompleto: `${nombres} ${apePat} ${apeMat}`.trim()
          };
        }
      },
      {
        url: `https://api.perudevs.com/api/v1/dni/complete?document=${clean}&key=cGVydWRldnMucHJvZHVjdGlvbi5iaXRjb2lucy42ODQyOGM1Y2QzNzI0NGI2ODgxNTRjNmU1MjQ4YjNkNQ==`,
        headers: {},
        parse: (d) => {
          const r = d.resultado || d.data || d;
          if (!r || (!r.nombres && !r.nombre_completo)) return null;
          const nombres = (r.nombres || r.name || '').trim();
          const apePat = (r.apellido_paterno || r.apellidoPaterno || '').trim();
          const apeMat = (r.apellido_materno || r.apellidoMaterno || '').trim();
          return {
            dni: clean,
            nombres,
            apellidoPaterno: apePat,
            apellidoMaterno: apeMat,
            nombreCompleto: (r.nombre_completo || `${nombres} ${apePat} ${apeMat}`).trim()
          };
        }
      }
    ];

    for (const ep of publicEndpoints) {
      try {
        const res = await fetch(ep.url, {
          headers: { 'Accept': 'application/json', ...ep.headers }
        });
        if (res.ok) {
          const json = await res.json();
          const parsed = ep.parse(json);
          if (parsed && parsed.nombreCompleto) {
            memoryCacheDni[clean] = parsed;
            saveToStorage('lens_cache_dni_' + clean, parsed);
            return parsed;
          }
        }
      } catch (err) {
        // Continuar siguiente endpoint
      }
    }

    throw new Error(`No se pudo obtener datos para el DNI ${clean}. Verifique el número o ingréselo manualmente.`);
  }

  /**
   * Consulta datos de RUC ante SUNAT (API gratuita multi-proveedor)
   * @param {string|number} ruc - 11 dígitos numéricos
   * @returns {Promise<Object>} Datos de la empresa o contribuyente (razonSocial, direccion, estado, condicion)
   */
  async function consultarRUC(ruc) {
    const clean = String(ruc || '').trim().replace(/\D/g, '');
    if (clean.length !== 11) {
      throw new Error('El RUC debe contener exactamente 11 dígitos.');
    }

    // 1. Revisar caché en memoria o localStorage
    if (memoryCacheRuc[clean]) return memoryCacheRuc[clean];
    const cached = getFromStorage('lens_cache_ruc_' + clean);
    if (cached) {
      memoryCacheRuc[clean] = cached;
      return cached;
    }

    // 2. Intentar servicio backend interno (sin problemas de CORS)
    try {
      const res = await fetch(`/api/consulta-documento?tipo=ruc&numero=${clean}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.razonSocial) {
          memoryCacheRuc[clean] = data;
          saveToStorage('lens_cache_ruc_' + clean, data);
          return data;
        }
      } else if (res.status === 404) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `RUC ${clean} no encontrado en SUNAT.`);
      }
    } catch (e) {
      if (e.message && e.message.includes('no encontrado')) throw e;
    }

    // 3. Fallback directo desde el navegador a APIs públicas con CORS
    const token = localStorage.getItem('lens_apis_token') || 'apis-token-1.aTSI10NVAlmq0zAcGQ0UsYYYFetGm0Da';
    const publicEndpoints = [
      {
        url: `https://api.sunat.lat/v1/ruc/${clean}`,
        headers: {},
        parse: (d) => {
          const rz = (d.razon_social || d.razonSocial || d.nombre || '').trim();
          if (!rz) return null;
          return {
            ruc: clean,
            razonSocial: rz,
            direccion: (d.direccion || d.domicilio_fiscal || '').trim() || 'TRUJILLO, LA LIBERTAD',
            estado: (d.estado || 'ACTIVO').trim(),
            condicion: (d.condicion || 'HABIDO').trim()
          };
        }
      },
      {
        url: `https://api.apis.net.pe/v2/sunat/ruc?numero=${clean}`,
        headers: { 'Authorization': `Bearer ${token}` },
        parse: (d) => {
          const rz = (d.razonSocial || d.razon_social || '').trim();
          if (!rz) return null;
          return {
            ruc: clean,
            razonSocial: rz,
            direccion: (d.direccion || '').trim() || 'TRUJILLO, LA LIBERTAD',
            estado: (d.estado || 'ACTIVO').trim(),
            condicion: (d.condicion || 'HABIDO').trim()
          };
        }
      },
      {
        url: `https://dniruc.apisperu.net/api/v1/ruc/${clean}`,
        headers: {},
        parse: (d) => {
          const r = d.data || d;
          const rz = (r.razonSocial || r.razon_social || '').trim();
          if (!rz) return null;
          return {
            ruc: clean,
            razonSocial: rz,
            direccion: (r.direccion || '').trim() || 'TRUJILLO, LA LIBERTAD',
            estado: (r.estado || 'ACTIVO').trim(),
            condicion: (r.condicion || 'HABIDO').trim()
          };
        }
      }
    ];

    for (const ep of publicEndpoints) {
      try {
        const res = await fetch(ep.url, {
          headers: { 'Accept': 'application/json', ...ep.headers }
        });
        if (res.ok) {
          const json = await res.json();
          const parsed = ep.parse(json);
          if (parsed && parsed.razonSocial) {
            memoryCacheRuc[clean] = parsed;
            saveToStorage('lens_cache_ruc_' + clean, parsed);
            return parsed;
          }
        }
      } catch (err) {}
    }

    throw new Error(`No se pudo obtener datos para el RUC ${clean}. Ingréselo manualmente.`);
  }

  // Exportar en LG.fiscal y con alias directos en LG
  LG.fiscal = {
    consultarDNI,
    consultarRUC
  };
  LG.consultarDNI = consultarDNI;
  LG.consultarRUC = consultarRUC;
})();
