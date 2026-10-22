(function () {
  'use strict';

  const LG = window.LG = window.LG || {};
  const C = LG.components = LG.components || {};

  // 1. TOP BAR
  C.TopBar = function () {
    const s = LG.data.site.contact;
    return LG.html`
      <div class="top-bar">
        <div class="container top-bar-content">
          <div class="top-bar-info">
            <span class="top-bar-item">
              ${LG.icon('pin', { size: 15, sw: 2.2 })}
              ${s.address}
            </span>
            <span class="top-bar-item">
              ${LG.icon('phone', { size: 15, sw: 2.2 })}
              ${s.phone}
            </span>
          </div>
          <div class="top-bar-item">
            <span class="top-bar-badge">
              ${LG.icon('star', { size: 13 })}
              ${s.badge}
            </span>
            <a href="admin.html" class="top-bar-admin-link" title="Portal Staff y Toma de Decisiones">
              ${LG.icon('lock', { size: 12, sw: 2.2 })}
              Portal Staff
            </a>
          </div>
        </div>
      </div>
    `;
  };

  // 2. HEADER
  C.Header = function (opts = {}) {
    const current = opts.current || 'inicio';
    const isHome = opts.isHome !== false;
    const links = isHome ? LG.data.site.nav.home : LG.data.site.nav.tracking;

    return LG.html`
      <header class="site-header" id="siteHeader">
        <div class="container navbar">
          <a href="${isHome ? '#inicio' : 'index.html'}" class="nav-brand" title="Lens Group Trujillo">
            <img src="assets/images/logo.jpg" alt="Lens Group Trujillo - Distribuidor Autorizado" class="brand-logo-img">
          </a>

          <nav class="nav-menu" id="navMenu">
            <button class="mobile-close-btn" id="mobileCloseBtn" aria-label="Cerrar menú">&times;</button>
            <div class="nav-menu-divider"></div>
            ${LG.each(links, (item) => {
              const isActive = (item.href === `#${current}` || item.href === current);
              const extraTitle = item.title ? ` title="${LG.esc(item.title)}"` : '';
              return `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}"${extraTitle}>${item.label}</a>`;
            })}
            <div class="nav-menu-divider"></div>
            <a href="${isHome ? '#contacto' : 'index.html#contacto'}" class="btn btn-primary drawer-contact-btn">
              Agendar Cita en Trujillo
            </a>
          </nav>

          <div class="nav-actions">
            <a href="${isHome ? '#contacto' : 'index.html#contacto'}" class="btn btn-navy btn-sm btn-contact">
              Agendar Cita
            </a>
          </div>
        </div>
      </header>
      <div class="nav-menu-overlay" id="navMenuOverlay"></div>
    `;
  };

  // 3. HERO SECTION
  C.Hero = function () {
    const h = LG.data.site.hero;
    return LG.html`
      <section class="hero-section" id="inicio">
        <div class="container hero-grid">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="hero-badge-icon">${LG.icon('shieldCheck', { size: 18 })}</span>
              <span class="hero-badge-text">${h.badge}</span>
            </div>

            <h1 class="hero-title">
              ${h.titleTop} <br>
              <span class="text-gradient-teal">${h.titleHighlight}</span> ${h.titleBottom}
            </h1>

            <p class="hero-description">${h.description}</p>

            <div class="hero-cta-group">
              <a href="#catalogo" class="btn btn-primary">
                ${LG.icon('cart', { size: 20, sw: 2 })}
                Ver Catálogo
              </a>
            </div>

            <div class="hero-metrics">
              ${LG.each(h.metrics, (m) => LG.html`
                <div class="metric-item">
                  <span class="metric-number">${m.number}<span>${m.unit}</span></span>
                  <p class="metric-label">${m.label}</p>
                </div>
              `)}
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-image-wrapper">
              <img src="${h.image}" alt="Colección de lentes Lens Group Trujillo" id="heroMainImg">
            </div>

            ${LG.each(h.floatingCards, (c, i) => LG.html`
              <div class="floating-card floating-card-${i + 1}">
                <div class="floating-card-icon">
                  ${LG.icon(c.icon, { size: 24, sw: 2.2 })}
                </div>
                <div>
                  <div class="floating-card-title">${c.title}</div>
                  <div class="floating-card-sub">${c.sub}</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  };

  // 4. BRANDS & TRUST SECTION
  C.BrandsSection = function () {
    const brands = LG.data.site.brands;
    const pillars = LG.data.site.trustPillars;

    return LG.html`
      <section class="brands-section" id="marcas">
        <div class="container">
          <div class="brands-header">
            <p>Distribuidor Autorizado de Marcas Comerciales de Alta Calidad</p>
          </div>

          <div class="brands-carousel-wrapper">
            <div class="brands-carousel-track">
              ${LG.each(brands, (b) => LG.html`
                <div class="brand-item" title="${b.title}">
                  <img src="${b.logo}" alt="${b.alt}" loading="lazy">
                </div>
              `)}
              ${LG.each(brands, (b) => LG.html`
                <div class="brand-item" aria-hidden="true" title="${b.title}">
                  <img src="${b.logo}" alt="${b.alt}" loading="lazy">
                </div>
              `)}
            </div>
          </div>

          <div class="trust-grid">
            ${LG.each(pillars, (p) => LG.html`
              <div class="trust-card">
                <div class="trust-icon">
                  ${LG.icon(p.icon, { size: 28, sw: 2 })}
                </div>
                <h3 class="trust-title">${p.title}</h3>
                <p class="trust-desc">${p.desc}</p>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  };

  // 5. CATALOG SECTION (ADULTOS / GENERAL)
  C.CatalogSection = function () {
    const filters = LG.data.site.catalogFilters;
    return LG.html`
      <section class="section section-bg-alt" id="catalogo">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Colección Exclusiva 2026</span>
            <h2 class="section-title">Catálogo de <span class="text-gradient-primary">Lentes & Monturas</span></h2>
            <p class="section-subtitle">
              Haz clic en cualquier modelo para ver sus detalles, acabados y precios con zoom de alta definición.
            </p>
          </div>

          <div class="catalog-controls">
            <div class="filter-pills" role="group" aria-label="Filtrar catálogo por categoría">
              ${LG.each(filters, (f, i) => LG.html`
                <button type="button" class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${f.value}">${f.label}</button>
              `)}
            </div>
            <label class="catalog-search">
              <span class="catalog-search-icon" aria-hidden="true">
                ${LG.icon('searchAlt', { size: 18, sw: 2 })}
              </span>
              <input id="catalogSearch" type="search" placeholder="Buscar por modelo, marca o tecnología"
                autocomplete="off" aria-label="Buscar productos" />
            </label>
          </div>

          <div class="products-grid" id="productsContainer">
            <!-- Renderizado dinámicamente por catalog.js -->
          </div>

          <div class="catalog-promo-banner">
            <div class="catalog-promo-copy">
              <h3 class="catalog-promo-title">¿Tienes una receta<br>oftálmica de tu<br>oftalmólogo?</h3>
              <p class="catalog-promo-description">Envíanos la foto de tu<br>prescripción médica por<br>WhatsApp y te
                cotizamos los<br>cristales exactos al instante.</p>
            </div>
            <a href="${LG.wa(LG.data.site.messages.prescription)}"
              target="_blank" rel="noopener" class="btn btn-primary catalog-promo-button">
              ${LG.icon('whatsapp', { size: 22, attrs: { 'aria-hidden': 'true' } })}
              <span>Enviar Receta por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    `;
  };

  // 6. KIDS CATALOG SECTION
  C.KidsCatalogSection = function () {
    const filters = LG.data.site.kidsFilters;
    const products = LG.data.site.kidsProducts;

    return LG.html`
      <section class="section" id="catalogo-ninos">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Colección Infantil 2026</span>
            <h2 class="section-title"><span class="kids-title-gradient">Catálogo de Lentes para Niños</span></h2>
            <p class="section-subtitle">
              Monturas ultra flexibles, ligeras e hipoalergénicas con protección UV y filtro de luz azul para los más pequeños.
            </p>
          </div>

          <div class="catalog-controls">
            <div class="filter-pills" id="filtros-ninos" role="group" aria-label="Filtrar catálogo infantil por categoría">
              ${LG.each(filters, (f, i) => LG.html`
                <button type="button" class="filter-btn${i === 0 ? ' active' : ''}" data-category="${f.value}">${f.label}</button>
              `)}
            </div>
            <label class="catalog-search">
              <span class="catalog-search-icon" aria-hidden="true">
                ${LG.icon('searchAlt', { size: 18, sw: 2 })}
              </span>
              <input id="search-ninos" type="text" placeholder="Buscar lentes infantiles por nombre o marca..."
                autocomplete="off" aria-label="Buscar productos infantiles" />
            </label>
          </div>

          <div class="products-grid" id="grid-ninos">
            ${LG.each(products, (p) => LG.html`
              <article class="product-card product-card-ninos" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
                <div class="product-media">
                  <span class="product-tag-badge">${p.badge}</span>
                  <img src="${p.image}" alt="${p.alt}" class="product-image" loading="lazy">
                  <div class="product-quick-actions">
                    <button class="btn-icon-zoom" title="Ver en 3D interactivo y zoom"
                      onclick="openProductModal('${p.id}')" aria-label="Ver detalles">
                      ${LG.icon('box3d', { size: 20, sw: 2 })}
                    </button>
                  </div>
                </div>
                <div class="product-body">
                  <h3 class="product-title">${p.name}</h3>
                  <div class="product-specs">
                    ${LG.each(p.specs, (s) => `<span class="spec-chip">${s}</span>`)}
                  </div>
                  <div class="product-footer">
                    <div class="product-price-box">
                      <span class="product-price-label">Precio Especial</span>
                      <div>
                        <span class="product-price">S/ ${p.price}</span>
                        <span class="product-price-old">S/ ${p.oldPrice}</span>
                      </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; width: 100%;">
                      <button class="btn btn-sm btn-outline"
                        style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;"
                        onclick="openProductModal('${p.id}')">
                        <span>Ver Detalles</span>
                        ${LG.icon('arrow', { size: 14, sw: 2.2, attrs: { 'aria-hidden': 'true' } })}
                      </button>
                      <a href="${LG.wa(`Hola Lens Group Trujillo, deseo consultar por el modelo infantil *${p.name}* (${p.type} - S/ ${p.price}).`)}"
                        target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp"
                        style="flex: 1; justify-content: center;" title="Consultar por WhatsApp">
                        ${LG.icon('whatsapp', { size: 16 })}
                        Cotizar
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            `)}

            <div id="empty-state-ninos" class="empty-state"
              style="display: none; grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-dark-400);">
              <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--color-dark-400);">${LG.icon('search', { size: 48 })}</div>
              <h3 style="margin-bottom: 0.5rem; color: var(--color-dark-800);">No encontramos modelos infantiles que coincidan</h3>
              <p>Prueba con otro término de búsqueda o selecciona la categoría "Todos".</p>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  // 7. LENS SIMULATOR SECTION
  C.SimulatorSection = function () {
    const list = LG.data.site.treatments;
    return LG.html`
      <section class="section" id="simulador">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Herramienta Visual</span>
            <h2 class="section-title">Simulador de Tratamientos de Lunas</h2>
            <p class="section-subtitle">
              Experimenta cómo cambia tu visión con cada tecnología de cristales antes de hacer tu elección.
            </p>
          </div>

          <!-- VERSIÓN DESKTOP -->
          <div class="simulator-card sim-desktop-only">
            <div class="simulator-viewer">
              <img src="assets/images/trujillo_city.jpg" alt="Simulación visual Trujillo" class="simulator-bg-img">
              <div class="simulator-lens-overlay">
                <div class="simulator-lens-filter filter-blue" id="simulatorLensFilter"></div>
              </div>
              <div style="position: absolute; bottom: 1rem; left: 1rem; background: rgba(15,23,42,0.8); color: white; padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 600;">
                Vista simulada a través del lente óptico
              </div>
            </div>

            <div class="simulator-controls">
              <div class="sim-options-list">
                ${LG.each(list, (t, i) => LG.html`
                  <button class="sim-opt-button${i === 0 ? ' active' : ''}" data-treatment="${t.key}">
                    <div class="sim-opt-icon">${LG.icon(t.icon, { size: 20, sw: 2 })}</div>
                    <div>
                      <div class="sim-opt-title">${t.title}</div>
                      <div class="sim-opt-desc">${t.desc}</div>
                    </div>
                  </button>
                `)}
              </div>
            </div>
          </div>

          <div class="simulator-info-bar sim-desktop-only">
            <div class="simulator-info-content">
              <h3 id="simActiveTitle">Filtro Blue Defense (Luz Azul Digital)</h3>
              <p id="simActiveDesc">
                Bloquea la radiación emitida por smartphones, laptops y pantallas LED. Alivia la fatiga visual, ojos secos y previene la alteración de los ciclos de sueño.
              </p>
            </div>
            <div class="simulator-info-ideal">
              ${LG.icon('info', { size: 16, sw: 2.5 })}
              <p id="simActiveIdeal">Ideal para: Personas con más de 5 horas diarias en oficina, programadores, diseñadores y estudiantes.</p>
            </div>
          </div>

          <!-- VERSIÓN MOBILE -->
          <div class="sim-mobile-only">
            <div class="sim-mob-viewer">
              <img src="assets/images/trujillo_city.jpg" alt="Simulación visual" class="simulator-bg-img">
              <div class="simulator-lens-overlay">
                <div class="simulator-lens-filter filter-blue" id="simulatorLensFilterMob"></div>
              </div>
              <div class="sim-mob-label">Vista a través del lente óptico</div>
            </div>

            <div class="sim-mob-pills-wrap">
              <div class="sim-mob-pills">
                ${LG.each(list, (t, i) => LG.html`
                  <button class="sim-pill${i === 0 ? ' active' : ''}" data-treatment-mob="${t.key}">
                    ${LG.icon(t.icon, { size: 14, sw: 2.5 })}
                    ${t.short}
                  </button>
                `)}
              </div>
            </div>

            <div class="sim-mob-info">
              <div class="sim-mob-info-header">
                <h3 id="simActiveTitleMob">Filtro Blue Defense (Luz Azul Digital)</h3>
              </div>
              <p id="simActiveDescMob">Bloquea la radiación emitida por smartphones, laptops y pantallas LED. Alivia la fatiga visual, ojos secos y previene la alteración de los ciclos de sueño.</p>
              <div class="sim-mob-ideal">
                ${LG.icon('clockHand', { size: 14, sw: 2.5 })}
                <p id="simActiveIdealMob">Ideal para: Personas con más de 5 horas diarias en oficina, programadores, diseñadores y estudiantes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  // 8. ABOUT SECTION
  C.AboutSection = function () {
    const a = LG.data.site.about;
    return LG.html`
      <section class="section section-bg-alt" id="nosotros">
        <div class="container">
          <div class="about-grid">
            <div class="about-content">
              <span class="section-tag">${a.tag}</span>
              <h2 class="section-title">${a.title}</h2>
              ${LG.each(a.paragraphs, (p) => `<p>${p}</p>`)}

              <div class="about-features-list">
                ${LG.each(a.features, (f) => LG.html`
                  <div class="feature-item">
                    <div class="feature-icon">${LG.icon('checkCircleFill', { size: 22 })}</div>
                    <div>
                      <div class="feature-item-title">${f.title}</div>
                      <div class="feature-item-desc">${f.desc}</div>
                    </div>
                  </div>
                `)}
              </div>
            </div>

            <div class="about-images-col">
              <img src="assets/images/clinic_optometry.jpg" alt="Consultorio óptico moderno Lens Group Trujillo" class="about-main-img">

              <div class="about-sub-card">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                  <img src="assets/images/optometrist_doctor.jpg" alt="Optómetra en Trujillo"
                    style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
                  <div>
                    <h4 style="font-size: 0.95rem; margin-bottom: 0.1rem;">Optometría Certificada</h4>
                    <span style="font-size: 0.75rem; color: var(--color-teal-700); font-weight: 700;">Colegio de Optómetras del Perú</span>
                  </div>
                </div>
                <p style="font-size: 0.8rem; color: var(--color-dark-500); margin: 0;">
                  Diagnóstico visual preciso y asesoría en selección de cristales progresivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  // 9. TESTIMONIALS SECTION
  C.TestimonialsSection = function () {
    const s = LG.data.site.contact;
    const tests = LG.data.site.testimonials;

    return LG.html`
      <section class="section" id="testimonios">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Opiniones de Clientes</span>
            <h2 class="section-title">La Confianza de Trujillo nos Respalda</h2>
            <p class="section-subtitle">
              Clientes reales que visitaron nuestro local en Jr. Gamarra 778 y comprobaron la autenticidad, garantía y trato personalizado.
            </p>
          </div>

          <div class="google-business-summary-card">
            <div class="google-summary-left">
              <div class="google-icon-box">${LG.icon('google', { size: 28 })}</div>
              <div>
                <div class="google-biz-name">
                  Trujillo Lens Group
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a73e8" title="Negocio Verificado">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                </div>
                <div class="google-score-row">
                  <span class="google-numeric-score">5.0</span>
                  <span class="google-stars-icons">★★★★★</span>
                  <span class="google-reviews-count">(Calificación en Google Maps)</span>
                </div>
                <div class="google-address-chip">
                  ${LG.icon('pin', { size: 14, sw: 2 })}
                  ${s.addressShort}
                </div>
              </div>
            </div>

            <div class="google-summary-right">
              <a href="${s.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-write-review">
                ${LG.icon('edit', { size: 16, sw: 2.5 })}
                Escribir una opinión
              </a>
              <a href="${s.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-view-maps-outline">
                ${LG.icon('pinFill', { size: 16 })}
                Ver en Maps
              </a>
            </div>
          </div>

          <div class="testimonials-grid">
            ${LG.each(tests, (t) => LG.html`
              <div class="testimonial-card">
                <div class="test-stars">★★★★★</div>
                <p class="test-text">"${t.text}"</p>
                <div class="test-author-box">
                  <div class="test-avatar">${t.initials}</div>
                  <div>
                    <div class="test-author-name">${t.name}</div>
                    <div class="test-author-loc">${t.location}</div>
                    <div class="google-tag-pill">
                      ${LG.icon('checkSmall', { size: 12 })}
                      Reseña en Google
                    </div>
                  </div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  };

  // 10. CONTACT & APPOINTMENT SECTION
  C.ContactSection = function () {
    const s = LG.data.site.contact;
    const a = LG.data.site.appointment;

    return LG.html`
      <section class="section section-bg-alt" id="contacto">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Ubicación y Atención</span>
            <h2 class="section-title">Visítanos o Agenda tu Consulta</h2>
            <p class="section-subtitle">
              Estamos ubicados en una zona accesible y céntrica de Trujillo con estacionamiento cercano y atención personalizada.
            </p>
          </div>

          <div class="contact-grid">
            <div class="location-info-card">
              <div id="storeStatusBadge" class="hours-status-badge">
                <span class="dot"></span> Abierto hoy hasta las 9:00 PM
              </div>

              <h3 style="margin-bottom: 1.5rem;">Información de Atención</h3>

              <div class="info-item">
                <div class="info-icon">${LG.icon('pin', { size: 22, sw: 2 })}</div>
                <div>
                  <div class="info-title">Dirección de la Óptica</div>
                  <div class="info-val">${s.address}</div>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">${LG.icon('clock', { size: 22, sw: 2 })}</div>
                <div>
                  <div class="info-title">Horarios de Atención</div>
                  <div class="info-val">${s.hours.weekdays}</div>
                  <div style="font-size: 0.9rem; color: var(--color-dark-500); margin-top: 0.2rem;">${s.hours.sunday}</div>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">${LG.icon('phone', { size: 22, sw: 2 })}</div>
                <div>
                  <div class="info-title">Teléfonos & WhatsApp</div>
                  <div class="info-val">${s.phone}</div>
                </div>
              </div>

              <div class="map-container">
                <iframe title="Ubicación Lens Group Trujillo en Google Maps"
                  src="${s.mapsEmbed}"
                  allowfullscreen="" loading="lazy">
                </iframe>
              </div>
            </div>

            <div class="appointment-card">
              <h3 style="margin-bottom: 0.5rem;">Agenda tu Cita o Examen de la Vista</h3>
              <p style="font-size: 0.9rem; color: var(--color-dark-500); margin-bottom: 1.5rem;">
                Reserva tu evaluación con nuestros optómetras. Tu solicitud se confirmará instantáneamente vía WhatsApp.
              </p>

              <form id="appointmentForm">
                <div class="form-group">
                  <label for="apptName" class="form-label">Nombre Completo *</label>
                  <input type="text" id="apptName" class="form-input" placeholder="Ej. Ana Lucía Morales" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="apptPhone" class="form-label">Celular / WhatsApp *</label>
                    <input type="tel" id="apptPhone" class="form-input" placeholder="Ej. 958 000 000" required>
                  </div>
                  <div class="form-group">
                    <label for="apptService" class="form-label">Servicio Requerido *</label>
                    <select id="apptService" class="form-select" required>
                      ${LG.each(a.services, (srv) => `<option value="${srv}">${srv}</option>`)}
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="apptDate" class="form-label">Fecha Preferida *</label>
                    <input type="date" id="apptDate" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label for="apptTime" class="form-label">Turno de Preferencia *</label>
                    <select id="apptTime" class="form-select" required>
                      ${LG.each(a.shifts, (sh) => `<option value="${sh}">${sh}</option>`)}
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="apptNotes" class="form-label">Detalles Adicionales (Opcional)</label>
                  <textarea id="apptNotes" class="form-textarea" rows="2"
                    placeholder="¿Tienes alguna preferencia de marca o síntomas visuales?"></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">
                  ${LG.icon('check', { size: 20, sw: 2 })}
                  Confirmar Cita por WhatsApp
                </button>
              </form>

              <div id="appointmentSuccess" style="display: none; text-align: center; padding: 2rem 1rem;">
                <div style="width: 60px; height: 60px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">
                  ${LG.icon('check', { size: 32, sw: 2.5 })}
                </div>
                <h3 style="margin-bottom: 0.5rem; color: var(--color-dark-900);">¡Solicitud Enviada con Éxito!</h3>
                <p style="color: var(--color-dark-600); font-size: 0.95rem; margin-bottom: 1.5rem;">
                  Hemos preparado tu mensaje de confirmación para WhatsApp. Nuestro asesor en Trujillo te responderá en breve para asegurar tu turno.
                </p>
                <button class="btn btn-outline" onclick="resetAppointmentForm()">
                  Agendar otra cita
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  // 11. TRACKING INLINE SECTION (INDEX.HTML)
  C.TrackingInlineSection = function () {
    const chips = LG.data.site.trackingChips;
    const faqs = LG.data.site.faqShort;

    return LG.html`
      <section class="section section-bg-alt" id="seguimiento">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Estado en Tiempo Real</span>
            <h2 class="section-title">Seguimiento de Pedido</h2>
            <p class="section-subtitle">
              Ingresa el código de tu boleta o el que te enviamos por WhatsApp y conoce en qué etapa está tu orden.
            </p>
          </div>

          <div class="tracking-search-card"
            style="max-width: 820px; margin: 0 auto 3rem auto; position: static; box-shadow: var(--shadow-lg);">
            <form id="trackingForm" class="tracking-form" novalidate>
              <label for="trackingCodeInput" class="tracking-input-label">
                ${LG.icon('receipt', { size: 18, sw: 2 })}
                Ingresa tu código de seguimiento
              </label>

              <div class="tracking-input-group">
                <div class="tracking-input-wrap">
                  <span class="tracking-input-icon">${LG.icon('search', { size: 20, sw: 2 })}</span>
                  <input type="text" id="trackingCodeInput" class="tracking-input" placeholder="Ej: LGT-2025-0342"
                    maxlength="20" autocomplete="off" autocorrect="off" spellcheck="false" inputmode="text"
                    aria-label="Código de seguimiento de pedido">
                </div>
                <button type="submit" class="btn btn-primary tracking-btn-submit" id="trackingSubmitBtn">
                  ${LG.icon('search', { size: 20, sw: 2.2 })}
                  Consultar estado
                </button>
              </div>

              <div class="tracking-help-row">
                <span>El código aparece en tu boleta o fue enviado por WhatsApp.</span>
                <a href="${LG.wa(LG.data.site.messages.lostCode)}"
                  target="_blank" rel="noopener" class="tracking-wa-help">
                  ${LG.icon('whatsapp', { size: 16 })}
                  ¿No tienes tu código? Escríbenos por WhatsApp
                </a>
              </div>
            </form>

            <div class="tracking-chips-wrap">
              <div class="tracking-chips-title">Prueba con un código de ejemplo</div>
              <div class="tracking-chips-list">
                ${LG.each(chips, (c) => LG.html`
                  <button type="button" class="tracking-chip-btn" data-code="${c.code}">${c.code} <span class="tracking-chip-tag">${c.tag}</span></button>
                `)}
              </div>
            </div>
          </div>

          <div id="trackingResultArea" class="tracking-result-area"
            style="display: none; max-width: 960px; margin: 0 auto;"></div>
          <div id="trackingErrorArea" style="display: none;"></div>

          <div style="margin-top: 4rem;">
            <h3 style="text-align: center; font-size: 1.35rem; font-weight: 800; color: var(--color-dark-900); margin-bottom: 1.75rem;">
              Preguntas frecuentes sobre pedidos
            </h3>
            <div class="tracking-faq-grid">
              ${LG.each(faqs, (f) => LG.html`
                <div class="tracking-faq-card">
                  <div class="faq-card-icon">${LG.icon(f.icon, { size: 22, sw: 2 })}</div>
                  <div class="faq-card-q">${f.q}</div>
                  <div class="faq-card-a">${f.a}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </section>
    `;
  };

  // 12. FOOTER
  C.Footer = function (opts = {}) {
    const isHome = opts.isHome !== false;
    const s = LG.data.site.contact;
    const col = isHome ? LG.data.site.footer.columns.home : LG.data.site.footer.columns.tracking;
    const socials = LG.data.site.socials;

    return LG.html`
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <img src="assets/images/logo.svg" alt="Lens Group Trujillo Logo" style="height: 52px; margin-bottom: 1rem;">
              <p>${LG.data.site.footer.description}</p>
              <div class="social-links">
                ${LG.each(socials, (soc) => LG.html`
                  <a href="${soc.url}" target="_blank" rel="noopener" class="social-btn" aria-label="${soc.label}">
                    ${LG.icon(soc.icon, { size: 18 })}
                  </a>
                `)}
              </div>
            </div>

            <div class="footer-col">
              <h4 class="footer-title">${col.title}</h4>
              <ul class="footer-links">
                ${LG.each(col.links, (l) => LG.html`
                  <li><a href="${l.href}"${l.style ? ` style="${l.style}"` : ''}>${l.label}</a></li>
                `)}
              </ul>
            </div>

            <div class="footer-col">
              <h4 class="footer-title">Información Legal</h4>
              <ul class="footer-links">
                <li><a href="${isHome ? '#contacto' : 'index.html#contacto'}">RUC: ${s.ruc}</a></li>
                <li><a href="${isHome ? '#contacto' : 'index.html#contacto'}">Políticas de Garantía Oficial</a></li>
                <li><a href="${isHome ? '#contacto' : 'index.html#contacto'}">Términos y Condiciones</a></li>
                <li><a href="${isHome ? '#contacto' : 'index.html#contacto'}">Protección de Datos Personales</a></li>
              </ul>
              <div style="margin-top: 1.25rem; display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.05); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.1);">
                ${LG.icon('book', { size: 22, sw: 2 })}
                <span style="font-size: 0.8rem; font-weight: 700; color: white;">Libro de Reclamaciones Virtual</span>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div>© 2026 <strong>Lens Group Trujillo</strong>. Todos los derechos reservados. Trujillo, La Libertad - Perú.</div>
            <div style="color: var(--color-teal-400); font-weight: 600;">Salud Visual • Moda • Confiabilidad</div>
          </div>
        </div>
      </footer>
    `;
  };

  // 13. PRODUCT ZOOM MODAL
  C.ProductModal = function () {
    return LG.html`
      <div class="modal-overlay" id="productModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-dialog">
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Cerrar ventana">
            ${LG.icon('close', { size: 20, sw: 2.5 })}
          </button>

          <div class="modal-content-grid">
            <div class="modal-viewer-wrapper">
              <div class="modal-main-info">
                <h2 id="modalTitle" style="font-size: 1.5rem; line-height: 1.25; margin: 0 0 0.5rem 0; color: var(--color-dark-900);"></h2>
                <div style="margin-bottom: 0.65rem; display: flex; align-items: baseline; gap: 0.6rem;">
                  <span class="product-price" id="modalPrice" style="font-size: 1.85rem; font-weight: 800; color: var(--color-teal-700);"></span>
                  <span class="product-price-old" id="modalOldPrice" style="font-size: 1.1rem; text-decoration: line-through; color: var(--color-dark-400);"></span>
                </div>
                <p id="modalDesc" style="font-size: 0.9rem; line-height: 1.5; color: var(--color-dark-600); margin: 0;"></p>
              </div>

              <div class="modal-zoom-container" id="modalZoomContainer">
                <span class="product-tag-badge" id="modalTag"></span>
                <img src="" alt="" class="modal-zoom-image" id="modalZoomImage">
              </div>
            </div>

            <div class="modal-details">
              <h3 class="modal-specs-title">Ficha Técnica & Detalles</h3>
              <div class="modal-specs-list" id="modalSpecsList"></div>

              <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="#" target="_blank" rel="noopener" id="modalWhatsAppBtn" class="btn btn-whatsapp"
                  style="width: 100%; justify-content: center;">
                  ${LG.icon('whatsapp', { size: 20 })}
                  Comprar / Consultar en WhatsApp
                </a>
                <button class="btn btn-outline" onclick="closeProductModal()" style="width: 100%;">
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // 14. FLOATING WHATSAPP & MOBILE ACTION BAR
  C.FloatingWidgets = function (opts = {}) {
    const isHome = opts.isHome !== false;
    const actions = LG.data.site.mobileActions;

    return LG.html`
      <div class="floating-whatsapp" id="floatingWhatsApp">
        <div class="whatsapp-bubble">
          ¡Hola! ¿Necesitas asesoría con tus lentes en Trujillo? Chatea con nosotros
        </div>
        <a href="${LG.wa(LG.data.site.messages.advice)}"
          target="_blank" rel="noopener" class="whatsapp-trigger-btn"
          aria-label="Abrir chat de WhatsApp de Lens Group Trujillo">
          ${LG.icon('whatsapp', { size: 34 })}
        </a>
      </div>

      <nav class="mobile-action-bar" id="mobileActionBar" aria-label="Acciones rápidas">
        ${LG.each(actions, (act) => {
          if (act.whatsapp) {
            return LG.html`
              <a href="${LG.wa(LG.data.site.messages.advice)}"
                target="_blank" rel="noopener" class="mobile-action-btn whatsapp-action" id="${act.id}">
                ${LG.icon(act.icon, { size: 24 })}
                ${act.label}
              </a>
            `;
          }
          const href = isHome ? act.href : `index.html${act.href}`;
          return LG.html`
            <a href="${href}" class="mobile-action-btn${act.active && isHome ? ' active' : ''}" id="${act.id}">
              ${LG.icon(act.icon, { size: 24, sw: 2.2 })}
              ${act.label}
            </a>
          `;
        })}
      </nav>
    `;
  };
})();
