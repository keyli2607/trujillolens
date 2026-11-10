import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/images/logo.svg"
              alt="Lens Group Trujillo Logo"
              width={180}
              height={52}
              style={{ height: "52px", width: "auto", marginBottom: "1rem" }}
            />
            <p>
              Óptica y distribuidora autorizada de las firmas líderes de lentes y monturas. Innovación oftálmica, garantía
              oficial y estilo inigualable en Trujillo, Perú.
            </p>
            <div className="social-links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="Facebook Lens Group Trujillo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="Instagram Lens Group Trujillo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="TikTok Lens Group Trujillo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.95-4.5V8.09a8.21 8.21 0 0 0 4.82 1.55v-3a4.85 4.85 0 0 1-1-.05z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Categorías</h4>
            <ul className="footer-links">
              <li><Link href="/#catalogo">Gafas de Sol Polarizadas</Link></li>
              <li><Link href="/#catalogo">Lentes con Filtro Blue Light</Link></li>
              <li><Link href="/#catalogo">Monturas de Titanio &amp; Acetato</Link></li>
              <li><Link href="/#catalogo">Lunas Progresivas Digitales</Link></li>
              <li><Link href="/#catalogo">Lentes de Contacto</Link></li>
              <li><Link href="/seguimiento" style={{ color: "var(--color-teal-300)" }}>Seguimiento de Pedido</Link></li>
              <li><Link href="/admin.html" style={{ color: "var(--color-teal-400)", fontWeight: 600 }}>Portal Staff (Acceso)</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Información Legal</h4>
            <ul className="footer-links">
              <li><Link href="/#contacto">RUC: 20609502623</Link></li>
              <li><Link href="/#contacto">Políticas de Garantía Oficial</Link></li>
              <li><Link href="/#contacto">Términos y Condiciones</Link></li>
              <li><Link href="/#contacto">Protección de Datos Personales</Link></li>
            </ul>
            {/* Libro de Reclamaciones */}
            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                padding: "0.6rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>
                Libro de Reclamaciones Virtual
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 <strong>Lens Group Trujillo</strong>. Todos los derechos reservados. Trujillo, La Libertad - Perú.
          </div>
          <div style={{ color: "var(--color-teal-400)", fontWeight: 600 }}>
            Salud Visual • Moda • Confiabilidad
          </div>
        </div>
      </div>
    </footer>
  );
}
