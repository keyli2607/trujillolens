import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="section section-bg-alt" id="nosotros">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-tag">Conoce Lens Group Trujillo</span>
            <h2 className="section-title">
              Pasión por la salud visual y la elegancia en cada mirada
            </h2>
            <p>
              Fundada con la convicción de ofrecer a los trujillanos un estándar superior en óptica, Lens Group
              Trujillo se ha consolidado como distribuidor autorizado oficial de las marcas oftálmicas y de sol más
              reconocidas a nivel global.
            </p>
            <p>
              Nuestro equipo está conformado por optómetras titulados y asesores especializados en visagismo. Combinamos
              instrumental computarizado de precisión milimétrica con una curaduría estética moderna para que tus lentes
              sean una extensión perfecta de tu personalidad.
            </p>

            <div className="about-features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <div className="feature-item-title">Examen Clínico Completo</div>
                  <div className="feature-item-desc">Autorefractómetro digital de última generación.</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <div className="feature-item-title">Ajuste & Mantenimiento</div>
                  <div className="feature-item-desc">Calibración y limpieza ultrasónica gratuita.</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <div className="feature-item-title">Garantía de Adaptación</div>
                  <div className="feature-item-desc">Respaldamos tu comodidad visual al 100%.</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <div className="feature-item-title">Atención Personalizada</div>
                  <div className="feature-item-desc">Asesoría de estilo según tu tipo de rostro.</div>
                </div>
              </div>
            </div>

          </div>

          <div className="about-images-col">
            <Image
              src="/images/optometria-consultorio.jpg"
              alt="Consultorio óptico moderno Lens Group Trujillo"
              width={540}
              height={400}
              className="about-main-img"
              style={{ width: "100%", objectFit: "cover" }}
            />

            <div className="about-sub-card">
              <div style={{ display: "flex", alignContent: "center", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <Image
                  src="/images/doctor-optometrista.jpg"
                  alt="Doctor optómetra en Lens Group Trujillo"
                  width={48}
                  height={48}
                  style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ fontSize: "0.95rem", marginBottom: "0.1rem" }}>Optometría Certificada</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-teal-700)", fontWeight: 700 }}>
                    Colegio de Optómetras del Perú
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-dark-500)", margin: 0 }}>
                Diagnóstico visual preciso y asesoría en selección de cristales progresivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
