"use client";

import { useEffect, useState } from "react";

const states = ["cola", "proceso", "listo"];

export default function AdminDashboard() {
  const [credentials, setCredentials] = useState({ dni: "", pin: "" });
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState({ dni: "", nombres: "", apellido_paterno: "", apellido_materno: "", celular: "" });

  async function loadOverview() {
    const response = await fetch("/api/admin/overview", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "No se pudo cargar el panel.");
    setData(result);
  }

  async function login(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "No se pudo iniciar sesión.");
    setSession(result.user);
    loadOverview().catch((loadError) => setError(loadError.message));
  }

  async function updateOrder(order, estado) {
    const response = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: order.id, estado, urgente: order.urgente }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "No se pudo actualizar la orden.");
    await loadOverview();
  }

  async function savePatient(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patient) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "No se pudo registrar el paciente.");
    setPatient({ dni: "", nombres: "", apellido_paterno: "", apellido_materno: "", celular: "" });
    await loadOverview();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setSession(null);
    setData(null);
  }

  async function importOrders() {
    const response = await fetch("/api/admin/import-orders", { method: "POST" });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "No se pudo migrar orders.json.");
    setError(`Migración terminada: ${result.imported} importados, ${result.skipped} ya existentes.`);
    await loadOverview();
  }

  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" }).then(async (response) => {
      if (response.ok) {
        setSession({});
        setData(await response.json());
      }
    }).catch(() => {});
  }, []);

  if (!session) {
    return (
      <main className="admin-shell">
        <section className="admin-login">
          <span className="section-tag">Acceso privado</span>
          <h1> Lens Group</h1>
          <p>Ingresa con tu DNI y PIN institucional.</p>
          <form onSubmit={login} className="admin-form">
            <input inputMode="numeric" maxLength={8} placeholder="DNI" value={credentials.dni} onChange={(event) => setCredentials({ ...credentials, dni: event.target.value })} required />
            <input type="password" minLength={4} placeholder="PIN" value={credentials.pin} onChange={(event) => setCredentials({ ...credentials, pin: event.target.value })} required />
            <button className="btn btn-primary" type="submit">Ingresar</button>
          </form>
          {error && <p className="admin-error">{error}</p>}
        </section>
      </main>
    );
  }

  const counts = data ? [
    ["Pacientes", data.patients.length],
    ["Ventas", data.sales.length],
    ["Órdenes", data.orders.length],
    ["Monturas", data.frames.length],
    ["Lunas", data.lenses.length],
  ] : [];

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div><span className="section-tag">Operaciones</span><h1>Panel administrativo</h1><p>{session.nombres ? `${session.nombres} ${session.apellidos || ""} · ${session.rol || ""}` : "Sesión activa"}</p></div>
        <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <section className="admin-stat-grid">{counts.map(([label, count]) => <div className="admin-stat" key={label}><strong>{count}</strong><span>{label}</span></div>)}</section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><h2>Órdenes de laboratorio</h2><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><button className="btn btn-outline" onClick={importOrders}>Importar orders.json</button><button className="btn btn-outline" onClick={() => loadOverview()}>Actualizar</button></div></div>
        <div className="admin-table-wrap"><table><thead><tr><th>Ticket</th><th>Estado</th><th>Urgente</th><th>Cambiar</th></tr></thead><tbody>{data?.orders.map((order) => <tr key={order.id}><td>{order.numero_ticket}</td><td>{order.estado}</td><td>{order.urgente ? "Sí" : "No"}</td><td><select value={order.estado} onChange={(event) => updateOrder(order, event.target.value)}>{states.map((state) => <option key={state}>{state}</option>)}</select></td></tr>)}</tbody></table></div>
      </section>
      <section className="admin-columns">
        <div className="admin-panel"><h2>Registrar paciente</h2><form onSubmit={savePatient} className="admin-form admin-form-grid">{[["dni", "DNI"], ["nombres", "Nombres"], ["apellido_paterno", "Apellido paterno"], ["apellido_materno", "Apellido materno"], ["celular", "Celular"]].map(([key, label]) => <input key={key} placeholder={label} value={patient[key]} onChange={(event) => setPatient({ ...patient, [key]: event.target.value })} required={key !== "celular"} />)}<button className="btn btn-primary" type="submit">Guardar paciente</button></form></div>
        <div className="admin-panel"><h2>Inventario bajo</h2><ul className="admin-list">{data?.frames.filter((item) => item.cantidad <= 5).slice(0, 8).map((item) => <li key={item.id}><span>{item.marca} {item.modelo || ""}</span><strong>{item.cantidad}</strong></li>)}{!data?.frames.some((item) => item.cantidad <= 5) && <li>No hay alertas de monturas.</li>}</ul></div>
      </section>
    </main>
  );
}
