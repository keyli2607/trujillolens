"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { buildWhatsAppProductLink } from "../data/products";

export default function ProductModal({ product, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen || !product) return null;
  return (
    <div
      className="modal-overlay active"
      id="productModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => {
        if (e.target.id === "productModal") onClose();
      }}
    >
      <div className="modal-dialog">
        <button className="modal-close-btn" id="modalCloseBtn" aria-label="Cerrar ventana" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="modal-content-grid">
          {/* Product Image Showcase Container */}
          {/* Columna Izquierda: Información Principal + Imagen del Producto */}
          <div className="modal-viewer-wrapper">
            <div className="modal-main-info">
              {/* Título / Nombre del Producto */}
              <h2 id="modalTitle" style={{ fontSize: "1.45rem", lineHeight: 1.25, margin: "0.2rem 0 0.5rem 0", color: "var(--color-dark-900)" }}>
                {product.nombre_autogenerado || product.name || product.modelo}
              </h2>

              {/* Precios */}
              <div style={{ marginBottom: "0.6rem", display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
                <span className="product-price" id="modalPrice" style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--color-teal-700)" }}>
                  S/ {product.precio_venta ?? product.price}
                </span>
                {(product.oldPrice || product.precio_mayorista) && (
                  <span className="product-price-old" id="modalOldPrice" style={{ fontSize: "1.05rem", textDecoration: "line-through", color: "var(--color-dark-400)" }}>
                    S/ {product.oldPrice || Math.round((product.precio_venta || 0) * 1.2)}
                  </span>
                )}
              </div>

              {/* Descripción */}
              <p id="modalDesc" style={{ fontSize: "0.9rem", lineHeight: 1.45, color: "var(--color-dark-600)", margin: 0 }}>
                {product.description ||
                  `Montura oftálmica original distribuida por Lens Group Trujillo. Elaborada con acabados de alta durabilidad en ${product.material || "material premium"}, ideal para adaptación de cristales formulados, antirreflejo y protección UV.`}
              </p>
            </div>

            <div className="modal-zoom-container" id="modalZoomContainer">
              {product.stock_total !== undefined && (
                <span className="product-tag-badge" style={{ background: "#0d9488", color: "#fff", padding: "0.2rem 0.5rem", fontSize: "0.75rem", top: "1rem", left: "1rem" }}>
                  Stock: {product.stock_total}
                </span>
              )}
              {product.tag && (
                <span className="product-tag-badge" id="modalTag" style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem", top: product.stock_total !== undefined ? "2.6rem" : "1rem", left: "1rem" }}>
                  {product.tag}
                </span>
              )}
              <img
                src={product.imagen || product.image || "/images/optics_acetate.jpg"}
                alt={product.nombre_autogenerado || product.name || product.modelo || "Lente"}
                className="modal-zoom-image"
                id="modalZoomImage"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/optics_acetate.jpg";
                }}
              />
            </div>
          </div>

          {/* Columna Derecha: Especificaciones Técnicas y Botones */}
          <div className="modal-details">
            <h3 className="modal-specs-title">Ficha Técnica & Detalles</h3>

            {/* Chips de etiquetas adicionales */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
              {Array.isArray(product.etiquetas_publico) &&
                product.etiquetas_publico.map((tag, idx) => (
                  <span
                    key={`pub-${idx}`}
                    className="spec-chip"
                    style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: "700", fontSize: "0.75rem" }}
                  >
                    {tag}
                  </span>
                ))}
              {Array.isArray(product.etiquetas_tecnicas) &&
                product.etiquetas_tecnicas.map((tag, idx) => (
                  <span
                    key={`tec-${idx}`}
                    className="spec-chip"
                    style={{ background: "#f1f5f9", color: "#475569", fontWeight: "600", fontSize: "0.75rem" }}
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Specifications Table */}
            <div className="modal-specs-list" id="modalSpecsList">
              {product.modelo && (
                <div className="modal-spec-row">
                  <span className="modal-spec-label">Modelo</span>
                  <span className="modal-spec-value">{product.modelo}</span>
                </div>
              )}
              <div className="modal-spec-row">
                <span className="modal-spec-label">Material</span>
                <span className="modal-spec-value">{product.material || product.details?.material || "Acetato / Metal"}</span>
              </div>
              {product.codigo_sistema && (
                <div className="modal-spec-row">
                  <span className="modal-spec-label">Código de Sistema</span>
                  <span className="modal-spec-value" style={{ fontFamily: "monospace" }}>{product.codigo_sistema}</span>
                </div>
              )}
              {product.details?.lenses && (
                <div className="modal-spec-row">
                  <span className="modal-spec-label">Tratamiento de Cristales</span>
                  <span className="modal-spec-value">{product.details.lenses}</span>
                </div>
              )}
              {product.details?.protection && (
                <div className="modal-spec-row">
                  <span className="modal-spec-label">Nivel de Protección</span>
                  <span className="modal-spec-value">{product.details.protection}</span>
                </div>
              )}
              {product.details?.measurements && (
                <div className="modal-spec-row">
                  <span className="modal-spec-label">Dimensiones Oficiales</span>
                  <span className="modal-spec-value">{product.details.measurements}</span>
                </div>
              )}
              <div className="modal-spec-row">
                <span className="modal-spec-label">Garantía y Ajuste</span>
                <span className="modal-spec-value" style={{ color: "#0d9488" }}>Incluido (Lens Group Trujillo)</span>
              </div>
            </div>

            {/* Direct Purchase Button */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href={`https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo,%20estoy%20interesado%20en%20el%20modelo%20*${encodeURIComponent(
                  product.nombre_autogenerado || product.name || product.modelo
                )}*%20-%20Precio:%20S/%20${product.precio_venta ?? product.price}`}
                target="_blank"
                rel="noopener noreferrer"
                id="modalWhatsAppBtn"
                className="btn btn-whatsapp"
                style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
                </svg>
                Comprar / Consultar en WhatsApp
              </a>
              <button className="btn btn-outline" onClick={onClose} type="button" style={{ width: "100%" }}>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
