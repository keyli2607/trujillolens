export const WHATSAPP_STORE_PHONE = '51958169535';

export const ORDERS_DB = {
  'LGT-2025-0342': {
    code: 'LGT-2025-0342',
    customer: 'Carlos Mendoza Quispe',
    receivedDate: '08 de Marzo, 2026',
    estimatedDate: '10 de Marzo, 2026',
    service: 'Montura Ray-Ban Round Metal + Cristales Antirreflejo Blue Protect UV400',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'listo',
    currentStep: 3,
    statusTitle: '¡Listo para Recoger en Tienda!',
    statusBadgeText: 'Listo',
    statusBadgeClass: 'state-badge-ready',
    statusBoxClass: 'status-box-ready',
    statusDesc: 'Tu pedido ya está en tienda listo para ser entregado.',
    showPickupBanner: true,
    history: [
      { step: 1, name: 'Cola', date: '08 Mar - 10:30 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '08 Mar - 03:15 PM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: '10 Mar - 09:00 AM', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },
  'LGT-2025-0210': {
    code: 'LGT-2025-0210',
    customer: 'Roberto Castillo Díaz',
    receivedDate: '09 de Marzo, 2026',
    estimatedDate: '11 de Marzo, 2026',
    service: 'Cristales Fotocromáticos Transition Gen 8 + Montura Titanio Flexible',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'proceso',
    currentStep: 2,
    statusTitle: 'En Proceso de Laboratorio',
    statusBadgeText: 'Proceso',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Tallado digital, biselado y control de calidad en laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: '09 Mar - 11:00 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '09 Mar - 05:20 PM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Estimado: 11 Mar', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },
  'LGT-2025-0105': {
    code: 'LGT-2025-0105',
    customer: 'Mariana Paredes Silva',
    receivedDate: '09 de Marzo, 2026',
    estimatedDate: '12 de Marzo, 2026',
    service: 'Lunas Progresivas Digitales FreeForm + Montura Vogue Eyewear',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'proceso',
    currentStep: 2,
    statusTitle: 'En Proceso de Laboratorio',
    statusBadgeText: 'Proceso',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Tallado digital, biselado y control de calidad en laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: '09 Mar - 04:00 PM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '10 Mar - 08:30 AM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Estimado: 12 Mar', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },
  'LGT-2025-0450': {
    code: 'LGT-2025-0450',
    customer: 'Andrea Fernández Ruiz',
    receivedDate: '10 de Marzo, 2026',
    estimatedDate: '13 de Marzo, 2026',
    service: 'Gafas de Sol Oakley Polarizadas con Graduación Espejada',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'cola',
    currentStep: 1,
    statusTitle: 'En Cola de Espera',
    statusBadgeText: 'Cola',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Receta registrada y montura asignada. En espera de laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: '10 Mar - 09:45 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: 'Estimado: 11 Mar', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: 'Estimado: 13 Mar', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  },
  'LGT-2025-0500': {
    code: 'LGT-2025-0500',
    customer: 'Jorge Luis Vásquez',
    receivedDate: '04 de Marzo, 2026',
    estimatedDate: '07 de Marzo, 2026',
    service: 'Montura Ultraligera de Titanio + Cristales Monofocales Crizal',
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'listo',
    currentStep: 3,
    statusTitle: '¡Listo para Recoger en Tienda!',
    statusBadgeText: 'Listo',
    statusBadgeClass: 'state-badge-ready',
    statusBoxClass: 'status-box-ready',
    statusDesc: 'Tu pedido ya está en tienda listo para ser entregado.',
    showPickupBanner: true,
    history: [
      { step: 1, name: 'Cola', date: '04 Mar - 11:15 AM', desc: 'Receta registrada y montura asignada. En espera de laboratorio.' },
      { step: 2, name: 'Proceso', date: '05 Mar - 02:30 PM', desc: 'Tallado digital, biselado y control de calidad en laboratorio.' },
      { step: 3, name: 'Listo', date: '07 Mar - 10:00 AM', desc: 'Tu pedido ya está en tienda listo para ser entregado.' }
    ]
  }
};

export const STEP_ICONS = {
  1: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  2: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  3: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`
};

export const CHECK_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
