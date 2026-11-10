import { NextResponse } from "next/server";
import { createAdminSession, isSupabaseAdminConfigured, supabaseAdminRequest } from "../../../../lib/supabase-admin";

export async function POST(request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Configura SUPABASE_SERVICE_ROLE_KEY y ADMIN_SESSION_SECRET." }, { status: 503 });
  }

  const { dni, pin } = await request.json().catch(() => ({}));
  if (!/^\d{8}$/.test(String(dni || "")) || String(pin || "").length < 4) {
    return NextResponse.json({ error: "DNI o PIN inválido." }, { status: 400 });
  }

  try {
    const users = await supabaseAdminRequest("usuarios", {
      params: {
        select: "id,dni,nombres,apellidos,rol,activo,is_active,bloqueado_hasta",
        dni: `eq.${dni}`,
        pin: `eq.${pin}`,
        limit: "1",
      },
    });
    const user = users?.[0];
    const isActive = user && user.activo !== false && user.is_active !== false;
    const isBlocked = user?.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date();

    if (!user || !isActive || isBlocked) {
      return NextResponse.json({ error: "Credenciales inválidas o usuario bloqueado." }, { status: 401 });
    }

    const response = NextResponse.json({ user: { nombres: user.nombres, apellidos: user.apellidos, rol: user.rol } });
    response.cookies.set("lgt_admin_session", createAdminSession(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("lgt_admin_session", "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
