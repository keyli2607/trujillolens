export default function TestimonialsSection() {
  const testimonials = [
    {
      stars: "★★★★★",
      text: '"Compré mis gafas de sol Ray-Ban Aviator y comprobé el número de serie directamente en la web oficial: ¡100% auténticos! La atención en su local de la Galería San Antonio fue impecable y rápida."',
      avatar: "CA",
      author: "Carlos Alva Ramos",
      loc: "Trujillo • Local Guide",
    },
    {
      stars: "★★★★★",
      text: '"Excelente atención y gran variedad de monturas. Me asesoraron con mis lunas Blue Defense para trabajar en computadora y el alivio en la vista fue instantáneo. Muy recomendados en el centro de Trujillo."',
      avatar: "MV",
      author: "Mariana Vásquez E.",
      loc: "Trujillo • Cliente Verificado",
    },
    {
      stars: "★★★★★",
      text: '"Me graduaron mis lentes con cristales Inka Lens y montura ultraligera. La nitidez y acabado son excelentes, además tienen los mejores precios de Trujillo en marcas reconocidas."',
      avatar: "JT",
      author: "Jorge Torres Mendocilla",
      loc: "Trujillo • Cliente Verificado",
    },
  ];

  return (
    <section className="section" id="testimonios">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Opiniones de Clientes</span>
          <h2 className="section-title">La Confianza de Trujillo nos Respalda</h2>
          <p className="section-subtitle">
            Clientes reales que visitaron nuestro local en Jr. Gamarra 778 y comprobaron la autenticidad, garantía y
            trato personalizado.
          </p>
        </div>

        {/* Google Maps Business Summary Widget */}
        <div className="google-business-summary-card">
          <div className="google-summary-left">
            <div className="google-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            </div>
            <div>
              <div className="google-biz-name">
                Trujillo Lens Group
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a73e8" title="Negocio Verificado">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <div className="google-score-row">
                <span className="google-numeric-score">5.0</span>
                <span className="google-stars-icons">★★★★★</span>
                <span className="google-reviews-count">(Calificación en Google Maps)</span>
              </div>
              <div className="google-address-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Galeria San Antonio, Jr. Gamarra N° 778, Trujillo
              </div>
            </div>
          </div>

          <div className="google-summary-right">
            <a
              href="https://maps.app.goo.gl/xGcnJzLPnmXBZScR8"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-write-review"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Escribir una opinión
            </a>
            <a
              href="https://maps.app.goo.gl/xGcnJzLPnmXBZScR8"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view-maps-outline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Ver en Maps
            </a>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="test-stars">{t.stars}</div>
              <p className="test-text">{t.text}</p>
              <div className="test-author-box">
                <div className="test-avatar">{t.avatar}</div>
                <div>
                  <div className="test-author-name">{t.author}</div>
                  <div className="test-author-loc">{t.loc}</div>
                  <div className="google-tag-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Reseña en Google
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
