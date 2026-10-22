"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ProductModal from "./ProductModal";

export default function CatalogSection() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Carga los productos con su stock validado desde la API
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((datos) => {
        if (!datos.error && Array.isArray(datos)) {
          setProductos(datos);
        }
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar el catálogo:", error);
        setCargando(false);
      });
  }, []);

  // 2. Extrae las categorías únicas dinámicamente para los filtros
  const filters = useMemo(() => {
    const cats = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
    const dynamicFilters = cats.map((cat) => ({
      id: cat,
      label: cat,
    }));
    return [{ id: "todos", label: "Todos los Modelos" }, ...dynamicFilters];
  }, [productos]);

  // 3. Filtra por categoría y texto de búsqueda
  const filteredProducts = useMemo(() => {
    let list = productos;

    if (currentFilter !== "todos") {
      list = list.filter((p) => p.categoria === currentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.nombre_autogenerado && p.nombre_autogenerado.toLowerCase().includes(q)) ||
          (p.modelo && p.modelo.toLowerCase().includes(q)) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.categoria && p.categoria.toLowerCase().includes(q))
      );
    }

    return list;
  }, [productos, currentFilter, searchQuery]);

  return (
    <section className="section section-bg-alt" id="catalogo">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Colección Exclusiva 2026</span>
          <h2 className="section-title">
            Catálogo de <span className="text-gradient-primary">Lentes & Monturas</span>
          </h2>
          <p className="section-subtitle">
            Haz clic en cualquier modelo para ver sus detalles, acabados y precios con zoom de alta definición.
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="catalog-controls">
          <div className="filter-pills">
            {filters.map((f) => (
              <button
                key={f.id}
                className={`filter-btn ${currentFilter === f.id ? "active" : ""}`}
                onClick={() => setCurrentFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="catalog-search">
            <svg
              className="catalog-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              id="catalogSearch"
              placeholder="Buscar por modelo, material o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="products-grid" id="productsContainer">
          {cargando ? (
            <div
              className="empty-state"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem",
                color: "var(--color-dark-400)",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Cargando inventario desde el almacén...</h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              className="empty-state"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem",
                color: "var(--color-dark-400)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--color-dark-400)" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 style={{ marginBottom: "0.5rem" }}>No encontramos modelos que coincidan</h3>
              <p>Prueba buscando con otro término o selecciona la categoría &quot;Todos&quot;.</p>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const whatsappLink = `https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo,%20estoy%20interesado%20en%20el%20modelo%20*${encodeURIComponent(
                prod.nombre_autogenerado || prod.modelo
              )}*-%2520Precio:%20S/%20${prod.precio_venta}`;

              return (
                <article className="product-card" key={prod.id}>
                  <div className="product-media">
                    <span className="product-tag-badge">Stock: {prod.stock_total} disp.</span>

                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "220px",
                        backgroundColor: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={prod.imagen || "/images/optics_acetate.jpg"}
                        alt={prod.nombre_autogenerado || prod.modelo || "Lente"}
                        width={320}
                        height={220}
                        className="product-image"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </div>

                    <div className="product-quick-actions">
                      <button
                        type="button"
                        className="btn-icon-zoom"
                        title="Ver detalles interactivos"
                        onClick={() => setSelectedProduct(prod)}
                        aria-label="Ver detalles"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="product-body">
                    <h3 className="product-title">{prod.nombre_autogenerado || prod.modelo}</h3>

                    <div className="product-specs">
                      {prod.modelo && <span className="spec-chip">Modelo: {prod.modelo}</span>}
                      {prod.material && <span className="spec-chip">{prod.material}</span>}
                      <span className="spec-chip" style={{ backgroundColor: "#e6fffa", color: "#0d9488", fontWeight: "600" }}>
                        Disponible: {prod.stock_total} u.
                      </span>
                    </div>

                    <div className="product-footer">
                      <div className="product-price-box">
                        <span className="product-price-label">Precio Venta</span>
                        <div>
                          <span className="product-price">S/ {prod.precio_venta}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          style={{ flex: 1 }}
                          onClick={() => setSelectedProduct(prod)}
                        >
                          Detalle
                        </button>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-whatsapp"
                          style={{ flex: 1, justifyContent: "center" }}
                          title="Consultar por WhatsApp"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.772zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
                          </svg>
                          Cotizar
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Catalog Banner Promo */}
        <div className="catalog-promo-banner">
          <div className="catalog-promo-copy">
            <h3 className="catalog-promo-title">
              ¿Tienes una receta
              <br />
              oftálmica de tu
              <br />
              oftalmólogo?
            </h3>
            <p className="catalog-promo-description">
              Envíanos la foto de tu
              <br />
              prescripción médica por
              <br />
              WhatsApp y te cotizamos los
              <br />
              cristales exactos al instante.
            </p>
          </div>
          <a
            href="https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo,%20adjunto%20mi%20receta%20m%C3%A9dica%20para%20cotizar%20mis%20lunas."
            target="_blank"
            rel="noopener noreferrer"
            className="btn catalog-promo-button"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
            </svg>
            <span>Enviar Receta por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}