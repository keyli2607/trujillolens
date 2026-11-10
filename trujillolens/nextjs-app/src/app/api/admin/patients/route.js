import { NextResponse } from "next/server";
import { requireAdminSession, supabaseAdminRequest } from "../../../../lib/supabase-admin";

export async function POST(request) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Sesión administrativa requerida." }, { status: 401 });

  const data = await request.json().catch(() => ({}));
  if (!/^\d{8}$/.test(String(data.dni || "")) || !data.nombres || !data.apellido_paterno || !data.apellido_materno) {
    return NextResponse.json({ error: "DNI y nombres completos son obligatorios." }, { status: 400 });
  }

  try {
    const result = await supabaseAdminRequest("pacientes", {
      method: "POST",
      body: {
        dni: data.dni,
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        celular: data.celular || null,
        fecha_nacimiento: data.fecha_nacimiento || null,
        genero: data.genero || null,
        ocupacion: data.ocupacion || null,
        registrado_por: session.id,
      },
    });
    return NextResponse.json(result?.[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
