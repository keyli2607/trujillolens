"use client";

import { useState, useRef } from "react";
import { WHATSAPP_STORE_PHONE } from "../data/orders";

const STEP_ICONS = {
  1: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  2: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
  3: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  ),
};

const CHECK_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SAMPLE_CHIPS = [
  { code: "LGT-2025-0450", tag: "Cola" },
  { code: "LGT-2025-0105", tag: "Proceso" },
  { code: "LGT-2025-0342", tag: "Listo" },
];

export default function TrackingSection() {
  const [code, setCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef(null);

  const handleSearch = async (searchVal) => {
    const val = searchVal.trim().toUpperCase();
    if (!val) return;

    setSearchedCode(val);
    setIsLoading(true);
    setOrderResult(null);
    setNotFound(false);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(val)}`, { cache: "no-store" });
      if (!response.ok) {
        setNotFound(true);
        return;
      }

      setOrderResult(await response.json());
    } catch {
      setOrderResult(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(code);
  };

  const handleChipClick = (sampleCode) => {
    setCode(sampleCode);
    handleSearch(sampleCode);
  };

  const resetSearch = () => {
    setCode("");
    setSearchedCode("");
    setOrderResult(null);
    setNotFound(false);
  };

  const progressPercent = orderResult ? ((orderResult.currentStep - 1) / 2) * 100 : 0;

  return (
    <section className="section section-bg-alt" id="seguimiento">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Estado en Tiempo Real</span>
          <h2 className="section-title">Seguimiento de Pedido</h2>
          <p className="section-subtitle">
            Ingresa el código de tu boleta o el que te enviamos por WhatsApp y conoce en qué etapa está tu orden.
          </p>
        </div>

        {/* Tarjeta de búsqueda */}
        <div
          className="tracking-search-card"
          style={{ maxWidth: "820px", margin: "0 auto 3rem auto", position: "static", boxShadow: "var(--shadow-lg)" }}
        >
          <form id="trackingForm" className="tracking-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="trackingCodeInput" className="tracking-input-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <line x1="7" y1="8" x2="17" y2="8"></line>
                <line x1="7" y1="12" x2="17" y2="12"></line>
                <line x1="7" y1="16" x2="13" y2="16"></line>
              </svg>
              Ingresa tu código de seguimiento
            </label>

            <div className="tracking-input-group">
              <div className="tracking-input-wrap">
                <span className="tracking-input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="text"
                  id="trackingCodeInput"
                  className="tracking-input"
                  placeholder="Ej: LGT-2025-0342"
                  maxLength={20}
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Código de seguimiento de pedido"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary tracking-btn-submit" id="trackingSubmitBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {isLoading ? "Consultando..." : "Consultar estado"}
              </button>
            </div>

            <div className="tracking-help-row">
              <span>El código aparece en tu boleta o fue enviado por WhatsApp.</span>
              <a
                href="https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo%2C%20no%20encuentro%20mi%20c%C3%B3digo%20de%20seguimiento."
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-wa-help"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
                </svg>
                ¿No tienes tu código? Escríbenos por WhatsApp
              </a>
            </div>
          </form>

          {/* Chips de ejemplo */}
          <div className="tracking-chips-wrap">
            <div className="tracking-chips-title">Prueba con un código de ejemplo</div>
            <div className="tracking-chips-list">
              {SAMPLE_CHIPS.map((chip) => (
                <button
                  type="button"
                  key={chip.code}
                  className="tracking-chip-btn"
                  onClick={() => handleChipClick(chip.code)}
                >
                  {chip.code} <span className="tracking-chip-tag">{chip.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Área de resultado y error */}
        <div ref={resultRef}>
          {orderResult && (
            <div className="tracking-result-area" style={{ maxWidth: "960px", margin: "0 auto" }}>
              <div className="tracking-result-card">
                {/* Encabezado del Pedido */}
                <div className="tracking-result-header">
                  <div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--color-teal-300)",
                        marginBottom: "0.35rem",
                        fontWeight: 700,
                      }}
                    >
                      Código de Orden Oficial
                    </div>
                    <div className="tracking-code-pill">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                        <line x1="7" y1="8" x2="17" y2="8"></line>
                        <line x1="7" y1="12" x2="17" y2="12"></line>
                        <line x1="7" y1="16" x2="13" y2="16"></line>
                      </svg>
                      {orderResult.code}
                    </div>
                  </div>

                  <div>
                    <span className={`tracking-state-badge ${orderResult.statusBadgeClass}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {orderResult.statusBadgeText}
                    </span>
                  </div>
                </div>

                {/* Datos Principales de la Orden */}
                <div className="tracking-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Cliente Titular</span>
                    <span className="meta-value">{orderResult.customer}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Fecha de Recepción</span>
                    <span className="meta-value">{orderResult.receivedDate}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Entrega Estimada</span>
                    <span className="meta-value meta-value-highlight">{orderResult.estimatedDate}</span>
                  </div>
                  <div className="meta-item" style={{ gridColumn: "1 / -1" }}>
                    <span className="meta-label">Tipo de Servicio / Producto</span>
                    <span className="meta-value" style={{ fontSize: "1rem", color: "var(--color-dark-800)" }}>
                      {orderResult.service}
                    </span>
                  </div>
                  <div className="meta-item" style={{ gridColumn: "1 / -1" }}>
                    <span className="meta-label">Sede de Entrega en Trujillo</span>
                    <span className="meta-value" style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-dark-700)" }}>
                      {orderResult.branch} (Horario: Lun-Sáb 9am–9pm / Dom 9:30am–2pm)
                    </span>
                  </div>
                </div>

                {/* Línea de Tiempo */}
                <div className="tracking-timeline-section">
                  <div className="timeline-header-row">
                    <div>
                      <h3 className="timeline-title">Progreso del Pedido</h3>
                      <p style={{ fontSize: "0.9rem", color: "var(--color-dark-500)", marginTop: "0.2rem" }}>
                        Línea de tiempo auditada en laboratorio
                      </p>
                    </div>
                    <div className="timeline-estimated-pill">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Fecha Estimada: <strong>{orderResult.estimatedDate}</strong>
                    </div>
                  </div>

                  <div className="timeline-track-wrap">
                    <div className="timeline-track-bar">
                      <div
                        className="timeline-progress-bar"
                        id="timelineProgressBar"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <ul className="timeline-steps">
                      {orderResult.history.map((item) => {
                        let stepClass = "timeline-step";
                        let nodeIcon = STEP_ICONS[item.step];

                        if (item.step < orderResult.currentStep) {
                          stepClass += " is-completed";
                          nodeIcon = CHECK_ICON;
                        } else if (item.step === orderResult.currentStep) {
                          stepClass += " is-active";
                        } else {
                          stepClass += " is-pending";
                        }

                        return (
                          <li className={stepClass} key={item.step}>
                            <div className="timeline-node">{nodeIcon}</div>
                            <div className="timeline-step-info">
                              <div className="timeline-step-label">{item.name}</div>
                              <div className="timeline-step-desc">{item.desc}</div>
                              <div
                                style={{
                                  fontSize: "0.725rem",
                                  fontWeight: 700,
                                  color: "var(--color-teal-700)",
                                  marginTop: "0.2rem",
                                }}
                              >
                                {item.date}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Mensaje de Estado Actual */}
                  <div className={`tracking-status-box ${orderResult.statusBoxClass}`}>
                    <div className="status-box-icon">{STEP_ICONS[orderResult.currentStep]}</div>
                    <div style={{ flex: 1 }}>
                      <div className="status-box-title">{orderResult.statusTitle}</div>
                      <div className="status-box-desc">{orderResult.statusDesc}</div>

                      {orderResult.showPickupBanner && (
                        <div className="status-box-pickup-info">
                          <span className="status-box-pickup-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            Galería San Antonio, Jr. Gamarra N° 778
                          </span>
                          <span className="status-box-pickup-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Lunes a Sábado: 9:00 AM – 9:00 PM
                          </span>
                          <span className="status-box-pickup-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                              <line x1="7" y1="8" x2="17" y2="8"></line>
                            </svg>
                            Presentar DNI o comprobante de compra
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones Inferiores */}
                <div className="tracking-result-actions">
                  <a
                    href={`https://wa.me/${WHATSAPP_STORE_PHONE}?text=${encodeURIComponent(
                      `Hola Lens Group Trujillo, tengo una consulta sobre mi pedido *${orderResult.code}* a nombre de *${orderResult.customer}* (${orderResult.service}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ flex: 1, maxWidth: "460px" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
                    </svg>
                    Consultar por WhatsApp sobre este pedido
                  </a>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button type="button" className="btn btn-outline" onClick={resetSearch}>
                      Nueva Consulta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {notFound && (
            <div className="tracking-error-card" style={{ maxWidth: "820px", margin: "0 auto" }}>
              <div className="tracking-error-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="tracking-error-title">No encontramos ese código ({searchedCode})</h3>
              <p className="tracking-error-text">
                No encontramos ese código, verifica o contáctanos por WhatsApp. Si acabas de realizar tu pedido en tienda
                hoy, recuerda que el registro en laboratorio puede tomar unos minutos en reflejarse.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/${WHATSAPP_STORE_PHONE}?text=${encodeURIComponent(
                    `Hola Lens Group Trujillo, no encuentro el código de mi orden *${searchedCode}* en el sistema de seguimiento y quisiera consultar el estado de mis lentes.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
                <button type="button" className="btn btn-outline" onClick={resetSearch}>
                  Probar otro código
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Compacto */}
        <div style={{ marginTop: "4rem" }}>
          <h3
            style={{
              textAlign: "center",
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--color-dark-900)",
              marginBottom: "1.75rem",
            }}
          >
            Preguntas frecuentes sobre pedidos
          </h3>
          <div className="tracking-faq-grid">
            <div className="tracking-faq-card">
              <div className="faq-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                  <line x1="7" y1="8" x2="17" y2="8"></line>
                  <line x1="7" y1="12" x2="17" y2="12"></line>
                </svg>
              </div>
              <div className="faq-card-q">¿Perdí mi código?</div>
              <div className="faq-card-a">
                Está impreso en tu boleta o te lo enviamos por WhatsApp. Escríbenos con tu nombre y lo ubicamos al instante.
              </div>
            </div>

            <div className="tracking-faq-card">
              <div className="faq-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="faq-card-q">¿Cuánto demora mi pedido?</div>
              <div className="faq-card-a">
                Monofocales: 1–2 días. Progresivos: 2–3 días. Fotocromáticos / Polarizados: 2–4 días. Te notificamos por
                WhatsApp cuando esté listo.
              </div>
            </div>

            <div className="tracking-faq-card">
              <div className="faq-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="faq-card-q">Horario de recojo</div>
              <div className="faq-card-a">
                <strong>Galería San Antonio, Jr. Gamarra N° 778.</strong>
                <br />
                Lun–Sáb: 9:00 a.m.–9:00 p.m. &nbsp;|&nbsp; Dom: 9:30 a.m.–2:00 p.m.
                <br />
                Trae tu DNI o boleta.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
