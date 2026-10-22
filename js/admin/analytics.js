/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: ANALYTICS & SIMULATOR MODULE
   File: js/admin/analytics.js
   Description: Executive KPIs calculation, Chart.js business intelligence graphs,
                time-series filters, and what-if profitability scenario simulator.
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. EXECUTIVE KPIS & DECISION MATRIX METRICS
  // --------------------------------------------------------------------------
  function updateMetricsAndDecisions() {
    const ordersList = Object.values(state.orders || {});
    
    const totalRevenue = ordersList.reduce((acc, cur) => acc + (cur.price || 450), 0);
    const avgTicket = ordersList.length ? Math.round(totalRevenue / ordersList.length) : 0;
    const activeOrders = ordersList.filter(o => o.estado !== 'listo').length;
    const readyOrders = ordersList.filter(o => o.estado === 'listo').length;
    const urgentOrders = ordersList.filter(o => o.urgente && o.estado !== 'listo').length;

    const onTimeRate = ordersList.length ? (94.2 + (readyOrders * 0.5)).toFixed(1) : 95.0;

    // Actualizar en todas las instancias de KPIs (tanto en overview como en analytics)
    document.querySelectorAll('[data-kpi="revenue"]').forEach(el => {
      el.textContent = `S/ ${(totalRevenue * 12).toLocaleString('es-PE')}`;
    });
    document.querySelectorAll('[data-kpi="ticket"]').forEach(el => {
      el.textContent = `S/ ${avgTicket}`;
    });
    document.querySelectorAll('[data-kpi="ontime"]').forEach(el => {
      el.textContent = `${Math.min(99.4, onTimeRate)}%`;
    });
    document.querySelectorAll('[data-kpi="active"]').forEach(el => {
      el.textContent = activeOrders;
    });

    const decisionBadge = document.getElementById('sidebarDecisionsBadge');
    if (decisionBadge) {
      decisionBadge.textContent = urgentOrders > 0 ? `${urgentOrders} urgentes` : '4 activas';
    }
  }

  // --------------------------------------------------------------------------
  // 2. CHART.JS VISUALIZATIONS
  // --------------------------------------------------------------------------
  function renderCharts() {
    if (typeof Chart === 'undefined') return;

    const ordersList = Object.values(state.orders || {});

    // 1. Tendencia de Ingresos Semanales
    const ctxRevenue = document.getElementById('chartRevenueTrend');
    if (ctxRevenue) {
      if (state.charts.revenue) state.charts.revenue.destroy();

      state.charts.revenue = new Chart(ctxRevenue, {
        type: 'line',
        data: {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4 (Actual)'],
          datasets: [
            {
              label: 'Ingresos Reales (S/)',
              data: [11200, 14500, 13800, 15320],
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.15)',
              fill: true,
              tension: 0.35,
              borderWidth: 3,
              pointBackgroundColor: '#5eead4',
              pointRadius: 5
            },
            {
              label: 'Meta Presupuestada (S/)',
              data: [12000, 13000, 14000, 15000],
              borderColor: 'rgba(255, 255, 255, 0.25)',
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
          },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // 2. Cuota por Marca
    const ctxBrands = document.getElementById('chartBrandShare');
    if (ctxBrands) {
      if (state.charts.brands) state.charts.brands.destroy();

      const brandCounts = {};
      ordersList.forEach(o => {
        const b = o.brand || 'Otras';
        brandCounts[b] = (brandCounts[b] || 0) + 1;
      });

      state.charts.brands = new Chart(ctxBrands, {
        type: 'doughnut',
        data: {
          labels: Object.keys(brandCounts).length ? Object.keys(brandCounts) : ['Ray-Ban', 'Oakley', 'Vogue', 'InkaLens', 'Sylvane'],
          datasets: [{
            data: Object.values(brandCounts).length ? Object.values(brandCounts) : [35, 25, 18, 14, 8],
            backgroundColor: [
              '#0d9488',
              '#38bdf8',
              '#818cf8',
              '#f59e0b',
              '#f43f5e',
              '#10b981'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 15 } }
          },
          cutout: '65%'
        }
      });
    }

    // 3. Tratamientos de Lunas
    const ctxTreatments = document.getElementById('chartTreatments');
    if (ctxTreatments) {
      if (state.charts.treatments) state.charts.treatments.destroy();

      state.charts.treatments = new Chart(ctxTreatments, {
        type: 'bar',
        data: {
          labels: ['Blue Protect', 'Fotocromático', 'Antirreflejo HD', 'Polarizado', 'Crizal UV'],
          datasets: [{
            label: 'Órdenes Solicitadas',
            data: [42, 28, 24, 18, 15],
            backgroundColor: '#38bdf8',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // 4. Gráfico de Ventas de Productos
    const ctxSalesProducts = document.getElementById('salesProductsChart');
    if (ctxSalesProducts) {
      if (state.charts.salesProducts) state.charts.salesProducts.destroy();

      state.charts.salesProducts = new Chart(ctxSalesProducts, {
        type: 'bar',
        data: {
          labels: ['Miraflex Azul', 'Nano Vista TR90', 'Ray-Ban Kids', 'InkaLens Titanium', 'Miraflex Lila', 'Ray-Ban Wayfarer', 'Oakley Holbrook'],
          datasets: [{
            label: 'Unidades Vendidas',
            data: [14, 9, 7, 5, 4, 3, 2],
            backgroundColor: '#0ea5e9',
            hoverBackgroundColor: '#38bdf8',
            borderRadius: 6,
            maxBarThickness: 52
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} unidades vendidas`
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#94a3b8', precision: 0 }
            },
            x: { 
              grid: { display: false },
              ticks: { color: '#cbd5e1', font: { weight: '600', size: 12 }, maxRotation: 0, minRotation: 0 }
            }
          }
        }
      });
    }

    // 5. Gráfico del Mes Actual (Ingresos Semanales vs Meta)
    const ctxMonthWeekly = document.getElementById('chartCurrentMonthWeekly');
    if (ctxMonthWeekly) {
      if (state.charts.currentMonthWeekly) state.charts.currentMonthWeekly.destroy();

      state.charts.currentMonthWeekly = new Chart(ctxMonthWeekly, {
        type: 'bar',
        data: {
          labels: ['Sem 1 (1-7 Mar)', 'Sem 2 (8-14 Mar)', 'Sem 3 (15-21 Mar)', 'Sem 4 (22-31 Mar)'],
          datasets: [
            {
              label: 'Ingresos Reales (S/)',
              data: [11200, 14500, 13800, 15320],
              backgroundColor: '#0ea5e9',
              hoverBackgroundColor: '#38bdf8',
              borderRadius: 6,
              maxBarThickness: 44,
              order: 2
            },
            {
              label: 'Meta Semanal (S/)',
              data: [12000, 13000, 14000, 15000],
              type: 'line',
              borderColor: '#fbbf24',
              borderDash: [5, 5],
              borderWidth: 2.5,
              pointBackgroundColor: '#fbbf24',
              pointRadius: 5,
              fill: false,
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#cbd5e1', font: { family: 'Inter', weight: '600' }, boxWidth: 12, padding: 12 }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: S/ ${Number(ctx.raw).toLocaleString('es-PE')}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#94a3b8',
                callback: (val) => 'S/ ' + (val >= 1000 ? (val / 1000) + 'k' : val)
              }
            }
          }
        }
      });
    }

    // 6. Gráfico de los Últimos 3 Meses (Trimestre I 2026: Ene, Feb, Mar)
    const ctxQuarterly = document.getElementById('chartQuarterlyComparison');
    if (ctxQuarterly) {
      if (state.charts.quarterlyComparison) state.charts.quarterlyComparison.destroy();

      state.charts.quarterlyComparison = new Chart(ctxQuarterly, {
        type: 'bar',
        data: {
          labels: ['Enero 2026', 'Febrero 2026', 'Marzo 2026 (Actual)'],
          datasets: [
            {
              label: 'Facturación Mensual (S/)',
              data: [48200, 51400, 54820],
              backgroundColor: ['rgba(14, 165, 233, 0.85)', 'rgba(56, 189, 248, 0.85)', 'rgba(16, 185, 129, 0.9)'],
              hoverBackgroundColor: ['#0ea5e9', '#38bdf8', '#10b981'],
              borderRadius: 8,
              maxBarThickness: 62,
              yAxisID: 'y',
              order: 2
            },
            {
              label: 'Órdenes Atendidas',
              data: [110, 118, 130],
              type: 'line',
              borderColor: '#a855f7',
              pointBackgroundColor: '#c084fc',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 1.5,
              pointRadius: 6,
              pointHoverRadius: 8,
              borderWidth: 3,
              tension: 0.35,
              fill: false,
              yAxisID: 'y1',
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#cbd5e1', font: { family: 'Inter', weight: '600' }, boxWidth: 12, padding: 12 }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  if (ctx.dataset.yAxisID === 'y') {
                    return ` ${ctx.dataset.label}: S/ ${Number(ctx.raw).toLocaleString('es-PE')}`;
                  }
                  return ` ${ctx.dataset.label}: ${ctx.raw} órdenes`;
                }
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { weight: '600' } } },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#94a3b8',
                callback: (val) => 'S/ ' + (val >= 1000 ? (val / 1000) + 'k' : val)
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              min: 80,
              max: 150,
              ticks: {
                color: '#c084fc',
                callback: (val) => val + ' ord'
              }
            }
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. ANALYTICS PANEL FILTER (MONTH / QUARTER / ALL)
  // --------------------------------------------------------------------------
  function filterAnalyticsPanel(panelId) {
    const pCurrent = document.getElementById('analyticsPanelCurrentMonth');
    const pQuarter = document.getElementById('analyticsPanelLast3Months');
    const pills = document.querySelectorAll('#analyticsNavPills .analytics-pill');
    pills.forEach(p => p.classList.remove('active'));

    if (panelId === 'current-month') {
      if (pCurrent) pCurrent.style.display = 'block';
      if (pQuarter) pQuarter.style.display = 'none';
      const activeBtn = document.querySelector('[data-panel-filter="current-month"]');
      if (activeBtn) activeBtn.classList.add('active');
    } else if (panelId === 'last-3-months') {
      if (pCurrent) pCurrent.style.display = 'none';
      if (pQuarter) pQuarter.style.display = 'block';
      const activeBtn = document.querySelector('[data-panel-filter="last-3-months"]');
      if (activeBtn) activeBtn.classList.add('active');
    } else {
      if (pCurrent) pCurrent.style.display = 'block';
      if (pQuarter) pQuarter.style.display = 'block';
      const activeBtn = document.querySelector('[data-panel-filter="all"]');
      if (activeBtn) activeBtn.classList.add('active');
    }

    setTimeout(() => {
      renderCharts();
    }, 50);
  }

  // --------------------------------------------------------------------------
  // 4. SCENARIO PROFITABILITY SIMULATOR (WHAT-IF)
  // --------------------------------------------------------------------------
  function simCompute(discount, patientsInc, premiumRate) {
    const baseMonthlyPatients = 140;
    const baseAvgTicket = 450;
    const baseMargin = 0.58;

    const simulatedPatients = baseMonthlyPatients * (1 + patientsInc / 100);
    const effectiveTicket = (baseAvgTicket * (1 - discount / 100)) + ((premiumRate - 40) * 2.5);
    const revenue = Math.round(simulatedPatients * effectiveTicket);
    const margin = Math.max(35, Math.min(72, (baseMargin - (discount * 0.008) + (premiumRate * 0.002)) * 100));
    const profit = Math.round(revenue * (margin / 100));
    return { revenue, margin, profit };
  }

  function simSetDelta(el, current, base) {
    if (!el) return;
    const diff = current - base;
    const pct = base ? (diff / base) * 100 : 0;
    el.classList.remove('up', 'down');
    if (Math.abs(pct) < 0.05) {
      el.textContent = '— sin cambios vs. base';
    } else {
      el.classList.add(diff > 0 ? 'up' : 'down');
      el.textContent = `${diff > 0 ? '▲ +' : '▼ '}S/ ${Math.abs(diff).toLocaleString('es-PE')} (${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)`;
    }
  }

  function updateSimulator() {
    const discountEl = document.getElementById('simDiscount');
    const patientsEl = document.getElementById('simPatients');
    const premiumEl = document.getElementById('simPremium');
    if (!discountEl || !patientsEl || !premiumEl) return;

    const discount = parseInt(discountEl.value) || 0;
    const patientsInc = parseInt(patientsEl.value) || 0;
    const premiumRate = parseInt(premiumEl.value) || 40;

    const lblDiscount = document.getElementById('lblSimDiscount');
    const lblPatients = document.getElementById('lblSimPatients');
    const lblPremium = document.getElementById('lblSimPremium');

    if (lblDiscount) lblDiscount.textContent = `${discount}%`;
    if (lblPatients) lblPatients.textContent = `+${patientsInc}%`;
    if (lblPremium) lblPremium.textContent = `${premiumRate}%`;

    // Sliders visual fill
    [discountEl, patientsEl, premiumEl].forEach(s => {
      const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
      s.style.setProperty('--fill', `${pct}%`);
    });

    const base = simCompute(0, 0, 40);
    const sim = simCompute(discount, patientsInc, premiumRate);

    const resRev = document.getElementById('simResultRevenue');
    const resProf = document.getElementById('simResultProfit');
    const resMarg = document.getElementById('simResultMargin');

    if (resRev) resRev.textContent = `S/ ${sim.revenue.toLocaleString('es-PE')}`;
    if (resProf) resProf.textContent = `S/ ${sim.profit.toLocaleString('es-PE')}`;
    if (resMarg) resMarg.textContent = `${sim.margin.toFixed(1)}%`;

    const bar = document.getElementById('simMarginBar');
    if (bar) bar.style.width = `${Math.min(100, sim.margin)}%`;

    simSetDelta(document.getElementById('simDeltaRevenue'), sim.revenue, base.revenue);
    simSetDelta(document.getElementById('simDeltaProfit'), sim.profit, base.profit);

    // Decision state
    const profitChange = base.profit ? (sim.profit - base.profit) / base.profit : 0;
    let status;
    if (discount > 18 && premiumRate < 45) {
      status = {
        tone: 'danger', label: 'Riesgoso', hint: 'Margen en erosión',
        icon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
        text: '<strong>Alerta de Erosión de Margen:</strong> Descuento excesivo sin suficiente venta cruzada de lunas de alto valor. Se sugiere topar el descuento al 12%.'
      };
    } else if (profitChange < -0.03) {
      status = {
        tone: 'warning', label: 'Precaución', hint: 'Utilidad por debajo de la base',
        icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
        text: '<strong>Escenario con Pérdida de Utilidad:</strong> El incentivo no se compensa con el volumen esperado. Aumenta la campaña de captación o la adopción de lunas premium.'
      };
    } else if (profitChange >= 0.15 && sim.margin >= 50) {
      status = {
        tone: 'success', label: 'Óptimo', hint: 'Altamente rentable',
        icon: '<polyline points="20 6 9 17 4 12"></polyline>',
        text: '<strong>Estrategia Altamente Rentable:</strong> El volumen y las lunas premium compensan con creces el incentivo. Se proyecta récord de utilidad.'
      };
    } else {
      status = {
        tone: 'info', label: 'Equilibrado', hint: profitChange > 0 ? 'Mejora moderada' : 'Escenario base',
        icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
        text: '<strong>Escenario Equilibrado:</strong> Crecimiento controlado y margen saludable dentro del promedio del sector en Trujillo.'
      };
    }

    const statusBox = document.getElementById('simStatusBox');
    if (statusBox) {
      statusBox.className = `sim-metric-box sim-tone-${status.tone}`;
      const simResultStatus = document.getElementById('simResultStatus');
      const simStatusHint = document.getElementById('simStatusHint');
      if (simResultStatus) simResultStatus.textContent = status.label;
      if (simStatusHint) simStatusHint.textContent = status.hint;
    }

    const verdictBox = document.getElementById('simVerdictBox');
    if (verdictBox) {
      verdictBox.removeAttribute('style');
      verdictBox.className = `sim-verdict-box sim-verdict-${status.tone}`;
      verdictBox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${status.icon}</svg>
        <span>${status.text}</span>
      `;
    }
  }

  function resetSimulator() {
    const d = document.getElementById('simDiscount');
    const p = document.getElementById('simPatients');
    const r = document.getElementById('simPremium');
    if (d) d.value = 0;
    if (p) p.value = 0;
    if (r) r.value = 40;
    updateSimulator();
  }

  document.addEventListener('click', e => {
    if (e.target && e.target.closest && e.target.closest('#btnSimReset')) resetSimulator();
  });

  // Window Exports
  window.updateMetricsAndDecisions = updateMetricsAndDecisions;
  window.renderCharts = renderCharts;
  window.filterAnalyticsPanel = filterAnalyticsPanel;
  window.simCompute = simCompute;
  window.simSetDelta = simSetDelta;
  window.updateSimulator = updateSimulator;
  window.resetSimulator = resetSimulator;

})();
