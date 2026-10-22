(function () {
  'use strict';

  const LG = window.LG = window.LG || {};
  const C = LG.components = LG.components || {};

  // 1. PANTALLA DE LOGIN
  C.AdminLoginScreen = function () {
    return LG.html`
      <div class="login-container" id="loginScreen">
        <div class="login-backdrop-glow"></div>

        <div class="login-card">
          <div class="login-brand">
            <img src="assets/images/logo.svg" alt="Lens Group Trujillo" class="login-logo">
            <div>
              <span class="login-tag">
                ${LG.icon('lock', { size: 12, sw: 2.5 })}
                Acceso Corporativo
              </span>
            </div>
            <h1 class="login-title">Portal Lens Group</h1>
            <p class="login-subtitle">Inteligencia de Negocios y Toma de Decisiones</p>
          </div>

          <form class="login-form" id="loginForm">
            <div class="form-group">
              <label class="form-label" for="adminUsername">Usuario o DNI Institucional</label>
              <div class="input-with-icon">
                ${LG.icon('user', { size: 18, sw: 2, className: 'input-icon' })}
                <input type="text" id="adminUsername" class="form-input" placeholder="admin o 12345678" required autocomplete="username">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="adminPassword" style="display: flex; justify-content: space-between;">
                <span>Contraseña o PIN</span>
                <a href="#" id="btnForgotPassword" style="color: var(--admin-primary); font-size: 0.8rem; text-decoration: none;">¿Olvidaste tu contraseña?</a>
              </label>
              <div class="input-with-icon">
                ${LG.icon('lock', { size: 18, sw: 2, className: 'input-icon' })}
                <input type="password" id="adminPassword" class="form-input" placeholder="••••••••" required autocomplete="current-password">
              </div>
            </div>

            <div class="login-error" id="loginErrorMsg"></div>

            <button type="submit" class="form-btn-submit" id="btnSubmitLogin">
              <span>Ingresar al Dashboard</span>
              ${LG.icon('arrowRight', { size: 18, sw: 2.5 })}
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.25rem;">
            <a href="index.html" class="back-to-web">
              ${LG.icon('arrowLeft', { size: 15, sw: 2 })}
              Volver a la tienda pública
            </a>
          </div>
        </div>
      </div>
    `;
  };

  // 2. SIDEBAR LATERAL
  C.AdminSidebar = function () {
    return LG.html`
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="sidebar-brand">
          <a href="index.html" title="Lens Group Trujillo">
            <img src="assets/images/logo.svg" alt="Lens Group" class="sidebar-logo">
          </a>
          <div class="sidebar-brand-text">
            <span class="sidebar-brand-name">Lens Group</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <!-- 1. OPERACIONES COMERCIALES (Accesible para Vendedor y Admin) -->
          <div class="sidebar-section-label" data-roles="seller,admin,superadmin">Ventas &amp; Catálogos</div>

          <button type="button" class="sidebar-nav-btn" data-view="sales" data-roles="seller,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('trendingUp', { size: 18, sw: 2 })}
              <span>Historial de Ventas</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="catalog" data-roles="seller,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('layers', { size: 18, sw: 2 })}
              <span>Catálogo de Niños</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="catalog-adult" data-roles="seller,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('tv', { size: 18, sw: 2 })}
              <span>Catálogo de Adultos</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="inventory" data-roles="seller,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('box3d', { size: 18, sw: 2 })}
              <span>Inventario Local</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="cardex" data-roles="seller,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('fileLines', { size: 18, sw: 2 })}
              <span>Cardex de Movimientos</span>
            </div>
          </button>

          <!-- 2. GESTIÓN ESTRATÉGICA & BI (Solo Administrador / Gerencia) -->
          <div class="sidebar-section-label" data-roles="admin,superadmin" style="margin-top: 0.5rem;">Gestión Estratégica</div>

          <button type="button" class="sidebar-nav-btn" data-view="overview" data-roles="admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('dashboard', { size: 18, sw: 2 })}
              <span>Visión General</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="decisions" data-roles="admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('sparkle', { size: 18, sw: 2 })}
              <span>Toma de Decisiones</span>
            </div>
            <span class="nav-badge-pill nav-badge-alert" id="sidebarDecisionsBadge">4 Activas</span>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="analytics" data-roles="admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('barChart', { size: 18, sw: 2 })}
              <span>Gráficos &amp; Analítica Global</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="simulator" data-roles="admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('layersPoly', { size: 18, sw: 2 })}
              <span>Simulador What-If</span>
            </div>
          </button>

          <!-- 3. OPERACIONES DE SEDE Y PACIENTES (Laboratorio & Clínica / Admin / Superadmin) -->
          <div class="sidebar-section-label" data-roles="clinical,admin,superadmin" style="margin-top: 0.5rem;">Atención &amp; Pacientes</div>

          <button type="button" class="sidebar-nav-btn" data-view="orders" data-roles="clinical,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('fileText', { size: 18, sw: 2 })}
              <span>Pacientes &amp; Órdenes</span>
            </div>
            <span class="nav-badge-pill" id="sidebarOrdersBadge">8</span>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="postventa" data-roles="clinical,admin,superadmin">
            <div class="nav-btn-content">
              ${LG.icon('users', { size: 18, sw: 2 })}
              <span>CRM &amp; Pacientes</span>
            </div>
            <span class="nav-badge-pill" id="sidebarCrmBadge">10</span>
          </button>

          <!-- 4. ADMINISTRACIÓN GLOBAL (Super Admin) -->
          <div class="sidebar-section-label" data-roles="superadmin" style="margin-top: 0.5rem;">Administración Global</div>

          <button type="button" class="sidebar-nav-btn" data-view="users" data-roles="superadmin">
            <div class="nav-btn-content">
              ${LG.icon('users', { size: 18, sw: 2 })}
              <span>Usuarios &amp; Sucursales</span>
            </div>
          </button>

          <button type="button" class="sidebar-nav-btn" data-view="audit" data-roles="superadmin">
            <div class="nav-btn-content">
              ${LG.icon('shield', { size: 18, sw: 2 })}
              <span>Auditoría &amp; Backups</span>
            </div>
          </button>
        </nav>

        <div class="sidebar-user">
          <div class="sidebar-user-info">
            <div class="sidebar-avatar" id="sidebarUserAvatar">C</div>
            <div class="sidebar-user-details">
              <span class="sidebar-user-name" id="sidebarUserName">Dr. Carlos Miranda</span>
              <span class="sidebar-user-role" id="sidebarUserRole">Gerente General</span>
            </div>
          </div>
          <button type="button" class="sidebar-logout-btn" id="sidebarLogoutBtn" title="Cerrar Sesión">
            ${LG.icon('logout', { size: 18, sw: 2 })}
          </button>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;
  };

  // 3. TOPBAR PRINCIPAL
  C.AdminTopbar = function () {
    return LG.html`
      <header class="main-topbar">
        <div class="topbar-left">
          <button type="button" class="btn-sidebar-toggle" id="btnSidebarToggle" aria-label="Abrir panel lateral">
            ${LG.icon('menu', { size: 20, sw: 2 })}
          </button>
          <div class="topbar-breadcrumb">
            <span>Panel</span>
            <span>/</span>
            <span class="breadcrumb-active" id="activeCategoryBreadcrumb">Visión General &amp; KPIs</span>
          </div>
        </div>

        <div class="topbar-right">
          <select class="filter-select" id="branchSelect">
            <option value="gamarra" selected>Sede Jr. Gamarra 778</option>
            <option value="all">Todas las Sedes Trujillo</option>
          </select>

          <select class="filter-select" id="periodSelect">
            <option value="month" selected>Marzo 2026</option>
            <option value="week">Últimos 7 Días</option>
            <option value="quarter">Trimestre I - 2026</option>
          </select>

          <a href="index.html" class="btn-web-link" target="_blank" title="Abrir tienda en nueva pestaña">
            ${LG.icon('external', { size: 14, sw: 2 })}
            <span>Ver Tienda</span>
          </a>
        </div>
      </header>
    `;
  };

  // 4. VISTAS DEL DASHBOARD
  C.AdminViews = function () {
    return LG.html`
      <div class="main-views-container">
        <!-- VISTA: VENTAS -->
        <section class="dash-view" id="view-sales">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Historial y Facturación de Ventas</h2>
              <p>Emisión y control de Boletas, Facturas electrónicas (SUNAT/RENIEC) y comprobantes.</p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="btn-primary-action" id="btnOpenNewSaleModal" onclick="openNewSaleModal()">
                ${LG.icon('plus', { size: 16, sw: 2.5 })}
                <span>+ Nueva Venta / Boleta</span>
              </button>
              <button type="button" class="btn-header-action" onclick="exportSalesToCsv()">
                ${LG.icon('download', { size: 14, sw: 2 })}
                <span>Exportar Ventas</span>
              </button>
            </div>
          </div>
          <div class="kpi-grid">
            <div class="kpi-card" style="--kpi-color: #0d9488;">
              <div class="kpi-header">
                <span class="kpi-label">Ventas del Día</span>
                <span class="kpi-icon" style="background: rgba(13, 148, 136, 0.1); color: #0d9488;">S/</span>
              </div>
              <div class="kpi-value" id="salesTotalDay">S/ 1,420.00</div>
              <div class="kpi-footer"><span class="kpi-trend trend-up">↑ Hoy en Trujillo</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #3b82f6;">
              <div class="kpi-header">
                <span class="kpi-label">Monturas Vendidas (Hoy)</span>
                <span class="kpi-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">${LG.icon('box3d', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="salesFramesDay">7</div>
              <div class="kpi-footer"><span class="kpi-trend">En promedio</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #8b5cf6;">
              <div class="kpi-header">
                <span class="kpi-label">Mejor Vendedor (Semana)</span>
                <span class="kpi-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">${LG.icon('star', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="salesTopSeller">Dr. Miranda</div>
              <div class="kpi-footer"><span class="kpi-trend">22 Ventas cerradas</span></div>
            </div>
          </div>

          <!-- 1. Top Productos Más Vendidos (Arriba) -->
          <div class="chart-card" style="margin-top: 1.5rem;">
            <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="margin: 0;">Top Productos Más Vendidos</h3>
                <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: var(--admin-text-muted);">Ranking de monturas y tratamientos con mayor rotación comercial en Trujillo.</p>
              </div>
              <span class="nav-badge-pill" style="background: rgba(14, 165, 233, 0.15); color: #0ea5e9; font-weight: 700;">Demanda Semanal</span>
            </div>
            <div class="chart-container-inner" style="height: 250px; padding: 1rem 1.25rem;">
              <canvas id="salesProductsChart"></canvas>
            </div>
          </div>

          <!-- 2. Transacciones y Comprobantes (Debajo a ancho completo) -->
          <div class="chart-card" style="margin-top: 1.5rem;">
            <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <h3 style="margin: 0;">Transacciones y Comprobantes</h3>
                <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: var(--admin-text-muted);">Registro de boletas electrónicas (B001), facturas (F001) y notas de venta.</p>
              </div>
              <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
                <input type="text" id="salesSearchInput" class="form-input" placeholder="Buscar por comprobante, cliente o doc..." style="font-size: 0.85rem; padding: 0.5rem 0.9rem; min-width: 280px;">
                <button type="button" class="btn-primary-action" style="padding: 0.5rem 1rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onclick="openNewSaleModal()">
                  ${LG.icon('plus', { size: 15, sw: 2.5 })}
                  <span>+ Nueva Venta</span>
                </button>
              </div>
            </div>
            <div class="mobile-table-hint" style="display: none; font-size: 0.72rem; color: var(--admin-text-dim); margin-top: 0.5rem; margin-bottom: 0.2rem; align-items: center; gap: 0.35rem;">
              <span>Desliza horizontalmente para ver todos los comprobantes y acciones</span>
            </div>
            <div class="table-responsive" style="margin-top: 0.5rem;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th style="min-width: 140px;">Comprobante</th>
                    <th style="min-width: 115px;">Fecha / Hora</th>
                    <th style="min-width: 200px;">Cliente / Razón Social</th>
                    <th style="min-width: 130px;">DNI / RUC</th>
                    <th style="min-width: 220px;">Detalle de Venta</th>
                    <th style="min-width: 110px;">Total</th>
                    <th style="min-width: 100px;">Estado</th>
                    <th style="min-width: 170px; text-align: right;">Acciones</th>
                  </tr>
                </thead>
                <tbody id="salesTableBody">
                  <tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">Cargando historial de ventas...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- VISTA: OVERVIEW -->
        <section class="dash-view active" id="view-overview">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Visión General del Negocio</h2>
              <p>Métricas clave de facturación, volumen y estado del laboratorio en tiempo real.</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn-primary-action" onclick="switchCategory('orders')">
                ${LG.icon('fileLines', { size: 15, sw: 2.5 })}
                <span>Ver Órdenes</span>
              </button>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card" style="--kpi-color: #0d9488;">
              <div class="kpi-header"><span class="kpi-label">Ingresos Mensuales</span><div class="kpi-icon">${LG.icon('dollar', { size: 20 })}</div></div>
              <div class="kpi-value" data-kpi="revenue">S/ 54,820</div>
              <div class="kpi-footer"><span class="kpi-trend trend-up">▲ +16.2%</span><span>Meta: S/ 60,000 (91.4%)</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #38bdf8;">
              <div class="kpi-header"><span class="kpi-label">Ticket Promedio</span><div class="kpi-icon">${LG.icon('bag', { size: 20 })}</div></div>
              <div class="kpi-value" data-kpi="ticket">S/ 438</div>
              <div class="kpi-footer"><span class="kpi-trend trend-up">▲ +S/ 34</span><span>Margen promedio: 58.4%</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #10b981;">
              <div class="kpi-header"><span class="kpi-label">Cumplimiento en Plazo</span><div class="kpi-icon">${LG.icon('clock', { size: 20 })}</div></div>
              <div class="kpi-value" data-kpi="ontime">95.2%</div>
              <div class="kpi-footer"><span class="kpi-trend trend-up">Meta: &gt;95%</span><span>Tiempo prom: 28 hrs</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #f59e0b;">
              <div class="kpi-header"><span class="kpi-label">Órdenes en Taller</span><div class="kpi-icon">${LG.icon('layersPoly', { size: 20 })}</div></div>
              <div class="kpi-value" data-kpi="active">12</div>
              <div class="kpi-footer"><span class="kpi-trend trend-alert">2 Urgentes</span><span>Biselado y calibración</span></div>
            </div>
          </div>

          <div style="background: rgba(13, 148, 136, 0.12); border: 1px solid rgba(13, 148, 136, 0.35); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(13, 148, 136, 0.25); display: flex; align-items: center; justify-content: center; color: #5eead4;">
                ${LG.icon('zap', { size: 22, sw: 2.5 })}
              </div>
              <div>
                <strong style="color: var(--admin-text-main); font-size: 1.05rem;">4 Decisiones Estratégicas Pendientes</strong>
                <p style="font-size: 0.82rem; color: var(--admin-text-muted); margin-top: 0.15rem;">
                  El motor algorítmico identificó oportunidades de stock, rotación de lunas y turnos clínicos.
                </p>
              </div>
            </div>
            <button type="button" class="btn-primary-action" onclick="switchCategory('decisions')">
              <span>Ver Matriz de Decisiones</span>
              ${LG.icon('arrowRight', { size: 16, sw: 2.5 })}
            </button>
          </div>
        </section>

        <!-- VISTA: DECISIONES -->
        <section class="dash-view" id="view-decisions">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Matriz de Toma de Decisiones Estratégicas</h2>
              <p>Recomendaciones algorítmicas accionables para optimizar margen, stock y laboratorio.</p>
            </div>
          </div>

          <div class="decision-grid">
            <div class="decision-card">
              <span class="card-type-tag tag-urgent">${LG.icon('alert', { size: 12, sw: 2.5 })} Quiebre Inminente</span>
              <div class="decision-card-title">Reabastecer Ray-Ban Aviator y Cristales Blue Defense</div>
              <p class="decision-card-problem">Stock de seguridad en umbral crítico (≤ 2 unidades). Esta línea representa el 32% del ingreso semanal en la sede Jr. Gamarra.</p>
              <div class="decision-card-impact"><strong>Impacto proyectado:</strong> Evita pérdida de ~S/ 3,400 en ventas durante el fin de semana.</div>
              <div class="decision-card-action">
                <button type="button" class="btn-decision-action" onclick="showToast('Solicitud de reposición enviada a almacén central')">
                  ${LG.icon('check', { size: 14, sw: 2 })} Aprobar Orden de Compra (15 uds)
                </button>
              </div>
            </div>

            <div class="decision-card">
              <span class="card-type-tag tag-revenue">${LG.icon('trendingUp', { size: 12, sw: 2.5 })} Margen Alto</span>
              <div class="decision-card-title">Impulsar Campaña en Lunas Progresivas FreeForm</div>
              <p class="decision-card-problem">Margen neto del 68%, pero solo representan el 21% de prescripciones. El 45% de pacientes examinados son mayores de 42 años con presbicia.</p>
              <div class="decision-card-impact"><strong>Impacto proyectado:</strong> +S/ 7,800 adicionales de utilidad neta con solo 10 upgrades más al mes.</div>
              <div class="decision-card-action">
                <button type="button" class="btn-decision-action" onclick="showToast('Protocolo de demostración visual asignado a consultorio')">
                  ${LG.icon('check', { size: 14, sw: 2 })} Activar Protocolo en Gabinete
                </button>
              </div>
            </div>

            <div class="decision-card">
              <span class="card-type-tag tag-ops">${LG.icon('clock', { size: 12, sw: 2.5 })} Cuello de Botella</span>
              <div class="decision-card-title">Balancear Turno Vespertino en Laboratorio</div>
              <p class="decision-card-problem">El tiempo en biselado aumentó a 34h debido a acumulación de pedidos en la tarde. 2 órdenes urgentes corren riesgo de demora.</p>
              <div class="decision-card-impact"><strong>Impacto proyectado:</strong> Reduce tiempo de entrega en 14 horas y asegura satisfacción 100%.</div>
              <div class="decision-card-action">
                <button type="button" class="btn-decision-action" onclick="showToast('Prioridad Alfa asignada a tickets urgentes en taller')">
                  ${LG.icon('check', { size: 14, sw: 2 })} Priorizar Bandejas Rojas en Taller
                </button>
              </div>
            </div>

            <div class="decision-card">
              <span class="card-type-tag tag-strategy">${LG.icon('users', { size: 12, sw: 2.5 })} Capacidad Clínica</span>
              <div class="decision-card-title">Reforzar Atención Sábados en Jr. Gamarra</div>
              <p class="decision-card-problem">76% de las citas y exámenes visuales se concentran de 4:30 PM a 8:30 PM. Tiempo de espera en sala supera los 22 minutos.</p>
              <div class="decision-card-impact"><strong>Impacto proyectado:</strong> Evita fuga de 4 a 6 pacientes por fin de semana (~S/ 2,200).</div>
              <div class="decision-card-action">
                <button type="button" class="btn-decision-action" onclick="showToast('Horario de 2do optómetra confirmado para Sábados')">
                  ${LG.icon('check', { size: 14, sw: 2 })} Programar 2° Especialista Turno Tarde
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- VISTA: ANALYTICS -->
        <section class="dash-view" id="view-analytics">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Analítica y Gráficos de Negocio</h2>
              <p>Métricas consolidadas de ventas, estadísticas trimestrales, rendimiento en tiempo real y demanda oftálmica.</p>
            </div>
            <div class="analytics-tab-pills" id="analyticsNavPills">
              <button type="button" class="analytics-pill active" data-panel-filter="all" onclick="filterAnalyticsPanel('all')">
                ${LG.icon('chart', { size: 14, sw: 2 })}
                <span>Todos los Paneles</span>
              </button>
              <button type="button" class="analytics-pill" data-panel-filter="current-month" onclick="filterAnalyticsPanel('current-month')">
                <span class="live-pulse-dot"></span>
                <span>Mes Actual (Marzo)</span>
              </button>
              <button type="button" class="analytics-pill" data-panel-filter="last-3-months" onclick="filterAnalyticsPanel('last-3-months')">
                ${LG.icon('calendar', { size: 14, sw: 2 })}
                <span>Últimos 3 Meses</span>
              </button>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- PANEL 1: ESTADÍSTICAS DEL MES ACTUAL (MARZO 2026) -->
          <!-- ======================================================== -->
          <div class="analytics-section-card accent-current" id="analyticsPanelCurrentMonth">
            <div class="analytics-section-header">
              <div class="analytics-header-left">
                <div class="analytics-section-icon" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8;">
                  ${LG.icon('zap', { size: 22, sw: 2.2 })}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap;">
                    <h3 class="analytics-section-title">Estadísticas del Mes Actual (Marzo 2026)</h3>
                    <span class="analytics-badge badge-active"><span class="live-pulse-dot"></span> En Curso &bull; Día 26 de 31</span>
                    <span class="analytics-badge badge-target">Meta: S/ 60,000</span>
                  </div>
                  <p class="analytics-section-sub">Seguimiento en tiempo real de facturación acumulada, ritmo de órdenes y cumplimiento presupuestario de tienda.</p>
                </div>
              </div>
              <div class="analytics-header-right">
                <div class="analytics-stat-pill">
                  <span class="stat-pill-label">Cumplimiento Meta Mes</span>
                  <strong class="stat-pill-value" style="color: #38bdf8;">91.4%</strong>
                </div>
              </div>
            </div>

            <!-- KPIs MES ACTUAL -->
            <div class="analytics-kpis-grid">
              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Facturación Acumulada</span>
                  <span class="kpi-mini-tag tag-success">▲ +16.2% vs Feb</span>
                </div>
                <div class="kpi-mini-value" style="color: #38bdf8;">S/ 54,820.00</div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 91.4%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>Meta S/ 60,000</span>
                  <span style="color: #38bdf8; font-weight: 600;">Faltan S/ 5,180</span>
                </div>
              </div>

              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Órdenes Atendidas</span>
                  <span class="kpi-mini-tag tag-success">130 cerradas</span>
                </div>
                <div class="kpi-mini-value" style="color: #34d399;">130 <span style="font-size: 0.92rem; font-weight: 500; color: var(--admin-text-muted);">/ 140 meta</span></div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 92.8%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>98 Listas &bull; 20 Taller &bull; 12 Cola</span>
                  <span style="color: #34d399; font-weight: 600;">92.8% objetivo</span>
                </div>
              </div>

              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Ticket Promedio</span>
                  <span class="kpi-mini-tag tag-purple">▲ +S/ 34.00</span>
                </div>
                <div class="kpi-mini-value" style="color: #c084fc;">S/ 421.70</div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 85%; background: linear-gradient(90deg, #a855f7, #c084fc);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>Margen Comercial: 58.4%</span>
                  <span style="color: #c084fc; font-weight: 600;">Lunas Premium 48%</span>
                </div>
              </div>

              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Proyección Cierre</span>
                  <span class="kpi-mini-tag tag-warning">Ritmo S/ 2,108/día</span>
                </div>
                <div class="kpi-mini-value" style="color: #fbbf24;">S/ 62,500.00</div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>Superávit estimado</span>
                  <span style="color: #fbbf24; font-weight: 600;">+4.2% sobre meta</span>
                </div>
              </div>
            </div>

            <!-- CONTENIDO GRÁFICO MES ACTUAL + MIX DE VENTAS -->
            <div class="charts-grid" style="margin-top: 0.25rem;">
              <div class="chart-card col-8" style="margin-bottom: 0;">
                <div class="chart-header">
                  <div class="chart-title-wrap">
                    <h3>Ingresos Semanales del Mes vs Meta</h3>
                    <p>Avance acumulativo por semana del mes de Marzo 2026 (S/)</p>
                  </div>
                  <span class="nav-badge-pill" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; font-weight: 700;">Semana 4 en marcha</span>
                </div>
                <div class="chart-container-inner" style="min-height: 250px;">
                  <canvas id="chartCurrentMonthWeekly"></canvas>
                </div>
              </div>

              <div class="chart-card col-4" style="margin-bottom: 0;">
                <div class="chart-header">
                  <div class="chart-title-wrap">
                    <h3>Mix de Facturación (Marzo)</h3>
                    <p>Distribución por categoría en el mes actual</p>
                  </div>
                </div>
                <div class="category-breakdown-list">
                  <div class="category-item">
                    <div class="cat-info">
                      <span class="cat-name">Monturas Oftálmicas</span>
                      <span class="cat-amount">S/ 24,120.00 (44%)</span>
                    </div>
                    <div class="cat-bar"><div class="cat-fill" style="width: 44%; background: #0ea5e9;"></div></div>
                  </div>
                  <div class="category-item">
                    <div class="cat-info">
                      <span class="cat-name">Lunas &amp; Tratamientos</span>
                      <span class="cat-amount">S/ 21,930.00 (40%)</span>
                    </div>
                    <div class="cat-bar"><div class="cat-fill" style="width: 40%; background: #10b981;"></div></div>
                  </div>
                  <div class="category-item">
                    <div class="cat-info">
                      <span class="cat-name">Gafas de Sol Polarizadas</span>
                      <span class="cat-amount">S/ 6,030.00 (11%)</span>
                    </div>
                    <div class="cat-bar"><div class="cat-fill" style="width: 11%; background: #f59e0b;"></div></div>
                  </div>
                  <div class="category-item">
                    <div class="cat-info">
                      <span class="cat-name">Accesorios &amp; Consultas</span>
                      <span class="cat-amount">S/ 2,740.00 (5%)</span>
                    </div>
                    <div class="cat-bar"><div class="cat-fill" style="width: 5%; background: #a855f7;"></div></div>
                  </div>

                  <div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-sm); border-left: 3px solid #38bdf8;">
                    <div style="font-size: 0.74rem; color: var(--admin-text-muted); font-weight: 700;">TOP PRODUCTO DEL MES:</div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: #ffffff; margin-top: 0.15rem;">Miraflex Kids Azul + Blue Protect</div>
                    <div style="font-size: 0.74rem; color: #38bdf8; margin-top: 0.15rem;">22 unidades vendidas (S/ 7,480.00)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- PANEL 2: ESTADÍSTICAS DE LOS ÚLTIMOS 3 MESES (TRIMESTRE) -->
          <!-- ======================================================== -->
          <div class="analytics-section-card accent-quarterly" id="analyticsPanelLast3Months" style="margin-top: 1.5rem;">
            <div class="analytics-section-header">
              <div class="analytics-header-left">
                <div class="analytics-section-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
                  ${LG.icon('calendar', { size: 22, sw: 2.2 })}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap;">
                    <h3 class="analytics-section-title">Estadísticas de los Últimos 3 Meses (Enero – Marzo 2026)</h3>
                    <span class="analytics-badge badge-quarter">Trimestre I - 2026</span>
                    <span class="analytics-badge badge-growth">Crecimiento +13.7%</span>
                    <span class="analytics-badge badge-target">96.5% Meta Trimestral</span>
                  </div>
                  <p class="analytics-section-sub">Consolidado trimestral de ventas, órdenes despachadas, comparativa mes a mes y tasa de retención de pacientes.</p>
                </div>
              </div>
              <div class="analytics-header-right">
                <div class="analytics-stat-pill">
                  <span class="stat-pill-label">Total Trimestre (Q1)</span>
                  <strong class="stat-pill-value" style="color: #34d399;">S/ 154,420.00</strong>
                </div>
              </div>
            </div>

            <!-- KPIs ÚLTIMOS 3 MESES -->
            <div class="analytics-kpis-grid">
              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Ingreso Consolidado (3M)</span>
                  <span class="kpi-mini-tag tag-success">▲ +13.7% Trimestral</span>
                </div>
                <div class="kpi-mini-value" style="color: #34d399;">S/ 154,420.00</div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 96.5%; background: linear-gradient(90deg, #059669, #10b981);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>Meta Trimestre: S/ 160,000</span>
                  <span style="color: #34d399; font-weight: 600;">96.5% alcanzado</span>
                </div>
              </div>

              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Órdenes Consolidadas</span>
                  <span class="kpi-mini-tag tag-info">358 órdenes</span>
                </div>
                <div class="kpi-mini-value" style="color: #38bdf8;">358 <span style="font-size: 0.92rem; font-weight: 500; color: var(--admin-text-muted);">órdenes</span></div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 95.4%; background: linear-gradient(90deg, #0284c7, #0ea5e9);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>Promedio: 119.3 ord/mes</span>
                  <span style="color: #38bdf8; font-weight: 600;">95.4% entregas a tiempo</span>
                </div>
              </div>

              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Ticket Promedio Trimestral</span>
                  <span class="kpi-mini-tag tag-purple">Estabilidad Alta</span>
                </div>
                <div class="kpi-mini-value" style="color: #818cf8;">S/ 431.34</div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 90%; background: linear-gradient(90deg, #4f46e5, #818cf8);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>Rango: S/ 421 - S/ 438</span>
                  <span style="color: #818cf8; font-weight: 600;">Margen: 58.2%</span>
                </div>
              </div>

              <div class="kpi-mini-card">
                <div class="kpi-mini-top">
                  <span class="kpi-mini-title">Retención de Pacientes</span>
                  <span class="kpi-mini-tag tag-pink">Fidelización</span>
                </div>
                <div class="kpi-mini-value" style="color: #f472b6;">78.4%</div>
                <div class="kpi-mini-progress">
                  <div class="kpi-progress-bar" style="width: 78.4%; background: linear-gradient(90deg, #db2777, #f472b6);"></div>
                </div>
                <div class="kpi-mini-bottom">
                  <span>342 pacientes únicos</span>
                  <span style="color: #f472b6; font-weight: 600;">268 recompras/citas</span>
                </div>
              </div>
            </div>

            <!-- CONTENIDO GRÁFICO TRIMESTRAL + COMPARATIVA MES A MES -->
            <div class="charts-grid" style="margin-top: 0.25rem;">
              <div class="chart-card col-8" style="margin-bottom: 0;">
                <div class="chart-header">
                  <div class="chart-title-wrap">
                    <h3>Comparativa de Facturación y Órdenes (Ene - Feb - Mar 2026)</h3>
                    <p>Facturación total (barras S/) y volumen de órdenes atendidas (línea azul)</p>
                  </div>
                  <span class="nav-badge-pill" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 700;">+13.7% Trimestral</span>
                </div>
                <div class="chart-container-inner" style="min-height: 250px;">
                  <canvas id="chartQuarterlyComparison"></canvas>
                </div>
              </div>

              <div class="chart-card col-4" style="margin-bottom: 0;">
                <div class="chart-header">
                  <div class="chart-title-wrap">
                    <h3>Desglose Mes a Mes</h3>
                    <p>Evolución intermensual del trimestre</p>
                  </div>
                </div>
                <div class="month-comparison-list">
                  <!-- Enero -->
                  <div class="month-row-item">
                    <div class="month-row-header">
                      <strong class="month-row-name">Enero 2026</strong>
                      <span class="month-row-total">S/ 48,200.00</span>
                    </div>
                    <div class="month-row-metrics">
                      <span>110 órdenes</span>
                      <span>Ticket: S/ 438.18</span>
                      <span class="badge-mini-neutral">Base Q1</span>
                    </div>
                    <div class="month-row-progress"><div class="fill" style="width: 87.9%; background: #64748b;"></div></div>
                  </div>

                  <!-- Febrero -->
                  <div class="month-row-item">
                    <div class="month-row-header">
                      <strong class="month-row-name">Febrero 2026</strong>
                      <span class="month-row-total">S/ 51,400.00</span>
                    </div>
                    <div class="month-row-metrics">
                      <span>118 órdenes</span>
                      <span>Ticket: S/ 435.59</span>
                      <span class="badge-mini-up">▲ +6.6%</span>
                    </div>
                    <div class="month-row-progress"><div class="fill" style="width: 93.8%; background: #0ea5e9;"></div></div>
                  </div>

                  <!-- Marzo -->
                  <div class="month-row-item highlighted">
                    <div class="month-row-header">
                      <strong class="month-row-name">Marzo 2026 (Actual)</strong>
                      <span class="month-row-total" style="color: #34d399;">S/ 54,820.00</span>
                    </div>
                    <div class="month-row-metrics">
                      <span>130 órdenes</span>
                      <span>Ticket: S/ 421.70</span>
                      <span class="badge-mini-up">▲ +6.7%</span>
                    </div>
                    <div class="month-row-progress"><div class="fill" style="width: 100%; background: #10b981;"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- GRÁFICOS DE DEMANDA GLOBAL Y PARTICIPACIÓN -->
          <!-- ======================================================== -->
          <div style="margin-top: 1.5rem;">
            <div style="margin-bottom: 1rem;">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #ffffff; margin: 0;">Análisis Detallado de Demanda &amp; Tratamientos Oftálmicos</h3>
              <p style="font-size: 0.8rem; color: var(--admin-text-muted); margin: 0.2rem 0 0 0;">Participación por marcas autorizadas y preferencias en lunas de laboratorio.</p>
            </div>
            <div class="charts-grid">
              <div class="chart-card col-4">
                <div class="chart-header">
                  <div class="chart-title-wrap">
                    <h3>Participación por Marca</h3>
                    <p>Distribución de órdenes en tienda</p>
                  </div>
                </div>
                <div class="chart-container-inner"><canvas id="chartBrandShare"></canvas></div>
              </div>
              <div class="chart-card col-8">
                <div class="chart-header">
                  <div class="chart-title-wrap">
                    <h3>Tratamientos y Filtros Oftálmicos Más Demandados</h3>
                    <p>Volumen de lunas solicitadas por tipo de protección visual</p>
                  </div>
                </div>
                <div class="chart-container-inner" style="min-height: 250px;"><canvas id="chartTreatments"></canvas></div>
              </div>
            </div>
          </div>
        </section>

        <!-- VISTA: SIMULADOR WHAT-IF -->
        <section class="dash-view" id="view-simulator">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Simulador de Escenarios &amp; Rentabilidad ("What-If")</h2>
              <p>Modela proyecciones antes de tomar decisiones sobre precios, promociones o compras.</p>
            </div>
          </div>
          <div class="simulator-panel">
            <div class="simulator-grid">
              <div class="simulator-controls">
                <div class="sim-section-title">
                  
                  <div><h3>Variables del Escenario</h3><p>Mueve los controles y observa el impacto en tiempo real.</p></div>
                </div>

                <div class="sim-slider-group">
                  <div class="sim-slider-labels"><span>Descuento Promocional en Monturas</span><strong class="sim-chip" id="lblSimDiscount">0%</strong></div>
                  <input type="range" class="sim-slider" id="simDiscount" min="0" max="25" step="5" value="0">
                  <div class="sim-slider-scale"><span>0%</span><span>25%</span></div>
                </div>

                <div class="sim-slider-group">
                  <div class="sim-slider-labels"><span>Incremento de Pacientes (Campaña)</span><strong class="sim-chip" id="lblSimPatients">+0%</strong></div>
                  <input type="range" class="sim-slider" id="simPatients" min="0" max="60" step="10" value="0">
                  <div class="sim-slider-scale"><span>+0%</span><span>+60%</span></div>
                </div>

                <div class="sim-slider-group">
                  <div class="sim-slider-labels"><span>Adopción de Lunas Premium</span><strong class="sim-chip" id="lblSimPremium">40%</strong></div>
                  <input type="range" class="sim-slider" id="simPremium" min="20" max="80" step="5" value="40">
                  <div class="sim-slider-scale"><span>20%</span><span>80%</span></div>
                </div>

                <button type="button" class="btn-header-action sim-reset-btn" id="btnSimReset">
                  ${LG.icon('rotateCcw', { size: 14, sw: 2.5 })} Restablecer escenario base
                </button>
              </div>

              <div class="simulator-results">
                <div class="sim-section-title"><div><h3>Proyección Mensual</h3><p>Comparado con el escenario base actual.</p></div></div>
                <div class="sim-result-metrics">
                  <div class="sim-metric-box sim-tone-neutral"><span class="sim-metric-label">Ingreso Estimado</span><div class="sim-metric-val" id="simResultRevenue">S/ 63,000</div><span class="sim-delta" id="simDeltaRevenue">— sin cambios</span></div>
                  <div class="sim-metric-box sim-tone-success"><span class="sim-metric-label">Utilidad Neta</span><div class="sim-metric-val" id="simResultProfit">S/ 36,540</div><span class="sim-delta" id="simDeltaProfit">— sin cambios</span></div>
                  <div class="sim-metric-box sim-tone-info"><span class="sim-metric-label">Margen Neto</span><div class="sim-metric-val" id="simResultMargin">58.0%</div><div class="sim-progress"><div class="sim-progress-fill" id="simMarginBar" style="width: 58%;"></div></div></div>
                  <div class="sim-metric-box" id="simStatusBox"><span class="sim-metric-label">Estado de Decisión</span><div class="sim-metric-val sim-status-val" id="simResultStatus">Equilibrado</div><span class="sim-delta" id="simStatusHint">Escenario base</span></div>
                </div>
                <div class="sim-verdict-box sim-verdict-info" id="simVerdictBox">
                  ${LG.icon('info', { size: 20, sw: 2.5 })}
                  <span><strong>Escenario Equilibrado:</strong> Crecimiento controlado y margen saludable dentro del promedio del sector en Trujillo.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- VISTA: ORDENES -->
        <section class="dash-view" id="view-orders">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Control de Órdenes &amp; Laboratorio</h2>
              <p>Gestión de tickets, cambio de estado en vivo y sincronización con el seguimiento del cliente.</p>
            </div>
            <div style="display: flex; gap: 0.6rem;">
              <button type="button" class="btn-primary-action" id="btnNewOrder">
                ${LG.icon('plus', { size: 16, sw: 2.5 })}
                <span>Nueva Orden</span>
              </button>
              <button type="button" class="btn-header-action" id="btnExportCsv" title="Exportar reporte CSV">
                ${LG.icon('download', { size: 15, sw: 2 })}
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <div class="orders-table-panel">
            <div class="table-toolbar">
              <input type="text" class="table-search-input" id="orderSearchInput" placeholder="Buscar código, paciente, DNI...">
              <div class="table-status-tabs">
                <button type="button" class="tab-btn active" data-filter="all">Todas (<span id="tabCountAll">0</span>)</button>
                <button type="button" class="tab-btn" data-filter="cola">Cola (<span id="tabCountCola">0</span>)</button>
                <button type="button" class="tab-btn" data-filter="proceso">Proceso (<span id="tabCountProceso">0</span>)</button>
                <button type="button" class="tab-btn" data-filter="listo">Listas (<span id="tabCountListo">0</span>)</button>
                <button type="button" class="tab-btn" data-filter="urgente">Urgentes (<span id="tabCountUrgente">0</span>)</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr><th>Código Ticket</th><th>Paciente</th><th>Servicio / Producto</th><th>Fecha Estimada</th><th>Monto</th><th>Estado Actual</th><th>Acción Rápida</th></tr>
                </thead>
                <tbody id="ordersTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- VISTA: INVENTARIO -->
        <section class="dash-view" id="view-inventory">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Monitoreo de Stock &amp; Alertas de Inventario</h2>
              <p>Control de existencias de monturas, lunas y tratamientos para prevenir quiebres de stock.</p>
            </div>
            <div style="display: flex; gap: 0.6rem;">
              <button type="button" class="btn-primary-action" onclick="openInventoryModal()" data-roles="admin,superadmin">
                ${LG.icon('plus', { size: 16, sw: 2.5 })}
                <span>Nuevo Producto</span>
              </button>
              <button type="button" class="btn-header-action" onclick="showToast('Inventario sincronizado con almacén central')">
                ${LG.icon('refresh', { size: 15, sw: 2 })}
                <span>Actualizar Stock</span>
              </button>
            </div>
          </div>
          <div class="inventory-grid" id="inventoryGrid"></div>
        </section>

        <!-- VISTA: USUARIOS -->
        <section class="dash-view" id="view-users">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Gestión de Usuarios y Sucursales</h2>
              <p>Crear, editar y desactivar personal (administradores locales, optómetras, vendedores). Control total multi-sede.</p>
            </div>
            <button type="button" class="btn-primary-action" onclick="openUserModal()" data-roles="superadmin">
              <span>+ Nuevo Usuario</span>
            </button>
          </div>
          <div class="orders-table-panel">
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr><th>Nombre y Apellido</th><th>Usuario / DNI</th><th>Rol en el Sistema</th><th>Sucursal Asignada</th><th>Estado</th><th style="text-align: right;">Acciones</th></tr>
                </thead>
                <tbody id="usersTableBody">
                  <tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">Cargando usuarios...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- VISTA: CATALOGO NINOS -->
        <section class="dash-view" id="view-catalog">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Catálogo de Monturas: Colección Niños</h2>
              <p>Filtrado de monturas de silicona y TR-90 por edad y género. Vinculado a stock y módulo de ventas.</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
              <button type="button" class="btn-header-action" onclick="showToast('Sincronizando inventario con la nube...')">
                ${LG.icon('refresh', { size: 15, sw: 2 })}
                <span>Actualizar Stock</span>
              </button>
              <button type="button" class="btn-primary-action" onclick="openInventoryModal()" data-roles="admin,superadmin">
                ${LG.icon('plus', { size: 14, sw: 2.5 })}
                <span>Agregar Stock</span>
              </button>
            </div>
          </div>
          <div class="catalog-filters">
            <select class="form-input" id="filterCatalogCategory" style="max-width: 200px;">
              <option value="all">Todas las Categorías</option><option value="Niños">Niños</option><option value="Niñas">Niñas</option><option value="Unisex">Unisex</option>
            </select>
            <select class="form-input" id="filterCatalogMaterial" style="max-width: 200px;">
              <option value="all">Cualquier Material</option><option value="Silicona Flexible">Silicona Flexible</option><option value="TR-90">TR-90 Ultraligero</option>
            </select>
            <select class="form-input" id="filterCatalogAge" style="max-width: 200px;">
              <option value="all">Cualquier Edad</option><option value="0-3 años">0 a 3 años</option><option value="4-8 años">4 a 8 años</option><option value="9-12 años">9 a 12 años</option>
            </select>
          </div>
          <div class="catalog-grid" id="catalogGrid"></div>
        </section>

        <!-- VISTA: CATALOGO ADULTOS -->
        <section class="dash-view" id="view-catalog-adult">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Catálogo de Monturas: Colección Adultos</h2>
              <p>Filtrado de monturas de acetato y metal para damas y caballeros.</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
              <button type="button" class="btn-header-action" onclick="showToast('Sincronizando inventario con la nube...')">
                ${LG.icon('refresh', { size: 15, sw: 2 })}
                <span>Actualizar Stock</span>
              </button>
              <button type="button" class="btn-primary-action" onclick="openInventoryModal()" data-roles="admin,superadmin">
                ${LG.icon('plus', { size: 14, sw: 2.5 })}
                <span>Agregar Stock</span>
              </button>
            </div>
          </div>
          <div class="catalog-filters">
            <select class="form-input" id="filterCatalogAdultCategory" style="max-width: 200px;">
              <option value="all">Todas las Categorías</option><option value="Damas">Damas</option><option value="Caballeros">Caballeros</option><option value="Unisex">Unisex</option>
            </select>
            <select class="form-input" id="filterCatalogAdultMaterial" style="max-width: 200px;">
              <option value="all">Cualquier Material</option><option value="Acetato">Acetato</option><option value="Metal">Metal / Acero</option><option value="Titanio">Titanio</option>
            </select>
          </div>
          <div class="catalog-grid" id="catalogAdultGrid"></div>
        </section>

        <!-- VISTA: CRM & POSTVENTA -->
        <section class="dash-view" id="view-postventa">
          <div class="view-header">
            <div class="view-title-group">
              <h2>CRM Oftalmológico &amp; Contactabilidad de Pacientes</h2>
              <p>Fidelización, seguimiento postventa de adaptación, control visual anual y contacto directo vía WhatsApp.</p>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button type="button" class="btn-primary-action" onclick="openNewPatientModal()">
                ${LG.icon('userAdd', { size: 16, sw: 2.5 })}
                <span>+ Nuevo Paciente CRM</span>
              </button>
              <button type="button" class="btn-header-action" onclick="openCrmTemplatesModal()">
                ${LG.icon('chat', { size: 15, sw: 2 })}
                <span>Plantillas WhatsApp</span>
              </button>
              <button type="button" class="btn-header-action" onclick="exportCrmCsv()" title="Exportar cartera a CSV">
                ${LG.icon('download', { size: 15, sw: 2 })}
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <!-- KPIs DEL CRM -->
          <div class="kpi-grid">
            <div class="kpi-card" style="--kpi-color: #0d9488;">
              <div class="kpi-header">
                <span class="kpi-label">Pacientes en Cartera</span>
                <span class="kpi-icon" style="background: rgba(13, 148, 136, 0.1); color: #0d9488;">${LG.icon('users', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="crmKpiTotal">10</div>
              <div class="kpi-footer"><span class="kpi-trend trend-up">Base de datos activa</span></div>
            </div>

            <div class="kpi-card" style="--kpi-color: #10b981;">
              <div class="kpi-header">
                <span class="kpi-label">Listos p/ Retiro</span>
                <span class="kpi-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">${LG.icon('box3d', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="crmKpiListo">2</div>
              <div class="kpi-footer"><span class="kpi-trend" style="color: #10b981;">Por notificar recojo</span></div>
            </div>

            <div class="kpi-card" style="--kpi-color: #0284c7;">
              <div class="kpi-header">
                <span class="kpi-label">En Adaptación (1-15d)</span>
                <span class="kpi-icon" style="background: rgba(2, 132, 199, 0.1); color: #0284c7;">${LG.icon('sparkle', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="crmKpiAdaptacion">2</div>
              <div class="kpi-footer"><span class="kpi-trend" style="color: #0284c7;">Control de confort</span></div>
            </div>

            <div class="kpi-card" style="--kpi-color: #d97706;">
              <div class="kpi-header">
                <span class="kpi-label">Control Visual Anual</span>
                <span class="kpi-icon" style="background: rgba(217, 119, 6, 0.1); color: #d97706;">${LG.icon('calendar', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="crmKpiControl">2</div>
              <div class="kpi-footer"><span class="kpi-trend" style="color: #d97706;">Cita preventiva</span></div>
            </div>

            <div class="kpi-card" style="--kpi-color: #8b5cf6;">
              <div class="kpi-header">
                <span class="kpi-label">Garantías Vigentes</span>
                <span class="kpi-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">${LG.icon('shield', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="crmKpiGarantia">2</div>
              <div class="kpi-footer"><span class="kpi-trend" style="color: #8b5cf6;">Calibración gratuita</span></div>
            </div>
          </div>

          <!-- TABLA CRM -->
          <div class="orders-table-panel">
            <div class="table-toolbar">
              <input type="text" class="table-search-input" id="crmSearchInput" placeholder="Buscar paciente por nombre, DNI, teléfono, ticket..." style="width: 320px;">
              <div class="table-status-tabs" id="crmStatusTabs">
                <button type="button" class="tab-btn active" data-filter="all">Todos (<span id="crmTabCountAll">10</span>)</button>
                <button type="button" class="tab-btn" data-filter="listo">Listos (<span id="crmTabCountListo">2</span>)</button>
                <button type="button" class="tab-btn" data-filter="adaptacion">Adaptación (<span id="crmTabCountAdaptacion">2</span>)</button>
                <button type="button" class="tab-btn" data-filter="control">Control Anual (<span id="crmTabCountControl">2</span>)</button>
                <button type="button" class="tab-btn" data-filter="garantia">Garantía (<span id="crmTabCountGarantia">2</span>)</button>
                <button type="button" class="tab-btn" data-filter="fidelizado">Fidelizados (<span id="crmTabCountFidelizado">2</span>)</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Paciente / Identificación</th>
                    <th>Contacto &amp; WhatsApp</th>
                    <th>Montura &amp; Lunas</th>
                    <th>Graduación Óptica</th>
                    <th>Etapa CRM / Estado</th>
                    <th>Seguimiento Postventa</th>
                    <th style="text-align: right;">Acciones Directas</th>
                  </tr>
                </thead>
                <tbody id="crmTableBody">
                  <!-- Inyectado dinámicamente por renderCRM() -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- VISTA: AUDITORIA -->
        <section class="dash-view" id="view-audit">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Auditoría, Inventario Crítico y Backups</h2>
              <p>Historial de cambios, ajustes manuales de stock, mermas y copias de seguridad de la base de datos.</p>
            </div>
            <button type="button" class="btn-primary-action" onclick="showToast('Iniciando copia de seguridad manual...')">
              ${LG.icon('download', { size: 16, sw: 2 })}
              <span>Generar Backup Manual</span>
            </button>
          </div>
          <div style="background: rgba(15, 23, 42, 0.4); border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; padding: 4rem; text-align: center; color: var(--admin-text-muted);">
            Visor de logs de auditoría del sistema en construcción.
          </div>
        </section>

        <!-- VISTA: CARDEX DE MOVIMIENTOS -->
        <section class="dash-view" id="view-cardex">
          <div class="view-header">
            <div class="view-title-group">
              <h2>Cardex de Movimientos de Inventario</h2>
              <p>Registro cronológico de entradas, salidas y ajustes de stock por producto y sede.</p>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button type="button" class="btn-primary-action" onclick="openCardexModal()" data-roles="admin,superadmin">
                ${LG.icon('plus', { size: 16, sw: 2.5 })}
                <span>Registrar Movimiento</span>
              </button>
              <button type="button" class="btn-header-action" onclick="exportCardexCsv()">
                ${LG.icon('download', { size: 14, sw: 2 })}
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <!-- KPIs Cardex -->
          <div class="kpi-grid" style="margin-bottom: 1.5rem;">
            <div class="kpi-card" style="--kpi-color: #10b981;">
              <div class="kpi-header">
                <span class="kpi-label">Entradas del Mes</span>
                <span class="kpi-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">${LG.icon('download', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="cardexInCount">—</div>
              <div class="kpi-footer"><span class="kpi-trend trend-up">Unidades ingresadas</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #ef4444;">
              <div class="kpi-header">
                <span class="kpi-label">Salidas del Mes</span>
                <span class="kpi-icon" style="background: rgba(239,68,68,0.1); color: #ef4444;">${LG.icon('arrowRight', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="cardexOutCount">—</div>
              <div class="kpi-footer"><span class="kpi-trend trend-alert">Unidades despachadas</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #f59e0b;">
              <div class="kpi-header">
                <span class="kpi-label">Ajustes / Mermas</span>
                <span class="kpi-icon" style="background: rgba(245,158,11,0.1); color: #f59e0b;">${LG.icon('refresh', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="cardexAdjCount">—</div>
              <div class="kpi-footer"><span class="kpi-trend">Correcciones de stock</span></div>
            </div>
            <div class="kpi-card" style="--kpi-color: #8b5cf6;">
              <div class="kpi-header">
                <span class="kpi-label">Saldo Neto Período</span>
                <span class="kpi-icon" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">${LG.icon('barChart', { size: 16, sw: 2 })}</span>
              </div>
              <div class="kpi-value" id="cardexNetBalance">—</div>
              <div class="kpi-footer"><span class="kpi-trend">Entradas − Salidas</span></div>
            </div>
          </div>

          <!-- Filtros Cardex -->
          <div class="chart-card" style="margin-bottom: 1.25rem;">
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; padding: 1rem 1.25rem;">
              <input type="text" id="cardexSearch" class="form-input" placeholder="Buscar por producto, referencia..." style="flex: 1; min-width: 220px; font-size: 0.85rem;" oninput="filterCardex()">
              <select id="cardexFilterType" class="form-input" style="max-width: 180px;" onchange="filterCardex()">
                <option value="all">Todos los tipos</option>
                <option value="entrada">Entradas</option>
                <option value="salida">Salidas</option>
                <option value="ajuste">Ajustes</option>
                <option value="merma">Mermas</option>
              </select>
              <select id="cardexFilterProduct" class="form-input" style="max-width: 220px;" onchange="filterCardex()">
                <option value="all">Todos los productos</option>
              </select>
            </div>
          </div>

          <!-- Tabla de Movimientos -->
          <div class="orders-table-panel">
            <div class="mobile-table-hint" style="display: none; font-size: 0.72rem; color: var(--admin-text-dim); margin: 0 0 0.4rem 0; align-items: center; gap: 0.35rem;">
              <span>Desliza horizontalmente para ver todos los movimientos</span>
            </div>
            <div class="table-responsive">
              <table class="admin-table" id="cardexTable">
                <thead>
                  <tr>
                    <th style="min-width: 120px;">Referencia</th>
                    <th style="min-width: 80px;">Tipo</th>
                    <th style="min-width: 220px;">Producto</th>
                    <th style="min-width: 110px;">Categoría</th>
                    <th style="min-width: 80px; text-align: center;">Cant. Ant.</th>
                    <th style="min-width: 80px; text-align: center;">Movimiento</th>
                    <th style="min-width: 80px; text-align: center;">Cant. Actual</th>
                    <th style="min-width: 140px;">Motivo / Detalle</th>
                    <th style="min-width: 110px;">Responsable</th>
                    <th style="min-width: 115px;">Fecha</th>
                  </tr>
                </thead>
                <tbody id="cardexTableBody">
                  <tr><td colspan="10" style="text-align:center; padding: 2.5rem; color: var(--admin-text-muted);">Cargando movimientos...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    `;
  };

  // 5. MODALES Y ASISTENTE IA
  C.AdminModals = function () {
    return LG.html`
      <!-- MODAL NUEVA ORDEN -->
      <div class="modal-overlay" id="modalNewOrder">
        <div class="modal-card">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--admin-text-main);">Registrar Nueva Orden de Laboratorio</h3>
            <button type="button" class="modal-close-btn" id="btnCloseModal">&times;</button>
          </div>
          <form id="formNewOrder" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="newOrderCode">Código de Ticket</label>
                <input type="text" id="newOrderCode" class="form-input" style="padding-left: 0.9rem;" readonly required>
              </div>
              <div class="form-group">
                <label class="form-label" for="newOrderDni">DNI del Paciente</label>
                <input type="text" id="newOrderDni" class="form-input" style="padding-left: 0.9rem;" placeholder="8 dígitos" maxlength="8" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="newOrderCustomer">Nombres y Apellidos Completos</label>
              <input type="text" id="newOrderCustomer" class="form-input" style="padding-left: 0.9rem;" placeholder="Ej. Ana Valeria Morales" required>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="newOrderPhone">Celular / WhatsApp</label>
                <input type="tel" id="newOrderPhone" class="form-input" style="padding-left: 0.9rem;" placeholder="9XXXXXXXX" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="newOrderBrand">Marca de Montura</label>
                <select id="newOrderBrand" class="form-input" style="padding-left: 0.9rem;">
                  <option value="Ray-Ban">Ray-Ban</option><option value="Oakley">Oakley</option><option value="Vogue">Vogue</option><option value="Carrera">Carrera</option><option value="InkaLens">InkaLens</option><option value="Sylvane">Sylvane</option><option value="Mely">Mely</option><option value="Dorian">Dorian</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="newOrderTreatment">Tratamiento / Lunas</label>
              <select id="newOrderTreatment" class="form-input" style="padding-left: 0.9rem;">
                <option value="Blue Protect UV400">Blue Protect UV400 (Filtro Luz Azul)</option><option value="Fotocromático Gen 8">Fotocromático Gen 8 (Oscurece al Sol)</option><option value="Antirreflejo HD Premium">Antirreflejo HD Premium</option><option value="Progresivo FreeForm">Lunas Progresivas Digitales FreeForm</option><option value="Polarizado G-15">Cristal Polarizado G-15 Solar</option><option value="Crizal Easy UV">Crizal Easy UV</option>
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: center;">
              <div class="form-group">
                <label class="form-label" for="newOrderPrice">Precio Total (S/)</label>
                <input type="number" id="newOrderPrice" class="form-input" style="padding-left: 0.9rem;" value="480" required>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.25rem;">
                <input type="checkbox" id="newOrderUrgent" style="width: 18px; height: 18px; accent-color: var(--admin-accent-rose); cursor: pointer;">
                <label for="newOrderUrgent" style="font-size: 0.85rem; font-weight: 700; color: var(--admin-accent-rose); cursor: pointer;">Marcar como Orden URGENTE</label>
              </div>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem;">
              <button type="button" class="btn-header-action" onclick="document.getElementById('modalNewOrder').classList.remove('active')">Cancelar</button>
              <button type="submit" class="btn-primary-action">${LG.icon('check', { size: 16, sw: 2.5 })} <span>Crear e Ingresar a Taller</span></button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL INVENTARIO -->
      <div class="modal-overlay" id="modalInventory">
        <div class="modal-card">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--admin-text-main);" id="modalInventoryTitle">Registrar Producto</h3>
            <button type="button" class="modal-close-btn" onclick="document.getElementById('modalInventory').classList.remove('active')">&times;</button>
          </div>
          <form id="formInventory" style="display: flex; flex-direction: column; gap: 1rem;">
            <input type="hidden" id="invItemId">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label" for="invCategory">Categoría</label><input type="text" id="invCategory" class="form-input" style="padding-left: 0.9rem;" placeholder="Ej. Sol Polarizado" required></div>
              <div class="form-group"><label class="form-label" for="invBrand">Marca</label><input type="text" id="invBrand" class="form-input" style="padding-left: 0.9rem;" placeholder="Ej. Ray-Ban" required></div>
            </div>
            <div class="form-group"><label class="form-label" for="invModel">Modelo / Descripción</label><input type="text" id="invModel" class="form-input" style="padding-left: 0.9rem;" placeholder="Ej. Aviator Classic Dorado (RB3025)" required></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label" for="invStock">Stock Actual</label><input type="number" id="invStock" class="form-input" style="padding-left: 0.9rem;" value="0" required></div>
              <div class="form-group"><label class="form-label" for="invCost">Costo (S/)</label><input type="number" id="invCost" class="form-input" style="padding-left: 0.9rem;" value="0" required></div>
              <div class="form-group"><label class="form-label" for="invPrice">Precio Venta (S/)</label><input type="number" id="invPrice" class="form-input" style="padding-left: 0.9rem;" value="0" required></div>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem;">
              <button type="button" class="btn-header-action" onclick="document.getElementById('modalInventory').classList.remove('active')">Cancelar</button>
              <button type="submit" class="btn-primary-action">${LG.icon('check', { size: 16, sw: 2.5 })} <span id="btnSaveInventoryText">Guardar Producto</span></button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL RECUPERAR CONTRASEÑA -->
      <div class="modal-overlay" id="modalRecovery">
        <div class="modal-card" style="max-width: 400px;">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--admin-text-main);">Recuperar Contraseña</h3>
            <button type="button" class="modal-close-btn" id="btnCloseRecoveryModal">&times;</button>
          </div>
          <form id="formRecovery" style="display: flex; flex-direction: column; gap: 1rem;">
            <p style="font-size: 0.9rem; color: var(--admin-text-muted);">
              Ingresa tu correo institucional o DNI. Te enviaremos un enlace seguro con encriptación de 256-bits para restablecer tu contraseña.
            </p>
            <div class="form-group">
              <label class="form-label" for="recoveryInput">DNI o Correo Institucional</label>
              <input type="text" id="recoveryInput" class="form-input" style="padding-left: 0.9rem;" placeholder="Ej: gerente@lensgroup.com" required>
            </div>
            <div class="form-group" style="background: var(--admin-bg-alt); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--admin-card-border);">
              <label class="form-label">Verificación de Seguridad (CAPTCHA)</label>
              <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem;">
                <div id="captchaText" style="background: var(--admin-input-bg); border: 1px solid var(--admin-card-border); padding: 0.5rem 1rem; border-radius: 4px; font-family: monospace; font-size: 1.2rem; font-weight: bold; letter-spacing: 2px; color: var(--admin-active-text); user-select: none; text-decoration: line-through;">XB84K</div>
                <button type="button" id="btnRefreshCaptcha" class="btn-header-action" title="Recargar CAPTCHA">${LG.icon('refresh', { size: 16, sw: 2 })}</button>
              </div>
              <input type="text" id="captchaInput" class="form-input" style="padding-left: 0.9rem;" placeholder="Ingresa los caracteres de arriba" required autocomplete="off">
              <div id="captchaError" style="color: #ef4444; font-size: 0.8rem; margin-top: 0.5rem; display: none;">CAPTCHA incorrecto. Intenta nuevamente.</div>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem;">
              <button type="button" class="btn-header-action" onclick="document.getElementById('modalRecovery').classList.remove('active')">Cancelar</button>
              <button type="submit" class="btn-primary-action">${LG.icon('send', { size: 16, sw: 2.5 })} <span>Enviar Enlace</span></button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL NUEVO USUARIO -->
      <div class="modal-overlay" id="modalNewUser">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--admin-text-main);">Crear Nuevo Usuario</h3>
            <button type="button" class="modal-close-btn" onclick="closeUserModal()">&times;</button>
          </div>
          <form id="formNewUser" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-group"><label class="form-label" for="newUserName">Nombres y Apellidos</label><input type="text" id="newUserName" class="form-input" style="padding-left: 0.9rem;" placeholder="Ej. Juan Pérez" required></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label" for="newUserUsername">Usuario / DNI</label><input type="text" id="newUserUsername" class="form-input" style="padding-left: 0.9rem;" placeholder="8 dígitos o username" required></div>
              <div class="form-group"><label class="form-label" for="newUserPassword">Contraseña</label><input type="password" id="newUserPassword" class="form-input" style="padding-left: 0.9rem;" placeholder="Mínimo 6 caracteres" required></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="newUserRole">Rol en el Sistema</label>
              <select id="newUserRole" class="form-input" style="padding-left: 0.9rem;">
                <option value="Laboratorio & Clínica">Laboratorio & Clínica (Optómetra)</option><option value="Ventas">Ventas (Asesor)</option><option value="Gerente General">Gerente de Sede (Admin Local)</option><option value="Acceso Total">Super Admin (Dueño / Sistemas)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="newUserBranch">Sucursal Asignada</label>
              <select id="newUserBranch" class="form-input" style="padding-left: 0.9rem;">
                <option value="Galería San Antonio, Jr. Gamarra N° 778">Galería San Antonio, Jr. Gamarra N° 778</option><option value="Sede 2 (Centro)">Sede 2 (Centro)</option><option value="Todas las Sedes">Todas las Sedes (Sólo Super Admins)</option>
              </select>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem;">
              <button type="button" class="btn-header-action" onclick="closeUserModal()">Cancelar</button>
              <button type="submit" class="btn-primary-action">${LG.icon('userAdd', { size: 16, sw: 2.5 })} <span>Crear Cuenta</span></button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL NUEVA VENTA & FACTURACIÓN ELECTRÓNICA -->
      <div class="modal-overlay" id="modalNewSale">
        <div class="modal-card" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
          <div class="modal-header">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--admin-text-main); margin: 0;">Nueva Venta &amp; Facturación Electrónica</h3>
              <p style="font-size: 0.8rem; color: var(--admin-text-muted); margin: 0.2rem 0 0 0;">Lens Group Trujillo S.A.C. • RUC 20609502623 • Jr. Gamarra 778</p>
            </div>
            <button type="button" class="modal-close-btn" onclick="closeNewSaleModal()">&times;</button>
          </div>

          <form id="formNewSale" style="display: flex; flex-direction: column; gap: 1.2rem; margin-top: 0.5rem;">
            <input type="hidden" id="saleDocType" value="boleta">

            <!-- Selector de Tipo de Comprobante -->
            <div>
              <label class="form-label">Tipo de Comprobante de Pago</label>
              <div class="fiscal-type-selector">
                <button type="button" class="fiscal-type-btn active" id="btnTypeBoleta" onclick="setSaleDocType('boleta')">
                  Boleta Electrónica (B001)
                </button>
                <button type="button" class="fiscal-type-btn" id="btnTypeFactura" onclick="setSaleDocType('factura')">
                  Factura Electrónica (F001)
                </button>
                <button type="button" class="fiscal-type-btn" id="btnTypeNota" onclick="setSaleDocType('nota')">
                  Nota de Venta (NV01)
                </button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; font-size: 0.78rem; color: var(--admin-text-muted);">
                <span>Serie &amp; Correlativo asignado:</span>
                <strong id="saleCorrelativoText" style="color: var(--admin-primary); font-family: monospace; font-size: 0.88rem;">B001-000428</strong>
              </div>
            </div>

            <!-- Datos del Cliente y Consulta RENIEC / SUNAT -->
            <div style="background: var(--admin-bg-alt); padding: 1rem; border-radius: 8px; border: 1px solid var(--admin-card-border);">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                ${LG.icon('userCheck', { size: 16, sw: 2 })}
                <span>Datos del Cliente &amp; Validación de Identidad</span>
              </div>

              <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.75rem;">
                <div class="form-group">
                  <label class="form-label" for="saleCustomerDocType">Documento</label>
                  <select id="saleCustomerDocType" class="form-input" style="padding-left: 0.6rem;" onchange="handleDocTypeSelectChange()">
                    <option value="DNI" selected>DNI (8 dígitos)</option>
                    <option value="RUC">RUC (11 dígitos)</option>
                    <option value="CE">Carnet Ext.</option>
                    <option value="SIN_DOC">Sin Documento</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="saleCustomerDocNumber">Número de Identificación</label>
                  <div class="fiscal-input-group">
                    <input type="text" id="saleCustomerDocNumber" class="form-input" placeholder="Ingresa DNI (8 dígitos)" maxlength="11" required style="padding-left: 0.8rem; font-weight: 600;">
                    <button type="button" id="btnFiscalLookup" class="btn-fiscal-lookup" onclick="handleConsultarFiscal()">
                      ${LG.icon('search', { size: 14, sw: 2 })}
                      <span id="btnFiscalLookupText">Consultar RENIEC</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Feedback visual de consulta RENIEC / SUNAT -->
              <div id="saleDocFeedback"></div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.75rem;">
                <div class="form-group" style="grid-column: span 2;" id="fieldCustomerNameGroup">
                  <label class="form-label" for="saleCustomerName" id="labelCustomerName">Nombres y Apellidos del Paciente</label>
                  <input type="text" id="saleCustomerName" class="form-input" style="padding-left: 0.8rem;" placeholder="Ej. Carlos Mendoza Quispe" required>
                </div>

                <div class="form-group" style="grid-column: span 2; display: none;" id="fieldCustomerAddressGroup">
                  <label class="form-label" for="saleCustomerAddress">Dirección Fiscal (SUNAT)</label>
                  <input type="text" id="saleCustomerAddress" class="form-input" style="padding-left: 0.8rem;" placeholder="Ej. Jr. Gamarra 778, Trujillo">
                </div>

                <div class="form-group">
                  <label class="form-label" for="saleCustomerPhone">Teléfono / WhatsApp (para comprobante)</label>
                  <input type="tel" id="saleCustomerPhone" class="form-input" style="padding-left: 0.8rem;" placeholder="944 123 890" value="944123890">
                </div>

                <div class="form-group">
                  <label class="form-label" for="saleCustomerEmail">Correo Electrónico (Opcional)</label>
                  <input type="email" id="saleCustomerEmail" class="form-input" style="padding-left: 0.8rem;" placeholder="cliente@correo.com">
                </div>
              </div>
            </div>

            <!-- Detalle de Productos: Montura y Lunas -->
            <div style="background: var(--admin-bg-alt); padding: 1rem; border-radius: 8px; border: 1px solid var(--admin-card-border);">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                ${LG.icon('box3d', { size: 16, sw: 2 })}
                <span>Montura y Tratamiento Óptico</span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 140px; gap: 0.75rem;">
                <div class="form-group">
                  <label class="form-label" for="saleFrameSelect">Selección de Montura</label>
                  <select id="saleFrameSelect" class="form-input" style="padding-left: 0.6rem;" onchange="handleFrameSelectChange()">
                    <option value="" data-price="0">-- Seleccionar Montura del Catálogo --</option>
                    <optgroup label="Línea Infantil &amp; Niños">
                      <option value="frm-1" data-price="120" data-name="Miraflex Flexible Azul">Miraflex Flexible Azul (S/ 120.00)</option>
                      <option value="frm-2" data-price="150" data-name="Nano Vista Deportivo TR90">Nano Vista Deportivo TR90 (S/ 150.00)</option>
                      <option value="frm-4" data-price="210" data-name="Ray-Ban Junior Wayfarer">Ray-Ban Junior Wayfarer (S/ 210.00)</option>
                      <option value="frm-5" data-price="120" data-name="Miraflex Flexible Lila">Miraflex Flexible Lila (S/ 120.00)</option>
                    </optgroup>
                    <optgroup label="Línea Adultos &amp; Juvenil">
                      <option value="frm-a1" data-price="420" data-name="Ray-Ban Wayfarer Classic">Ray-Ban Wayfarer Classic (S/ 420.00)</option>
                      <option value="frm-a2" data-price="480" data-name="Oakley Holbrook Polarized">Oakley Holbrook Polarized (S/ 480.00)</option>
                      <option value="frm-a3" data-price="350" data-name="Vogue Cat-Eye Elegance">Vogue Cat-Eye Elegance (S/ 350.00)</option>
                      <option value="frm-a4" data-price="550" data-name="Carrera Titanium Aviator">Carrera Titanium Aviator (S/ 550.00)</option>
                    </optgroup>
                    <option value="custom" data-price="180" data-name="Montura Personalizada">Otra Montura / Montura del Cliente</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="saleFramePrice">Precio Montura (S/)</label>
                  <input type="number" id="saleFramePrice" class="form-input" style="padding-left: 0.8rem;" value="0" min="0" step="0.01" oninput="calculateNewSaleTotals()">
                </div>
              </div>

              <div class="form-group" style="margin-top: 0.75rem;" id="fieldCustomFrameDesc" style="display: none;">
                <label class="form-label" for="saleCustomFrameName">Descripción de Montura</label>
                <input type="text" id="saleCustomFrameName" class="form-input" style="padding-left: 0.8rem;" placeholder="Ej. Montura Oftálmica Acetato Carey">
              </div>

              <div style="display: grid; grid-template-columns: 1fr 140px; gap: 0.75rem; margin-top: 0.75rem;">
                <div class="form-group">
                  <label class="form-label" for="saleLensTreatment">Lunas &amp; Tratamiento de Superficie</label>
                  <select id="saleLensTreatment" class="form-input" style="padding-left: 0.6rem;" onchange="handleLensTreatmentChange()">
                    <option value="0" data-price="0">Solo Montura (Sin Lunas - S/ 0)</option>
                    <option value="70" data-price="70" selected>Resina Antirreflejo UV400 (S/ 70.00)</option>
                    <option value="120" data-price="120">Policarbonato Antirreflejo HD (S/ 120.00)</option>
                    <option value="180" data-price="180">Blue Protect UV420 Luz Azul (S/ 180.00)</option>
                    <option value="260" data-price="260">Fotocromático Transition Gen 8 (S/ 260.00)</option>
                    <option value="380" data-price="380">Progresivo Digital FreeForm HD (S/ 380.00)</option>
                    <option value="490" data-price="490">Multifocal Progresivo + Blue + Transition (S/ 490.00)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="saleLensPrice">Precio Lunas (S/)</label>
                  <input type="number" id="saleLensPrice" class="form-input" style="padding-left: 0.8rem;" value="70" min="0" step="0.01" oninput="calculateNewSaleTotals()">
                </div>
              </div>

              <!-- Receta Óptica (Rx) -->
              <div style="margin-top: 0.75rem; border-top: 1px dashed var(--admin-card-border); padding-top: 0.75rem;">
                <label class="form-label" style="display: flex; justify-content: space-between;">
                  <span>Graduación / Receta Óptica (Rx)</span>
                  <span style="font-size: 0.72rem; color: var(--admin-text-muted);">Opcional</span>
                </label>
                <div style="display: grid; grid-template-columns: 1fr 1fr 100px; gap: 0.5rem;">
                  <input type="text" id="saleRxOD" class="form-input" style="padding-left: 0.5rem; font-size: 0.8rem;" placeholder="OD: Esf, Cil, Eje">
                  <input type="text" id="saleRxOI" class="form-input" style="padding-left: 0.5rem; font-size: 0.8rem;" placeholder="OI: Esf, Cil, Eje">
                  <input type="text" id="saleRxDNP" class="form-input" style="padding-left: 0.5rem; font-size: 0.8rem;" placeholder="DNP: mm">
                </div>
              </div>

              <!-- Integración con Taller / Laboratorio -->
              <div style="margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; background: var(--sim-sunken); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--admin-card-border);">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--admin-text-main); cursor: pointer; margin: 0;">
                  <input type="checkbox" id="saleCreateWorkshopOrder" checked style="width: 16px; height: 16px; accent-color: var(--admin-primary);">
                  <span>Enviar orden a Laboratorio / Taller automáticamente</span>
                </label>
                <select id="saleWorkshopUrgency" class="form-input" style="width: 110px; padding: 0.2rem 0.5rem; font-size: 0.78rem;">
                  <option value="normal">Normal</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <!-- Pago, Totales y Desglose Tributario -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div class="form-group">
                  <label class="form-label" for="salePaymentMethod">Método de Pago</label>
                  <select id="salePaymentMethod" class="form-input" style="padding-left: 0.6rem;">
                    <option value="Efectivo" selected>Efectivo Soles</option>
                    <option value="Yape">Yape (Trujillo)</option>
                    <option value="Plin">Plin</option>
                    <option value="Tarjeta">Tarjeta Débito / Crédito (POS)</option>
                    <option value="Transferencia BCP">Transferencia BCP / BBVA</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="salePaymentCondition">Condición de Pago</label>
                  <select id="salePaymentCondition" class="form-input" style="padding-left: 0.6rem;">
                    <option value="Pagado 100%" selected>Pagado 100% (Cancelado)</option>
                    <option value="Adelanto 50%">Adelanto 50% (Saldo contraentrega)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="saleDiscount">Descuento Especial (S/)</label>
                  <input type="number" id="saleDiscount" class="form-input" style="padding-left: 0.8rem;" value="0" min="0" step="0.01" oninput="calculateNewSaleTotals()">
                </div>
              </div>

              <!-- Resumen Tributario -->
              <div class="totals-breakdown">
                <div class="totals-row">
                  <span>Op. Gravadas (Base):</span>
                  <span id="saleSubtotalDisplay">S/ 0.00</span>
                </div>
                <div class="totals-row">
                  <span>I.G.V. (18%):</span>
                  <span id="saleIgvDisplay">S/ 0.00</span>
                </div>
                <div class="totals-row" style="color: #ef4444;">
                  <span>Descuento:</span>
                  <span id="saleDiscountDisplay">- S/ 0.00</span>
                </div>
                <div class="totals-row final">
                  <span>TOTAL A COBRAR:</span>
                  <strong id="saleTotalDisplay">S/ 0.00</strong>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; border-top: 1px solid var(--admin-card-border); padding-top: 1rem;">
              <button type="button" class="btn-header-action" onclick="closeNewSaleModal()">Cancelar</button>
              <button type="submit" class="btn-primary-action" style="padding: 0.6rem 1.5rem; font-size: 0.95rem;">
                ${LG.icon('check', { size: 16, sw: 2.5 })}
                <span>Emitir Comprobante &amp; Cobrar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL VISUALIZADOR DE COMPROBANTE ELECTRÓNICO (IMPRESIÓN / WHATSAPP) -->
      <div class="modal-overlay" id="modalInvoiceViewer">
        <div class="modal-card" style="max-width: 520px; max-height: 92vh; overflow-y: auto;">
          <div class="modal-header">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--admin-text-main); margin: 0;">Comprobante Electrónico Emitido</h3>
              <p style="font-size: 0.78rem; color: var(--admin-text-muted); margin: 0.2rem 0 0 0;">Listo para imprimir en ticketera térmica (80mm) o enviar por WhatsApp</p>
            </div>
            <button type="button" class="modal-close-btn" onclick="closeInvoiceModal()">&times;</button>
          </div>

          <!-- Barra de Acciones del Comprobante -->
          <div class="invoice-actions-bar" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <button type="button" class="btn-primary-action" style="flex: 1; justify-content: center;" onclick="printCurrentInvoice()">
              ${LG.icon('printer', { size: 16, sw: 2 })}
              <span>Imprimir Ticket</span>
            </button>
            <button type="button" class="btn-header-action" style="flex: 1; justify-content: center; background: #25d366; color: #fff; border-color: #25d366;" onclick="sendCurrentInvoiceWhatsApp()">
              ${LG.icon('chat', { size: 16, sw: 2 })}
              <span>Enviar WhatsApp</span>
            </button>
            <button type="button" class="btn-header-action" style="padding: 0.5rem 0.8rem;" title="Copiar Datos" onclick="copyInvoiceText()">
              ${LG.icon('clipboard', { size: 16, sw: 2 })}
            </button>
          </div>

          <!-- Representación Impresa Oficial del Comprobante Térmico -->
          <div id="printableInvoice">
            <div class="ticket-preview-wrapper" id="ticketContent">
              <!-- Renderizado dinámicamente con los datos de la venta -->
            </div>
          </div>
        </div>
      </div>

      <!-- ASISTENTE BOT -->
      <button id="chatbotBtn" class="btn-primary-action" onclick="toggleChatbot()" style="position: fixed; bottom: 2rem; right: 2rem; width: 60px; height: 60px; border-radius: 50%; box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4); z-index: 1000; padding: 0; display: flex; align-items: center; justify-content: center;" data-roles="superadmin">
        ${LG.icon('chat', { size: 28, sw: 2 })}
      </button>

      <div id="chatbotWindow" style="position: fixed; bottom: 6rem; right: 2rem; width: 350px; height: 450px; background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); z-index: 1000; display: none; flex-direction: column; overflow: hidden; backdrop-filter: blur(10px);">
        <div style="padding: 1rem; background: var(--admin-bg-alt); border-bottom: 1px solid var(--admin-card-border); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${LG.icon('bot', { size: 20, stroke: 'var(--admin-primary)', sw: 2 })}
            <strong style="color: var(--admin-text-main);">Asistente LensBot</strong>
          </div>
          <button onclick="toggleChatbot()" style="background: none; border: none; color: var(--admin-text-muted); cursor: pointer; font-size: 1.2rem;">&times;</button>
        </div>
        <div id="chatbotMessages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem;">
          <div style="align-self: flex-start; background: var(--admin-bg-alt); padding: 0.75rem; border-radius: 8px 8px 8px 0; border: 1px solid var(--admin-card-border); color: var(--admin-text-main); max-width: 85%;">
            ¡Hola! Soy tu asistente virtual. Puedes preguntarme cosas como: <br><br>
            <span style="color: var(--admin-primary);">"¿Cuánto se vendió hoy?"</span><br>
            <span style="color: var(--admin-primary);">"Dame un resumen de la semana"</span>
          </div>
        </div>
        <form id="chatbotForm" style="padding: 1rem; border-top: 1px solid var(--admin-card-border); display: flex; gap: 0.5rem; background: var(--admin-bg-alt);">
          <input type="text" id="chatbotInput" class="form-input" placeholder="Escribe tu pregunta..." style="flex: 1; padding-left: 0.75rem;" required>
          <button type="submit" class="btn-primary-action" style="padding: 0 1rem;">
            ${LG.icon('send', { size: 18, sw: 2 })}
          </button>
        </form>
      </div>
    `;
  };

  // 6. LAYOUT COMPLETO DEL DASHBOARD
  C.AdminDashboardLayout = function () {
    return LG.html`
      <div class="dashboard-layout" id="dashboardScreen" style="display: none;">
        ${C.AdminSidebar()}
        <div class="admin-main-wrapper">
          ${C.AdminTopbar()}
          ${C.AdminViews()}
        </div>
      </div>
      ${C.AdminModals()}
    `;
  };
})();
