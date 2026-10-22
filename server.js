import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 8080;
const ENV_FILE = path.join(process.cwd(), 'nextjs-app', '.env.local');

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

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const resolveFilePath = (targetPath) => {
    const candidate = path.join(process.cwd(), targetPath);
    const ext = path.extname(candidate).toLowerCase();
    if (ext) return candidate;

    const htmlCandidate = `${candidate}.html`;
    if (fs.existsSync(htmlCandidate)) return htmlCandidate;
    return candidate;
  };

  const filePath = resolveFilePath(reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(process.cwd(), `${reqPath}.html`);
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
