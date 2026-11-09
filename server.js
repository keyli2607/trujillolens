import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8080;
const ENV_FILE = fs.existsSync(path.join(process.cwd(), 'nextjs-app', '.env.local'))
  ? path.join(process.cwd(), 'nextjs-app', '.env.local')
  : path.join(__dirname, 'nextjs-app', '.env.local');

let SUPABASE_URL = 'https://rsjondlejagmnjrmbolf.supabase.co';
let SUPABASE_KEY = 'sb_publishable_A86Q2r3lrF6z14HunWuuwQ_Y-G8ziVV';

try {
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
    if (!SUPABASE_KEY && line.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
  });
} catch (e) {
  // Usando credenciales por defecto configuradas
}

async function supabaseRequest(endpoint, options = {}) {
  const url = new URL(`/rest/v1/${endpoint}`, SUPABASE_URL);
  const res = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' || options.method === 'PATCH' ? 'return=representation' : '',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Error en Supabase');
  return data;
}
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Funciones locales eliminadas en favor de supabaseRequest

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

const APIS_NET_PE_TOKEN = process.env.APIS_NET_PE_TOKEN || process.env.DECOLECTA_TOKEN || process.env.NEXT_PUBLIC_APIS_TOKEN || 'apis-token-1.aTSI10NVAlmq0zAcGQ0UsYYYFetGm0Da';
const PERUDEVS_KEY = process.env.PERUDEVS_KEY || 'cGVydWRldnMucHJvZHVjdGlvbi5iaXRjb2lucy42ODQyOGM1Y2QzNzI0NGI2ODgxNTRjNmU1MjQ4YjNkNQ==';
const serverCacheDni = new Map();
const serverCacheRuc = new Map();

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
  if (serverCacheDni.has(dni)) return serverCacheDni.get(dni);

  // 1. APIs.net.pe / Decolecta v2
  try {
    const res = await fetchWithTimeout(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${APIS_NET_PE_TOKEN}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.nombres || data.nombreCompleto)) {
        const nombres = (data.nombres || '').trim();
        const apePat = (data.apellidoPaterno || '').trim();
        const apeMat = (data.apellidoMaterno || '').trim();
        const result = {
          success: true, tipo: 'DNI', dni, nombres, apellidoPaterno: apePat, apellidoMaterno: apeMat,
          nombreCompleto: data.nombreCompleto || `${nombres} ${apePat} ${apeMat}`.trim(),
          fuente: 'RENIEC'
        };
        serverCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {}

  // 2. PeruDevs
  try {
    const res = await fetchWithTimeout(`https://api.perudevs.com/api/v1/dni/complete?document=${dni}&key=${PERUDEVS_KEY}`);
    if (res.ok) {
      const data = await res.json();
      const r = data.resultado || data.data || data;
      if (r && (r.nombres || r.nombre_completo || r.name)) {
        const nombres = (r.nombres || r.name || '').trim();
        const apePat = (r.apellido_paterno || r.apellidoPaterno || '').trim();
        const apeMat = (r.apellido_materno || r.apellidoMaterno || '').trim();
        const result = {
          success: true, tipo: 'DNI', dni, nombres, apellidoPaterno: apePat, apellidoMaterno: apeMat,
          nombreCompleto: (r.nombre_completo || `${nombres} ${apePat} ${apeMat}`).trim(),
          fuente: 'RENIEC'
        };
        serverCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {}

  // 3. DNIRUC ApisPeru
  try {
    const res = await fetchWithTimeout(`https://dniruc.apisperu.net/api/v1/dni/${dni}`);
    if (res.ok) {
      const data = await res.json();
      const r = data.data || data;
      if (r && (r.nombres || r.nombreCompleto)) {
        const nombres = (r.nombres || '').trim();
        const apePat = (r.apellidoPaterno || r.apellido_paterno || '').trim();
        const apeMat = (r.apellidoMaterno || r.apellido_materno || '').trim();
        const result = {
          success: true, tipo: 'DNI', dni, nombres, apellidoPaterno: apePat, apellidoMaterno: apeMat,
          nombreCompleto: r.nombreCompleto || `${nombres} ${apePat} ${apeMat}`.trim(),
          fuente: 'RENIEC'
        };
        serverCacheDni.set(dni, result);
        return result;
      }
    }
  } catch (e) {}

  return null;
}

async function consultarRucEnProveedores(ruc) {
  if (serverCacheRuc.has(ruc)) return serverCacheRuc.get(ruc);

  // 1. Sunat.lat (Gratuito y abierto)
  try {
    const res = await fetchWithTimeout(`https://api.sunat.lat/v1/ruc/${ruc}`);
    if (res.ok) {
      const data = await res.json();
      const rz = (data.razon_social || data.razonSocial || data.nombre || '').trim();
      if (rz) {
        const result = {
          success: true, tipo: 'RUC', ruc, razonSocial: rz,
          direccion: (data.direccion || data.domicilio_fiscal || '').trim() || 'TRUJILLO, LA LIBERTAD',
          estado: (data.estado || 'ACTIVO').trim(),
          condicion: (data.condicion || 'HABIDO').trim(),
          fuente: 'SUNAT'
        };
        serverCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {}

  // 2. APIs.net.pe / Decolecta v2
  try {
    const res = await fetchWithTimeout(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${APIS_NET_PE_TOKEN}` }
    });
    if (res.ok) {
      const data = await res.json();
      const rz = (data.razonSocial || data.razon_social || '').trim();
      if (rz) {
        const result = {
          success: true, tipo: 'RUC', ruc, razonSocial: rz,
          direccion: (data.direccion || '').trim() || 'TRUJILLO, LA LIBERTAD',
          estado: (data.estado || 'ACTIVO').trim(),
          condicion: (data.condicion || 'HABIDO').trim(),
          fuente: 'SUNAT'
        };
        serverCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {}

  // 3. DNIRUC
  try {
    const res = await fetchWithTimeout(`https://dniruc.apisperu.net/api/v1/ruc/${ruc}`);
    if (res.ok) {
      const data = await res.json();
      const r = data.data || data;
      const rz = (r.razonSocial || r.razon_social || '').trim();
      if (rz) {
        const result = {
          success: true, tipo: 'RUC', ruc, razonSocial: rz,
          direccion: (r.direccion || '').trim() || 'TRUJILLO, LA LIBERTAD',
          estado: (r.estado || 'ACTIVO').trim(),
          condicion: (r.condicion || 'HABIDO').trim(),
          fuente: 'SUNAT'
        };
        serverCacheRuc.set(ruc, result);
        return result;
      }
    }
  } catch (e) {}

  return null;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (requestUrl.pathname === '/api/admin/login') {
    if (req.method === 'OPTIONS') return sendJson(res, 204, {});
    if (req.method === 'POST') {
      readRequestBody(req).then(async (creds) => {
        const u = String(creds.username || creds.dni || '').trim().toLowerCase();
        const p = String(creds.password || creds.pin || '').trim();

        try {
          const users = await supabaseRequest(`usuarios?select=*&dni=eq.${u}&pin=eq.${p}&limit=1`);
          if (users && users.length > 0) {
            const user = users[0];
            return sendJson(res, 200, {
              success: true,
              user: {
                name: `${user.nombres} ${user.apellidos}`,
                role: user.rol,
                branch: 'Sucursal Principal'
              }
            });
          }
        } catch (e) {
          console.error('Error in login logic:', e);
        }

        return sendJson(res, 401, { error: 'Credenciales inválidas en Supabase.' });
      }).catch((e) => {
        console.error('Catch-all error:', e);
        sendJson(res, 400, { error: 'Formato inválido o error interno.' });
      });
      return;
    }
  }

  if (requestUrl.pathname === '/api/orders' || requestUrl.pathname.startsWith('/api/orders/')) {
    if (req.method === 'OPTIONS') return sendJson(res, 204, {});
    if (req.method === 'GET') {
      supabaseRequest('ordenes_laboratorio?select=*,ventas(*)').then(ordenes => {
        // Transformar al formato que espera el frontend actual
        const mapOrders = {};
        (ordenes || []).forEach(o => {
          mapOrders[o.numero_ticket] = {
            code: o.numero_ticket,
            estado: o.estado,
            urgente: o.urgente,
            service: o.ventas?.montura_descripcion || '',
            treatment: o.ventas?.luna_descripcion || '',
            price: 0,
            cost: 0,
            currentStep: o.estado === 'Entregado' ? 5 : o.estado === 'Listo para Recojo' ? 4 : o.estado === 'En Proceso' ? 2 : 1
          };
        });
        sendJson(res, 200, mapOrders);
      }).catch(e => sendJson(res, 500, { error: e.message }));
      return;
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      readRequestBody(req).then(async (data) => {
        const code = data.code || requestUrl.pathname.replace('/api/orders/', '').trim();
        if (!code) return sendJson(res, 400, { error: 'Se requiere código de orden.' });
        
        try {
           const updateData = {
              estado: data.estado || 'En Proceso',
              urgente: data.urgente || false
           };
           const result = await supabaseRequest(`ordenes_laboratorio?numero_ticket=eq.${code}`, {
              method: 'PATCH',
              body: JSON.stringify(updateData)
           });
           return sendJson(res, 200, result?.[0] || data);
        } catch(e) {
           return sendJson(res, 500, { error: e.message });
        }
      }).catch(() => sendJson(res, 400, { error: 'Error procesando datos.' }));
      return;
    }

    readRequestBody(req).then(async (order) => {
      if (!order.code) return sendJson(res, 400, { error: 'El pedido necesita un código.' });
      try {
         // Esta es una creación básica simplificada, en el sistema completo usarías el ImportOrders
         await supabaseRequest('ordenes_laboratorio', {
            method: 'POST',
            body: JSON.stringify({ numero_ticket: order.code, estado: order.estado || 'En Cola' })
         });
         sendJson(res, 200, order);
      } catch(e) {
         sendJson(res, 500, { error: e.message });
      }
    }).catch(() => sendJson(res, 400, { error: 'Datos de pedido inválidos.' }));
    return;
  }

  if (requestUrl.pathname === '/api/consulta-documento') {
    if (req.method === 'OPTIONS') return sendJson(res, 204, {});
    const tipo = (requestUrl.searchParams.get('tipo') || '').toLowerCase().trim();
    const numero = (requestUrl.searchParams.get('numero') || requestUrl.searchParams.get('documento') || '').trim().replace(/\D/g, '');

    (async () => {
      try {
        if (!numero) return sendJson(res, 400, { error: 'Parámetro "numero" es requerido.' });
        if (tipo === 'dni' || (!tipo && numero.length === 8)) {
          if (numero.length !== 8) return sendJson(res, 400, { error: 'El DNI debe tener 8 dígitos.' });
          const info = await consultarDniEnProveedores(numero);
          if (info) return sendJson(res, 200, info);
          return sendJson(res, 404, { error: `No se encontró información para el DNI ${numero} en RENIEC.`, notFound: true });
        }
        if (tipo === 'ruc' || (!tipo && numero.length === 11)) {
          if (numero.length !== 11) return sendJson(res, 400, { error: 'El RUC debe tener 11 dígitos.' });
          const info = await consultarRucEnProveedores(numero);
          if (info) return sendJson(res, 200, info);
          return sendJson(res, 404, { error: `No se encontró información para el RUC ${numero} en SUNAT.`, notFound: true });
        }
        return sendJson(res, 400, { error: 'Tipo de documento no válido.' });
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    })();
    return;
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const resolveFilePath = (targetPath) => {
    let candidate = path.join(process.cwd(), targetPath);
    if (!fs.existsSync(candidate)) {
      const alt = path.join(__dirname, targetPath);
      if (fs.existsSync(alt)) candidate = alt;
    }
    const ext = path.extname(candidate).toLowerCase();
    if (ext) return candidate;

    const htmlCandidate = `${candidate}.html`;
    if (fs.existsSync(htmlCandidate)) return htmlCandidate;
    return candidate;
  };

  const filePath = resolveFilePath(reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = fs.existsSync(path.join(process.cwd(), `${reqPath}.html`))
        ? path.join(process.cwd(), `${reqPath}.html`)
        : path.join(__dirname, `${reqPath}.html`);
      fs.stat(fallbackPath, (fallbackErr, fallbackStats) => {
        if (fallbackErr || !fallbackStats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
          return;
        }

        const ext = path.extname(fallbackPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        });

        fs.createReadStream(fallbackPath).pipe(res);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
