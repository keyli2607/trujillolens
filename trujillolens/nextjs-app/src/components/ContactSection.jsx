"use client";

import { useState, useEffect } from "react";

export default function ContactSection() {
  const [storeStatus, setStoreStatus] = useState({
    isOpen: true,
    text: "Abierto hoy hasta las 9:00 PM",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Examen de Vista Computarizado",
    date: "",
    time: "Mañana (9:30 AM - 1:00 PM)",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    // Set min date
    const today = new Date().toISOString().split("T")[0];
    setTodayDate(today);

    // Live Store Status (Trujillo Timezone UTC-5)
    function calculateStatus() {
      const now = new Date();
      const peruTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
      const day = peruTime.getDay();
      const hour = peruTime.getHours();
      const minutes = peruTime.getMinutes();
      const currentTime = hour + minutes / 60;

      let open = false;
      let closingInfo = "";

      if (day >= 1 && day <= 6) {
        if (currentTime >= 9 && currentTime < 21) {
          open = true;
          closingInfo = "Abierto hoy hasta las 9:00 PM";
        } else if (currentTime < 9) {
          closingInfo = "Cerrado ahora • Abre hoy a las 9:00 AM";
        } else {
          closingInfo =
            day === 6
              ? "Cerrado ahora • Abre domingo 9:30 AM"
              : "Cerrado ahora • Abre mañana 9:00 AM";
        }
      } else {
        if (currentTime >= 9.5 && currentTime < 14) {
          open = true;
          closingInfo = "Abierto hoy hasta las 2:00 PM";
        } else if (currentTime < 9.5) {
          closingInfo = "Cerrado ahora • Abre hoy a las 9:30 AM";
        } else {
          closingInfo = "Cerrado ahora • Abre lunes 9:00 AM";
        }
      }

      setStoreStatus({ isOpen: open, text: closingInfo });
    }

    calculateStatus();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, phone, service, date, time, notes } = formData;
    if (!name.trim() || !phone.trim() || !service || !date) {
      alert("Por favor completa todos los campos requeridos para coordinar tu cita.");
      return;
    }

    const message =
      `*¡Hola Lens Group Trujillo! Deseo agendar una cita oftálmica / visita a la óptica.*\n\n` +
      `*Nombre:* ${name.trim()}\n` +
      `*Teléfono:* ${phone.trim()}\n` +
      `*Servicio requerido:* ${service}\n` +
      `*Fecha solicitada:* ${date}\n` +
      `*Turno preferido:* ${time}\n` +
      (notes.trim() ? `*Observaciones:* ${notes.trim()}\n\n` : `\n`) +
      `¿Podrían confirmarme la disponibilidad en su sede de Trujillo? ¡Muchas gracias!`;

    const whatsappUrl = `https://wa.me/51958169535?text=${encodeURIComponent(message)}`;

    setIsSubmitted(true);

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 600);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      service: "Examen de Vista Computarizado",
      date: "",
      time: "Mañana (9:30 AM - 1:00 PM)",
      notes: "",
    });
    setIsSubmitted(false);
  };

  return (
    <section className="section section-bg-alt" id="contacto">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Ubicación y Atención</span>
          <h2 className="section-title">Visítanos o Agenda tu Consulta</h2>
          <p className="section-subtitle">
            Estamos ubicados en una zona accesible y céntrica de Trujillo con estacionamiento cercano y atención
            personalizada.
          </p>
        </div>

        <div className="contact-grid">
          {/* Information & Map Card */}
          <div className="location-info-card">
            {/* Dynamic Open/Closed Status Indicator */}
            <div
              id="storeStatusBadge"
              className="hours-status-badge"
              style={
                storeStatus.isOpen
                  ? {}
                  : {
                      background: "#fef2f2",
                      color: "#b91c1c",
                      borderColor: "#fecaca",
                    }
              }
            >
              <span
                className="dot"
                style={
                  storeStatus.isOpen
                    ? {}
                    : {
                        background: "#ef4444",
                        boxShadow: "0 0 0 2px rgba(239,68,68,0.3)",
                      }
                }
              ></span>{" "}
              {storeStatus.text}
            </div>

            <h3 style={{ marginBottom: "1.5rem" }}>Información de Atención</h3>

            <div className="info-item">
              <div className="info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <div className="info-title">Dirección de la Óptica</div>
                <div className="info-val">Galeria San Antonio, Jr. Gamarra N° 778, Trujillo 13001</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <div className="info-title">Horarios de Atención</div>
                <div className="info-val">Lunes a Sábado: 9:00 AM – 9:00 PM</div>
                <div style={{ fontSize: "0.9rem", color: "var(--color-dark-500)", marginTop: "0.2rem" }}>
                  Domingos: 9:30 AM – 2:00 PM
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <div className="info-title">Teléfonos & WhatsApp</div>
                <div className="info-val">+51 958 169 535</div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="map-container">
              <iframe
                title="Ubicación Lens Group Trujillo en Google Maps"
                src="https://maps.google.com/maps?q=Galeria%20San%20Antonio%2C%20Jr.%20Gamarra%20N%C2%B0%20778%2C%20Trujillo%2013001&t=&z=17&ie=UTF8&iwloc=&output=embed"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Appointment Booking Card */}
          <div className="appointment-card">
            <h3 style={{ marginBottom: "0.5rem" }}>Agenda tu Cita o Examen de la Vista</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-dark-500)", marginBottom: "1.5rem" }}>
              Reserva tu evaluación con nuestros optómetras. Tu solicitud se confirmará instantáneamente vía WhatsApp.
            </p>

            {!isSubmitted ? (
              <form id="appointmentForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="Ej. Ana Lucía Morales"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-input"
                      placeholder="Ej. 958 000 000"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service" className="form-label">
                      Servicio Requerido *
                    </label>
                    <select
                      id="service"
                      className="form-select"
                      required
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="Examen de Vista Computarizado">Examen de Vista Computarizado</option>
                      <option value="Graduación de Nuevas Lunas">Graduación de Nuevas Lunas</option>
                      <option value="Compra de Gafas de Sol">Compra de Gafas de Sol</option>
                      <option value="Adaptación Lentes de Contacto">Adaptación Lentes de Contacto</option>
                      <option value="Mantenimiento y Calibración">Mantenimiento y Calibración</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date" className="form-label">
                      Fecha Preferida *
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="form-input"
                      required
                      min={todayDate}
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time" className="form-label">
                      Turno de Preferencia *
                    </label>
                    <select id="time" className="form-select" required value={formData.time} onChange={handleChange}>
                      <option value="Mañana (9:30 AM - 1:00 PM)">Mañana (9:30 AM - 1:00 PM)</option>
                      <option value="Tarde (2:30 PM - 5:00 PM)">Tarde (2:30 PM - 5:00 PM)</option>
                      <option value="Noche (5:30 PM - 7:45 PM)">Noche (5:30 PM - 7:45 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    Detalles Adicionales (Opcional)
                  </label>
                  <textarea
                    id="notes"
                    className="form-textarea"
                    rows={2}
                    placeholder="¿Tienes alguna preferencia de marca o síntomas visuales?"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "1rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Confirmar Cita por WhatsApp
                </button>
              </form>
            ) : (
              /* Success Alert State */
              <div id="appointmentSuccess" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "#ecfdf5",
                    color: "#10b981",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem auto",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ marginBottom: "0.5rem", color: "var(--color-dark-900)" }}>
                  ¡Solicitud Enviada con Éxito!
                </h3>
                <p style={{ color: "var(--color-dark-600)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                  Hemos preparado tu mensaje de confirmación para WhatsApp. Nuestro asesor en Trujillo te responderá en
                  breve para asegurar tu turno.
                </p>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Agendar otra cita
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
