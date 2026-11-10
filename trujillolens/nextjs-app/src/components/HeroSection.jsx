import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-section" id="inicio">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </span>
            <span className="hero-badge-text">Distribuidor Autorizado • 100% Originales</span>
          </div>

          <h1 className="hero-title">
            Visión clara, <br />
            <span className="text-gradient-teal">estilo insuperable</span> en Trujillo
          </h1>

          <p className="hero-description">
            Descubre la colección más exclusiva de gafas de sol, monturas de diseñador y lentes oftálmicos con
            tecnología digital. Cuidamos de tu salud visual con precisión médica y elegancia.
          </p>

          <div className="hero-cta-group">
            <Link href="/#catalogo" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Ver el catálogo
            </Link>
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">+6<span>Años</span></span>
              <p className="metric-label">Liderando la óptica en Trujillo</p>
            </div>
            <div className="metric-item">
              <span className="metric-number">+800<span></span></span>
              <p className="metric-label">Modelos y monturas disponibles</p>
            </div>
            <div className="metric-item">
              <span className="metric-number">100<span>%</span></span>
              <p className="metric-label">Garantía oficial y autenticidad</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <Image
              src="/images/hero_eyewear.jpg"
              alt="Colección de lentes Lens Group Trujillo"
              width={640}
              height={560}
              priority
              id="heroMainImg"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>

          {/* Floating Badge 1 */}
          <div className="floating-card floating-card-1">
            <div className="floating-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <div className="floating-card-title">Garantía Certificada</div>
              <div className="floating-card-sub">Marcas nacionales 100% originales</div>
            </div>
          </div>

          {/* Floating Badge 2 */}
          <div className="floating-card floating-card-2">
            <div className="floating-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" y1="8" x2="12" y2="8"></line>
                <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
              </svg>
            </div>
            <div>
              <div className="floating-card-title">Laboratorio Digital</div>
              <div className="floating-card-sub">Corte computarizado de lunas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
