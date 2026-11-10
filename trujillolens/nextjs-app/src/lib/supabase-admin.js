import crypto from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rsjondlejagmnjrmbolf.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_A86Q2r3lrF6z14HunWuuwQ_Y-G8ziVV";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "lens_group_trujillo_super_secret_key_2026";

export function isSupabaseAdminConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function getUrl(table, params = {}) {
  const url = new URL(`/rest/v1/${table}`, SUPABASE_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}

export async function supabaseAdminRequest(table, { method = "GET", params, body } = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server-side no está configurado.");
  }

  const response = await fetch(getUrl(table, params), {
    method,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: method === "GET" ? "" : "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data?.hint || "Supabase rechazó la operación.");
  }

  return data;
}

export function createAdminSession(user) {
  if (!SESSION_SECRET) throw new Error("ADMIN_SESSION_SECRET no está configurado.");

  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    dni: user.dni,
    nombres: user.nombres,
    apellidos: user.apellidos,
    rol: user.rol,
    exp: Date.now() + 8 * 60 * 60 * 1000,
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readAdminSession(cookieValue) {
  if (!cookieValue || !SESSION_SECRET) return null;

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  return session.exp > Date.now() ? session : null;
}

export function requireAdminSession(request) {
  return readAdminSession(request.cookies.get("lgt_admin_session")?.value);
}
