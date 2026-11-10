import { NextResponse } from 'next/server';

// Tokens configurables por variables de entorno con fallbacks públicos
const APIS_NET_PE_TOKEN = process.env.APIS_NET_PE_TOKEN || process.env.DECOLECTA_TOKEN || process.env.NEXT_PUBLIC_APIS_TOKEN || 'apis-token-1.aTSI10NVAlmq0zAcGQ0UsYYYFetGm0Da';
const PERUDEVS_KEY = process.env.PERUDEVS_KEY || 'cGVydWRldnMucHJvZHVjdGlvbi5iaXRjb2lucy42ODQyOGM1Y2QzNzI0NGI2ODgxNTRjNmU1MjQ4YjNkNQ==';

// Cache en memoria para acelerar consultas repetidas y ahorrar cuota
const memoryCacheDni = new Map();
const memoryCacheRuc = new Map();

async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function consultarDniEnProveedores(dni) {
  if (memoryCacheDni.has(dni)) {
    return memoryCacheDni.get(dni);
  }

  // Proveedor 1: Decolecta / APIs.net.pe v2 (El estándar más usado en Perú)
  try {
    const res = await fetchWithTimeout(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${APIS_NET_PE_TOKEN}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.nombres || data.nombreCompleto)) {
        const nombres = (data.nombres || '').trim();
        const apePat = (data.apellidoPaterno || '').trim();
        const apeMat = (data.apellidoMaterno || '').trim();
        const nombreCompleto = data.nombreCompleto || `${nombres} ${apePat} ${apeMat}`.trim();
        const result = {
          success: true,
          tipo: 'DNI',
          dni,
          nombres,
          apellidoPaterno: apePat,
          apellidoMaterno: apeMat,
          nombreCompleto,
          fuente: 'RENIEC (APIsPeru)'
        };
        memoryCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {
    // Intentar siguiente proveedor
  }

  // Proveedor 2: PeruDevs
  try {
    const res = await fetchWithTimeout(`https://api.perudevs.com/api/v1/dni/complete?document=${dni}&key=${PERUDEVS_KEY}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const r = data.resultado || data.data || data;
      if (r && (r.nombres || r.nombre_completo || r.name)) {
        const nombres = (r.nombres || r.name || '').trim();
        const apePat = (r.apellido_paterno || r.apellidoPaterno || '').trim();
        const apeMat = (r.apellido_materno || r.apellidoMaterno || '').trim();
        const nombreCompleto = (r.nombre_completo || `${nombres} ${apePat} ${apeMat}`).trim();
        const result = {
          success: true,
          tipo: 'DNI',
          dni,
          nombres,
          apellidoPaterno: apePat,
          apellidoMaterno: apeMat,
          nombreCompleto,
          fuente: 'RENIEC (PeruDevs)'
        };
        memoryCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {
    // Intentar siguiente proveedor
  }

  // Proveedor 3: DNIRUC ApisPeru (Endpoint directo gratuito)
  try {
    const res = await fetchWithTimeout(`https://dniruc.apisperu.net/api/v1/dni/${dni}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const r = data.data || data;
      if (r && (r.nombres || r.nombreCompleto)) {
        const nombres = (r.nombres || '').trim();
        const apePat = (r.apellidoPaterno || r.apellido_paterno || '').trim();
        const apeMat = (r.apellidoMaterno || r.apellido_materno || '').trim();
        const nombreCompleto = r.nombreCompleto || `${nombres} ${apePat} ${apeMat}`.trim();
        const result = {
          success: true,
          tipo: 'DNI',
          dni,
          nombres,
          apellidoPaterno: apePat,
          apellidoMaterno: apeMat,
          nombreCompleto,
          fuente: 'RENIEC (DNIRuc)'
        };
        memoryCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {
    // Intentar siguiente proveedor
  }

  // Proveedor 4: Decolecta v1
  try {
    const res = await fetchWithTimeout(`https://api.decolecta.com/v1/reniec/dni?numero=${dni}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.nombres || data.nombreCompleto)) {
        const nombres = (data.nombres || '').trim();
        const apePat = (data.apellidoPaterno || '').trim();
        const apeMat = (data.apellidoMaterno || '').trim();
        const nombreCompleto = data.nombreCompleto || `${nombres} ${apePat} ${apeMat}`.trim();
        const result = {
          success: true,
          tipo: 'DNI',
          dni,
          nombres,
          apellidoPaterno: apePat,
          apellidoMaterno: apeMat,
          nombreCompleto,
          fuente: 'RENIEC (Decolecta)'
        };
        memoryCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {
    // Fin de intentos
  }

  return null;
}

async function consultarRucEnProveedores(ruc) {
  if (memoryCacheRuc.has(ruc)) {
    return memoryCacheRuc.get(ruc);
  }

  // Proveedor 1: Sunat.lat (API abierta y gratuita para contribuyentes SUNAT)
  try {
    const res = await fetchWithTimeout(`https://api.sunat.lat/v1/ruc/${ruc}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const razonSocial = (data.razon_social || data.razonSocial || data.nombre || '').trim();
      if (razonSocial) {
        const direccion = (data.direccion || data.domicilio_fiscal || '').trim();
        const estado = (data.estado || data.estado_del_contribuyente || 'ACTIVO').trim();
        const condicion = (data.condicion || data.condicion_de_domicilio || 'HABIDO').trim();
        const result = {
          success: true,
          tipo: 'RUC',
          ruc,
          razonSocial,
          direccion: direccion || 'TRUJILLO, LA LIBERTAD',
          estado,
          condicion,
          departamento: data.departamento || 'LA LIBERTAD',
          provincia: data.provincia || 'TRUJILLO',
          distrito: data.distrito || 'TRUJILLO',
          fuente: 'SUNAT (Sunat.lat)'
        };
        memoryCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {
    // Intentar siguiente
  }

  // Proveedor 2: Decolecta / APIs.net.pe v2
  try {
    const res = await fetchWithTimeout(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${APIS_NET_PE_TOKEN}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      const razonSocial = (data.razonSocial || data.razon_social || '').trim();
      if (razonSocial) {
        const result = {
          success: true,
          tipo: 'RUC',
          ruc,
          razonSocial,
          direccion: (data.direccion || '').trim() || 'TRUJILLO, LA LIBERTAD',
          estado: (data.estado || 'ACTIVO').trim(),
          condicion: (data.condicion || 'HABIDO').trim(),
          departamento: data.departamento || 'LA LIBERTAD',
          provincia: data.provincia || 'TRUJILLO',
          distrito: data.distrito || 'TRUJILLO',
          fuente: 'SUNAT (APIsPeru)'
        };
        memoryCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {
    // Intentar siguiente
  }

  // Proveedor 3: DNIRUC ApisPeru
  try {
    const res = await fetchWithTimeout(`https://dniruc.apisperu.net/api/v1/ruc/${ruc}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const r = data.data || data;
      const razonSocial = (r.razonSocial || r.razon_social || '').trim();
      if (razonSocial) {
        const result = {
          success: true,
          tipo: 'RUC',
          ruc,
          razonSocial,
          direccion: (r.direccion || '').trim() || 'TRUJILLO, LA LIBERTAD',
          estado: (r.estado || 'ACTIVO').trim(),
          condicion: (r.condicion || 'HABIDO').trim(),
          fuente: 'SUNAT (DNIRuc)'
        };
        memoryCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {
    // Intentar siguiente
  }

  // Proveedor 4: PeruDevs
  try {
    const res = await fetchWithTimeout(`https://api.perudevs.com/api/v1/ruc?document=${ruc}&key=${PERUDEVS_KEY}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const r = data.resultado || data.data || data;
      const razonSocial = (r.razon_social || r.razonSocial || r.nombre_o_razon_social || '').trim();
      if (razonSocial) {
        const result = {
          success: true,
          tipo: 'RUC',
          ruc,
          razonSocial,
          direccion: (r.direccion || r.direccion_completa || '').trim() || 'TRUJILLO, LA LIBERTAD',
          estado: (r.estado || 'ACTIVO').trim(),
          condicion: (r.condicion || 'HABIDO').trim(),
          fuente: 'SUNAT (PeruDevs)'
        };
        memoryCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {
    // Fin de intentos
  }

  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = (searchParams.get('tipo') || '').toLowerCase().trim();
    const numero = (searchParams.get('numero') || searchParams.get('documento') || '').trim().replace(/\D/g, '');

    if (!numero) {
      return NextResponse.json({ error: 'Parámetro "numero" es requerido.' }, { status: 400 });
    }

    if (tipo === 'dni' || (!tipo && numero.length === 8)) {
      if (numero.length !== 8) {
        return NextResponse.json({ error: 'El DNI debe contener exactamente 8 dígitos numéricos.' }, { status: 400 });
      }

      const infoDni = await consultarDniEnProveedores(numero);
      if (infoDni) {
        return NextResponse.json(infoDni, { status: 200 });
      }

      return NextResponse.json({
        error: `No se encontraron datos para el DNI ${numero} en los servicios de RENIEC.`,
        notFound: true
      }, { status: 404 });
    }

    if (tipo === 'ruc' || (!tipo && numero.length === 11)) {
      if (numero.length !== 11) {
        return NextResponse.json({ error: 'El RUC debe contener exactamente 11 dígitos numéricos.' }, { status: 400 });
      }

      const infoRuc = await consultarRucEnProveedores(numero);
      if (infoRuc) {
        return NextResponse.json(infoRuc, { status: 200 });
      }

      return NextResponse.json({
        error: `No se encontró información para el RUC ${numero} en la base de datos de SUNAT.`,
        notFound: true
      }, { status: 404 });
    }

    return NextResponse.json({ error: 'Tipo de documento no válido. Use "dni" (8 dígitos) o "ruc" (11 dígitos).' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Error interno en el servicio de consulta: ' + err.message }, { status: 500 });
  }
}

