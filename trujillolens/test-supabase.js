const fs = require('fs');
const path = require('path');
const ENV_FILE = path.join(process.cwd(), 'nextjs-app', '.env.local');

let SUPABASE_URL = 'https://rsjondlejagmnjrmbolf.supabase.co';
let SUPABASE_KEY = 'sb_publishable_A86Q2r3lrF6z14HunWuuwQ_Y-G8ziVV';

try {
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
  });
} catch (e) {}

async function supabaseRequest(endpoint) {
  const url = new URL(`/rest/v1/${endpoint}`, SUPABASE_URL);
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function testAll() {
  const tables = ['usuarios', 'pacientes', 'ventas', 'ordenes_laboratorio', 'inventario_monturas', 'banco_lunas', 'catalogo_mercaderia'];
  console.log(`Conectando a: ${SUPABASE_URL}`);
  for (const t of tables) {
    try {
      const res = await supabaseRequest(`${t}?select=*&limit=3`);
      if (res.ok) {
        console.log(`✅ [${t}]: OK (${Array.isArray(res.data) ? res.data.length : 0} registros)`);
      } else {
        console.log(`❌ [${t}]: Error ${res.status}:`, res.data?.message || res.data);
      }
    } catch (e) {
      console.log(`❌ [${t}]: Excepción:`, e.message);
    }
  }
}

testAll();
