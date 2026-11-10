import { NextResponse } from "next/server";

const ORDER_STATUS_DEFS = {
  1: {
    key: "cola",
    statusTitle: "En Cola de Espera",
    statusBadgeText: "Cola",
    statusBadgeClass: "state-badge-progress",
    statusBoxClass: "status-box-progress",
    statusDesc: "Receta registrada y montura asignada. En espera de laboratorio.",
    showPickupBanner: false,
  },
  2: {
    key: "proceso",
    statusTitle: "En Proceso de Laboratorio",
    statusBadgeText: "Proceso",
    statusBadgeClass: "state-badge-progress",
    statusBoxClass: "status-box-progress",
    statusDesc: "Tallado digital, biselado y control de calidad en laboratorio.",
    showPickupBanner: false,
  },
  3: {
    key: "listo",
    statusTitle: "¡Listo para Recoger en Tienda!",
    statusBadgeText: "Listo",
    statusBadgeClass: "state-badge-ready",
    statusBoxClass: "status-box-ready",
    statusDesc: "Tu pedido ya está en tienda listo para ser entregado.",
    showPickupBanner: true,
  },
};

function mapStatusToStep(val) {
  if (typeof val === "number") {
    if (val <= 1) return 1;
    if (val === 2 || val === 3) return 2;
    return 3;
  }
  if (!val) return 1;
  const s = String(val).toLowerCase().trim();
  if (s.includes("cola")) return 1;
  if (s.includes("proceso") || s.includes("taller") || s.includes("calidad") || s.includes("laboratorio")) return 2;
  if (s.includes("listo") || s.includes("recojo") || s.includes("entrega")) return 3;
  return 1;
}

const STATUS_NAMES = {
  1: "Cola",
  2: "Proceso",
  3: "Listo",
};

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function formatDate(value, fallback = "Pendiente") {
  if (!value) return fallback;

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeZone: "America/Lima",
  }).format(new Date(value));
}

function buildHistory(order, currentStep) {
  const events = [
    { step: 1, date: order.creado_en, desc: "Receta registrada y montura asignada. En espera de laboratorio." },
    { step: 2, date: order.iniciado_en, desc: "Tallado digital, biselado y control de calidad en laboratorio." },
    { step: 3, date: order.completado_en, desc: "Tu pedido ya está en tienda listo para ser entregado." },
  ];

  return events.map((event) => ({
    step: event.step,
    name: STATUS_NAMES[event.step],
    date: event.date ? formatDate(event.date) : event.step > currentStep ? "Pendiente" : "Completado",
    desc: event.desc,
  }));
}

function mapOrder(order) {
  const currentStep = mapStatusToStep(order.estado);
  const statusDef = ORDER_STATUS_DEFS[currentStep];
  const sale = order.ventas || {};
  const patient = sale.pacientes || {};
  const branch = sale.sucursales || {};

  return {
    code: order.numero_ticket,
    customer: [patient.nombres, patient.apellido_paterno, patient.apellido_materno].filter(Boolean).join(" ") || "Cliente registrado",
    receivedDate: formatDate(order.creado_en),
    estimatedDate: formatDate(sale.fecha_entrega, "Por confirmar"),
    service: [sale.montura_descripcion, sale.luna_descripcion].filter(Boolean).join(" + ") || "Servicio óptico registrado",
    branch: branch.direccion || "Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001",
    currentStep,
    estado: statusDef.key,
    statusTitle: statusDef.statusTitle,
    statusBadgeText: statusDef.statusBadgeText,
    statusBadgeClass: statusDef.statusBadgeClass,
    statusBoxClass: statusDef.statusBoxClass,
    statusDesc: statusDef.statusDesc,
    showPickupBanner: statusDef.showPickupBanner,
    history: buildHistory(order, currentStep),
  };
}

export async function GET(request, { params }) {
  const code = (await params).code?.trim().toUpperCase();

  if (!code || !/^[-A-Z0-9]{3,30}$/.test(code)) {
    return NextResponse.json({ error: "Código de seguimiento inválido." }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Supabase no está configurado en el entorno de Next.js." }, { status: 503 });
  }

  const query = new URL("/rest/v1/ordenes_laboratorio", SUPABASE_URL);
  query.searchParams.set(
    "select",
    "numero_ticket,estado,creado_en,iniciado_en,completado_en,ventas(numero_ticket,fecha_entrega,montura_descripcion,luna_descripcion,pacientes(nombres,apellido_paterno,apellido_materno),sucursales(direccion))"
  );
  query.searchParams.set("numero_ticket", `eq.${code}`);
  query.searchParams.set("limit", "1");

  try {
    const response = await fetch(query, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "No se pudo consultar Supabase." }, { status: 502 });
    }

    const orders = await response.json();
    if (!orders.length) {
      return NextResponse.json({ error: "No encontramos ese código." }, { status: 404 });
    }

    return NextResponse.json(mapOrder(orders[0]), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Supabase local no está disponible." }, { status: 503 });
  }
}