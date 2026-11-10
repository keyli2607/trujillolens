import { NextResponse } from "next/server";
import { requireAdminSession, supabaseAdminRequest } from "../../../../lib/supabase-admin";

export async function PATCH(request) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Sesión administrativa requerida." }, { status: 401 });

  const { id, cantidad, tipo } = await request.json().catch(() => ({}));
  const nextQuantity = Number(cantidad);
  if (!id || !Number.isInteger(nextQuantity) || nextQuantity < 0 || !["monturas", "lunas"].includes(tipo)) {
    return NextResponse.json({ error: "Producto, tipo o cantidad inválidos." }, { status: 400 });
  }

  try {
    const table = tipo === "monturas" ? "inventario_monturas" : "banco_lunas";
    const result = await supabaseAdminRequest(table, {
      method: "PATCH",
      params: { id: `eq.${id}` },
      body: { cantidad: nextQuantity, actualizado_en: new Date().toISOString() },
    });
    return NextResponse.json(result?.[0] || { ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
