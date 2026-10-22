/* ==========================================================================
   LENS GROUP TRUJILLO — ADMIN DASHBOARD: STATE & DATA REPOSITORIES
   File: js/admin/state.js
   Description: Core application state, Supabase endpoints, and mock databases
   ========================================================================== */

(function () {
  'use strict';

  const ADMIN_STORAGE_KEY = 'lens_group_admin_session';

  const SUPABASE_URL = 'https://rsjondlejagmnjrmbolf.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_A86Q2r3lrF6z14HunWuuwQ_Y-G8ziVV';

  const API_ORDERS_URL = `${SUPABASE_URL}/rest/v1/ordenes_laboratorio?select=*,ventas(*)`;
  const API_LOGIN_URL = `${SUPABASE_URL}/rest/v1/usuarios`;

  // Base de datos de inventario de monturas y tratamientos
  const INVENTORY_DB = [
    { id: 'inv-1', brand: 'Ray-Ban', model: 'Aviator Classic Dorado (RB3025)', stock: 2, threshold: 5, category: 'Sol Polarizado', cost: 250, price: 520, status: 'critical' },
    { id: 'inv-2', brand: 'Ray-Ban', model: 'Wayfarer Midnight Black (RB2140)', stock: 8, threshold: 4, category: 'Sol Clásico', cost: 230, price: 480, status: 'good' },
    { id: 'inv-3', brand: 'Oakley', model: 'Holbrook Polarized OO9102', stock: 3, threshold: 5, category: 'Sol Deportivo', cost: 245, price: 590, status: 'medium' },
    { id: 'inv-4', brand: 'Vogue', model: 'Cat-Eye VO5211S Acetato', stock: 4, threshold: 4, category: 'Oftálmico Femenino', cost: 180, price: 420, status: 'medium' },
    { id: 'inv-5', brand: 'Carrera', model: 'Champion Classic Aviador', stock: 6, threshold: 3, category: 'Sol Unisex', cost: 190, price: 490, status: 'good' },
    { id: 'inv-6', brand: 'InkaLens', model: 'Titanium Flex TR-90 Ultraligero', stock: 9, threshold: 5, category: 'Oftálmico Flexible', cost: 130, price: 360, status: 'good' },
    { id: 'inv-7', brand: 'Sylvane', model: 'Elegance Rose Gold Metálico', stock: 2, threshold: 4, category: 'Oftálmico Premium', cost: 135, price: 380, status: 'critical' },
    { id: 'inv-8', brand: 'Mely', model: 'Fashion Acetato Habana', stock: 11, threshold: 5, category: 'Oftálmico Juvenil', cost: 115, price: 320, status: 'good' },
    { id: 'inv-9', brand: 'Lunas', model: 'Cristales Blue Protect UV400', stock: 3, threshold: 8, category: 'Tratamiento Digital', cost: 70, price: 180, status: 'critical' },
    { id: 'inv-10', brand: 'Lunas', model: 'Progresivo Digital FreeForm', stock: 7, threshold: 4, category: 'Presbicia Alta Gama', cost: 190, price: 580, status: 'good' },
    { id: 'inv-11', brand: 'Lunas', model: 'Fotocromático Transition Gen 8', stock: 5, threshold: 6, category: 'Fotosensible', cost: 140, price: 390, status: 'medium' }
  ];

  const MOCK_CATALOG = [
    { id: 'frm-1', sku: 'KID-SILI-001', brand: 'Miraflex', model: 'Flexible Azul', material: 'Silicona Flexible', color: 'Azul Marino', age: '0-3 años', category: 'Niños', price: 120, stock: 15, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80' },
    { id: 'frm-2', sku: 'KID-TR90-002', brand: 'Nano Vista', model: 'Deportivo TR90', material: 'TR-90', color: 'Rojo/Negro', age: '4-8 años', category: 'Unisex', price: 150, stock: 8, image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&q=80' },
    { id: 'frm-3', sku: 'KID-SILI-003', brand: 'InkaLens Kids', model: 'Princesa Rosa', material: 'Silicona Flexible', color: 'Rosa Pastel', age: '4-8 años', category: 'Niñas', price: 110, stock: 0, image: 'https://plus.unsplash.com/premium_photo-1675807963495-2ba19356cc5b?w=400&q=80' },
    { id: 'frm-4', sku: 'KID-TR90-004', brand: 'Ray-Ban Junior', model: 'Wayfarer Kids', material: 'Acetato/TR-90', color: 'Carey', age: '9-12 años', category: 'Unisex', price: 210, stock: 5, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
    { id: 'frm-5', sku: 'KID-SILI-005', brand: 'Miraflex', model: 'Flexible Lila', material: 'Silicona Flexible', color: 'Lila', age: '0-3 años', category: 'Niñas', price: 120, stock: 12, image: 'https://images.unsplash.com/photo-1625591342279-798822d645fc?w=400&q=80' }
  ];

  const MOCK_CATALOG_ADULT = [
    { id: 'frm-a1', sku: 'ADU-ACE-001', brand: 'Ray-Ban', model: 'Wayfarer Classic', material: 'Acetato', color: 'Negro', category: 'Unisex', price: 420, stock: 5, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
    { id: 'frm-a2', sku: 'ADU-MET-002', brand: 'Oakley', model: 'Holbrook', material: 'Metal', color: 'Plata', category: 'Caballeros', price: 480, stock: 3, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
    { id: 'frm-a3', sku: 'ADU-ACE-003', brand: 'Vogue', model: 'Cat-Eye Elegance', material: 'Acetato', color: 'Carey', category: 'Damas', price: 350, stock: 7, image: 'https://images.unsplash.com/photo-1589785890913-912c96c4b2ff?w=400&q=80' },
    { id: 'frm-a4', sku: 'ADU-TIT-004', brand: 'Carrera', model: 'Titanium Aviator', material: 'Titanio', color: 'Dorado', category: 'Caballeros', price: 550, stock: 2, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80' },
    { id: 'frm-a5', sku: 'ADU-MET-005', brand: 'Sylvane', model: 'Round Metal', material: 'Metal', color: 'Rose Gold', category: 'Damas', price: 380, stock: 0, image: 'https://images.unsplash.com/photo-1625591342279-798822d645fc?w=400&q=80' }
  ];

  // Fallback Orders en caso de ejecución estática
  const DEFAULT_ORDERS = {
    'LGT-2025-0342': {
      code: 'LGT-2025-0342',
      customer: 'Carlos Mendoza Quispe',
      dni: '45892147',
      phone: '944123890',
      receivedDate: '08 de Marzo, 2026',
      estimatedDate: '10 de Marzo, 2026',
      brand: 'Ray-Ban',
      service: 'Montura Ray-Ban Round Metal + Cristales Antirreflejo Blue Protect UV400',
      treatment: 'Blue Protect UV400',
      price: 540,
      cost: 210,
      estado: 'listo',
      urgente: false,
      currentStep: 3
    },
    'LGT-2025-0210': {
      code: 'LGT-2025-0210',
      customer: 'Roberto Castillo Díaz',
      dni: '71245890',
      phone: '958741236',
      receivedDate: '09 de Marzo, 2026',
      estimatedDate: '11 de Marzo, 2026',
      brand: 'InkaLens',
      service: 'Cristales Fotocromáticos Transition Gen 8 + Montura Titanio Flexible',
      treatment: 'Fotocromático Gen 8',
      price: 460,
      cost: 175,
      estado: 'proceso',
      urgente: true,
      currentStep: 2
    },
    'LGT-2025-0105': {
      code: 'LGT-2025-0105',
      customer: 'Mariana Paredes Silva',
      dni: '42369854',
      phone: '962145873',
      receivedDate: '09 de Marzo, 2026',
      estimatedDate: '12 de Marzo, 2026',
      brand: 'Vogue',
      service: 'Lunas Progresivas Digitales FreeForm + Montura Vogue Eyewear',
      treatment: 'Antirreflejo HD Premium',
      price: 680,
      cost: 230,
      estado: 'proceso',
      urgente: false,
      currentStep: 2
    },
    'LGT-2025-0450': {
      code: 'LGT-2025-0450',
      customer: 'Andrea Fernández Ruiz',
      dni: '70963215',
      phone: '974581236',
      receivedDate: '10 de Marzo, 2026',
      estimatedDate: '13 de Marzo, 2026',
      brand: 'Oakley',
      service: 'Gafas de Sol Oakley Polarizadas con Graduación Espejada',
      treatment: 'Polarizado + Espejado Azul',
      price: 590,
      cost: 245,
      estado: 'cola',
      urgente: false,
      currentStep: 1
    },
    'LGT-2025-0500': {
      code: 'LGT-2025-0500',
      customer: 'Jorge Luis Vásquez',
      dni: '18456321',
      phone: '949852147',
      receivedDate: '04 de Marzo, 2026',
      estimatedDate: '07 de Marzo, 2026',
      brand: 'Carrera',
      service: 'Montura Ultraligera de Titanio + Cristales Monofocales Crizal',
      treatment: 'Crizal Easy UV',
      price: 490,
      cost: 190,
      estado: 'listo',
      urgente: false,
      currentStep: 3
    },
    'LGT-2026-0612': {
      code: 'LGT-2026-0612',
      customer: 'Luciana Alva Benites',
      dni: '72658412',
      phone: '941582369',
      receivedDate: '10 de Marzo, 2026',
      estimatedDate: '11 de Marzo, 2026',
      brand: 'Sylvane',
      service: 'Montura Oftálmica Sylvane + Cristales Blue Defense para Trabajo Digital',
      treatment: 'Blue Defense UV420',
      price: 380,
      cost: 135,
      estado: 'proceso',
      urgente: true,
      currentStep: 2
    },
    'LGT-2026-0615': {
      code: 'LGT-2026-0615',
      customer: 'Víctor Hugo Ramos',
      dni: '18965412',
      phone: '955214876',
      receivedDate: '10 de Marzo, 2026',
      estimatedDate: '12 de Marzo, 2026',
      brand: 'Ray-Ban',
      service: 'Gafas de Sol Ray-Ban Aviator Polarized G-15',
      treatment: 'Polarizado G-15',
      price: 520,
      cost: 250,
      estado: 'cola',
      urgente: false,
      currentStep: 1
    },
    'LGT-2026-0620': {
      code: 'LGT-2026-0620',
      customer: 'Camila Sotelo Barreto',
      dni: '75321458',
      phone: '966325874',
      receivedDate: '07 de Marzo, 2026',
      estimatedDate: '09 de Marzo, 2026',
      brand: 'Mely',
      service: 'Montura Mely Habana + Cristales Antirreflejo SuperClean',
      treatment: 'Antirreflejo Hidrofóbico',
      price: 320,
      cost: 115,
      estado: 'listo',
      urgente: false,
      currentStep: 3
    }
  };

  // Base de datos de ventas iniciales (Óptica Trujillo)
  const DEFAULT_SALES = [
    {
      id: 'sale-1',
      correlativo: 'B001-000427',
      tipoDoc: 'boleta',
      clienteDocTipo: 'DNI',
      clienteDocNumero: '45892147',
      clienteNombre: 'ANA LUCIA MORALES CHAVEZ',
      clienteTelefono: '944123890',
      clienteDireccion: 'Jr. Pizarro 420, Trujillo',
      monturaNombre: 'Nano Vista Deportivo TR90',
      monturaPrecio: 150,
      lunasNombre: 'Policarbonato Antirreflejo HD',
      lunasPrecio: 120,
      descuento: 0,
      subtotal: 228.81,
      igv: 41.19,
      total: 270.00,
      metodoPago: 'Yape',
      condicionPago: 'Pagado 100%',
      fechaHora: 'Hoy 10:45 AM',
      timestamp: Date.now() - 3600000 * 2,
      estado: 'Pagado',
      tallerGenerado: true
    },
    {
      id: 'sale-2',
      correlativo: 'B001-000426',
      tipoDoc: 'boleta',
      clienteDocTipo: 'DNI',
      clienteDocNumero: '71245890',
      clienteNombre: 'ROBERTO CARLOS CASTILLO DIAZ',
      clienteTelefono: '958741236',
      clienteDireccion: 'Av. Larco 820, Trujillo',
      monturaNombre: 'Miraflex Flexible Azul',
      monturaPrecio: 120,
      lunasNombre: 'Resina Antirreflejo UV400',
      lunasPrecio: 70,
      descuento: 0,
      subtotal: 161.02,
      igv: 28.98,
      total: 190.00,
      metodoPago: 'Efectivo',
      condicionPago: 'Pagado 100%',
      fechaHora: 'Hoy 09:30 AM',
      timestamp: Date.now() - 3600000 * 4,
      estado: 'Pagado',
      tallerGenerado: true
    },
    {
      id: 'sale-3',
      correlativo: 'F001-000185',
      tipoDoc: 'factura',
      clienteDocTipo: 'RUC',
      clienteDocNumero: '20601234567',
      clienteNombre: 'OPTICA Y CLINICA VISUAL DEL NORTE S.A.C.',
      clienteTelefono: '962145873',
      clienteDireccion: 'AV. ESPAÑA NRO. 1420, TRUJILLO, LA LIBERTAD',
      monturaNombre: 'Ray-Ban Wayfarer Classic',
      monturaPrecio: 420,
      lunasNombre: 'Blue Protect UV420 Luz Azul',
      lunasPrecio: 180,
      descuento: 50,
      subtotal: 466.10,
      igv: 83.90,
      total: 550.00,
      metodoPago: 'Transferencia BCP',
      condicionPago: 'Pagado 100%',
      fechaHora: 'Ayer 06:15 PM',
      timestamp: Date.now() - 86400000,
      estado: 'Pagado',
      tallerGenerado: true
    },
    {
      id: 'sale-4',
      correlativo: 'B001-000425',
      tipoDoc: 'boleta',
      clienteDocTipo: 'DNI',
      clienteDocNumero: '40852963',
      clienteNombre: 'MARIA ELENA GONZALES PAREDES',
      clienteTelefono: '974581236',
      clienteDireccion: 'Urb. California, Trujillo',
      monturaNombre: 'Vogue Cat-Eye Elegance',
      monturaPrecio: 350,
      lunasNombre: 'Fotocromático Transition Gen 8',
      lunasPrecio: 260,
      descuento: 20,
      subtotal: 500.00,
      igv: 90.00,
      total: 590.00,
      metodoPago: 'Tarjeta',
      condicionPago: 'Adelanto 50%',
      fechaHora: 'Ayer 04:30 PM',
      timestamp: Date.now() - 86400000 * 1.2,
      estado: 'Adelanto 50%',
      tallerGenerado: true
    }
  ];

  // Base de datos de Pacientes y Contactabilidad CRM (Lens Group Trujillo)
  const DEFAULT_CRM_PATIENTS = [
    {
      id: 'crm-pat-1',
      dni: '72658412',
      nombre: 'Luciana Alva Benites',
      edad: 27,
      genero: 'F',
      telefono: '941582369',
      direccion: 'Urb. California Mz. B Lt. 14, Trujillo',
      ocupacion: 'Diseñadora UI/UX & Web',
      ticket: 'LGT-2026-0612',
      montura: 'Sylvane Elegance Rose Gold Metálico',
      lunas: 'Blue Defense UV420 Luz Azul + Antirreflejo HD',
      graduacion: {
        od: { esf: '-1.50', cil: '-0.75', eje: '90°', av: '20/20' },
        oi: { esf: '-1.75', cil: '-0.50', eje: '85°', av: '20/20' },
        add: null,
        dp: '62 mm',
        diagnostico: 'Astigmatismo miópico compuesto + Fatiga visual digital severa por pantallas'
      },
      estado: 'listo',
      estadoTexto: 'Listo p/ Retiro',
      fechaEntrega: 'Hoy (19/10/2026)',
      fechaGarantia: '19/10/2027',
      proximaRevision: 'Octubre 2027',
      notaSeguimiento: 'Lentes calibrados en biseladora hoy 10:00 AM. Pendiente enviar WhatsApp para recojo.',
      timeline: [
        { fecha: '17/10/2026 11:30', tipo: 'clinica', autor: 'Optómetra', detalle: 'Evaluación refractiva completada. Se prescribe filtro de luz azul de alta densidad.' },
        { fecha: '19/10/2026 10:00', tipo: 'taller', autor: 'Laboratorio', detalle: 'Biselado digital de cristales UV420 y montaje en montura Sylvane. Control de calidad 100% OK.' }
      ]
    },
    {
      id: 'crm-pat-2',
      dni: '71245890',
      nombre: 'Dr. Roberto Carlos Castillo Díaz',
      edad: 42,
      genero: 'M',
      telefono: '958741236',
      direccion: 'Av. Larco 820, Víctor Larco Herrera, Trujillo',
      ocupacion: 'Médico Cirujano',
      ticket: 'LGT-2025-0210',
      montura: 'InkaLens Titanium Flex TR-90 Ultraligero',
      lunas: 'Fotocromático Transition Gen 8 + Crizal Easy UV',
      graduacion: {
        od: { esf: '+1.25', cil: '-0.50', eje: '180°', av: '20/20' },
        oi: { esf: '+1.50', cil: '-0.75', eje: '175°', av: '20/20' },
        add: '+1.50',
        dp: '64 mm',
        diagnostico: 'Presbicia incipiente con astigmatismo leve contra la regla'
      },
      estado: 'adaptacion',
      estadoTexto: 'En Adaptación',
      fechaEntrega: '13/10/2026',
      fechaGarantia: '13/10/2027',
      proximaRevision: 'Octubre 2027',
      notaSeguimiento: 'Día 6 de uso: Contactar para verificar velocidad de transición en exteriores.',
      timeline: [
        { fecha: '11/10/2026 16:00', tipo: 'venta', autor: 'Ventas', detalle: 'Adquiere montura InkaLens Titanium + lunas Transition Gen 8.' },
        { fecha: '13/10/2026 17:30', tipo: 'entrega', autor: 'Atención', detalle: 'Lentes entregados en sede Jr. Gamarra. Se explicaron cuidados del antirreflejo.' },
        { fecha: '16/10/2026 10:15', tipo: 'whatsapp', autor: 'CRM Postventa', detalle: 'Paciente reporta visión cercana muy cómoda en lectura de expedientes médicos.' }
      ]
    },
    {
      id: 'crm-pat-3',
      dni: '42369854',
      nombre: 'Mariana Paredes Silva',
      edad: 53,
      genero: 'F',
      telefono: '962145873',
      direccion: 'Urb. El Golf Mz. H Lt. 8, Víctor Larco, Trujillo',
      ocupacion: 'Arquitecta & Tasadora de Inmuebles',
      ticket: 'LGT-2025-0105',
      montura: 'Vogue Eyewear Cat-Eye VO5211S Acetato Habana',
      lunas: 'Progresivo Digital FreeForm Alta Definición + Antirreflejo HD',
      graduacion: {
        od: { esf: '+2.00', cil: '-1.00', eje: '45°', av: '20/25' },
        oi: { esf: '+2.25', cil: '-1.25', eje: '135°', av: '20/25' },
        add: '+2.25',
        dp: '61 mm',
        diagnostico: 'Presbicia media con astigmatismo hipermetrópico (1ra vez usuaria de progresivos)'
      },
      estado: 'adaptacion',
      estadoTexto: 'En Adaptación',
      fechaEntrega: '16/10/2026',
      fechaGarantia: '16/10/2027',
      proximaRevision: 'Octubre 2027',
      notaSeguimiento: 'Día 3 con progresivos: Contactar mañana para validar visión intermedia en planos.',
      timeline: [
        { fecha: '14/10/2026 18:20', tipo: 'clinica', autor: 'Dr. Carlos Miranda', detalle: 'Toma de medidas con pupilómetro digital. Corredor progresivo de 14mm.' },
        { fecha: '16/10/2026 12:00', tipo: 'entrega', autor: 'Optometrista', detalle: 'Entrega con inducción de movimientos de barbilla para enfocar lejos, intermedio y cerca.' }
      ]
    },
    {
      id: 'crm-pat-4',
      dni: '45892147',
      nombre: 'Ana Lucía Morales Chávez (Pediátrico)',
      edad: 7,
      genero: 'F',
      telefono: '944123890',
      direccion: 'Jr. Pizarro 420, Trujillo Centro',
      ocupacion: 'Estudiante Primaria (Colegio San José Obrero)',
      ticket: 'B001-000427',
      montura: 'Nano Vista Deportivo TR90 Rojo/Negro con Banda Elástica',
      lunas: 'Policarbonato Antirreflejo HD Anti-Impacto UV400',
      graduacion: {
        od: { esf: '+3.50', cil: '-1.50', eje: '10°', av: '20/30' },
        oi: { esf: '+3.75', cil: '-1.75', eje: '170°', av: '20/30' },
        add: null,
        dp: '54 mm',
        diagnostico: 'Hipermetropía infantil bilateral con astigmatismo (riesgo de ambliopía)'
      },
      estado: 'fidelizado',
      estadoTexto: 'Fidelizado / Satisfecho',
      fechaEntrega: '05/09/2026',
      fechaGarantia: '05/09/2027',
      proximaRevision: 'Marzo 2027 (Semestral)',
      notaSeguimiento: 'Padres muy conformes. Montura ultra resistente a golpes en colegio.',
      timeline: [
        { fecha: '05/09/2026 11:00', tipo: 'entrega', autor: 'Atención', detalle: 'Adaptación de banda elástica deportiva para recreo y actividad física.' },
        { fecha: '20/09/2026 16:45', tipo: 'whatsapp', autor: 'CRM Postventa', detalle: 'Mamá confirma excelente adaptación y mejor rendimiento en lectura.' }
      ]
    },
    {
      id: 'crm-pat-5',
      dni: '18456321',
      nombre: 'Jorge Luis Vásquez Arteaga',
      edad: 48,
      genero: 'M',
      telefono: '949852147',
      direccion: 'Calle Los Pinos 340, Huanchaco, Trujillo',
      ocupacion: 'Empresario Gastronómico',
      ticket: 'LGT-2025-0500',
      montura: 'Carrera Champion Classic Aviador Metálico',
      lunas: 'Monofocal Policarbonato Crizal Easy UV',
      graduacion: {
        od: { esf: '-2.25', cil: '-0.50', eje: '75°', av: '20/20' },
        oi: { esf: '-2.50', cil: '-0.50', eje: '80°', av: '20/20' },
        add: '+1.00',
        dp: '65 mm',
        diagnostico: 'Miopía moderada. Última graduación cumplió 11 meses (cita pendiente)'
      },
      estado: 'control',
      estadoTexto: 'Control Anual / Cita',
      fechaEntrega: '20/11/2025',
      fechaGarantia: '20/11/2026',
      proximaRevision: 'Noviembre 2026 (URGENTE)',
      notaSeguimiento: 'Cumple 1 año de receta. Enviar invitación de WhatsApp para examen optométrico gratis.',
      timeline: [
        { fecha: '20/11/2025 15:00', tipo: 'entrega', autor: 'Ventas', detalle: 'Retiro conforme de lentes en sede Galería San Antonio.' },
        { fecha: '15/10/2026 09:30', tipo: 'sistema', autor: 'CRM Automático', detalle: 'Alerta del sistema: 11 meses de última graduación sin reevaluación.' }
      ]
    },
    {
      id: 'crm-pat-6',
      dni: '75321458',
      nombre: 'Camila Sotelo Barreto',
      edad: 22,
      genero: 'F',
      telefono: '966325874',
      direccion: 'Urb. Primavera Mz. D Lt. 5, Trujillo',
      ocupacion: 'Estudiante de Medicina (UNT)',
      ticket: 'LGT-2026-0620',
      montura: 'Mely Fashion Acetato Habana Juvenil',
      lunas: 'Cristales Antirreflejo SuperClean Hidrofóbico UV400',
      graduacion: {
        od: { esf: '-3.00', cil: '-0.75', eje: '100°', av: '20/20' },
        oi: { esf: '-3.25', cil: '-0.75', eje: '95°', av: '20/20' },
        add: null,
        dp: '59 mm',
        diagnostico: 'Miopía media. Requerimiento continuo en microscopio y largas jornadas de estudio'
      },
      estado: 'listo',
      estadoTexto: 'Listo p/ Retiro',
      fechaEntrega: 'Hoy (19/10/2026)',
      fechaGarantia: '19/10/2027',
      proximaRevision: 'Octubre 2027',
      notaSeguimiento: 'Pedido finalizado en laboratorio óptico hoy 11:30 AM. Enviar WhatsApp.',
      timeline: [
        { fecha: '18/10/2026 10:00', tipo: 'clinica', autor: 'Optometrista', detalle: 'Refracción computarizada y prueba ambulatoria con caja de lunas.' },
        { fecha: '19/10/2026 11:30', tipo: 'taller', autor: 'Laboratorio', detalle: 'Montura armada y limpiada con ultrasonido. Lista en estuche de cuero.' }
      ]
    },
    {
      id: 'crm-pat-7',
      dni: '18965412',
      nombre: 'Víctor Hugo Ramos Gil',
      edad: 38,
      genero: 'M',
      telefono: '955214876',
      direccion: 'Urb. San Andrés 2da Etapa, Trujillo',
      ocupacion: 'Ingeniero Civil / Obras Viales',
      ticket: 'LGT-2026-0615',
      montura: 'Ray-Ban Aviator Classic Dorado (RB3025)',
      lunas: 'Cristal Mineral Polarizado G-15 Antideslumbrante',
      graduacion: {
        od: { esf: '0.00', cil: '-0.50', eje: '180°', av: '20/20' },
        oi: { esf: '0.00', cil: '-0.50', eje: '175°', av: '20/20' },
        add: null,
        dp: '66 mm',
        diagnostico: 'Protección fototóxica y solar para trabajos en campo abierto bajo radiación solar intensa'
      },
      estado: 'garantia',
      estadoTexto: 'Garantía Vigente',
      fechaEntrega: '10/05/2026',
      fechaGarantia: '10/05/2027',
      proximaRevision: 'Mayo 2027',
      notaSeguimiento: 'Garantía oficial vigente. Se le ofreció servicio de calibración y pulido de montura.',
      timeline: [
        { fecha: '10/05/2026 14:00', tipo: 'entrega', autor: 'Ventas', detalle: 'Entrega de gafas originales con certificado de autenticidad y paño de seda.' },
        { fecha: '02/10/2026 11:15', tipo: 'tienda', autor: 'Taller', detalle: 'Mantenimiento preventivo gratuito: ajuste de tornillos de bisagra y cambio de plaquetas.' }
      ]
    },
    {
      id: 'crm-pat-8',
      dni: '41258963',
      nombre: 'Ing. Marcos Valdivia Cruz',
      edad: 50,
      genero: 'M',
      telefono: '978451230',
      direccion: 'Av. América Norte 1240, Urb. Los Jardines, Trujillo',
      ocupacion: 'Gerente de Operaciones Mineras',
      ticket: 'LGT-2025-0450',
      montura: 'Oakley Holbrook Polarized OO9102 Negro Mate',
      lunas: 'Policarbonato Iridium Espejado Polarizado Graduado',
      graduacion: {
        od: { esf: '-1.00', cil: '-0.75', eje: '15°', av: '20/20' },
        oi: { esf: '-1.25', cil: '-0.50', eje: '165°', av: '20/20' },
        add: '+2.00',
        dp: '67 mm',
        diagnostico: 'Presbicia moderada + Miopía. Requiere renovación anual de lunas'
      },
      estado: 'control',
      estadoTexto: 'Control Anual / Cita',
      fechaEntrega: '15/10/2025',
      fechaGarantia: '15/10/2026 (Por Vencer)',
      proximaRevision: 'Octubre 2026 (Vencida)',
      notaSeguimiento: 'Más de 12 meses sin control. Enviar recordatorio por WhatsApp de evaluación gratuita.',
      timeline: [
        { fecha: '15/10/2025 18:00', tipo: 'entrega', autor: 'Ventas', detalle: 'Entrega de gafas de seguridad polarizadas graduadas.' },
        { fecha: '18/10/2026 08:30', tipo: 'sistema', autor: 'CRM Automático', detalle: 'Alerta: Han transcurrido 365 días desde la última refracción clínica.' }
      ]
    },
    {
      id: 'crm-pat-9',
      dni: '73981245',
      nombre: 'Sofía Huamán Mendoza (Infantil)',
      edad: 5,
      genero: 'F',
      telefono: '987654321',
      direccion: 'Urb. Los Cedros Mz. E Lt. 12, Trujillo',
      ocupacion: 'Educación Inicial (Kinder)',
      ticket: 'KID-2026-0034',
      montura: 'Miraflex Flexible Azul Silicona Antialérgica',
      lunas: 'Orgánico Resina UV400 Endurecido Anti-Raya',
      graduacion: {
        od: { esf: '+2.75', cil: '-1.00', eje: '90°', av: '20/25' },
        oi: { esf: '+3.00', cil: '-1.25', eje: '90°', av: '20/25' },
        add: null,
        dp: '51 mm',
        diagnostico: 'Estrabismo acomodativo infantil con respuesta favorable a corrección óptica'
      },
      estado: 'garantia',
      estadoTexto: 'Garantía Vigente',
      fechaEntrega: '01/08/2026',
      fechaGarantia: '01/08/2027',
      proximaRevision: 'Febrero 2027 (Semestral)',
      notaSeguimiento: 'Garantía de rotura activa. El puente de silicona fue calibrado sin costo en septiembre.',
      timeline: [
        { fecha: '01/08/2026 12:30', tipo: 'entrega', autor: 'Optometrista', detalle: 'Ajuste de puente nasal anatómico que no comprime sienes.' },
        { fecha: '14/09/2026 17:00', tipo: 'tienda', autor: 'Taller', detalle: 'Ajuste de tensión tras caída en el colegio. Montura intacta por material siliconado.' }
      ]
    },
    {
      id: 'crm-pat-10',
      dni: '70963215',
      nombre: 'Lic. Daniela Rivasplata Quevedo',
      edad: 31,
      genero: 'F',
      telefono: '974581236',
      direccion: 'Calle Húsares de Junín 650, Trujillo',
      ocupacion: 'Docente de Idiomas & Traductora',
      ticket: 'B001-000425',
      montura: 'Vogue Cat-Eye Elegance Carey Acetato Italiano',
      lunas: 'Fotocromático Transition Gen 8 + Blue Defense Digital',
      graduacion: {
        od: { esf: '-2.00', cil: '-1.00', eje: '15°', av: '20/20' },
        oi: { esf: '-2.00', cil: '-1.00', eje: '165°', av: '20/20' },
        add: null,
        dp: '60 mm',
        diagnostico: 'Astigmatismo miópico con fotofobia en ambientes soleados'
      },
      estado: 'fidelizado',
      estadoTexto: 'Fidelizado / VIP',
      fechaEntrega: '12/07/2026',
      fechaGarantia: '12/07/2027',
      proximaRevision: 'Julio 2027',
      notaSeguimiento: 'Cliente VIP: Calificó con 5 estrellas en Google Reviews. Recomienda activamente a colegas.',
      timeline: [
        { fecha: '12/07/2026 19:00', tipo: 'entrega', autor: 'Atención', detalle: 'Retiro conforme de lentes. Excelente estética facial.' },
        { fecha: '25/07/2026 10:00', tipo: 'whatsapp', autor: 'CRM Postventa', detalle: 'Paciente encantada con el cambio automático de claro a oscuro en Trujillo.' }
      ]
    }
  ];

  // Base de datos de Cardex de movimientos
  const CARDEX_DB = [
    { id: 'CDX-001', ref: 'CDX-2026-001', type: 'entrada',  product: 'Ray-Ban Aviator Classic Dorado (RB3025)',  category: 'Sol Polarizado',         prev: 0,  qty: 10, current: 10, reason: 'Compra inicial proveedor Lima', responsible: 'Dr. Carlos Miranda',   date: '2026-03-01' },
    { id: 'CDX-002', ref: 'CDX-2026-002', type: 'salida',   product: 'Ray-Ban Aviator Classic Dorado (RB3025)',  category: 'Sol Polarizado',         prev: 10, qty: -4, current: 6,  reason: 'Venta al cliente / Boleta B001-00082', responsible: 'Ana Sofía Ruiz',    date: '2026-03-03' },
    { id: 'CDX-003', ref: 'CDX-2026-003', type: 'salida',   product: 'Ray-Ban Aviator Classic Dorado (RB3025)',  category: 'Sol Polarizado',         prev: 6,  qty: -4, current: 2,  reason: 'Venta al cliente / Boleta B001-00094', responsible: 'Dr. Carlos Miranda', date: '2026-03-08' },
    { id: 'CDX-004', ref: 'CDX-2026-004', type: 'entrada',  product: 'Oakley Holbrook Polarized OO9102',         category: 'Sol Deportivo',          prev: 0,  qty: 5,  current: 5,  reason: 'Reposición de stock — Almacén central', responsible: 'Dr. Carlos Miranda', date: '2026-03-02' },
    { id: 'CDX-005', ref: 'CDX-2026-005', type: 'salida',   product: 'Oakley Holbrook Polarized OO9102',         category: 'Sol Deportivo',          prev: 5,  qty: -2, current: 3,  reason: 'Venta al cliente / Boleta B001-00091', responsible: 'Ana Sofía Ruiz',    date: '2026-03-07' },
    { id: 'CDX-006', ref: 'CDX-2026-006', type: 'ajuste',   product: 'Vogue Cat-Eye VO5211S Acetato',            category: 'Oftálmico Femenino',     prev: 5,  qty: -1, current: 4,  reason: 'Corrección de inventario físico',     responsible: 'Dr. Carlos Miranda', date: '2026-03-05' },
    { id: 'CDX-007', ref: 'CDX-2026-007', type: 'entrada',  product: 'Lunas Cristales Blue Protect UV400',       category: 'Tratamiento Digital',    prev: 0,  qty: 15, current: 15, reason: 'Pedido a laboratorio óptico Trujillo', responsible: 'Dr. Carlos Miranda', date: '2026-03-01' },
    { id: 'CDX-008', ref: 'CDX-2026-008', type: 'salida',   product: 'Lunas Cristales Blue Protect UV400',       category: 'Tratamiento Digital',    prev: 15, qty: -6, current: 9,  reason: 'Uso en órdenes de lab. semana 1',     responsible: 'Optómetra en Turno', date: '2026-03-07' },
    { id: 'CDX-009', ref: 'CDX-2026-009', type: 'salida',   product: 'Lunas Cristales Blue Protect UV400',       category: 'Tratamiento Digital',    prev: 9,  qty: -6, current: 3,  reason: 'Uso en órdenes de lab. semana 2',     responsible: 'Optómetra en Turno', date: '2026-03-14' },
    { id: 'CDX-010', ref: 'CDX-2026-010', type: 'entrada',  product: 'InkaLens Titanium Flex TR-90 Ultraligero', category: 'Oftálmico Flexible',     prev: 5,  qty: 4,  current: 9,  reason: 'Reposición semanal desde almacén',    responsible: 'Dr. Carlos Miranda', date: '2026-03-10' },
    { id: 'CDX-011', ref: 'CDX-2026-011', type: 'merma',    product: 'Sylvane Elegance Rose Gold Metálico',      category: 'Oftálmico Premium',      prev: 3,  qty: -1, current: 2,  reason: 'Montura dañada — rayadura en escaparate', responsible: 'Ana Sofía Ruiz', date: '2026-03-12' },
    { id: 'CDX-012', ref: 'CDX-2026-012', type: 'entrada',  product: 'Lunas Progresivo Digital FreeForm',        category: 'Presbicia Alta Gama',    prev: 3,  qty: 7,  current: 10, reason: 'Pedido mensual a proveedor Lima',     responsible: 'Dr. Carlos Miranda', date: '2026-03-13' },
    { id: 'CDX-013', ref: 'CDX-2026-013', type: 'salida',   product: 'Lunas Progresivo Digital FreeForm',        category: 'Presbicia Alta Gama',    prev: 10, qty: -3, current: 7,  reason: 'Uso en órdenes LGT-2025-0105, 0122', responsible: 'Optómetra en Turno', date: '2026-03-15' },
    { id: 'CDX-014', ref: 'CDX-2026-014', type: 'ajuste',   product: 'Mely Fashion Acetato Habana',               category: 'Oftálmico Juvenil',      prev: 13, qty: -2, current: 11, reason: 'Diferencia en conteo físico mensual', responsible: 'Dr. Carlos Miranda', date: '2026-03-16' },
    { id: 'CDX-015', ref: 'CDX-2026-015', type: 'entrada',  product: 'Carrera Champion Classic Aviador',          category: 'Sol Unisex',             prev: 3,  qty: 3,  current: 6,  reason: 'Compra puntual feria óptica Trujillo', responsible: 'Dr. Carlos Miranda', date: '2026-03-18' },
    { id: 'CDX-016', ref: 'CDX-2026-016', type: 'salida',   product: 'Lunas Fotocromático Transition Gen 8',     category: 'Fotosensible',           prev: 7,  qty: -2, current: 5,  reason: 'Uso en orden LGT-2025-0210',          responsible: 'Optómetra en Turno', date: '2026-03-18' },
    { id: 'CDX-017', ref: 'CDX-2026-017', type: 'entrada',  product: 'Ray-Ban Wayfarer Midnight Black (RB2140)', category: 'Sol Clásico',            prev: 5,  qty: 3,  current: 8,  reason: 'Reposición — pedido semanal',         responsible: 'Dr. Carlos Miranda', date: '2026-03-19' },
    { id: 'CDX-018', ref: 'CDX-2026-018', type: 'salida',   product: 'Ray-Ban Wayfarer Midnight Black (RB2140)', category: 'Sol Clásico',            prev: 8,  qty: -1, current: 7,  reason: 'Venta / Boleta B001-00118',           responsible: 'Ana Sofía Ruiz',    date: '2026-03-20' },
  ];

  const CATEGORY_NAMES = {
    'overview': 'Visión General & KPIs',
    'decisions': 'Matriz de Toma de Decisiones',
    'analytics': 'Analítica & Gráficos BI',
    'simulator': 'Simulador de Rentabilidad',
    'orders': 'Órdenes de Laboratorio',
    'inventory': 'Inventario & Stock Crítico',
    'cardex': 'Cardex de Movimientos',
    'catalog': 'Catálogo de Niños',
    'catalog-adult': 'Catálogo de Adultos',
    'sales': 'Historial de Ventas',
    'postventa': 'CRM & Pacientes Oftalmológicos'
  };

  let state = {
    session: null,
    currentCategory: 'overview',
    orders: {},
    inventory: INVENTORY_DB,
    sales: [...DEFAULT_SALES],
    salesSearchQuery: '',
    salesCorrelative: { boleta: 428, factura: 186, nota: 912 },
    currentInvoice: null,
    currentFilter: 'all',
    searchQuery: '',
    charts: {},
    crmPatients: [...DEFAULT_CRM_PATIENTS],
    crmFilter: 'all',
    crmSearchQuery: '',
    cardex: [...CARDEX_DB],
    users: [
      { id: 'usr-1', name: 'Dr. Carlos Miranda', username: 'admin', role: 'Gerente General', branch: 'Galería San Antonio, Jr. Gamarra N° 778', status: 'activo' },
      { id: 'usr-2', name: 'Optómetra en Turno', username: 'optometrista', role: 'Laboratorio & Clínica', branch: 'Galería San Antonio, Jr. Gamarra N° 778', status: 'activo' },
      { id: 'usr-3', name: 'Ana Sofía Ruiz', username: 'aruiz', role: 'Ventas', branch: 'Sede 2 (Centro)', status: 'inactivo' }
    ]
  };

  // Exposición a nivel global para todos los módulos
  window.ADMIN_STORAGE_KEY = ADMIN_STORAGE_KEY;
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  window.API_ORDERS_URL = API_ORDERS_URL;
  window.API_LOGIN_URL = API_LOGIN_URL;
  window.INVENTORY_DB = INVENTORY_DB;
  window.MOCK_CATALOG = MOCK_CATALOG;
  window.MOCK_CATALOG_ADULT = MOCK_CATALOG_ADULT;
  window.DEFAULT_ORDERS = DEFAULT_ORDERS;
  window.DEFAULT_SALES = DEFAULT_SALES;
  window.DEFAULT_CRM_PATIENTS = DEFAULT_CRM_PATIENTS;
  window.CARDEX_DB = CARDEX_DB;
  window.CATEGORY_NAMES = CATEGORY_NAMES;
  window.state = state;
})();
