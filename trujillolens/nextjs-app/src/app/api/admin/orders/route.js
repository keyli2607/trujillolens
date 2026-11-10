import { NextResponse } from "next/server";
import { requireAdminSession, supabaseAdminRequest } from "../../../../lib/supabase-admin";

export async function PATCH(request) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Sesión administrativa requerida." }, { status: 401 });

  const { id, estado, urgente } = await request.json().catch(() => ({}));
  const validStates = ["En Cola", "En Proceso", "Listo para Recojo", "Entregado", "Cancelado"];
  if (!id || !validStates.includes(estado)) {
    return NextResponse.json({ error: "Orden o estado inválido." }, { status: 400 });
  }

  try {
    const now = new Date().toISOString();
    const changes = { estado, urgente: Boolean(urgente) };
    if (estado === "En Proceso") changes.iniciado_en = now;
    if (estado === "Listo para Recojo" || estado === "Entregado") changes.completado_en = now;
    const result = await supabaseAdminRequest("ordenes_laboratorio", {
      method: "PATCH",
      params: { id: `eq.${id}` },
      body: changes,
    });
    return NextResponse.json(result?.[0] || { ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
