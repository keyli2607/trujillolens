import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdminSession, supabaseAdminRequest } from "../../../../lib/supabase-admin";

function parseSpanishDate(value) {
  if (!value) return null;
  const match = String(value).toLowerCase().match(/(\d{1,2}).*?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|setiembre|septiembre|octubre|noviembre|diciembre).*?(\d{4})/);
  if (!match) return null;
  const months = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, setiembre: 8, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
  return new Date(Date.UTC(Number(match[3]), months[match[2]], Number(match[1]))).toISOString();
}

export async function POST(request) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Sesión administrativa requerida." }, { status: 401 });

  try {
    const source = path.join(process.cwd(), "..", "orders.json");
    const orders = JSON.parse(await fs.readFile(source, "utf8"));
    const entries = Object.values(orders);
    let imported = 0;
    let skipped = 0;

    for (const order of entries) {
      const existing = await supabaseAdminRequest("ventas", { params: { select: "id", numero_ticket: `eq.${order.code}`, limit: "1" } });
      if (existing?.length) {
        skipped += 1;
        continue;
      }

      const patient = await supabaseAdminRequest("pacientes", {
        params: { select: "id", dni: `eq.${order.dni || "00000000"}`, limit: "1" },
      });
      let patientId = patient?.[0]?.id;
      if (!patientId) {
        const createdPatient = await supabaseAdminRequest("pacientes", {
          method: "POST",
          body: {
            dni: order.dni || `9${String(order.code).replace(/\D/g, "").slice(-7).padStart(7, "0")}`,
            nombres: order.customer || "Cliente importado",
            apellido_paterno: "Importado",
            apellido_materno: "Orders",
            celular: order.phone || null,
            ocupacion: "Importado desde orders.json",
            registrado_por: session.id,
          },
        });
        patientId = createdPatient?.[0]?.id;
      }
      const sale = await supabaseAdminRequest("ventas", {
        method: "POST",
        body: {
          numero_ticket: order.code,
          paciente_id: patientId,
          vendedor_id: session.id,
          montura_descripcion: order.service || null,
          luna_descripcion: order.notes || null,
          tipo_pedido: "externo",
          estado_entrega: Number(order.currentStep) === 5 ? "Entregado" : "Por Entregar",
          fecha_entrega: parseSpanishDate(order.estimatedDate),
          sucursal_id: null,
        },
      });
      const saleId = sale?.[0]?.id;
      if (!saleId) throw new Error(`No se pudo crear la venta ${order.code}.`);

      await supabaseAdminRequest("ordenes_laboratorio", {
        method: "POST",
        body: {
          venta_id: saleId,
          numero_ticket: order.code,
          estado: Number(order.currentStep) === 5 ? "Entregado" : Number(order.currentStep) >= 4 ? "Listo para Recojo" : Number(order.currentStep) === 2 ? "En Proceso" : "En Cola",
          notas_taller: order.notes || null,
        },
      });
      imported += 1;
    }

    return NextResponse.json({ imported, skipped, total: entries.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
