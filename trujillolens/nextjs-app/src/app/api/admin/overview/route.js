import { NextResponse } from "next/server";
import { requireAdminSession, supabaseAdminRequest } from "../../../../lib/supabase-admin";

export async function GET(request) {
  if (!requireAdminSession(request)) {
    return NextResponse.json({ error: "Sesión administrativa requerida." }, { status: 401 });
  }

  try {
    const [patients, sales, orders, frames, lenses] = await Promise.all([
      supabaseAdminRequest("pacientes", { params: { select: "id,dni,nombres,apellido_paterno,apellido_materno,celular,creado_en", order: "creado_en.desc", limit: "100" } }),
      supabaseAdminRequest("ventas", { params: { select: "id,numero_ticket,paciente_id,sucursal_id,montura_descripcion,luna_descripcion,tipo_pedido,estado_entrega,fecha_entrega,creado_en", order: "creado_en.desc", limit: "100" } }),
      supabaseAdminRequest("ordenes_laboratorio", { params: { select: "id,venta_id,numero_ticket,estado,urgente,creado_en,iniciado_en,completado_en", order: "creado_en.desc", limit: "100" } }),
      supabaseAdminRequest("inventario_monturas", { params: { select: "id,codigo,marca,modelo,color,tipo,cantidad,precio_venta,activo,sucursal_id", order: "actualizado_en.desc", limit: "100" } }),
      supabaseAdminRequest("banco_lunas", { params: { select: "id,catalogo_luna_id,cantidad,cantidad_minima,grado,esfera,cilindro,sucursal_id", order: "actualizado_en.desc", limit: "100" } }),
    ]);

    return NextResponse.json({ patients, sales, orders, frames, lenses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
