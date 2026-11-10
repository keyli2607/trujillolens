import Image from "next/image";

export default function BrandsSection() {
  const brands = [
    { name: "TROPIC Sunglasses", src: "/brands/tropic.png", alt: "TROPIC Sunglasses" },
    { name: "SYLVANE Sunglasses", src: "/brands/sylvane.png", alt: "SYLVANE Sunglasses" },
    { name: "MELY Sunglasses RTD", src: "/brands/mely.png", alt: "MELY Sunglasses" },
    { name: "Darleen Kids Sunglasses", src: "/brands/darleen.png", alt: "Darleen Kids" },
    { name: "DEBBY Sunglassss Kids", src: "/brands/debby.png", alt: "DEBBY Kids" },
    { name: "Tony Lu Sunglasses Kids", src: "/brands/tony_lu.png", alt: "Tony Lu Kids" },
    { name: "DORIAN Sunglasses Kids", src: "/brands/dorian.png", alt: "DORIAN Sunglasses Kids" },
    { name: "FREDD Sunglasses Kids", src: "/brands/fredd.png", alt: "FREDD Sunglasses Kids" },
    { name: "Greisy Sunglasses", src: "/brands/greisy.png", alt: "Greisy Sunglasses" },
    { name: "Fiorella Conte", src: "/brands/fiorellaconte.svg", alt: "Fiorella Conte" },
    { name: "Inka Lens", src: "/brands/inkalens.svg", alt: "Inka Lens" },
    { name: "D&L Optical", src: "/brands/dandl.svg", alt: "D&L" },
    { name: "Kevin Collection", src: "/brands/kevin.svg", alt: "Kevin" },
  ];

  return (
    <section className="brands-section" id="marcas">
      <div className="container">
        <div className="brands-header">
          <p>Distribuidor Autorizado de Marcas Comerciales de Alta Calidad</p>
        </div>

        <div className="brands-carousel-wrapper">
          <div className="brands-carousel-track">
            {/* Set 1 */}
            {brands.map((b, idx) => (
              <div className="brand-item" key={`b1-${idx}`} title={b.name}>
                <Image src={b.src} alt={b.alt} width={130} height={45} style={{ objectFit: "contain" }} />
              </div>
            ))}

            {/* Set 2 (Duplicado para animación infinita fluida) */}
            {brands.map((b, idx) => (
              <div className="brand-item" aria-hidden="true" key={`b2-${idx}`} title={b.name}>
                <Image src={b.src} alt={b.alt} width={130} height={45} style={{ objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Pillars Grid */}
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="trust-title">Procedencia Garantizada</h3>
            <p className="trust-desc">
              Todos nuestros lentes incluyen código de serie, estuche oficial y certificado internacional de fábrica.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                </path>
              </svg>
            </div>
            <h3 className="trust-title">Taller & Calibración Propia</h3>
            <p className="trust-desc">
              Contamos con biselado digital de última generación en Trujillo para una adaptación milimétrica a tu receta.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="trust-title">Optómetras Colegiados</h3>
            <p className="trust-desc">
              Evaluación visual completa, refracción computarizada y asesoramiento estético según la anatomía de tu rostro.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h3 className="trust-title">Entrega Rápida en Trujillo</h3>
            <p className="trust-desc">
              Retira en nuestra tienda del Centro Histórico o solicita envío seguro a domicilio en toda la provincia de Trujillo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
