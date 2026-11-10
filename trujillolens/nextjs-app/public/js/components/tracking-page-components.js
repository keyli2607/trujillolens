/* ==========================================================================
   LENS GROUP TRUJILLO — COMPONENTES DE LA PÁGINA DE SEGUIMIENTO
   ========================================================================== */
(function () {
  'use strict';

  const LG = window.LG = window.LG || {};
  const C = LG.components = LG.components || {};

  C.TrackingHero = function () {
    return LG.html`
      <section class="tracking-hero">
        <div class="container">
          <div class="tracking-hero-content">
            <div class="tracking-badge">
              ${LG.icon('search', { size: 15, sw: 2.2 })}
              Seguimiento en Tiempo Real
            </div>
            <h1 class="tracking-hero-title">¿Cómo va tu pedido?</h1>
            <p class="tracking-hero-desc">
              Consulta al instante el estado de tus lentes, monturas o cristales. Ingresa el código que te
              entregamos en caja y conoce cada etapa del proceso en nuestro laboratorio óptico certificado en Trujillo.
            </p>
          </div>
        </div>
      </section>
    `;
  };

  C.TrackingMainSearch = function () {
    const chips = LG.data.site.trackingChips;

    return LG.html`
      <section class="section-bg-alt" style="padding-top: 0; padding-bottom: 4rem; min-height: 120px;">
        <div class="container">
          <div class="tracking-admin-layout">
            <div class="tracking-search-card">
              <form id="trackingForm" class="tracking-form" novalidate>
                <label for="trackingCodeInput" class="tracking-input-label">
                  ${LG.icon('receipt', { size: 18, sw: 2 })}
                  Ingresa tu codigo de seguimiento
                </label>

                <div class="tracking-input-group">
                  <div class="tracking-input-wrap">
                    <span class="tracking-input-icon">
                      ${LG.icon('search', { size: 20, sw: 2 })}
                    </span>
                    <input type="text" id="trackingCodeInput" class="tracking-input" placeholder="Ej: LGT-2025-0342"
                      maxlength="20" autocomplete="off" autocorrect="off" spellcheck="false" inputmode="text"
                      aria-label="Código de seguimiento">
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
                    <button type="button" class="tracking-chip-btn" data-code="${c.code}">${c.code} <span
                        class="tracking-chip-tag">${c.tag}</span></button>
                  `)}
                </div>
              </div>
            </div>
          </div>

          <!-- Result area -->
          <div id="trackingResultArea" class="tracking-result-area" style="display: none;"></div>
          <!-- Error area -->
          <div id="trackingErrorArea" style="display: none;"></div>
        </div>
      </section>
    `;
  };

  C.TrackingFullFAQ = function () {
    const list = LG.data.site.faqFull;

    return LG.html`
      <section class="tracking-faq-section">
        <div class="container">
          <div class="section-header" style="margin-bottom: 0;">
            <span class="section-tag">Preguntas Frecuentes</span>
            <h2 class="section-title">Todo lo que necesitas saber</h2>
            <p class="section-subtitle">Respuestas rápidas a las dudas más comunes al recoger o consultar tu pedido.</p>
          </div>
          <div class="tracking-faq-grid">
            ${LG.each(list, (f) => LG.html`
              <div class="tracking-faq-card">
                <div class="faq-card-icon">${LG.icon(f.icon, { size: 22, sw: 2 })}</div>
                <div class="faq-card-q">${f.q}</div>
                <div class="faq-card-a">
                  ${f.a}
                  ${f.list ? LG.html`
                    <ul style="margin-top: 0.6rem; margin-left: 1.2rem; line-height: 1.9;">
                      ${LG.each(f.list, ([item, time]) => `<li><strong>${item}</strong> &mdash; ${time}</li>`)}
                    </ul>
                  ` : ''}
                  ${f.cta ? LG.html`
                    <br><br>
                    <a href="${LG.wa(f.cta.message)}"
                      target="_blank" rel="noopener" class="tracking-wa-help">
                      ${LG.icon('whatsapp', { size: 15 })}
                      ${f.cta.label}
                    </a>
                  ` : ''}
                </div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  };
})();
