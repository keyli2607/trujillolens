"use client";

import { useState } from "react";
import Image from "next/image";
import { TREATMENTS_DATA } from "../data/treatments";

const OPTIONS = [
  {
    key: "blue",
    title: "Filtro Blue Defense",
    desc: "Protege tus ojos de monitores y celulares",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    key: "antireflective",
    title: "Antirreflejo Crizal",
    desc: "Máxima transparencia sin reflejos nocturnos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
      </svg>
    ),
  },
  {
    key: "polarized",
    title: "Polarizado Pro UV400",
    desc: "Elimina encandilamientos en sol brillante",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
  },
  {
    key: "transitions",
    title: "Fotocromático Transitions",
    desc: "Se adapta a la luz: claro en interiores, oscuro afuera",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    ),
  },
];

export default function LensSimulator() {
  const [activeKey, setActiveKey] = useState("blue");
  const activeData = TREATMENTS_DATA[activeKey];

  return (
    <section className="section" id="simulador">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Herramienta Visual</span>
          <h2 className="section-title">Simulador de Tratamientos de Lunas</h2>
          <p className="section-subtitle">
            Experimenta cómo cambia tu visión con cada tecnología de cristales antes de hacer tu elección.
          </p>
        </div>

        <div className="simulator-card">
          {/* Visual Glass Simulation Area */}
          <div className="simulator-viewer">
            <Image
              src="/images/trujillo_city.jpg"
              alt="Simulación visual Trujillo"
              width={700}
              height={450}
              className="simulator-bg-img"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="simulator-lens-overlay">
              <div
                className={`simulator-lens-filter ${activeData.filterClass}`}
                id="simulatorLensFilter"
              ></div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                background: "rgba(15,23,42,0.8)",
                color: "white",
                padding: "0.4rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              Vista simulada a través del lente óptico
            </div>
          </div>

          {/* Controls */}
          <div className="simulator-controls">
            <h3 id="simActiveTitle" style={{ marginBottom: "0.5rem", fontSize: "1.3rem" }}>
              {activeData.title}
            </h3>
            <p
              id="simActiveDesc"
              style={{ fontSize: "0.9rem", color: "var(--color-dark-600)", marginBottom: "0.75rem" }}
            >
              {activeData.description}
            </p>
            <p
              id="simActiveIdeal"
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-teal-700)",
                marginBottom: "1.5rem",
              }}
            >
              Ideal para: {activeData.idealFor}
            </p>

            <div className="sim-options-list">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`sim-opt-button ${activeKey === opt.key ? "active" : ""}`}
                  onClick={() => setActiveKey(opt.key)}
                >
                  <div className="sim-opt-icon">{opt.icon}</div>
                  <div>
                    <div className="sim-opt-title">{opt.title}</div>
                    <div className="sim-opt-desc">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
