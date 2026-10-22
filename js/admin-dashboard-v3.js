/* ==========================================================================
   LENS GROUP TRUJILLO — SISTEMA DE GESTIÓN & TOMA DE DECISIONES (BI)
   Módulo con Panel Lateral por Categorías
   ========================================================================== */

const ADMIN_STORAGE_KEY = 'lens_group_admin_session';

const SUPABASE_URL = 'https://rsjondlejagmnjrmbolf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A86Q2r3lrF6z14HunWuuwQ_Y-G8ziVV';

// Ya no usamos las rutas locales /api porque en GitHub Pages no hay servidor Node
const API_ORDERS_URL = `${SUPABASE_URL}/rest/v1/ordenes_laboratorio?select=*,ventas(*)`;
const API_LOGIN_URL = `${SUPABASE_URL}/rest/v1/usuarios`;

// Base de datos de inventario
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
  users: [
    { id: 'usr-1', name: 'Dr. Carlos Miranda', username: 'admin', role: 'Gerente General', branch: 'Galería San Antonio, Jr. Gamarra N° 778', status: 'activo' },
    { id: 'usr-2', name: 'Optómetra en Turno', username: 'optometrista', role: 'Laboratorio & Clínica', branch: 'Galería San Antonio, Jr. Gamarra N° 778', status: 'activo' },
    { id: 'usr-3', name: 'Ana Sofía Ruiz', username: 'aruiz', role: 'Ventas', branch: 'Sede 2 (Centro)', status: 'inactivo' }
  ]
};

window.state = state;

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

// ==========================================================================
// 1. INICIALIZACIÓN
// ==========================================================================
function initApp() {
  initAuth();
  setupEventListeners();
  setupSidebarNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initAuth() {
  const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (saved) {
    try {
      state.session = JSON.parse(saved);
      showDashboardView();
      loadOrders();
      return;
    } catch (e) {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }
  showLoginView();
}

function isUserClinical() {
  if (!state.session) return false;
  const role = String(state.session.role || '').toLowerCase().trim();
  return role.includes('laborat') || role.includes('clinic') || role.includes('clínic') || 
         role.includes('optom') || role.includes('taller');
}

function isUserSeller() {
  if (!state.session) return false;
  if (state.session.isSuperAdmin === true) return false;
  if (isUserClinical()) return false;
  const role = String(state.session.role || '').toLowerCase().trim();
  if (role.includes('vent') || role.includes('vendedor') || role.includes('seller') || role.includes('comercial')) {
    return true;
  }
  const isManagementOrClinical = role.includes('admin') || role.includes('geren') || role.includes('direc') || 
                                 role.includes('optom') || role.includes('laborat') || role.includes('jefe');
  if (!isManagementOrClinical) {
    return true;
  }
  return false;
}

function showLoginView() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboardScreen').style.display = 'none';
}

function showDashboardView() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboardScreen').style.display = 'flex';
  
  if (state.session) {
    // Laboratorio y Clínica NUNCA es super admin
    if (isUserClinical()) {
      state.session.isSuperAdmin = false;
    }

    const displayName = state.session.name || 'Gerente General';
    const displayRole = state.session.role || 'Director Ejecutivo';
    const isSuperAdmin = state.session.isSuperAdmin === true;
    const isSeller = isUserSeller();
    const isClinical = isUserClinical();
    
    document.getElementById('sidebarUserName').textContent = displayName;
    document.getElementById('sidebarUserRole').textContent = displayRole;
    document.getElementById('sidebarUserAvatar').textContent = displayName.charAt(0).toUpperCase();

    // Filtro de roles en el Sidebar y elementos de la interfaz
    document.querySelectorAll('[data-roles]').forEach(el => {
      const allowedRoles = (el.dataset.roles || '').split(',').map(r => r.trim().toLowerCase());
      
      if (isSuperAdmin) {
        // Superadmin tiene acceso a todas las secciones
        el.style.display = '';
      } else if (isSeller) {
        // Vendedor solo puede ver elementos marcados con 'seller' o 'vendedor'
        if (allowedRoles.includes('seller') || allowedRoles.includes('vendedor')) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      } else if (isClinical) {
        // Laboratorio y clínica solo puede ver Atención & Pacientes ('clinical' o 'clinica')
        if (allowedRoles.includes('clinical') || allowedRoles.includes('clinica')) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      } else {
        // Otros roles directivos sin privilegios superadmin
        if (allowedRoles.includes('superadmin') && !allowedRoles.includes('admin') && !allowedRoles.includes('all')) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
      }
    });

    // Chatbot de soporte IA: reservado para administradores
    const chatbotBtn = document.getElementById('chatbotBtn');
    if (chatbotBtn) {
      chatbotBtn.style.display = (isSuperAdmin) ? '' : 'none';
    }

    // Configurar vista inicial según el rol
    const SELLER_ALLOWED = ['sales', 'catalog', 'catalog-adult', 'inventory', 'cardex'];
    const CLINICAL_ALLOWED = ['orders', 'postventa'];

    if (isSeller) {
      // Para vendedor limita la navegación a solo historial de ventas, catálogos e inventario local
      if (!SELLER_ALLOWED.includes(state.currentCategory)) {
        state.currentCategory = 'sales';
      }
      switchCategory(state.currentCategory);
    } else if (isClinical) {
      // Para laboratorio y clínica limita a solo atención y pacientes (órdenes y seguimiento postventa)
      if (!CLINICAL_ALLOWED.includes(state.currentCategory)) {
        state.currentCategory = 'orders';
      }
      switchCategory(state.currentCategory);
    } else {
      if (!isSuperAdmin && ['users', 'audit'].includes(state.currentCategory)) {
        state.currentCategory = 'overview';
      }
      switchCategory(state.currentCategory || 'overview');
      if (isSuperAdmin) {
        renderUsers();
      }
    }
  }
}

// ==========================================================================
// 2. NAVEGACIÓN POR PANEL LATERAL (CATEGORÍA POR CATEGORÍA)
// ==========================================================================
function setupSidebarNavigation() {
  const navBtns = document.querySelectorAll('.sidebar-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.view;
      if (category) {
        switchCategory(category);
        // En móvil cerrar el sidebar al seleccionar
        closeMobileSidebar();
      }
    });
  });

  // Toggle móvil del sidebar
  const btnToggle = document.getElementById('btnSidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (btnToggle && sidebar && overlay) {
    btnToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

window.switchCategory = function(categoryId) {
  const isSeller = isUserSeller();
  const isClinical = isUserClinical();
  const SELLER_ALLOWED = ['sales', 'catalog', 'catalog-adult', 'inventory', 'cardex'];
  const CLINICAL_ALLOWED = ['orders', 'postventa'];

  // Para vendedor limita las cosas que puede ver a solo historial de ventas, catálogos (niños y adultos) y al inventario local
  if (isSeller && !SELLER_ALLOWED.includes(categoryId)) {
    if (typeof showToast === 'function') {
      showToast('Vista restringida: Tu perfil solo tiene acceso a Ventas, Catálogos e Inventario.');
    }
    categoryId = 'sales';
  }

  // Para laboratorio y clínica limita a solo atención y pacientes (órdenes y postventa)
  if (isClinical && !CLINICAL_ALLOWED.includes(categoryId)) {
    if (typeof showToast === 'function') {
      showToast('Vista restringida: Tu perfil solo tiene acceso a Atención & Pacientes (Órdenes y Postventa).');
    }
    categoryId = 'orders';
  }

  state.currentCategory = categoryId;

  // Actualizar botones del sidebar
  document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
    if (btn.dataset.view === categoryId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Actualizar vistas principales
  document.querySelectorAll('.dash-view').forEach(view => {
    if (view.id === `view-${categoryId}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  if (categoryId === 'catalog') {
    renderCatalog();
  } else if (categoryId === 'catalog-adult') {
    renderAdultCatalog();
  } else if (categoryId === 'users') {
    renderUsers();
  } else if (categoryId === 'sales') {
    renderSales();
  } else if (categoryId === 'inventory') {
    renderInventory();
  } else if (categoryId === 'cardex') {
    renderCardex();
  } else if (categoryId === 'postventa') {
    renderCRM();
  }

  // Actualizar Breadcrumb
  const breadcrumb = document.getElementById('activeCategoryBreadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = CATEGORY_NAMES[categoryId] || 'Historial de Ventas';
  }

  // Si entra a la vista de analítica, visión general, o ventas, forzar re-renderizado / resize de Chart.js
  if (categoryId === 'analytics' || categoryId === 'overview' || categoryId === 'sales') {
    setTimeout(() => {
      renderCharts();
    }, 50);
  }

  // Scroll suave al tope del área de contenido
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==========================================================================
// 3. LISTENERS GENERALES
// ==========================================================================
function setupEventListeners() {
  // Formulario login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }



  // Logout
  const logoutBtn = document.getElementById('sidebarLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Búsqueda de órdenes
  const searchInput = document.getElementById('orderSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderOrdersTable();
    });
  }

  // Pestañas de estado en tabla de órdenes
  const ordersTabs = document.querySelector('#view-orders .table-status-tabs');
  if (ordersTabs) {
    ordersTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        ordersTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentFilter = btn.dataset.filter || 'all';
        renderOrdersTable();
      });
    });
  }

  // Pestañas de estado en tabla CRM
  const crmTabs = document.getElementById('crmStatusTabs');
  if (crmTabs) {
    crmTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        crmTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.crmFilter = btn.dataset.filter || 'all';
        renderCRM();
      });
    });
  }

  // Búsqueda en CRM
  const crmSearchInput = document.getElementById('crmSearchInput');
  if (crmSearchInput) {
    crmSearchInput.addEventListener('input', (e) => {
      state.crmSearchQuery = e.target.value.toLowerCase().trim();
      renderCRM();
    });
  }

  // Modal nueva orden
  const btnNewOrder = document.getElementById('btnNewOrder');
  const modalNewOrder = document.getElementById('modalNewOrder');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const formNewOrder = document.getElementById('formNewOrder');

  if (btnNewOrder && modalNewOrder) {
    btnNewOrder.addEventListener('click', () => {
      modalNewOrder.classList.add('active');
      const nextNum = Math.floor(1000 + Math.random() * 9000);
      document.getElementById('newOrderCode').value = `LGT-2026-${nextNum}`;
    });
  }

  if (btnCloseModal && modalNewOrder) {
    btnCloseModal.addEventListener('click', () => modalNewOrder.classList.remove('active'));
  }

  if (formNewOrder) {
    formNewOrder.addEventListener('submit', handleCreateOrder);
  }

  // Simulador de decisiones
  ['simDiscount', 'simPatients', 'simPremium'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateSimulator);
  });

  // Exportar CSV
  const btnExportCsv = document.getElementById('btnExportCsv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportOrdersToCsv);
  }

  // Recuperar Contraseña
  const btnForgotPassword = document.getElementById('btnForgotPassword');
  const modalRecovery = document.getElementById('modalRecovery');
  const btnCloseRecoveryModal = document.getElementById('btnCloseRecoveryModal');
  const formRecovery = document.getElementById('formRecovery');
  const btnRefreshCaptcha = document.getElementById('btnRefreshCaptcha');

  if (btnForgotPassword && modalRecovery) {
    btnForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      modalRecovery.classList.add('active');
      refreshCaptcha();
    });
  }

  if (btnCloseRecoveryModal && modalRecovery) {
    btnCloseRecoveryModal.addEventListener('click', () => {
      modalRecovery.classList.remove('active');
    });
  }

  if (btnRefreshCaptcha) {
    btnRefreshCaptcha.addEventListener('click', refreshCaptcha);
  }

  if (formRecovery) {
    formRecovery.addEventListener('submit', handleRecoverySubmit);
  }

  // Usuarios
  const formNewUser = document.getElementById('formNewUser');
  if (formNewUser) {
    formNewUser.addEventListener('submit', handleCreateUser);
  }

  // Filtros de Catálogo
  ['filterCatalogCategory', 'filterCatalogMaterial', 'filterCatalogAge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderCatalog);
  });

  // Filtros de Catálogo Adultos
  ['filterCatalogAdultCategory', 'filterCatalogAdultMaterial'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderAdultCatalog);
  });

  // Inventario
  const formInventory = document.getElementById('formInventory');
  if (formInventory) {
    formInventory.addEventListener('submit', (e) => typeof handleSaveInventory === 'function' && handleSaveInventory(e));
  }

  // Chatbot
  const chatbotForm = document.getElementById('chatbotForm');
  if (chatbotForm) {
    chatbotForm.addEventListener('submit', (e) => window.handleChatbotSubmit ? window.handleChatbotSubmit(e) : e.preventDefault());
  }

  // Nueva Venta & Facturación
  const formNewSale = document.getElementById('formNewSale');
  if (formNewSale) {
    formNewSale.addEventListener('submit', (e) => window.handleNewSaleSubmit ? window.handleNewSaleSubmit(e) : e.preventDefault());
  }

  // Búsqueda en historial de ventas
  const salesSearchInput = document.getElementById('salesSearchInput');
  if (salesSearchInput) {
    salesSearchInput.addEventListener('input', (e) => {
      state.salesSearchQuery = e.target.value.toLowerCase().trim();
      if (typeof window.renderSales === 'function') window.renderSales();
    });
  }

  // Enter en número de documento para consultar RENIEC / SUNAT
  const saleCustomerDocNumber = document.getElementById('saleCustomerDocNumber');
  if (saleCustomerDocNumber) {
    saleCustomerDocNumber.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (typeof window.handleConsultarFiscal === 'function') window.handleConsultarFiscal();
      }
    });
  }
}

// Lógica del CAPTCHA
let currentCaptcha = '';
function refreshCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptcha = result;
  const captchaText = document.getElementById('captchaText');
  if (captchaText) {
    captchaText.textContent = result;
    // Añadir estilos aleatorios para ofuscar un poco (simulación)
    captchaText.style.letterSpacing = Math.floor(Math.random() * 4 + 2) + 'px';
    captchaText.style.transform = `rotate(${Math.floor(Math.random() * 6 - 3)}deg)`;
  }
  document.getElementById('captchaInput').value = '';
  document.getElementById('captchaError').style.display = 'none';
}

function handleRecoverySubmit(e) {
  e.preventDefault();
  const input = document.getElementById('captchaInput').value.toUpperCase();
  const errorEl = document.getElementById('captchaError');
  
  if (input !== currentCaptcha) {
    errorEl.style.display = 'block';
    refreshCaptcha();
    return;
  }
  
  errorEl.style.display = 'none';
  showToast('Enlace de recuperación enviado al correo registrado.');
  document.getElementById('modalRecovery').classList.remove('active');
  document.getElementById('formRecovery').reset();
}

// ==========================================================================
// 3.5 GESTIÓN DE USUARIOS
// ==========================================================================
window.openUserModal = function(userId = null) {
  const modal = document.getElementById('modalNewUser');
  const form = document.getElementById('formNewUser');
  const title = modal.querySelector('.modal-header h3');
  
  if (userId) {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      title.textContent = 'Editar Usuario';
      document.getElementById('newUserName').value = user.name;
      document.getElementById('newUserUsername').value = user.username;
      document.getElementById('newUserRole').value = user.role;
      document.getElementById('newUserBranch').value = user.branch;
      document.getElementById('newUserPassword').removeAttribute('required'); // No requerido al editar
      form.dataset.editId = userId;
    }
  } else {
    title.textContent = 'Crear Nuevo Usuario';
    form.reset();
    document.getElementById('newUserPassword').setAttribute('required', 'true');
    delete form.dataset.editId;
  }
  
  if (modal) modal.classList.add('active');
};

window.closeUserModal = function() {
  const modal = document.getElementById('modalNewUser');
  if (modal) modal.classList.remove('active');
};

function handleCreateUser(e) {
  e.preventDefault();
  const name = document.getElementById('newUserName').value.trim();
  const username = document.getElementById('newUserUsername').value.trim();
  const role = document.getElementById('newUserRole').value;
  const branch = document.getElementById('newUserBranch').value;
  
  if (!name || !username) return;

  if (e.target.dataset.editId) {
    // Editar
    const user = state.users.find(u => u.id === e.target.dataset.editId);
    if (user) {
      user.name = name;
      user.username = username;
      user.role = role;
      user.branch = branch;
      showToast(`Usuario ${name} actualizado.`);
    }
  } else {
    // Crear
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      username,
      role,
      branch,
      status: 'activo'
    };
    state.users.push(newUser);
    showToast(`Usuario ${name} creado con éxito.`);
  }

  renderUsersTable();
  closeUserModal();
  document.getElementById('formNewUser').reset();
}

window.toggleUserStatus = function(userId) {
  const user = state.users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'activo' ? 'inactivo' : 'activo';
    renderUsersTable();
    showToast(`Usuario ${user.name} ahora está ${user.status}`);
  }
};

window.deleteUser = function(userId) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    state.users = state.users.filter(u => u.id !== userId);
    renderUsersTable();
    showToast('Usuario eliminado del sistema.');
  }
};

function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  if (state.users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
          No hay usuarios registrados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = state.users.map(user => {
    const isActivo = user.status === 'activo';
    const badgeClass = isActivo ? 'badge-listo' : 'badge-cola';
    const badgeText = isActivo ? 'Activo' : 'Inactivo';
    const toggleAction = isActivo ? 'Desactivar' : 'Activar';

    return `
      <tr>
        <td>
          <strong style="color: var(--admin-text-main);">${user.name}</strong>
        </td>
        <td>
          <span style="color: var(--admin-text-dim);">${user.username}</span>
        </td>
        <td>
          <span style="font-size: 0.8rem; color: var(--admin-primary); font-weight: 600;">${user.role}</span>
        </td>
        <td>
          <span style="font-size: 0.85rem; color: var(--admin-text-muted);">${user.branch}</span>
        </td>
        <td>
          <span class="badge-status ${badgeClass}">${badgeText}</span>
        </td>
        <td>
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn-decision-action" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: #38bdf8; border-color: rgba(56, 189, 248, 0.2);" onclick="openUserModal('${user.id}')">
              Editar
            </button>
            <button class="btn-decision-action" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="toggleUserStatus('${user.id}')">
              ${toggleAction}
            </button>
            <button class="btn-decision-action" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.2);" onclick="deleteUser('${user.id}')">
              Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================================================
// 3.6 CATÁLOGO DE NIÑOS
// ==========================================================================
function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  const catFilter = document.getElementById('filterCatalogCategory')?.value || 'all';
  const matFilter = document.getElementById('filterCatalogMaterial')?.value || 'all';
  const ageFilter = document.getElementById('filterCatalogAge')?.value || 'all';

  let filtered = MOCK_CATALOG;
  
  if (catFilter !== 'all') filtered = filtered.filter(item => item.category === catFilter);
  if (matFilter !== 'all') filtered = filtered.filter(item => item.material.includes(matFilter) || matFilter.includes(item.material));
  if (ageFilter !== 'all') filtered = filtered.filter(item => item.age === ageFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">No se encontraron monturas con esos filtros.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isOutOfStock = item.stock <= 0;
    const stockBadge = isOutOfStock 
      ? `<span class="badge-status badge-urgente" style="position: absolute; top: 1rem; right: 1rem;">Agotado</span>`
      : `<span class="badge-status badge-listo" style="position: absolute; top: 1rem; right: 1rem;">${item.stock} en stock</span>`;
      
    const btnSell = isOutOfStock
      ? `<button class="btn-decision-action" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled>Sin Stock</button>`
      : `<button class="btn-primary-action" style="flex: 1; padding: 0.5rem;" onclick="startSale('${item.id}')">Vender</button>`;

    return `
      <div class="catalog-card" style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: 12px; overflow: hidden; position: relative; box-shadow: var(--admin-shadow);">
        ${stockBadge}
        <div style="height: 180px; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--admin-card-border);">
          <img src="${item.image}" alt="${item.model}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="padding: 1.5rem;">
          <div style="font-size: 0.75rem; color: var(--admin-primary); font-weight: 800; margin-bottom: 0.25rem; text-transform: uppercase;">${item.brand} | ${item.sku}</div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; color: var(--admin-text-main); font-weight: 700;">${item.model}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.category}</span>
            <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.age}</span>
            <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.material}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span style="color: var(--admin-text-dim); font-size: 0.85rem; font-weight: 500;">Color: ${item.color}</span>
            <strong style="font-size: 1.35rem; color: var(--admin-accent);">S/ ${item.price.toFixed(2)}</strong>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            ${btnSell}
            ${!isUserSeller() ? `<button class="btn-header-action" style="padding: 0.5rem 1rem;" onclick="showToast('Abriendo editor de producto...')">Editar</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAdultCatalog() {
  const grid = document.getElementById('catalogAdultGrid');
  if (!grid) return;

  const catFilter = document.getElementById('filterCatalogAdultCategory')?.value || 'all';
  const matFilter = document.getElementById('filterCatalogAdultMaterial')?.value || 'all';

  let filtered = MOCK_CATALOG_ADULT;
  
  if (catFilter !== 'all') filtered = filtered.filter(item => item.category === catFilter);
  if (matFilter !== 'all') filtered = filtered.filter(item => item.material.includes(matFilter) || matFilter.includes(item.material));

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">No se encontraron monturas con esos filtros.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isOutOfStock = item.stock <= 0;
    const stockBadge = isOutOfStock 
      ? `<span class="badge-status badge-urgente" style="position: absolute; top: 1rem; right: 1rem;">Agotado</span>`
      : `<span class="badge-status badge-listo" style="position: absolute; top: 1rem; right: 1rem;">${item.stock} en stock</span>`;
      
    const btnSell = isOutOfStock
      ? `<button class="btn-decision-action" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled>Sin Stock</button>`
      : `<button class="btn-primary-action" style="flex: 1; padding: 0.5rem;" onclick="startSale('${item.id}')">Vender</button>`;

    return `
      <div class="catalog-card" style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: 12px; overflow: hidden; position: relative; box-shadow: var(--admin-shadow);">
        ${stockBadge}
        <div style="height: 180px; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--admin-card-border);">
          <img src="${item.image}" alt="${item.model}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="padding: 1.5rem;">
          <div style="font-size: 0.75rem; color: var(--admin-primary); font-weight: 800; margin-bottom: 0.25rem; text-transform: uppercase;">${item.brand} | ${item.sku}</div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; color: var(--admin-text-main); font-weight: 700;">${item.model}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.category}</span>
            <span style="font-size: 0.75rem; background: var(--admin-bg-alt); color: var(--admin-text-main); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-card-border); font-weight: 500;">${item.material}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span style="color: var(--admin-text-dim); font-size: 0.85rem; font-weight: 500;">Color: ${item.color}</span>
            <strong style="font-size: 1.35rem; color: var(--admin-accent);">S/ ${item.price.toFixed(2)}</strong>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            ${btnSell}
            ${!isUserSeller() ? `<button class="btn-header-action" style="padding: 0.5rem 1rem;" onclick="showToast('Abriendo editor de producto...')">Editar</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 3.7 MÓDULO DE VENTAS, FACTURACIÓN ELECTRÓNICA & RENIEC / SUNAT
// ==========================================================================
function numeroALetras(amount) {
  const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
  
  const entero = Math.floor(amount);
  const centavos = Math.round((amount - entero) * 100);
  const centavosStr = String(centavos).padStart(2, '0');
  
  if (entero === 0) return `CERO CON ${centavosStr}/100 SOLES`;
  if (entero === 100) return `CIEN CON ${centavosStr}/100 SOLES`;
  
  let texto = '';
  if (entero >= 1000) {
    const miles = Math.floor(entero / 1000);
    texto += (miles === 1 ? 'MIL ' : units[miles] + ' MIL ');
  }
  const resto1000 = entero % 1000;
  if (resto1000 >= 100) {
    const c = Math.floor(resto1000 / 100);
    texto += hundreds[c] + ' ';
  }
  const resto100 = resto1000 % 100;
  if (resto100 >= 10 && resto100 <= 19) {
    texto += teens[resto100 - 10] + ' ';
  } else if (resto100 >= 20) {
    const d = Math.floor(resto100 / 10);
    const u = resto100 % 10;
    if (d === 2 && u > 0) {
      texto += 'VEINTI' + units[u] + ' ';
    } else {
      texto += tens[d] + (u > 0 ? ' Y ' + units[u] : '') + ' ';
    }
  } else if (resto100 > 0) {
    texto += units[resto100] + ' ';
  }
  
  return (texto.trim() + ` CON ${centavosStr}/100 SOLES`).toUpperCase();
}

window.renderSales = function() {
  const tbody = document.getElementById('salesTableBody');
  if (!tbody) return;

  let list = state.sales || [];
  if (state.salesSearchQuery) {
    const q = state.salesSearchQuery.toLowerCase();
    list = list.filter(s =>
      (s.correlativo && s.correlativo.toLowerCase().includes(q)) ||
      (s.clienteNombre && s.clienteNombre.toLowerCase().includes(q)) ||
      (s.clienteDocNumero && s.clienteDocNumero.includes(q)) ||
      (s.monturaNombre && s.monturaNombre.toLowerCase().includes(q))
    );
  }

  // KPIs
  const totalDay = state.sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
  const salesTotalDayEl = document.getElementById('salesTotalDay');
  if (salesTotalDayEl) {
    salesTotalDayEl.textContent = `S/ ${totalDay.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const salesFramesDayEl = document.getElementById('salesFramesDay');
  if (salesFramesDayEl) {
    salesFramesDayEl.textContent = state.sales.length;
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
          No se encontraron ventas con los criterios de búsqueda.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(s => {
    const isPaid = s.estado === 'Pagado';
    const badgeClass = isPaid ? 'badge-listo' : 'badge-proceso';
    const docPillColor = s.clienteDocTipo === 'RUC' ? '#0284c7' : '#059669';
    const docPillBg = s.clienteDocTipo === 'RUC' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(5, 150, 105, 0.12)';

    return `
      <tr>
        <td style="white-space: nowrap;">
          <div style="font-weight: 800; font-family: monospace; color: var(--admin-primary); font-size: 0.92rem; letter-spacing: 0.02em;">
            ${s.correlativo}
          </div>
          <span style="font-size: 0.7rem; color: var(--admin-text-dim); text-transform: uppercase; font-weight: 600; display: block; margin-top: 0.15rem;">
            ${s.tipoDoc === 'factura' ? 'Factura Electrónica' : s.tipoDoc === 'boleta' ? 'Boleta Electrónica' : 'Nota de Venta'}
          </span>
        </td>
        <td style="white-space: nowrap;">
          <span style="font-size: 0.84rem; color: var(--admin-text-muted); font-weight: 600;">${s.fechaHora}</span>
        </td>
        <td style="min-width: 200px;">
          <div style="font-weight: 700; color: var(--admin-text-main); font-size: 0.88rem; line-height: 1.3;">
            ${s.clienteNombre}
          </div>
          ${s.clienteTelefono ? `
            <div style="font-size: 0.76rem; color: var(--admin-text-dim); margin-top: 0.2rem; display: inline-flex; align-items: center; gap: 0.3rem;">
              <span>${LG.icon('phone', { size: 14, sw: 2 })}</span>
              <span style="font-weight: 500;">${s.clienteTelefono}</span>
            </div>
          ` : ''}
        </td>
        <td style="white-space: nowrap;">
          <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <code style="font-size: 0.84rem; color: var(--admin-text-main); font-weight: 700; background: var(--admin-bg-alt); padding: 0.2rem 0.45rem; border-radius: 4px; border: 1px solid var(--admin-card-border); letter-spacing: 0.03em;">${s.clienteDocNumero}</code>
            <span style="font-size: 0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; background: ${docPillBg}; color: ${docPillColor}; font-weight: 800; border: 1px solid ${docPillColor}33;">
              ${s.clienteDocTipo}
            </span>
          </div>
        </td>
        <td style="min-width: 220px;">
          <div style="font-size: 0.84rem; color: var(--admin-text-main); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;" title="${s.monturaNombre}">
            ${s.monturaNombre}
          </div>
          <div style="font-size: 0.74rem; color: var(--admin-primary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; margin-top: 0.15rem;" title="${s.lunasNombre}">
            ${s.lunasNombre}
          </div>
        </td>
        <td style="white-space: nowrap;">
          <strong style="color: #10b981; font-size: 0.95rem; font-weight: 800;">S/ ${Number(s.total).toFixed(2)}</strong>
          <div style="font-size: 0.72rem; color: var(--admin-text-dim); font-weight: 600; text-transform: capitalize;">${s.metodoPago}</div>
        </td>
        <td style="white-space: nowrap;">
          <span class="badge-status ${badgeClass}">${s.estado}</span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
            <button type="button" class="btn-table-action" title="Ver Comprobante Electrónico" onclick="openInvoiceModal('${s.id}')">
              Ver
            </button>
            <button type="button" class="btn-table-action btn-wa" title="Enviar por WhatsApp" onclick="sendInvoiceWhatsApp('${s.id}')">
              WA
            </button>
            <button type="button" class="btn-table-action" title="Imprimir Comprobante" onclick="printInvoiceById('${s.id}')">
              ${LG.icon('printer', { size: 14, sw: 2 })}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.setSaleDocType = function(type) {
  const btnBoleta = document.getElementById('btnTypeBoleta');
  const btnFactura = document.getElementById('btnTypeFactura');
  const btnNota = document.getElementById('btnTypeNota');
  const docTypeInput = document.getElementById('saleDocType');
  const correlativoText = document.getElementById('saleCorrelativoText');
  const docTypeSelect = document.getElementById('saleCustomerDocType');
  const labelCustomerName = document.getElementById('labelCustomerName');
  const addressGroup = document.getElementById('fieldCustomerAddressGroup');
  const docNumberInput = document.getElementById('saleCustomerDocNumber');
  const btnFiscalLookupText = document.getElementById('btnFiscalLookupText');

  [btnBoleta, btnFactura, btnNota].forEach(b => b?.classList.remove('active'));

  docTypeInput.value = type;

  if (type === 'factura') {
    btnFactura?.classList.add('active');
    correlativoText.textContent = `F001-${String(state.salesCorrelative.factura).padStart(6, '0')}`;
    docTypeSelect.value = 'RUC';
    labelCustomerName.textContent = 'Razón Social de la Empresa';
    docNumberInput.placeholder = 'Ingresa RUC (11 dígitos)';
    docNumberInput.maxLength = 11;
    btnFiscalLookupText.textContent = 'Consultar SUNAT';
    if (addressGroup) addressGroup.style.display = 'block';
  } else if (type === 'nota') {
    btnNota?.classList.add('active');
    correlativoText.textContent = `NV01-${String(state.salesCorrelative.nota).padStart(6, '0')}`;
    labelCustomerName.textContent = 'Cliente';
    docNumberInput.placeholder = 'DNI o documento';
    btnFiscalLookupText.textContent = 'Consultar RENIEC';
    if (addressGroup) addressGroup.style.display = 'none';
  } else {
    // Boleta
    btnBoleta?.classList.add('active');
    correlativoText.textContent = `B001-${String(state.salesCorrelative.boleta).padStart(6, '0')}`;
    docTypeSelect.value = 'DNI';
    labelCustomerName.textContent = 'Nombres y Apellidos del Paciente';
    docNumberInput.placeholder = 'Ingresa DNI (8 dígitos)';
    docNumberInput.maxLength = 8;
    btnFiscalLookupText.textContent = 'Consultar RENIEC';
    if (addressGroup) addressGroup.style.display = 'none';
  }

  const feedback = document.getElementById('saleDocFeedback');
  if (feedback) feedback.innerHTML = '';
};

window.handleDocTypeSelectChange = function() {
  const docType = document.getElementById('saleCustomerDocType').value;
  const docNumberInput = document.getElementById('saleCustomerDocNumber');
  const btnFiscalLookupText = document.getElementById('btnFiscalLookupText');
  const addressGroup = document.getElementById('fieldCustomerAddressGroup');
  const labelCustomerName = document.getElementById('labelCustomerName');

  if (docType === 'RUC') {
    docNumberInput.placeholder = 'Ingresa RUC (11 dígitos)';
    docNumberInput.maxLength = 11;
    btnFiscalLookupText.textContent = 'Consultar SUNAT';
    labelCustomerName.textContent = 'Razón Social de la Empresa';
    if (addressGroup) addressGroup.style.display = 'block';
  } else {
    docNumberInput.placeholder = 'Ingresa DNI (8 dígitos)';
    docNumberInput.maxLength = 8;
    btnFiscalLookupText.textContent = 'Consultar RENIEC';
    labelCustomerName.textContent = 'Nombres y Apellidos del Paciente';
    if (addressGroup && document.getElementById('saleDocType').value !== 'factura') {
      addressGroup.style.display = 'none';
    }
  }

  const feedback = document.getElementById('saleDocFeedback');
  if (feedback) feedback.innerHTML = '';
};

window.handleConsultarFiscal = async function() {
  const docType = document.getElementById('saleCustomerDocType').value;
  const docNumber = document.getElementById('saleCustomerDocNumber').value.trim();
  const feedbackEl = document.getElementById('saleDocFeedback');
  const nameInput = document.getElementById('saleCustomerName');
  const addressInput = document.getElementById('saleCustomerAddress');
  const btnLookup = document.getElementById('btnFiscalLookup');
  const btnText = document.getElementById('btnFiscalLookupText');

  if (!docNumber) {
    showToast('Ingresa un número de documento para consultar.');
    return;
  }

  const prevText = btnText.textContent;
  btnLookup.disabled = true;
  btnText.textContent = 'Consultando...';

  try {
    if (docType === 'RUC' || docNumber.length === 11) {
      if (docNumber.length !== 11) throw new Error('El RUC debe tener 11 dígitos.');
      const data = await window.LG.fiscal.consultarRUC(docNumber);
      nameInput.value = data.razonSocial || '';
      if (addressInput) addressInput.value = data.direccion || 'TRUJILLO, LA LIBERTAD';
      feedbackEl.innerHTML = `
        <div class="verified-badge success">
          ${LG.icon('check', { size: 14, sw: 2.5 })}
          <span><strong>SUNAT:</strong> ${data.razonSocial} (${data.estado || 'ACTIVO'} - ${data.condicion || 'HABIDO'})</span>
        </div>
      `;
      showToast(`RUC ${docNumber} verificado ante SUNAT`);
    } else {
      if (docNumber.length !== 8) throw new Error('El DNI debe tener 8 dígitos.');
      const data = await window.LG.fiscal.consultarDNI(docNumber);
      nameInput.value = data.nombreCompleto || '';
      feedbackEl.innerHTML = `
        <div class="verified-badge success">
          ${LG.icon('check', { size: 14, sw: 2.5 })}
          <span><strong>RENIEC:</strong> ${data.nombreCompleto}</span>
        </div>
      `;
      showToast(`DNI ${docNumber} verificado ante RENIEC`);
    }
  } catch (err) {
    feedbackEl.innerHTML = `
      <div class="verified-badge warning">
        <span>${err.message} Puedes ingresar los datos manualmente.</span>
      </div>
    `;
    showToast(err.message);
  } finally {
    btnLookup.disabled = false;
    btnText.textContent = prevText;
  }
};

window.handleFrameSelectChange = function() {
  const select = document.getElementById('saleFrameSelect');
  const priceInput = document.getElementById('saleFramePrice');
  const customFrameGroup = document.getElementById('fieldCustomFrameDesc');
  const selectedOpt = select.options[select.selectedIndex];

  if (!selectedOpt) return;

  const price = parseFloat(selectedOpt.dataset.price) || 0;
  priceInput.value = price;

  if (select.value === 'custom') {
    if (customFrameGroup) customFrameGroup.style.display = 'block';
  } else {
    if (customFrameGroup) customFrameGroup.style.display = 'none';
  }

  calculateNewSaleTotals();
};

window.handleLensTreatmentChange = function() {
  const select = document.getElementById('saleLensTreatment');
  const priceInput = document.getElementById('saleLensPrice');
  const selectedOpt = select.options[select.selectedIndex];

  if (!selectedOpt) return;

  const price = parseFloat(selectedOpt.dataset.price) || 0;
  priceInput.value = price;

  calculateNewSaleTotals();
};

window.calculateNewSaleTotals = function() {
  const framePrice = parseFloat(document.getElementById('saleFramePrice')?.value) || 0;
  const lensPrice = parseFloat(document.getElementById('saleLensPrice')?.value) || 0;
  const discount = parseFloat(document.getElementById('saleDiscount')?.value) || 0;

  const subtotalNeto = framePrice + lensPrice;
  const total = Math.max(0, subtotalNeto - discount);
  const baseGravada = total / 1.18;
  const igv = total - baseGravada;

  const subtotalEl = document.getElementById('saleSubtotalDisplay');
  const igvEl = document.getElementById('saleIgvDisplay');
  const discountEl = document.getElementById('saleDiscountDisplay');
  const totalEl = document.getElementById('saleTotalDisplay');

  if (subtotalEl) subtotalEl.textContent = `S/ ${baseGravada.toFixed(2)}`;
  if (igvEl) igvEl.textContent = `S/ ${igv.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `- S/ ${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `S/ ${total.toFixed(2)}`;
};

window.openNewSaleModal = function(frameId = null) {
  const modal = document.getElementById('modalNewSale');
  const form = document.getElementById('formNewSale');
  if (!modal || !form) return;

  form.reset();
  setSaleDocType('boleta');

  if (frameId) {
    const frameSelect = document.getElementById('saleFrameSelect');
    if (frameSelect) {
      frameSelect.value = frameId;
      handleFrameSelectChange();
    }
  } else {
    const frameSelect = document.getElementById('saleFrameSelect');
    if (frameSelect && frameSelect.options.length > 1) {
      frameSelect.selectedIndex = 1;
      handleFrameSelectChange();
    }
  }

  calculateNewSaleTotals();
  modal.classList.add('active');
};

window.closeNewSaleModal = function() {
  document.getElementById('modalNewSale')?.classList.remove('active');
};

window.startSale = function(frameId) {
  openNewSaleModal(frameId);
};

window.closeSaleModal = function() {
  closeNewSaleModal();
};

window.handleNewSaleSubmit = async function(e) {
  e.preventDefault();

  const docType = document.getElementById('saleDocType').value;
  const customerDocType = document.getElementById('saleCustomerDocType').value;
  const customerDocNumber = document.getElementById('saleCustomerDocNumber').value.trim();
  const customerName = document.getElementById('saleCustomerName').value.trim();
  const customerAddress = document.getElementById('saleCustomerAddress')?.value.trim() || 'Trujillo, La Libertad';
  const customerPhone = document.getElementById('saleCustomerPhone').value.trim() || '944123890';
  const customerEmail = document.getElementById('saleCustomerEmail')?.value.trim() || '';

  const frameSelect = document.getElementById('saleFrameSelect');
  let frameName = frameSelect.options[frameSelect.selectedIndex]?.dataset.name || 'Montura Oftálmica';
  if (frameSelect.value === 'custom') {
    const customName = document.getElementById('saleCustomFrameName')?.value.trim();
    if (customName) frameName = customName;
  }
  const framePrice = parseFloat(document.getElementById('saleFramePrice').value) || 0;

  const lensSelect = document.getElementById('saleLensTreatment');
  const lensName = lensSelect.options[lensSelect.selectedIndex]?.text || 'Solo Montura';
  const lensPrice = parseFloat(document.getElementById('saleLensPrice').value) || 0;

  const rxOD = document.getElementById('saleRxOD')?.value.trim() || '';
  const rxOI = document.getElementById('saleRxOI')?.value.trim() || '';
  const rxDNP = document.getElementById('saleRxDNP')?.value.trim() || '';

  const discount = parseFloat(document.getElementById('saleDiscount').value) || 0;
  const total = Math.max(0, (framePrice + lensPrice) - discount);
  const subtotal = total / 1.18;
  const igv = total - subtotal;

  const paymentMethod = document.getElementById('salePaymentMethod').value;
  const paymentCondition = document.getElementById('salePaymentCondition').value;
  const isPaid = paymentCondition.includes('100%');

  // Correlativo según tipo
  let correlativo = '';
  if (docType === 'factura') {
    correlativo = `F001-${String(state.salesCorrelative.factura).padStart(6, '0')}`;
    state.salesCorrelative.factura++;
  } else if (docType === 'nota') {
    correlativo = `NV01-${String(state.salesCorrelative.nota).padStart(6, '0')}`;
    state.salesCorrelative.nota++;
  } else {
    correlativo = `B001-${String(state.salesCorrelative.boleta).padStart(6, '0')}`;
    state.salesCorrelative.boleta++;
  }

  const now = new Date();
  const horaStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  const fechaStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  const saleId = 'sale-' + Date.now();
  const newSale = {
    id: saleId,
    correlativo,
    tipoDoc: docType,
    clienteDocTipo: customerDocType,
    clienteDocNumero: customerDocNumber,
    clienteNombre: customerName,
    clienteDireccion: customerAddress,
    clienteTelefono: customerPhone,
    clienteEmail: customerEmail,
    monturaNombre: frameName,
    monturaPrecio: framePrice,
    lunasNombre: lensName,
    lunasPrecio: lensPrice,
    rx: { od: rxOD, oi: rxOI, dnp: rxDNP },
    descuento: discount,
    subtotal: Number(subtotal.toFixed(2)),
    igv: Number(igv.toFixed(2)),
    total: Number(total.toFixed(2)),
    totalEnLetras: numeroALetras(total),
    metodoPago: paymentMethod,
    condicionPago: paymentCondition,
    estado: isPaid ? 'Pagado' : 'Adelanto 50%',
    fechaHora: `Hoy ${horaStr}`,
    fechaCompleta: `${fechaStr} ${horaStr}`,
    timestamp: Date.now(),
    tallerGenerado: document.getElementById('saleCreateWorkshopOrder')?.checked || false
  };

  // Guardar en estado de ventas
  state.sales.unshift(newSale);
  try {
    if (window.LG?.supabase?.createSale) {
      window.LG.supabase.createSale(newSale).catch(err => console.warn('[Supabase] Venta no guardada en nube:', err));
    }
  } catch (e) {}

  // Si se marcó orden de taller automática, generarla
  if (newSale.tallerGenerado) {
    const isUrgent = document.getElementById('saleWorkshopUrgency')?.value === 'urgente';
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `LGT-2026-${orderNum}`;
    
    state.orders[orderCode] = {
      code: orderCode,
      customer: customerName,
      dni: customerDocNumber,
      phone: customerPhone,
      receivedDate: `${now.getDate()} de Marzo, 2026`,
      estimatedDate: `${now.getDate() + (isUrgent ? 1 : 2)} de Marzo, 2026`,
      brand: frameName.split(' ')[0] || 'LensGroup',
      service: `${frameName} + ${lensName}`,
      treatment: lensName,
      price: total,
      cost: Math.round(total * 0.4),
      estado: 'cola',
      urgente: isUrgent,
      currentStep: 1
    };

    // Intentar sincronizar con Supabase
    try {
      if (window.LG?.supabase?.createOrder) {
        window.LG.supabase.createOrder({
          numero_ticket: orderCode,
          estado: 'cola',
          urgente: isUrgent,
          paciente: customerName,
          dni: customerDocNumber,
          telefono: customerPhone,
          montura: frameName,
          luna: lensName,
          total: total
        }).catch(() => {});
      }
    } catch (e) {}
  }

  // Descontar inventario si coincide con catálogo
  const matchedFrame = MOCK_CATALOG.find(f => f.id === frameSelect.value) || MOCK_CATALOG_ADULT.find(f => f.id === frameSelect.value);
  if (matchedFrame && matchedFrame.stock > 0) {
    matchedFrame.stock -= 1;
    renderCatalog();
    renderAdultCatalog();
  }

  closeNewSaleModal();
  renderSales();
  renderOrdersTable();
  showToast(`¡${correlativo} emitido con éxito!`);

  // Abrir visualizador e impresión del comprobante de inmediato
  openInvoiceModal(newSale);
};

window.openInvoiceModal = function(saleOrId) {
  let sale = saleOrId;
  if (typeof saleOrId === 'string') {
    sale = state.sales.find(s => s.id === saleOrId);
  }
  if (!sale) return;

  state.currentInvoice = sale;
  const ticketContent = document.getElementById('ticketContent');
  if (!ticketContent) return;

  const docTitle = sale.tipoDoc === 'factura' 
    ? 'FACTURA ELECTRÓNICA' 
    : sale.tipoDoc === 'nota' 
      ? 'NOTA DE VENTA' 
      : 'BOLETA DE VENTA ELECTRÓNICA';

  ticketContent.innerHTML = `
    <div class="ticket-header">
      <h4>LENS GROUP TRUJILLO S.A.C.</h4>
      <div>R.U.C. 20609502623</div>
      <div>Jr. Gamarra N° 778 Int. 12 (Galería San Antonio)</div>
      <div>Centro Histórico — Trujillo, La Libertad</div>
      <div>WhatsApp: 944 123 890</div>
      <div class="ticket-doc-box">
        ${docTitle}<br>
        <strong>${sale.correlativo}</strong>
      </div>
    </div>

    <div class="ticket-meta">
      <div><strong>FECHA EMISIÓN:</strong> ${sale.fechaCompleta || sale.fechaHora}</div>
      <div><strong>CLIENTE:</strong> ${sale.clienteNombre}</div>
      <div><strong>${sale.clienteDocTipo}:</strong> ${sale.clienteDocNumero}</div>
      ${sale.clienteDireccion ? `<div><strong>DIRECCIÓN:</strong> ${sale.clienteDireccion}</div>` : ''}
      <div><strong>MONEDA:</strong> SOLES (PEN)</div>
      <div><strong>FORMA DE PAGO:</strong> ${sale.metodoPago} (${sale.condicionPago})</div>
    </div>

    <table class="ticket-items-table">
      <thead>
        <tr>
          <th>CANT</th>
          <th>DESCRIPCIÓN</th>
          <th style="text-align: right;">IMPORTE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <strong>${sale.monturaNombre}</strong>
            ${sale.rx && (sale.rx.od || sale.rx.oi) ? `<div style="font-size: 10px; color: #475569;">Rx OD:${sale.rx.od || '-'} OI:${sale.rx.oi || '-'}</div>` : ''}
          </td>
          <td style="text-align: right;">S/ ${Number(sale.monturaPrecio).toFixed(2)}</td>
        </tr>
        ${sale.lunasPrecio > 0 ? `
        <tr>
          <td>1</td>
          <td>${sale.lunasNombre}</td>
          <td style="text-align: right;">S/ ${Number(sale.lunasPrecio).toFixed(2)}</td>
        </tr>` : ''}
        ${sale.descuento > 0 ? `
        <tr>
          <td></td>
          <td style="color: #dc2626;">Descuento Promocional</td>
          <td style="text-align: right; color: #dc2626;">- S/ ${Number(sale.descuento).toFixed(2)}</td>
        </tr>` : ''}
      </tbody>
    </table>

    <div class="ticket-totals">
      <div class="ticket-totals-row">
        <span>OP. GRAVADA:</span>
        <span>S/ ${Number(sale.subtotal).toFixed(2)}</span>
      </div>
      <div class="ticket-totals-row">
        <span>I.G.V. (18%):</span>
        <span>S/ ${Number(sale.igv).toFixed(2)}</span>
      </div>
      <div class="ticket-totals-row grand">
        <span>TOTAL A PAGAR:</span>
        <span>S/ ${Number(sale.total).toFixed(2)}</span>
      </div>
    </div>

    <div style="margin-top: 8px; font-size: 11px; text-align: center; font-weight: 700;">
      SON: ${sale.totalEnLetras || numeroALetras(sale.total)}
    </div>

    <div class="ticket-footer">
      <!-- Código QR Simulado SVG para validación fiscal -->
      <svg class="ticket-qr" viewBox="0 0 100 100" fill="#0f172a">
        <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
        <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
        <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
        <rect x="45" y="10" width="8" height="8" />
        <rect x="45" y="25" width="8" height="15" />
        <rect x="60" y="45" width="15" height="8" />
        <rect x="80" y="45" width="10" height="15" />
        <rect x="45" y="60" width="8" height="30" />
        <rect x="60" y="70" width="30" height="8" />
        <rect x="75" y="82" width="15" height="8" />
      </svg>
      <div>Código Hash: <strong>qL8v92H/LtG-OptTruj=${sale.correlativo.slice(-4)}</strong></div>
      <div style="margin-top: 4px;">Representación impresa de la ${docTitle}. Puede verificar su validez electrónica ante SUNAT.</div>
      <div style="margin-top: 6px; font-weight: 700;">¡Gracias por cuidar su salud visual con Lens Group!</div>
    </div>
  `;

  document.getElementById('modalInvoiceViewer')?.classList.add('active');
};

window.closeInvoiceModal = function() {
  document.getElementById('modalInvoiceViewer')?.classList.remove('active');
};

window.printCurrentInvoice = function() {
  window.print();
};

window.printInvoiceById = function(saleId) {
  openInvoiceModal(saleId);
  setTimeout(() => window.print(), 250);
};

window.sendInvoiceWhatsApp = function(saleId) {
  openInvoiceModal(saleId);
  sendCurrentInvoiceWhatsApp();
};

window.sendCurrentInvoiceWhatsApp = function() {
  const sale = state.currentInvoice;
  if (!sale) return;

  const phone = (sale.clienteTelefono || '').replace(/\D/g, '');
  const cleanPhone = phone.length === 9 ? `51${phone}` : phone.length === 11 ? phone : '51944123890';

  const docTitle = sale.tipoDoc === 'factura' ? 'Factura Electrónica' : 'Boleta de Venta Electrónica';
  const msg = [
    `*LENS GROUP TRUJILLO*`,
    `Hola ${sale.clienteNombre}, adjuntamos su comprobante de pago:`,
    ``,
    `*${docTitle}:* ${sale.correlativo}`,
    `*Cliente:* ${sale.clienteNombre} (${sale.clienteDocTipo}: ${sale.clienteDocNumero})`,
    `*Fecha:* ${sale.fechaCompleta || sale.fechaHora}`,
    `--------------------------------`,
    `• Montura: ${sale.monturaNombre} (S/ ${Number(sale.monturaPrecio).toFixed(2)})`,
    sale.lunasPrecio > 0 ? `• Lunas: ${sale.lunasNombre} (S/ ${Number(sale.lunasPrecio).toFixed(2)})` : null,
    sale.descuento > 0 ? `• Descuento: - S/ ${Number(sale.descuento).toFixed(2)}` : null,
    `--------------------------------`,
    `*TOTAL PAGADO: S/ ${Number(sale.total).toFixed(2)}*`,
    `*Método de Pago:* ${sale.metodoPago}`,
    ``,
    `Sede: Jr. Gamarra N° 778 Int. 12 (Galería San Antonio), Trujillo`,
    `Consulte el estado de su orden en: https://lensgrouptrujillo.com/seguimiento.html`,
    `¡Gracias por su preferencia!`
  ].filter(Boolean).join('\n');

  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

window.copyInvoiceText = function() {
  const sale = state.currentInvoice;
  if (!sale) return;
  const text = `Comprobante: ${sale.correlativo}\nCliente: ${sale.clienteNombre}\nDoc: ${sale.clienteDocNumero}\nTotal: S/ ${sale.total.toFixed(2)}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Datos del comprobante copiados al portapapeles');
  });
};

window.exportSalesToCsv = function() {
  const sales = state.sales || [];
  if (!sales.length) return showToast('No hay ventas para exportar');

  const headers = ['Comprobante', 'Tipo', 'Doc Tipo', 'Doc Numero', 'Cliente', 'Telefono', 'Montura', 'Lunas', 'Subtotal', 'IGV', 'Total', 'Metodo Pago', 'Estado', 'Fecha'];
  const rows = sales.map(s => [
    `"${s.correlativo}"`,
    `"${s.tipoDoc}"`,
    `"${s.clienteDocTipo}"`,
    `"${s.clienteDocNumero}"`,
    `"${s.clienteNombre}"`,
    `"${s.clienteTelefono || ''}"`,
    `"${s.monturaNombre}"`,
    `"${s.lunasNombre}"`,
    s.subtotal,
    s.igv,
    s.total,
    `"${s.metodoPago}"`,
    `"${s.estado}"`,
    `"${s.fechaCompleta || s.fechaHora}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ventas_LensGroup_Trujillo_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Historial de ventas exportado a CSV');
};


// ==========================================================================
// 4. AUTENTICACIÓN
// ==========================================================================
window.quickLogin = function(u, p) {
  const userInput = document.getElementById('adminUsername');
  const passInput = document.getElementById('adminPassword');
  if (userInput && passInput) {
    userInput.value = u;
    passInput.value = p;
    const form = document.getElementById('loginForm');
    if (form) {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        handleLogin({ preventDefault: () => {} });
      }
    }
  }
};

async function handleLogin(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const errorEl = document.getElementById('loginErrorMsg');
  if (errorEl) errorEl.style.display = 'none';

  const u = (document.getElementById('adminUsername')?.value || '').trim();
  const p = (document.getElementById('adminPassword')?.value || '').trim();

  if (!u || !p) {
    if (errorEl) {
      errorEl.textContent = 'Por favor ingresa usuario y contraseña.';
      errorEl.style.display = 'block';
    }
    return;
  }

  // 1. Acceso de Super Admin local (prioridad alta y sin bloqueos de red)
  const isSuperKeyli = u.toLowerCase() === 'keyli' && p === '2607';
  const isDefaultAdmin = (u.toLowerCase() === 'admin' && (p === 'admin' || p === '1234' || p === '2607')) ||
                         (u === '12345678' && (p === '1234' || p === 'admin'));

  if (isSuperKeyli || isDefaultAdmin) {
    state.session = {
      name: isSuperKeyli ? 'Super Admin' : 'Dr. Carlos Miranda',
      role: isSuperKeyli ? 'Acceso Total' : 'Gerente General',
      branch: 'Todas las Sedes',
      isSuperAdmin: true
    };
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state.session));
    } catch (e) {}
    showDashboardView();
    loadOrders();
    showToast(`¡Bienvenido ${state.session.name}!`);
    return;
  }

  // 2. Consulta en Supabase
  try {
    const res = await fetch(`${API_LOGIN_URL}?select=*&or=(dni.eq.${encodeURIComponent(u)},nombres.ilike.${encodeURIComponent(u)})&pin=eq.${encodeURIComponent(p)}&limit=1`, {
      method: 'GET',
      headers: { 
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json' 
      }
    });
    
    if (res.ok) {
      const users = await res.json();
      if (users && users.length > 0) {
        const user = users[0];
        const isSuper = user.rol === 'admin' || user.rol === 'Super Admin' || user.rol === 'Acceso Total' || user.rol === 'Gerente General';
        state.session = {
          name: `${user.nombres || ''} ${user.apellidos || ''}`.trim() || user.dni,
          role: user.rol || 'Staff',
          branch: 'Galería San Antonio, Jr. Gamarra 778',
          isSuperAdmin: isSuper
        };
        try {
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state.session));
        } catch (e) {}
        showDashboardView();
        loadOrders();
        showToast(`¡Bienvenido ${state.session.name}!`);
        return;
      }
    }
  } catch (err) {
    console.warn('[Auth] Consulta remota falló, verificando credenciales locales:', err);
  }

  // 3. Fallback en caso de que coincida con usuarios registrados en mock
  const localMatch = (state.users || []).find(usr => usr.username.toLowerCase() === u.toLowerCase());
  if (localMatch && (p === 'admin' || p === '1234' || p === '2607')) {
    state.session = {
      name: localMatch.name,
      role: localMatch.role,
      branch: localMatch.branch,
      isSuperAdmin: localMatch.role === 'Gerente General'
    };
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state.session));
    } catch (e) {}
    showDashboardView();
    loadOrders();
    showToast(`¡Bienvenido ${state.session.name}!`);
    return;
  }

  if (errorEl) {
    errorEl.textContent = 'Usuario o contraseña incorrecta. Usa: keyli / 2607 o admin / admin';
    errorEl.style.display = 'block';
  }
}

// ==========================================================================
// 5. CHATBOT ASSISTANT
// ==========================================================================
window.toggleChatbot = function() {
  const win = document.getElementById('chatbotWindow');
  win.style.display = win.style.display === 'none' ? 'flex' : 'none';
};

window.handleChatbotSubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('chatbotInput');
  const msg = input.value.trim();
  if (!msg) return;

  // Add user message
  const msgsDiv = document.getElementById('chatbotMessages');
  msgsDiv.innerHTML += `
    <div style="align-self: flex-end; background: var(--admin-primary); padding: 0.75rem; border-radius: 8px 8px 0 8px; color: #fff; max-width: 85%;">
      ${msg}
    </div>
  `;
  input.value = '';
  msgsDiv.scrollTop = msgsDiv.scrollHeight;

  // Indicador de "escribiendo..."
  const typingId = 'typing-' + Date.now();
  msgsDiv.innerHTML += `
    <div id="${typingId}" style="align-self: flex-start; background: var(--admin-bg-alt); padding: 0.6rem 0.9rem; border-radius: 8px 8px 8px 0; border: 1px solid var(--admin-card-border); color: var(--admin-text-muted, #888); font-style: italic; font-size: 0.85rem;">
      LensBot está escribiendo...
    </div>
  `;
  msgsDiv.scrollTop = msgsDiv.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    let reply;
    try {
      reply = generateBotReply(msg);
    } catch (err) {
      reply = 'Tuve un problema procesando los datos. Intenta de nuevo, por favor.';
    }

    msgsDiv.innerHTML += `
      <div style="align-self: flex-start; background: var(--admin-bg-alt); padding: 0.75rem; border-radius: 8px 8px 8px 0; border: 1px solid var(--admin-card-border); color: var(--admin-text-main); max-width: 85%; line-height: 1.45;">
        ${reply}
      </div>
    `;
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
  }, 600 + Math.random() * 500);
};

// --------------------------------------------------------------------------
// Motor de respuestas de LensBot (usa los datos reales del dashboard)
// --------------------------------------------------------------------------
const BOT_MONEY = n => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const BOT_HL = t => `<span style='color: var(--admin-accent); font-weight: bold;'>${t}</span>`;
const BOT_NORM = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function botHas(text, words) {
  return words.some(w => text.includes(w));
}

function botData() {
  const orders = Object.values(state.orders && Object.keys(state.orders).length ? state.orders : DEFAULT_ORDERS);
  const inventory = state.inventory || INVENTORY_DB;
  const kids = MOCK_CATALOG;
  const adults = MOCK_CATALOG_ADULT;
  const revenue = orders.reduce((s, o) => s + (Number(o.price) || 0), 0);
  const cost = orders.reduce((s, o) => s + (Number(o.cost) || 0), 0);
  return { orders, inventory, kids, adults, revenue, cost, profit: revenue - cost };
}

function botTopBrands(orders) {
  const map = {};
  orders.forEach(o => {
    const b = o.brand || 'Otros';
    map[b] = map[b] || { brand: b, count: 0, total: 0 };
    map[b].count++;
    map[b].total += Number(o.price) || 0;
  });
  return Object.values(map).sort((a, b) => b.count - a.count || b.total - a.total);
}

function generateBotReply(rawMsg) {
  const t = BOT_NORM(rawMsg);
  const d = botData();
  const statusLabel = { cola: 'En cola', proceso: 'En proceso', listo: 'Listo para entrega' };

  // 1. Saludos / cortesía
  if (/^(hola|buenas|buenos|hey|hi|que tal|saludos)/.test(t)) {
    const h = new Date().getHours();
    const saludo = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
    return `${saludo} Soy <strong>LensBot</strong>. Puedo responderte sobre ventas, ganancias, lentes más vendidos, stock, órdenes, clientes, catálogo y más. ¿Qué necesitas?`;
  }
  if (botHas(t, ['gracias', 'thank'])) return '¡Con gusto! Si necesitas algo más, aquí estoy.';
  if (botHas(t, ['adios', 'chau', 'hasta luego', 'bye'])) return '¡Hasta luego! Que tengas excelentes ventas';
  if (botHas(t, ['quien eres', 'que eres', 'como te llamas', 'tu nombre'])) {
    return 'Soy <strong>LensBot</strong>, el asistente inteligente de Lens Group Trujillo. Analizo en tiempo real las órdenes, el inventario y los catálogos del sistema.';
  }
  if (botHas(t, ['ayuda', 'que puedes', 'que sabes', 'opciones', 'comandos', 'help'])) {
    return `Puedo ayudarte con:<br>
      • <em>"ventas totales"</em>, <em>"ganancias"</em><br>
      • <em>"lentes más vendidos"</em>, <em>"mejor marca"</em><br>
      • <em>"stock crítico"</em>, <em>"inventario"</em><br>
      • <em>"órdenes pendientes"</em>, <em>"urgentes"</em>, <em>"listos"</em><br>
      • <em>"clientes"</em> o busca por nombre/DNI/código<br>
      • <em>"catálogo niños"</em>, <em>"catálogo adultos"</em><br>
      • <em>"recomendaciones"</em>, <em>"hora"</em>, <em>"fecha"</em>`;
  }

  // 2. Hora / fecha
  if (/\b(que hora|hora es|la hora)\b/.test(t)) return `Son las ${BOT_HL(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }))}.`;
  if (botHas(t, ['fecha', 'que dia es', 'dia es hoy'])) return `Hoy es ${BOT_HL(new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}.`;

  // 3. Búsqueda por código de orden o DNI
  const codeMatch = t.match(/lgt-\d{4}-\d{3,4}/);
  const dniMatch = t.match(/\b\d{8}\b/);
  if (codeMatch || dniMatch) {
    const o = d.orders.find(x => (codeMatch && BOT_NORM(x.code) === codeMatch[0]) || (dniMatch && x.dni === dniMatch[0]));
    if (o) {
      return `<strong>Orden ${o.code}</strong><br>Cliente: ${o.customer} (DNI ${o.dni})<br>Servicio: ${o.service}<br>Entrega: ${o.estimatedDate}<br>Estado: ${BOT_HL(statusLabel[o.estado] || o.estado)}${o.urgente ? ' [Urgente]' : ''}<br>Total: ${BOT_MONEY(o.price)}`;
    }
    return 'No encontré ninguna orden con ese código o DNI. Verifica el dato e inténtalo de nuevo.';
  }

  // 4. Búsqueda por nombre de cliente
  const byName = d.orders.find(o => BOT_NORM(o.customer).split(' ').some(p => p.length > 3 && t.split(/\s+/).includes(p)));
  if (byName && !botHas(t, ['marca'])) {
    return `Encontré a <strong>${byName.customer}</strong>:<br>Orden: ${byName.code}<br>Servicio: ${byName.service}<br>Estado: ${BOT_HL(statusLabel[byName.estado] || byName.estado)}<br>Teléfono: ${byName.phone}`;
  }

  // 5. Más vendidos / ranking
  if (botHas(t, ['mas vendid', 'mas se vende', 'top', 'ranking', 'popular', 'mejor marca', 'mejores', 'favorit'])) {
    const top = botTopBrands(d.orders).slice(0, 5);
    const medals = ['1.', '2.', '3.', '4.', '5.'];
    return `<strong>Lentes / marcas más vendidos:</strong><br>` +
      top.map((b, i) => `${medals[i]} ${b.brand} — ${b.count} venta(s) · ${BOT_MONEY(b.total)}`).join('<br>') +
      `<br><br>Líder: ${BOT_HL(top[0].brand)}. Puedes ver el gráfico de barras en <em>Analítica & Gráficos BI</em>.`;
  }

  // 6. Menos vendidos
  if (botHas(t, ['menos vendid', 'no se vende', 'peor'])) {
    const all = botTopBrands(d.orders);
    const low = all.slice(-3).reverse();
    return `<strong>Menor rotación:</strong><br>` + low.map(b => `• ${b.brand} — ${b.count} venta(s)`).join('<br>') +
      `<br>Considera promociones o combos para estas marcas.`;
  }

  // 7. Ganancias / utilidad / margen
  if (botHas(t, ['ganancia', 'utilidad', 'margen', 'rentab', 'beneficio', 'profit'])) {
    const margin = d.revenue ? (d.profit / d.revenue * 100).toFixed(1) : 0;
    return `<strong>Rentabilidad:</strong><br>Ingresos: ${BOT_MONEY(d.revenue)}<br>Costos: ${BOT_MONEY(d.cost)}<br>Utilidad neta: ${BOT_HL(BOT_MONEY(d.profit))}<br>Margen: <strong>${margin}%</strong>`;
  }

  // 8. Ventas / ingresos
  if (botHas(t, ['venta', 'vendi', 'ingreso', 'factur', 'dinero', 'plata', 'cuanto', 'total', 'caja', 'hoy', 'semana', 'resumen', 'mes'])) {
    const avg = d.orders.length ? d.revenue / d.orders.length : 0;
    const best = [...d.orders].sort((a, b) => b.price - a.price)[0];
    return `<strong>Resumen de ventas:</strong><br>Órdenes registradas: <strong>${d.orders.length}</strong><br>Ingresos totales: ${BOT_HL(BOT_MONEY(d.revenue))}<br>Ticket promedio: ${BOT_MONEY(avg)}<br>Venta más alta: ${best ? `${best.customer} (${BOT_MONEY(best.price)})` : '-'}`;
  }

  // 9. Órdenes por estado
  if (botHas(t, ['urgente'])) {
    const u = d.orders.filter(o => o.urgente);
    return u.length ? `<strong>Órdenes urgentes (${u.length}):</strong><br>` + u.map(o => `• ${o.code} — ${o.customer} (${statusLabel[o.estado]})`).join('<br>') : 'No hay órdenes urgentes en este momento.';
  }
  if (botHas(t, ['listo', 'entrega', 'recoger', 'terminad'])) {
    const l = d.orders.filter(o => o.estado === 'listo');
    return `<strong>Listos para entrega (${l.length}):</strong><br>` + (l.map(o => `• ${o.code} — ${o.customer} · Tel: ${o.phone}`).join('<br>') || 'Ninguno por ahora.');
  }
  if (botHas(t, ['orden', 'pedido', 'pendiente', 'proceso', 'taller', 'laboratorio', 'cola', 'trabajo'])) {
    const c = s => d.orders.filter(o => o.estado === s).length;
    return `<strong>Estado del laboratorio:</strong><br>En cola: <strong>${c('cola')}</strong><br>En proceso: <strong>${c('proceso')}</strong><br>Listos: <strong>${c('listo')}</strong><br>Urgentes: <strong>${d.orders.filter(o => o.urgente).length}</strong>`;
  }

  // 10. Clientes / pacientes
  if (botHas(t, ['cliente', 'paciente', 'persona', 'comprador'])) {
    const names = d.orders.slice(0, 6).map(o => `• ${o.customer}`).join('<br>');
    return `Tenemos <strong>${d.orders.length}</strong> clientes con órdenes registradas:<br>${names}<br>Escríbeme un nombre, DNI o código (ej. LGT-2025-0342) para ver el detalle.`;
  }

  // 11. Catálogos
  if (botHas(t, ['nino', 'nina', 'infantil', 'kids', 'junior'])) {
    const stock = d.kids.reduce((s, f) => s + f.stock, 0);
    const out = d.kids.filter(f => f.stock === 0);
    return `<strong>Catálogo de Niños:</strong><br>${d.kids.length} modelos · ${BOT_HL(stock + ' unidades')} en stock<br>` +
      d.kids.map(f => `• ${f.brand} ${f.model} — ${f.stock} u. · ${BOT_MONEY(f.price)}`).join('<br>') +
      (out.length ? `<br>Agotados: ${out.map(f => f.model).join(', ')}` : '');
  }
  if (botHas(t, ['adulto', 'dama', 'caballero', 'hombre', 'mujer'])) {
    const stock = d.adults.reduce((s, f) => s + f.stock, 0);
    const out = d.adults.filter(f => f.stock === 0);
    return `<strong>Catálogo de Adultos:</strong><br>${d.adults.length} modelos · ${BOT_HL(stock + ' unidades')} en stock<br>` +
      d.adults.map(f => `• ${f.brand} ${f.model} — ${f.stock} u. · ${BOT_MONEY(f.price)}`).join('<br>') +
      (out.length ? `<br>Agotados: ${out.map(f => f.model).join(', ')}` : '');
  }

  // 12. Stock / inventario
  if (botHas(t, ['agotad', 'critico', 'falta', 'reponer', 'comprar', 'bajo'])) {
    const crit = d.inventory.filter(i => i.stock <= i.threshold);
    return `<strong>Productos a reponer (${crit.length}):</strong><br>` +
      crit.map(i => `• ${i.brand} ${i.model} — ${i.stock}/${i.threshold} u.`).join('<br>');
  }
  if (botHas(t, ['stock', 'inventario', 'montura', 'catalogo', 'producto', 'unidades', 'existencia', 'lente', 'luna', 'cristal', 'gafa'])) {
    const total = d.inventory.reduce((s, i) => s + i.stock, 0);
    const value = d.inventory.reduce((s, i) => s + i.stock * i.cost, 0);
    const crit = d.inventory.filter(i => i.stock <= i.threshold).length;
    const kidsStock = d.kids.reduce((s, f) => s + f.stock, 0);
    const adultStock = d.adults.reduce((s, f) => s + f.stock, 0);
    return `<strong>Inventario general:</strong><br>Productos: ${d.inventory.length} · Unidades: <strong>${total}</strong><br>Valor en stock: ${BOT_HL(BOT_MONEY(value))}<br>En nivel crítico: <strong>${crit}</strong><br>Monturas niños: ${kidsStock} u. · Adultos: ${adultStock} u.`;
  }

  // 13. Precios
  if (botHas(t, ['precio', 'caro', 'barato', 'cuesta', 'vale'])) {
    const all = [...d.inventory, ...d.kids, ...d.adults];
    const sorted = [...all].sort((a, b) => b.price - a.price);
    return `Mayor precio: <strong>${sorted[0].brand} ${sorted[0].model}</strong> (${BOT_MONEY(sorted[0].price)})<br>Menor precio: <strong>${sorted.at(-1).brand} ${sorted.at(-1).model}</strong> (${BOT_MONEY(sorted.at(-1).price)})`;
  }

  // 14. Búsqueda por marca o modelo
  const allProducts = [...d.inventory, ...d.kids, ...d.adults];
  const prodHits = allProducts.filter(p => {
    const name = BOT_NORM(`${p.brand} ${p.model}`);
    return t.split(/\s+/).some(w => w.length > 3 && name.includes(w));
  });
  if (prodHits.length) {
    return `<strong>Encontré ${prodHits.length} producto(s):</strong><br>` +
      prodHits.slice(0, 6).map(p => `• ${p.brand} ${p.model} — ${p.stock} u. · ${BOT_MONEY(p.price)}`).join('<br>');
  }

  // 15. Recomendaciones / decisiones
  if (botHas(t, ['recomienda', 'consejo', 'sugerencia', 'que hago', 'decision', 'mejorar', 'estrategia', 'idea'])) {
    const crit = d.inventory.filter(i => i.stock <= i.threshold);
    const top = botTopBrands(d.orders)[0];
    return `<strong>Recomendaciones:</strong><br>1. Reponer ${crit.length} producto(s) críticos (ej. ${crit[0] ? crit[0].brand + ' ' + crit[0].model : '-'}).<br>2. Potenciar ${top.brand}, tu marca líder, con exhibición destacada.<br>3. Ofrecer combos montura + tratamiento Blue Protect para subir el ticket.<br>4. Contactar a los clientes con órdenes listas para acelerar la entrega.`;
  }

  // 16. Usuarios / personal
  if (botHas(t, ['usuario', 'personal', 'empleado', 'trabajador', 'equipo'])) {
    return `<strong>Personal:</strong><br>` + state.users.map(u => `• ${u.name} — ${u.role} (${u.status})`).join('<br>');
  }

  // 17. Preguntas generales sobre ópticas
  if (botHas(t, ['miopia', 'astigmat', 'hipermetrop', 'presbicia', 'vista', 'ojo', 'vision'])) {
    return 'Para problemas visuales recomendamos un examen optométrico completo. Ofrecemos lunas monofocales, bifocales, progresivas FreeForm, fotocromáticas y con filtro Blue Protect para pantallas.';
  }
  if (botHas(t, ['horario', 'abren', 'cierran', 'direccion', 'ubicacion', 'donde'])) {
    return 'Galería San Antonio, Jr. Gamarra N° 778 – Trujillo.<br>Lunes a sábado de 9:00 a.m. a 8:00 p.m.';
  }

  // 18. Respuesta general (siempre útil, nunca "no entendí")
  const d2 = d.orders.filter(o => o.estado !== 'listo').length;
  return `Buena pregunta Te comparto un panorama rápido del negocio:<br>Ingresos: ${BOT_HL(BOT_MONEY(d.revenue))} · Utilidad: ${BOT_MONEY(d.profit)}<br>Órdenes activas: <strong>${d2}</strong><br>Marca líder: <strong>${botTopBrands(d.orders)[0].brand}</strong><br><br>Puedes preguntarme por ventas, ganancias, stock, clientes, órdenes, catálogo o pedirme recomendaciones.`;
}


function handleLogout() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  state.session = null;
  showLoginView();
  showToast('Sesión cerrada con éxito');
}

// ==========================================================================
// 5. CARGA Y SINCRONIZACIÓN DE ÓRDENES Y MÓDULOS DE SUPABASE
// ==========================================================================
async function loadOrders() {
  // 1. Cargar Órdenes de Laboratorio
  try {
    if (window.LG?.supabase?.getOrders) {
      const supaOrders = await window.LG.supabase.getOrders();
      if (supaOrders && Object.keys(supaOrders).length > 0) {
        state.orders = supaOrders;
      } else {
        state.orders = DEFAULT_ORDERS;
      }
    } else {
      const res = await fetch(API_ORDERS_URL, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const ordenes = await res.json();
        const mapOrders = {};
        (ordenes || []).forEach(o => {
          mapOrders[o.numero_ticket] = {
            code: o.numero_ticket,
            estado: o.estado,
            urgente: o.urgente,
            service: o.ventas?.montura_descripcion || 'Montura',
            treatment: o.ventas?.luna_descripcion || 'Cristales',
            price: Number(o.ventas?.precio_total) || 0,
            cost: Number(o.ventas?.costo_total) || 0,
            currentStep: o.estado === 'Entregado' ? 5 : o.estado === 'Listo para Recojo' ? 4 : o.estado === 'En Proceso' ? 2 : 1
          };
        });
        state.orders = Object.keys(mapOrders).length > 0 ? mapOrders : DEFAULT_ORDERS;
      } else {
        state.orders = DEFAULT_ORDERS;
      }
    }
  } catch (err) {
    state.orders = DEFAULT_ORDERS;
  }

  // 2. Cargar Ventas de Supabase
  try {
    if (window.LG?.supabase?.getSales) {
      const supaSales = await window.LG.supabase.getSales();
      if (supaSales && supaSales.length > 0) {
        state.sales = supaSales;
      }
    }
  } catch (err) {
    console.warn('[Admin] Fallback a ventas locales:', err);
  }

  // 3. Cargar Inventario de Supabase
  try {
    if (window.LG?.supabase?.getInventory) {
      const supaInv = await window.LG.supabase.getInventory();
      if (supaInv && supaInv.length > 0) {
        state.inventory = supaInv;
      }
    }
  } catch (err) {
    console.warn('[Admin] Fallback a inventario local:', err);
  }

  updateMetricsAndDecisions();
  renderOrdersTable();
  renderInventory();
  renderCharts();
  updateSimulator();
  renderSales();
  renderCRM();
}

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  const ordersList = Object.values(state.orders);

  const filtered = ordersList.filter(order => {
    if (state.currentFilter === 'cola' && order.estado !== 'cola') return false;
    if (state.currentFilter === 'proceso' && order.estado !== 'proceso') return false;
    if (state.currentFilter === 'listo' && order.estado !== 'listo') return false;
    if (state.currentFilter === 'urgente' && !order.urgente) return false;

    if (state.searchQuery) {
      const q = state.searchQuery;
      const match = (order.code && order.code.toLowerCase().includes(q)) ||
                    (order.customer && order.customer.toLowerCase().includes(q)) ||
                    (order.service && order.service.toLowerCase().includes(q)) ||
                    (order.dni && order.dni.includes(q)) ||
                    (order.brand && order.brand.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Contadores para pestañas
  const countAll = ordersList.length;
  const countCola = ordersList.filter(o => o.estado === 'cola').length;
  const countProceso = ordersList.filter(o => o.estado === 'proceso').length;
  const countListo = ordersList.filter(o => o.estado === 'listo').length;
  const countUrgente = ordersList.filter(o => o.urgente).length;

  document.getElementById('tabCountAll').textContent = countAll;
  document.getElementById('tabCountCola').textContent = countCola;
  document.getElementById('tabCountProceso').textContent = countProceso;
  document.getElementById('tabCountListo').textContent = countListo;
  document.getElementById('tabCountUrgente').textContent = countUrgente;

  // Actualizar badge en el sidebar
  const sidebarOrderBadge = document.getElementById('sidebarOrdersBadge');
  if (sidebarOrderBadge) {
    sidebarOrderBadge.textContent = countAll;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
          No se encontraron órdenes con los filtros actuales.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(order => {
    const isUrgent = order.urgente;
    let badgeClass = 'badge-cola';
    let badgeText = 'En Cola';
    if (order.estado === 'proceso') {
      badgeClass = 'badge-proceso';
      badgeText = 'En Proceso';
    } else if (order.estado === 'listo') {
      badgeClass = 'badge-listo';
      badgeText = 'Listo para Recojo';
    }

    return `
      <tr>
        <td>
          <strong style="color: var(--admin-text-main); font-family: 'Outfit', sans-serif;">${order.code}</strong>
          ${isUrgent ? `<span class="badge-urgente" style="margin-left: 0.35rem;">URGENTE</span>` : ''}
        </td>
        <td>
          <div style="font-weight: 600; color: var(--admin-text-main);">${order.customer}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-dim);">DNI: ${order.dni || 'Sin DNI'} · Cel: ${order.phone || '958...'}</div>
        </td>
        <td style="max-width: 260px;">
          <div style="font-weight: 500; font-size: 0.8rem; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${order.service}
          </div>
          <div style="font-size: 0.72rem; color: var(--admin-primary);">${order.treatment || 'Óptica digital'}</div>
        </td>
        <td>
          <span style="font-size: 0.8rem; color: var(--admin-text-muted);">${order.estimatedDate || 'En fecha'}</span>
        </td>
        <td>
          <strong style="color: #34d399;">S/ ${order.price || 450}</strong>
        </td>
        <td>
          <span class="badge-status ${badgeClass}">${badgeText}</span>
        </td>
        <td>
          <select class="select-state" onchange="updateOrderStatus('${order.code}', this.value)">
            <option value="cola" ${order.estado === 'cola' ? 'selected' : ''}>Cola</option>
            <option value="proceso" ${order.estado === 'proceso' ? 'selected' : ''}>Proceso</option>
            <option value="listo" ${order.estado === 'listo' ? 'selected' : ''}>Listo</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateOrderStatus = async function(code, newEstado) {
  if (!state.orders[code]) return;

  const currentStep = newEstado === 'cola' ? 1 : (newEstado === 'proceso' ? 2 : 3);
  let statusTitle = 'En Cola de Espera';
  let statusBadgeText = 'Cola';
  let statusDesc = 'Receta registrada y montura asignada. En espera de laboratorio.';
  let showPickupBanner = false;

  if (newEstado === 'proceso') {
    statusTitle = 'En Proceso de Laboratorio';
    statusBadgeText = 'Proceso';
    statusDesc = 'Tallado digital, biselado y control de calidad en laboratorio.';
  } else if (newEstado === 'listo') {
    statusTitle = '¡Listo para Recoger en Tienda!';
    statusBadgeText = 'Listo';
    statusDesc = 'Tu pedido ya está en tienda listo para ser entregado.';
    showPickupBanner = true;
  }

  const updatedFields = {
    estado: newEstado,
    currentStep,
    statusTitle,
    statusBadgeText,
    statusDesc,
    showPickupBanner
  };

  state.orders[code] = { ...state.orders[code], ...updatedFields };

  try {
    if (window.LG?.supabase?.updateOrderStatus) {
      await window.LG.supabase.updateOrderStatus(code, newEstado, state.orders[code]?.urgente);
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/ordenes_laboratorio?numero_ticket=eq.${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: newEstado })
      });
    }
  } catch (err) {
    console.warn('Error actualizando orden en Supabase:', err);
  }

  updateMetricsAndDecisions();
  renderOrdersTable();
  renderCharts();
  showToast(`Orden ${code} actualizada a: ${newEstado.toUpperCase()}`);
};

async function handleCreateOrder(e) {
  e.preventDefault();
  const code = document.getElementById('newOrderCode').value.trim();
  const customer = document.getElementById('newOrderCustomer').value.trim();
  const dni = document.getElementById('newOrderDni').value.trim();
  const phone = document.getElementById('newOrderPhone').value.trim();
  const brand = document.getElementById('newOrderBrand').value;
  const treatment = document.getElementById('newOrderTreatment').value;
  const price = parseFloat(document.getElementById('newOrderPrice').value) || 450;
  const urgente = document.getElementById('newOrderUrgent').checked;

  const today = new Date();
  const optDays = urgente ? 1 : 2;
  const estDate = new Date(today);
  estDate.setDate(estDate.getDate() + optDays);
  
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  const dateStr = `${today.getDate()} de ${meses[today.getMonth()]}, 2026`;
  const estDateStr = `${estDate.getDate()} de ${meses[estDate.getMonth()]}, 2026`;

  const newOrder = {
    code,
    customer,
    dni,
    phone,
    receivedDate: dateStr,
    estimatedDate: estDateStr,
    brand,
    service: `Montura ${brand} + Cristales ${treatment}`,
    treatment,
    price,
    cost: Math.round(price * 0.42),
    branch: 'Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
    estado: 'cola',
    urgente,
    currentStep: 1,
    statusTitle: 'En Cola de Espera',
    statusBadgeText: 'Cola',
    statusBadgeClass: 'state-badge-progress',
    statusBoxClass: 'status-box-progress',
    statusDesc: 'Receta registrada y montura asignada. En espera de laboratorio.',
    showPickupBanner: false,
    history: [
      { step: 1, name: 'Cola', date: `${dateStr} - Registro inicial`, desc: 'Ingreso al sistema Lens Group Trujillo.' }
    ]
  };

  state.orders[code] = newOrder;

  try {
    if (window.LG?.supabase?.createOrder) {
      await window.LG.supabase.createOrder(newOrder);
    } else {
      await fetch(API_ORDERS_URL, {
        method: 'POST',
        headers: { 
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newOrder)
      });
    }
  } catch (err) {
    console.warn('Error guardando en Supabase:', err);
  }

  document.getElementById('modalNewOrder').classList.remove('active');
  document.getElementById('formNewOrder').reset();

  updateMetricsAndDecisions();
  renderOrdersTable();
  renderCharts();
  showToast(`Nueva orden ${code} registrada con éxito`);
}

// ==========================================================================
// 6. GESTIÓN DE INVENTARIO & STOCK
// ==========================================================================
function renderInventory() {
  const container = document.getElementById('inventoryGrid');
  if (!container) return;

  container.innerHTML = state.inventory.map(item => {
    let pillClass = 'stock-good';
    let pillText = 'En Stock';
    if (item.status === 'critical') {
      pillClass = 'stock-critical';
      pillText = 'Crítico';
    } else if (item.status === 'medium') {
      pillClass = 'stock-medium';
      pillText = 'Reposición';
    }

    return `
      <div class="inventory-card">
        <div class="inventory-card-header">
          <span style="font-size: 0.75rem; color: var(--admin-primary); font-weight: 700; text-transform: uppercase;">
            ${item.category}
          </span>
          <span class="stock-pill ${pillClass}">${pillText}</span>
        </div>
        <div style="font-size: 1rem; font-weight: 700; color: var(--admin-text-main);">${item.brand}</div>
        <div style="font-size: 0.82rem; color: var(--admin-text-muted);">${item.model}</div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
          <div>
            <div style="font-size: 0.7rem; color: var(--admin-text-dim);">DISPONIBLE</div>
            <div class="stock-count-number">${item.stock} <span style="font-size: 0.85rem; font-weight: 500; color: var(--admin-text-dim);">uds</span></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.7rem; color: var(--admin-text-dim);">PRECIO VENTA</div>
            <div style="font-size: 1rem; font-weight: 700; color: #34d399;">S/ ${item.price}</div>
          </div>
        </div>
        ${isUserSeller() ? `
          <div style="margin-top: 0.5rem;">
            <button type="button" class="btn-primary-action" style="width: 100%; padding: 0.5rem; font-size: 0.85rem;" onclick="startSale('${item.id}')">
              Vender este Producto
            </button>
          </div>
        ` : `
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button type="button" class="btn-decision-action" style="flex: 1;" onclick="replenishStock('${item.id}')">
              +5 uds
            </button>
            <button type="button" class="btn-header-action" style="flex: 1;" onclick="openInventoryModal('${item.id}')">
              Editar
            </button>
          </div>
        `}
      </div>
    `;
  }).join('');
}

window.openInventoryModal = function(itemId = null) {
  if (isUserSeller()) {
    showToast('Solo los administradores pueden registrar o editar productos de inventario.');
    return;
  }
  const modal = document.getElementById('modalInventory');
  const form = document.getElementById('formInventory');
  if (!modal || !form) return;
  
  form.reset();
  
  if (itemId) {
    const item = state.inventory.find(i => i.id === itemId);
    if (item) {
      document.getElementById('modalInventoryTitle').textContent = 'Editar Producto';
      document.getElementById('btnSaveInventoryText').textContent = 'Guardar Cambios';
      document.getElementById('invItemId').value = item.id;
      document.getElementById('invCategory').value = item.category;
      document.getElementById('invBrand').value = item.brand;
      document.getElementById('invModel').value = item.model;
      document.getElementById('invStock').value = item.stock;
      document.getElementById('invCost').value = item.cost;
      document.getElementById('invPrice').value = item.price;
    }
  } else {
    document.getElementById('modalInventoryTitle').textContent = 'Nuevo Producto';
    document.getElementById('btnSaveInventoryText').textContent = 'Crear Producto';
    document.getElementById('invItemId').value = '';
  }
  
  modal.classList.add('active');
};

function handleSaveInventory(e) {
  e.preventDefault();
  
  const id = document.getElementById('invItemId').value;
  const category = document.getElementById('invCategory').value;
  const brand = document.getElementById('invBrand').value;
  const model = document.getElementById('invModel').value;
  const stock = parseInt(document.getElementById('invStock').value, 10);
  const cost = parseFloat(document.getElementById('invCost').value);
  const price = parseFloat(document.getElementById('invPrice').value);
  
  let status = 'good';
  if (stock <= 3) status = 'critical';
  else if (stock <= 6) status = 'medium';

  if (id) {
    const idx = state.inventory.findIndex(i => i.id === id);
    if (idx !== -1) {
      state.inventory[idx] = { ...state.inventory[idx], category, brand, model, stock, cost, price, status };
      showToast('Producto actualizado correctamente');
    }
  } else {
    const newId = 'inv-' + Date.now();
    state.inventory.unshift({ id: newId, category, brand, model, stock, cost, price, status, threshold: 5 });
    showToast('Nuevo producto agregado');
  }
  
  document.getElementById('modalInventory').classList.remove('active');
  renderInventory();
}
window.replenishStock = function(itemId) {
  const item = state.inventory.find(i => i.id === itemId);
  if (item) {
    item.stock += 5;
    item.status = item.stock > item.threshold ? 'good' : 'medium';
    renderInventory();
    showToast(`Reabastecido: +5 unidades de ${item.brand} ${item.model}`);
  }
};

// ==========================================================================
// 7. KPIS Y DECISIONES
// ==========================================================================
function updateMetricsAndDecisions() {
  const ordersList = Object.values(state.orders);
  
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

// ==========================================================================
// 8. GRÁFICOS (CHART.JS)
// ==========================================================================
function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const ordersList = Object.values(state.orders);

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

  // --- NUEVO: Gráfico de Ventas de Productos ---
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

  // --- NUEVO: Gráfico del Mes Actual (Ingresos Semanales vs Meta) ---
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

  // --- NUEVO: Gráfico de los Últimos 3 Meses (Trimestre I 2026: Ene, Feb, Mar) ---
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

// Filtro interactivo de paneles en la vista de Analítica
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

  // Redimensionar gráficos con suavidad tras alternar paneles
  setTimeout(() => {
    if (typeof renderCharts === 'function') {
      renderCharts();
    }
  }, 50);
}
window.filterAnalyticsPanel = filterAnalyticsPanel;

// ==========================================================================
// 9. SIMULADOR DE ESCENARIOS (WHAT-IF)
// ==========================================================================
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

  document.getElementById('lblSimDiscount').textContent = `${discount}%`;
  document.getElementById('lblSimPatients').textContent = `+${patientsInc}%`;
  document.getElementById('lblSimPremium').textContent = `${premiumRate}%`;

  // Relleno visual de los sliders
  [discountEl, patientsEl, premiumEl].forEach(s => {
    const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
    s.style.setProperty('--fill', `${pct}%`);
  });

  const base = simCompute(0, 0, 40);
  const sim = simCompute(discount, patientsInc, premiumRate);

  document.getElementById('simResultRevenue').textContent = `S/ ${sim.revenue.toLocaleString('es-PE')}`;
  document.getElementById('simResultProfit').textContent = `S/ ${sim.profit.toLocaleString('es-PE')}`;
  document.getElementById('simResultMargin').textContent = `${sim.margin.toFixed(1)}%`;

  const bar = document.getElementById('simMarginBar');
  if (bar) bar.style.width = `${Math.min(100, sim.margin)}%`;

  simSetDelta(document.getElementById('simDeltaRevenue'), sim.revenue, base.revenue);
  simSetDelta(document.getElementById('simDeltaProfit'), sim.profit, base.profit);

  // Determinar estado de decisión (antes estaba fijo en "Óptimo")
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
    document.getElementById('simResultStatus').textContent = status.label;
    document.getElementById('simStatusHint').textContent = status.hint;
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

window.resetSimulator = function () {
  const d = document.getElementById('simDiscount');
  const p = document.getElementById('simPatients');
  const r = document.getElementById('simPremium');
  if (d) d.value = 0;
  if (p) p.value = 0;
  if (r) r.value = 40;
  updateSimulator();
};

document.addEventListener('click', e => {
  if (e.target.closest && e.target.closest('#btnSimReset')) window.resetSimulator();
});

// ==========================================================================
// 10. EXPORTAR REPORTE CSV
// ==========================================================================
function exportOrdersToCsv() {
  const orders = Object.values(state.orders);
  if (!orders.length) return showToast('No hay órdenes para exportar');

  const headers = ['Código', 'Paciente', 'DNI', 'Teléfono', 'Servicio', 'Marca', 'Tratamiento', 'Precio (S/)', 'Estado', 'Fecha Recibido', 'Fecha Estimada'];
  const rows = orders.map(o => [
    `"${o.code}"`,
    `"${o.customer}"`,
    `"${o.dni || ''}"`,
    `"${o.phone || ''}"`,
    `"${o.service}"`,
    `"${o.brand || ''}"`,
    `"${o.treatment || ''}"`,
    o.price || 0,
    `"${o.estado}"`,
    `"${o.receivedDate}"`,
    `"${o.estimatedDate}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_LensGroup_Trujillo_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Reporte ejecutivo CSV descargado con éxito');
}

// ==========================================================================
// 11. GESTIÓN DE USUARIOS Y SUCURSALES (SUPER ADMIN CON SUPABASE)
// ==========================================================================
window.openUserModal = function() {
  document.getElementById('modalNewUser')?.classList.add('active');
};

window.closeUserModal = function() {
  document.getElementById('modalNewUser')?.classList.remove('active');
};

async function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">Cargando usuarios desde Supabase...</td></tr>`;

  try {
    let users = null;
    if (window.LG?.supabase?.getUsers) {
      users = await window.LG.supabase.getUsers();
    } else {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) users = await res.json();
    }

    if (!users || users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">No se encontraron usuarios en Supabase.</td></tr>`;
      return;
    }

    const estadoConfig = {
      activo:     { label: 'ACTIVO',     cls: 'user-estado-activo' },
      inactivo:   { label: 'INACTIVO',   cls: 'user-estado-inactivo' },
      suspendido: { label: 'SUSPENDIDO', cls: 'user-estado-suspendido' }
    };

    tbody.innerHTML = users.map(u => {
      const estadoVal = u.estado || (u.activo !== false ? 'activo' : 'inactivo');
      const cfg = estadoConfig[estadoVal] || estadoConfig.activo;
      return `
      <tr>
        <td><strong>${u.nombres || ''} ${u.apellidos || ''}</strong></td>
        <td><code>${u.dni}</code></td>
        <td><span class="stock-pill stock-good">${u.rol || 'Staff'}</span></td>
        <td>Galería San Antonio, Jr. Gamarra N° 778</td>
        <td>
          <select class="user-estado-select ${cfg.cls}" onchange="updateUserEstado('${u.id}', this)">
            <option value="activo"     ${estadoVal === 'activo'     ? 'selected' : ''}>ACTIVO</option>
            <option value="inactivo"   ${estadoVal === 'inactivo'   ? 'selected' : ''}>INACTIVO</option>
            <option value="suspendido" ${estadoVal === 'suspendido' ? 'selected' : ''}>SUSPENDIDO</option>
          </select>
        </td>
        <td style="text-align: right;">
          <span style="font-size: 0.8rem; color: var(--admin-text-dim);">Registrado</span>
        </td>
      </tr>`;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #ef4444;">Error consultando usuarios en Supabase.</td></tr>`;
  }
}

window.updateUserEstado = async function(userId, selectEl) {
  const nuevoEstado = selectEl.value;
  const clsMap = { activo: 'user-estado-activo', inactivo: 'user-estado-inactivo', suspendido: 'user-estado-suspendido' };

  // Actualizar clase visual inmediatamente
  selectEl.className = `user-estado-select ${clsMap[nuevoEstado] || ''}`;

  try {
    const body = {
      estado: nuevoEstado,
      activo: nuevoEstado === 'activo'
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error al actualizar');
    showToast(`Estado actualizado a ${nuevoEstado.toUpperCase()}`);
  } catch (err) {
    showToast('Error al guardar el estado: ' + err.message);
  }
};

document.getElementById('formNewUser')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const fullName = document.getElementById('newUserName').value.trim();
  const [nombres, ...rest] = fullName.split(' ');
  const apellidos = rest.join(' ') || ' ';
  const dni = document.getElementById('newUserUsername').value.trim();
  const pin = document.getElementById('newUserPassword').value.trim();
  const rol = document.getElementById('newUserRole').value;

  try {
    if (window.LG?.supabase?.createUser) {
      await window.LG.supabase.createUser({ nombres, apellidos, dni, pin, rol });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombres, apellidos, dni, pin, rol })
      });
    }

    showToast(`Usuario ${dni} creado con éxito en Supabase`);
    closeUserModal();
    document.getElementById('formNewUser').reset();
    renderUsers();
  } catch (err) {
    showToast(`Error al guardar en Supabase: ${err.message}`);
  }
});

// Toast
function showToast(msg) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eead4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ==========================================================================
// CARDEX DE MOVIMIENTOS
// ==========================================================================

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

state.cardex = [...CARDEX_DB];

function renderCardex() {
  const tbody = document.getElementById('cardexTableBody');
  if (!tbody) return;

  // Populate product filter
  const productSelect = document.getElementById('cardexFilterProduct');
  if (productSelect && productSelect.options.length <= 1) {
    const products = [...new Set(state.cardex.map(m => m.product))].sort();
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p.length > 36 ? p.substring(0, 34) + '…' : p;
      productSelect.appendChild(opt);
    });
  }

  _renderCardexTable(state.cardex);
  _updateCardexKpis(state.cardex);
}

function _renderCardexTable(movements) {
  const tbody = document.getElementById('cardexTableBody');
  if (!tbody) return;

  if (!movements.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2.5rem;color:var(--admin-text-muted);">No se encontraron movimientos con los filtros aplicados.</td></tr>`;
    return;
  }

  const TYPE_META = {
    entrada: { label: 'Entrada', cls: 'cardex-badge-entrada', symbol: '+' },
    salida:  { label: 'Salida',  cls: 'cardex-badge-salida',  symbol: '−' },
    ajuste:  { label: 'Ajuste',  cls: 'cardex-badge-ajuste',  symbol: '±' },
    merma:   { label: 'Merma',   cls: 'cardex-badge-merma',   symbol: '↓' },
  };

  tbody.innerHTML = movements
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(m => {
      const meta = TYPE_META[m.type] || TYPE_META.ajuste;
      const absQty = Math.abs(m.qty);
      const qtySign = m.qty > 0 ? '+' : '−';
      const qtyColor = m.type === 'entrada'
        ? '#10b981'
        : m.type === 'salida'
          ? '#ef4444'
          : m.type === 'merma'
            ? '#f97316'
            : '#f59e0b';
      return `
        <tr>
          <td><code style="font-size:0.78rem;background:rgba(255,255,255,0.05);padding:2px 7px;border-radius:4px;">${m.ref}</code></td>
          <td><span class="cardex-type-badge ${meta.cls}">${meta.symbol} ${meta.label}</span></td>
          <td style="font-weight:600;color:var(--admin-text-main);">${m.product}</td>
          <td><span style="font-size:0.78rem;color:var(--admin-text-muted);">${m.category}</span></td>
          <td style="text-align:center;color:var(--admin-text-muted);">${m.prev}</td>
          <td style="text-align:center;font-weight:700;font-size:1.05rem;color:${qtyColor};">${qtySign}${absQty}</td>
          <td style="text-align:center;font-weight:700;">${m.current}</td>
          <td style="font-size:0.82rem;color:var(--admin-text-muted);max-width:180px;">${m.reason}</td>
          <td style="font-size:0.82rem;">${m.responsible}</td>
          <td style="font-size:0.82rem;white-space:nowrap;">${m.date}</td>
        </tr>`;
    }).join('');
}

function _updateCardexKpis(movements) {
  const ins  = movements.filter(m => m.type === 'entrada').reduce((s, m) => s + Math.abs(m.qty), 0);
  const outs = movements.filter(m => m.type === 'salida').reduce((s, m) => s + Math.abs(m.qty), 0);
  const adjs = movements.filter(m => m.type === 'ajuste' || m.type === 'merma').reduce((s, m) => s + Math.abs(m.qty), 0);
  const net  = ins - outs;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('cardexInCount',   ins  + ' uds');
  set('cardexOutCount',  outs + ' uds');
  set('cardexAdjCount',  adjs + ' uds');
  set('cardexNetBalance', (net >= 0 ? '+' : '') + net + ' uds');

  const netEl = document.getElementById('cardexNetBalance');
  if (netEl) netEl.style.color = net >= 0 ? '#10b981' : '#ef4444';
}

window.filterCardex = function() {
  const search  = (document.getElementById('cardexSearch')?.value || '').toLowerCase();
  const type    = document.getElementById('cardexFilterType')?.value || 'all';
  const product = document.getElementById('cardexFilterProduct')?.value || 'all';

  const filtered = state.cardex.filter(m => {
    const matchSearch  = !search || m.product.toLowerCase().includes(search) || m.ref.toLowerCase().includes(search) || m.reason.toLowerCase().includes(search);
    const matchType    = type === 'all'    || m.type === type;
    const matchProduct = product === 'all' || m.product === product;
    return matchSearch && matchType && matchProduct;
  });

  _renderCardexTable(filtered);
  _updateCardexKpis(filtered);
};

window.openCardexModal = function() {
  // Modal inline rápido
  let modal = document.getElementById('modalCardex');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalCardex';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width:540px;">
        <div class="modal-header">
          <h3 style="font-size:1.15rem;font-weight:800;color:var(--admin-text-main);">Registrar Movimiento de Stock</h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('modalCardex').classList.remove('active')">&times;</button>
        </div>
        <form id="formCardex" style="display:flex;flex-direction:column;gap:1rem;padding:1.5rem;">
          <div class="form-group">
            <label class="form-label">Tipo de Movimiento</label>
            <select id="cdxType" class="form-input" required>
              <option value="entrada">Entrada (Compra / Reposición)</option>
              <option value="salida">Salida (Venta / Despacho)</option>
              <option value="ajuste">Ajuste (Corrección de conteo)</option>
              <option value="merma">Merma (Daño / Pérdida)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Producto</label>
            <select id="cdxProduct" class="form-input" required>
              ${INVENTORY_DB.map(i => `<option value="${i.model}" data-cat="${i.category}">${i.brand} — ${i.model}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Cantidad (unidades)</label>
            <input type="number" id="cdxQty" class="form-input" min="1" max="999" placeholder="Ej. 5" required>
          </div>
          <div class="form-group">
            <label class="form-label">Motivo / Detalle</label>
            <input type="text" id="cdxReason" class="form-input" placeholder="Ej. Reposición semanal desde almacén central" required>
          </div>
          <button type="submit" class="btn-primary-action" style="width:100%;justify-content:center;padding:0.85rem;">Guardar Movimiento</button>
        </form>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('formCardex').addEventListener('submit', function(e) {
      e.preventDefault();
      const type    = document.getElementById('cdxType').value;
      const product = document.getElementById('cdxProduct');
      const qty     = parseInt(document.getElementById('cdxQty').value, 10);
      const reason  = document.getElementById('cdxReason').value.trim();
      const cat     = product.options[product.selectedIndex]?.dataset.cat || '';

      const lastMov = state.cardex.filter(m => m.product === product.value).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      const prev    = lastMov ? lastMov.current : 0;
      const finalQty = (type === 'salida' || type === 'merma') ? -qty : qty;
      const current  = Math.max(0, prev + finalQty);

      const newId  = 'CDX-' + String(state.cardex.length + 1).padStart(3, '0');
      const today  = new Date().toISOString().split('T')[0];
      const user   = state.session?.name || 'Administrador';

      state.cardex.unshift({
        id: newId, ref: 'CDX-2026-' + String(state.cardex.length + 1).padStart(3, '0'),
        type, product: product.value, category: cat,
        prev, qty: finalQty, current, reason, responsible: user, date: today
      });

      // Sync with inventory
      const invItem = state.inventory.find(i => i.model === product.value);
      if (invItem) { invItem.stock = current; }

      // Refresh product filter
      const sel = document.getElementById('cardexFilterProduct');
      if (sel) {
        while (sel.options.length > 1) sel.remove(1);
        [...new Set(state.cardex.map(m => m.product))].sort().forEach(p => {
          const opt = document.createElement('option');
          opt.value = p;
          opt.textContent = p.length > 36 ? p.substring(0, 34) + '…' : p;
          sel.appendChild(opt);
        });
      }

      modal.classList.remove('active');
      this.reset();
      filterCardex();
      showToast('Movimiento registrado exitosamente en el Cardex');
    });
  }
  modal.classList.add('active');
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.classList.remove('active'); }, { once: false });
};

window.exportCardexCsv = function() {
  const rows = [
    ['Referencia','Tipo','Producto','Categoría','Cant. Anterior','Movimiento','Cant. Actual','Motivo','Responsable','Fecha'],
    ...state.cardex.map(m => [m.ref, m.type, `"${m.product}"`, m.category, m.prev, m.qty, m.current, `"${m.reason}"`, m.responsible, m.date])
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `cardex_lens_group_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Cardex exportado como CSV');
};

// ==========================================================================
// 12. CRM OFTALMOLÓGICO, POSTVENTA Y CONTACTABILIDAD
// ==========================================================================

window.renderCRM = function() {
  const tbody = document.getElementById('crmTableBody');
  const patients = state.crmPatients || [];

  // 1. Calcular KPIs
  const total = patients.length;
  const listo = patients.filter(p => p.estado === 'listo').length;
  const adaptacion = patients.filter(p => p.estado === 'adaptacion').length;
  const control = patients.filter(p => p.estado === 'control').length;
  const garantia = patients.filter(p => p.estado === 'garantia').length;
  const fidelizado = patients.filter(p => p.estado === 'fidelizado').length;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('crmKpiTotal', total);
  setEl('crmKpiListo', listo);
  setEl('crmKpiAdaptacion', adaptacion);
  setEl('crmKpiControl', control);
  setEl('crmKpiGarantia', garantia);

  setEl('crmTabCountAll', total);
  setEl('crmTabCountListo', listo);
  setEl('crmTabCountAdaptacion', adaptacion);
  setEl('crmTabCountControl', control);
  setEl('crmTabCountGarantia', garantia);
  setEl('crmTabCountFidelizado', fidelizado);

  // Badge en el panel lateral
  setEl('sidebarCrmBadge', total);

  if (!tbody) return;

  // 2. Filtrar
  let list = [...patients];
  if (state.crmFilter && state.crmFilter !== 'all') {
    list = list.filter(p => p.estado === state.crmFilter);
  }

  if (state.crmSearchQuery) {
    const q = state.crmSearchQuery.toLowerCase();
    list = list.filter(p =>
      (p.nombre && p.nombre.toLowerCase().includes(q)) ||
      (p.dni && p.dni.includes(q)) ||
      (p.telefono && p.telefono.includes(q)) ||
      (p.ticket && p.ticket.toLowerCase().includes(q)) ||
      (p.montura && p.montura.toLowerCase().includes(q)) ||
      (p.lunas && p.lunas.toLowerCase().includes(q)) ||
      (p.direccion && p.direccion.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
          <div style="margin-bottom: 0.5rem; display: flex; justify-content: center;">${LG.icon('search', { size: 32, sw: 1.8 })}</div>
          <div style="font-weight: 700; font-size: 1rem; color: var(--admin-text-main);">No se encontraron pacientes</div>
          <p style="font-size: 0.82rem; margin-top: 0.25rem;">Intenta con otro término de búsqueda o cambia la pestaña de filtro.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const badgeMap = {
      listo: { cls: 'crm-badge-listo', icon: '', text: 'Listo p/ Retiro' },
      adaptacion: { cls: 'crm-badge-adaptacion', icon: '', text: 'En Adaptación' },
      control: { cls: 'crm-badge-control', icon: '', text: 'Control Anual' },
      garantia: { cls: 'crm-badge-garantia', icon: '', text: 'Garantía Vigente' },
      fidelizado: { cls: 'crm-badge-fidelizado', icon: '⭐', text: 'Fidelizado / VIP' }
    };
    const bInfo = badgeMap[p.estado] || badgeMap.listo;
    const cleanPhone = String(p.telefono || '').replace(/\D/g, '');
    const initial = (p.nombre || 'P').trim().charAt(0).toUpperCase();

    // Rx resumen
    const odRx = p.graduacion?.od ? `OD: ${p.graduacion.od.esf || '0.00'} / ${p.graduacion.od.cil || '0.00'}` : 'OD: Normal';
    const oiRx = p.graduacion?.oi ? `OI: ${p.graduacion.oi.esf || '0.00'} / ${p.graduacion.oi.cil || '0.00'}` : 'OI: Normal';

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="crm-avatar">${initial}</div>
            <div>
              <div style="font-weight: 800; color: var(--admin-text-main); font-size: 0.92rem; cursor: pointer;" onclick="openPatientRecordModal('${p.id}')">
                ${p.nombre}
              </div>
              <div style="font-size: 0.74rem; color: var(--admin-text-muted); display: flex; gap: 0.5rem; align-items: center; margin-top: 0.15rem;">
                <span style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">DNI: ${p.dni}</span>
                <span>•</span>
                <span>${p.edad ? p.edad + ' años' : 'Paciente'}</span>
                <span>•</span>
                <span>${p.ocupacion || 'Trujillo'}</span>
              </div>
              <div style="font-size: 0.7rem; color: var(--admin-text-dim); margin-top: 0.1rem;">
                ${p.direccion || 'Trujillo, Perú'}
              </div>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;">
            <div style="font-weight: 700; font-family: monospace; font-size: 0.86rem; color: var(--admin-text-main);">
              +51 ${p.telefono}
            </div>
            <div style="display: flex; gap: 0.35rem;">
              <button type="button" class="crm-wa-btn" onclick="sendPatientWhatsApp('${p.id}')" title="Enviar WhatsApp con plantilla personalizada">
                ${window.LG.icon('whatsapp', { size: 14 })}
                <span>WhatsApp</span>
              </button>
              <a href="tel:${cleanPhone}" class="btn-table-action" title="Llamar al paciente" style="padding: 0.3rem 0.5rem;">
                ${window.LG.icon('phone', { size: 13, sw: 2 })}
              </a>
            </div>
          </div>
        </td>
        <td>
          <div style="max-width: 210px;">
            <span style="font-family: monospace; font-size: 0.72rem; font-weight: 800; color: var(--admin-accent-blue); background: rgba(2, 132, 199, 0.12); padding: 0.15rem 0.4rem; border-radius: 4px; display: inline-block; margin-bottom: 0.25rem;">
              ${p.ticket || 'TICKET'}
            </span>
            <div style="font-weight: 700; font-size: 0.84rem; color: var(--admin-text-main); line-height: 1.25;">
              ${p.montura}
            </div>
            <div style="font-size: 0.74rem; color: var(--admin-text-muted); margin-top: 0.2rem; line-height: 1.3;">
              ${p.lunas}
            </div>
          </div>
        </td>
        <td>
          <div class="crm-prescription-box" onclick="openPatientRecordModal('${p.id}')" style="cursor: pointer;" title="Clic para ver receta completa">
            <span style="color: #38bdf8;">${odRx}</span>
            <span style="color: #818cf8;">${oiRx}</span>
            ${p.graduacion?.add ? `<span style="color: #34d399; font-size: 0.7rem;">ADD: ${p.graduacion.add}</span>` : ''}
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;">
            <span class="crm-badge ${bInfo.cls}">
              <span>${bInfo.icon}</span>
              <span>${bInfo.text}</span>
            </span>
            <select class="select-state" onchange="updatePatientStatus('${p.id}', this.value)" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; width: 135px;">
              <option value="listo" ${p.estado === 'listo' ? 'selected' : ''}>Listo p/ Retiro</option>
              <option value="adaptacion" ${p.estado === 'adaptacion' ? 'selected' : ''}>En Adaptación</option>
              <option value="control" ${p.estado === 'control' ? 'selected' : ''}>Control Anual</option>
              <option value="garantia" ${p.estado === 'garantia' ? 'selected' : ''}>Garantía</option>
              <option value="fidelizado" ${p.estado === 'fidelizado' ? 'selected' : ''}>⭐ Fidelizado</option>
            </select>
          </div>
        </td>
        <td>
          <div style="font-size: 0.78rem; color: var(--admin-text-main); line-height: 1.35; max-width: 220px;">
            ${p.notaSeguimiento || 'Sin notas registradas.'}
          </div>
          <div style="font-size: 0.7rem; color: var(--admin-text-dim); margin-top: 0.25rem;">
            Revisión: <strong style="color: var(--admin-primary);">${p.proximaRevision || 'Anual'}</strong>
          </div>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button type="button" class="btn-table-action" onclick="openPatientRecordModal('${p.id}')" title="Ver Historial Clínico Completo">
              ${window.LG.icon('fileText', { size: 14, sw: 2 })}
              <span>Ficha</span>
            </button>
            <button type="button" class="btn-table-action" onclick="openAddInteractionModal('${p.id}')" title="Registrar Nota de Contacto">
              ${window.LG.icon('plus', { size: 13, sw: 2.5 })}
              <span>+ Nota</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.updatePatientStatus = function(patientId, newStatus) {
  const p = (state.crmPatients || []).find(x => x.id === patientId);
  if (!p) return;

  const names = {
    listo: 'Listo p/ Retiro',
    adaptacion: 'En Adaptación',
    control: 'Control Anual',
    garantia: 'Garantía Vigente',
    fidelizado: 'Fidelizado / VIP'
  };

  p.estado = newStatus;
  p.estadoTexto = names[newStatus] || newStatus;

  // Registrar en timeline
  if (!p.timeline) p.timeline = [];
  const now = new Date();
  const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
  p.timeline.unshift({
    fecha: fechaStr,
    tipo: 'estado',
    autor: state.session?.name || 'Staff Óptico',
    detalle: `Estado CRM actualizado a: "${p.estadoTexto}".`
  });

  renderCRM();
  showToast(`Estado de ${p.nombre} cambiado a: ${p.estadoTexto}`);
};

window.sendPatientWhatsApp = function(patientId, templateKey) {
  const p = (state.crmPatients || []).find(x => x.id === patientId);
  if (!p) return;

  const tKey = templateKey || p.estado || 'listo';
  const cleanPhone = String(p.telefono || '').replace(/\D/g, '');
  const firstName = p.nombre.split(' ')[0] || p.nombre;

  const templates = {
    listo: `¡Hola ${firstName}! Te saludamos de Lens Group Trujillo.\nTe informamos que tus lentes con montura *${p.montura}* y lunas *${p.lunas}* ya se encuentran calibrados y listos en nuestra sede de Jr. Gamarra 778 (Galería San Antonio, Trujillo).\n¡Puedes pasar a recogerlos cuando gustes! Quedamos atentos para atenderte.`,
    adaptacion: `¡Hola ${firstName}! Te saluda el equipo de Lens Group Trujillo.\nQueremos saber cómo te has sentido con tus nuevas lunas *${p.lunas}*. Recuerda que si necesitas algún ajuste en las plaquetas o calibración de la montura, puedes visitarnos en Jr. Gamarra 778 sin ningún costo. ¡Tu confort visual es nuestra prioridad!`,
    control: `¡Hola ${firstName}! Esperamos que te encuentres muy bien. Te escribimos de Lens Group Trujillo.\nRevisando tu historial óptico, ha transcurrido un año desde tu última graduación. Te invitamos a una reevaluación optométrica preventiva gratuita en nuestra sede de Jr. Gamarra 778 para verificar tu agudeza visual. ¿Te gustaría agendar tu cita esta semana?`,
    garantia: `¡Hola ${firstName}! En Lens Group Trujillo te recordamos que tu montura *${p.montura}* cuenta con garantía activa hasta el *${p.fechaGarantia || '2027'}*.\nPuedes visitarnos cuando desees para tu servicio gratuito de limpieza ultrasónica y ajuste de tornillos. ¡Te esperamos en Jr. Gamarra 778!`,
    fidelizado: `¡Hola ${firstName}! Gracias por confiar tu salud visual en Lens Group Trujillo. ⭐\nPor ser un paciente preferencial, este mes cuentas con un beneficio exclusivo del 20% de descuento en gafas de sol polarizadas o para un familiar directo. ¡Pregúntanos por los nuevos modelos de catálogo!`
  };

  const text = templates[tKey] || templates.listo;

  // Registrar en timeline
  if (!p.timeline) p.timeline = [];
  const now = new Date();
  const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
  p.timeline.unshift({
    fecha: fechaStr,
    tipo: 'whatsapp',
    autor: state.session?.name || 'CRM WhatsApp',
    detalle: `Mensaje de WhatsApp enviado (${tKey.toUpperCase()}) al +51 ${p.telefono}.`
  });

  const waUrl = `https://api.whatsapp.com/send?phone=51${cleanPhone}&text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
  showToast(`Abriendo WhatsApp para ${firstName}...`);
  renderCRM();
};

window.openPatientRecordModal = function(patientId) {
  const p = (state.crmPatients || []).find(x => x.id === patientId);
  if (!p) return;

  let modal = document.getElementById('modalPatientRecord');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalPatientRecord';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const od = p.graduacion?.od || { esf: '-', cil: '-', eje: '-', av: '-' };
  const oi = p.graduacion?.oi || { esf: '-', cil: '-', eje: '-', av: '-' };
  const add = p.graduacion?.add || 'No requiere';
  const dp = p.graduacion?.dp || 'Normal';
  const diag = p.graduacion?.diagnostico || 'Evaluación optométrica estándar.';

  const timelineHtml = (p.timeline || []).map(t => `
    <div class="crm-timeline-item">
      <div class="crm-timeline-dot"></div>
      <div class="crm-timeline-header">
        <span class="crm-timeline-badge">${t.tipo}</span>
        <span>${t.fecha}</span>
        <span style="color: var(--admin-primary); font-weight: 700;">${t.autor || 'Staff'}</span>
      </div>
      <div style="color: var(--admin-text-main); font-size: 0.84rem; line-height: 1.4; margin-top: 0.2rem;">
        ${t.detalle}
      </div>
    </div>
  `).join('');

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 720px; max-height: 90vh; overflow-y: auto;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="crm-avatar" style="width: 42px; height: 42px; font-size: 1.1rem;">${p.nombre.charAt(0)}</div>
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--admin-text-main);">${p.nombre}</h3>
            <span style="font-size: 0.78rem; color: var(--admin-text-muted);">Ficha Clínica Oftalmológica &amp; Historial CRM</span>
          </div>
        </div>
        <button type="button" class="modal-close-btn" onclick="document.getElementById('modalPatientRecord').classList.remove('active')">&times;</button>
      </div>

      <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- DATOS PERSONALES -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; background: rgba(15, 23, 42, 0.4); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border); font-size: 0.82rem;">
          <div><strong style="color: var(--admin-text-dim);">DNI:</strong> <span style="font-family: monospace; font-weight: 700; color: var(--admin-primary);">${p.dni}</span></div>
          <div><strong style="color: var(--admin-text-dim);">Celular / WhatsApp:</strong> +51 ${p.telefono}</div>
          <div><strong style="color: var(--admin-text-dim);">Edad / Género:</strong> ${p.edad} años (${p.genero === 'F' ? 'Femenino' : 'Masculino'})</div>
          <div><strong style="color: var(--admin-text-dim);">Ocupación:</strong> ${p.ocupacion}</div>
          <div style="grid-column: 1 / -1;"><strong style="color: var(--admin-text-dim);">Dirección:</strong> ${p.direccion}</div>
        </div>

        <!-- CUADRO DE REFRACCIÓN / RECETA ÓPTICA -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
            <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--admin-text-main);">Prescripción Optométrica</h4>
            <span style="font-size: 0.72rem; color: var(--admin-accent-blue); font-weight: 700;">Ticket: ${p.ticket}</span>
          </div>
          <table class="crm-rx-table">
            <thead>
              <tr>
                <th>Ojo</th>
                <th>Esfera (ESF)</th>
                <th>Cilindro (CIL)</th>
                <th>Eje (EJE)</th>
                <th>Agudeza Visual (AV)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 800; color: #38bdf8;">OD (Derecho)</td>
                <td>${od.esf}</td>
                <td>${od.cil}</td>
                <td>${od.eje}</td>
                <td>${od.av}</td>
              </tr>
              <tr>
                <td style="font-weight: 800; color: #818cf8;">OI (Izquierdo)</td>
                <td>${oi.esf}</td>
                <td>${oi.cil}</td>
                <td>${oi.eje}</td>
                <td>${oi.av}</td>
              </tr>
            </tbody>
          </table>
          <div style="display: flex; gap: 1rem; font-size: 0.8rem; background: rgba(2, 6, 23, 0.4); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border); flex-wrap: wrap;">
            <div><strong>Adición (ADD):</strong> <span style="color: #34d399; font-weight: 700;">${add}</span></div>
            <div><strong>Distancia Pupilar (DP):</strong> <span style="color: #38bdf8; font-weight: 700;">${dp}</span></div>
            <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.4rem; color: var(--admin-text-muted);">
              <strong>Diagnóstico:</strong> ${diag}
            </div>
          </div>
        </div>

        <!-- DETALLES DEL PRODUCTO Y GARANTÍA -->
        <div style="background: rgba(13, 148, 136, 0.08); border: 1px solid rgba(13, 148, 136, 0.25); border-radius: var(--radius-sm); padding: 0.9rem; font-size: 0.82rem;">
          <div style="font-weight: 800; color: var(--admin-active-text); margin-bottom: 0.4rem;">Montura &amp; Lunas Adquiridas</div>
          <div><strong>Montura:</strong> ${p.montura}</div>
          <div style="margin-top: 0.2rem;"><strong>Lunas / Tratamiento:</strong> ${p.lunas}</div>
          <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem; font-size: 0.78rem; border-top: 1px dashed rgba(13, 148, 136, 0.2); padding-top: 0.4rem;">
            <div>Garantía hasta: <strong>${p.fechaGarantia}</strong></div>
            <div>Próximo control anual: <strong style="color: var(--admin-accent-amber);">${p.proximaRevision}</strong></div>
          </div>
        </div>

        <!-- BITÁCORA DE SEGUIMIENTO (TIMELINE) -->
        <div>
          <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--admin-text-main); margin-bottom: 0.5rem;">
            Bitácora de Contactos &amp; Postventa
          </h4>
          <div class="crm-timeline">
            ${timelineHtml}
          </div>

          <!-- FORMULARIO AGREGAR INTERACCIÓN -->
          <div style="margin-top: 1rem; background: rgba(15, 23, 42, 0.6); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border);">
            <div style="font-weight: 700; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--admin-text-main);">+ Registrar Nueva Interacción / Nota</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <select id="modalAddType_${p.id}" class="form-input" style="max-width: 150px; font-size: 0.8rem; padding: 0.4rem;">
                <option value="whatsapp">WhatsApp</option>
                <option value="llamada">Llamada</option>
                <option value="tienda">Visita Tienda</option>
                <option value="taller">Taller / Ajuste</option>
                <option value="clinica">Control Médico</option>
              </select>
              <input type="text" id="modalAddText_${p.id}" class="form-input" placeholder="Detalle de la llamada, ajuste o mensaje..." style="flex: 1; font-size: 0.8rem; padding: 0.4rem;">
              <button type="button" class="btn-primary-action" onclick="submitPatientNote('${p.id}')" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                Guardar Nota
              </button>
            </div>
          </div>
        </div>

        <!-- ACCIONES RÁPIDAS -->
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--admin-card-border); padding-top: 1rem;">
          <button type="button" class="crm-wa-btn" onclick="sendPatientWhatsApp('${p.id}')" style="padding: 0.5rem 1rem;">
            ${window.LG.icon('whatsapp', { size: 16 })}
            <span>Contactar por WhatsApp</span>
          </button>
          <button type="button" class="btn-header-action" onclick="openCrmTemplatesModal('${p.id}')">
            ${window.LG.icon('chat', { size: 15 })}
            <span>Ver Plantillas</span>
          </button>
          <button type="button" class="btn-header-action" onclick="document.getElementById('modalPatientRecord').classList.remove('active')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  }, { once: false });
};

window.submitPatientNote = function(patientId) {
  const p = (state.crmPatients || []).find(x => x.id === patientId);
  if (!p) return;

  const typeEl = document.getElementById(`modalAddType_${patientId}`);
  const textEl = document.getElementById(`modalAddText_${patientId}`);
  const text = textEl ? textEl.value.trim() : '';

  if (!text) {
    showToast('Escriba el detalle de la interacción antes de guardar');
    return;
  }

  const type = typeEl ? typeEl.value : 'nota';
  if (!p.timeline) p.timeline = [];
  const now = new Date();
  const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

  p.timeline.unshift({
    fecha: fechaStr,
    tipo: type,
    autor: state.session?.name || 'Staff Óptico',
    detalle: text
  });
  p.notaSeguimiento = text;

  showToast('Nota guardada en el historial del paciente');
  renderCRM();
  openPatientRecordModal(patientId);
};

window.openAddInteractionModal = function(patientId) {
  openPatientRecordModal(patientId);
  setTimeout(() => {
    const input = document.getElementById(`modalAddText_${patientId}`);
    if (input) input.focus();
  }, 100);
};

window.openNewPatientModal = function() {
  let modal = document.getElementById('modalNewPatientCRM');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalNewPatientCRM';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const randomTicket = `LGT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
      <div class="modal-header">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--admin-text-main);">Registrar Nuevo Paciente en CRM</h3>
        <button type="button" class="modal-close-btn" onclick="document.getElementById('modalNewPatientCRM').classList.remove('active')">&times;</button>
      </div>

      <form id="formNewPatientCRM" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <!-- DNI Y RENIEC -->
        <div style="background: rgba(13, 148, 136, 0.08); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(13, 148, 136, 0.2);">
          <label class="form-label" style="font-weight: 800; color: var(--admin-active-text);">Documento de Identidad (RENIEC)</label>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.35rem;">
            <input type="text" id="newPatDni" class="form-input" placeholder="DNI de 8 dígitos (ej. 45892147)" maxlength="8" style="flex: 1; font-family: monospace;" required>
            <button type="button" class="btn-primary-action" id="btnQueryReniecPat" style="padding: 0 1rem;">
              <span>Consultar RENIEC</span>
            </button>
          </div>
        </div>

        <!-- DATOS PERSONALES -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Nombres y Apellidos Completos *</label>
            <input type="text" id="newPatNombre" class="form-input" placeholder="Ej. Ana Lucía Morales Chávez" required>
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono Celular / WhatsApp *</label>
            <input type="tel" id="newPatTelefono" class="form-input" placeholder="944123890" maxlength="9" required>
          </div>
          <div class="form-group">
            <label class="form-label">Edad (años)</label>
            <input type="number" id="newPatEdad" class="form-input" placeholder="Ej. 28" min="1" max="110">
          </div>
          <div class="form-group">
            <label class="form-label">Ocupación</label>
            <input type="text" id="newPatOcupacion" class="form-input" placeholder="Ej. Diseñadora, Médico, Estudiante">
          </div>
          <div class="form-group">
            <label class="form-label">Dirección / Distrito en Trujillo</label>
            <input type="text" id="newPatDireccion" class="form-input" placeholder="Ej. Urb. California, Trujillo">
          </div>
        </div>

        <!-- GRADUACIÓN ÓPTICA -->
        <div style="border-top: 1px solid var(--admin-card-border); padding-top: 0.75rem;">
          <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--admin-text-main); margin-bottom: 0.5rem;">Medida de la Vista (Refracción)</h4>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; background: rgba(15, 23, 42, 0.4); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-card-border); font-size: 0.8rem;">
            <div style="grid-column: 1 / -1; font-weight: 700; color: #38bdf8;">Ojo Derecho (OD):</div>
            <input type="text" id="newPatOdEsf" class="form-input" placeholder="Esf (ej. -1.50)">
            <input type="text" id="newPatOdCil" class="form-input" placeholder="Cil (ej. -0.50)">
            <input type="text" id="newPatOdEje" class="form-input" placeholder="Eje (ej. 90°)">
            <input type="text" id="newPatOdAv" class="form-input" placeholder="AV (ej. 20/20)">

            <div style="grid-column: 1 / -1; font-weight: 700; color: #818cf8; margin-top: 0.35rem;">Ojo Izquierdo (OI):</div>
            <input type="text" id="newPatOiEsf" class="form-input" placeholder="Esf (ej. -1.75)">
            <input type="text" id="newPatOiCil" class="form-input" placeholder="Cil (ej. -0.50)">
            <input type="text" id="newPatOiEje" class="form-input" placeholder="Eje (ej. 85°)">
            <input type="text" id="newPatOiAv" class="form-input" placeholder="AV (ej. 20/20)">

            <div style="grid-column: span 2; margin-top: 0.35rem;">
              <label class="form-label">Adición (ADD)</label>
              <input type="text" id="newPatAdd" class="form-input" placeholder="Ej. +1.50 (Opcional)">
            </div>
            <div style="grid-column: span 2; margin-top: 0.35rem;">
              <label class="form-label">Distancia Pupilar (DP)</label>
              <input type="text" id="newPatDp" class="form-input" placeholder="Ej. 62 mm">
            </div>
          </div>
        </div>

        <!-- PRODUCTO & ESTADO CRM -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; border-top: 1px solid var(--admin-card-border); padding-top: 0.75rem;">
          <div class="form-group">
            <label class="form-label">Ticket Asociado</label>
            <input type="text" id="newPatTicket" class="form-input" value="${randomTicket}">
          </div>
          <div class="form-group">
            <label class="form-label">Etapa CRM Inicial *</label>
            <select id="newPatEstado" class="form-input" required>
              <option value="listo">Listo p/ Retiro en Tienda</option>
              <option value="adaptacion" selected>En Adaptación (1 a 15 días)</option>
              <option value="control">Control Anual / Cita</option>
              <option value="garantia">En Garantía</option>
              <option value="fidelizado">Fidelizado / VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Montura</label>
            <input type="text" id="newPatMontura" class="form-input" placeholder="Ej. Ray-Ban Wayfarer Classic" required>
          </div>
          <div class="form-group">
            <label class="form-label">Lunas &amp; Tratamientos</label>
            <input type="text" id="newPatLunas" class="form-input" placeholder="Ej. Antirreflejo HD Blue Protect UV420" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Nota Inicial de Seguimiento</label>
            <input type="text" id="newPatNota" class="form-input" placeholder="Ej. Paciente requiere llamada a los 5 días para verificar confort con lunas">
          </div>
        </div>

        <button type="submit" class="btn-primary-action" style="padding: 0.85rem; justify-content: center; font-weight: 800; margin-top: 0.5rem;">
          Guardar Paciente en el CRM
        </button>
      </form>
    </div>
  `;

  // Listener RENIEC
  const btnReniec = document.getElementById('btnQueryReniecPat');
  if (btnReniec) {
    btnReniec.addEventListener('click', async () => {
      const dni = document.getElementById('newPatDni').value.trim();
      if (!dni || dni.length !== 8) {
        showToast('Ingrese un DNI válido de 8 dígitos');
        return;
      }
      btnReniec.textContent = 'Consultando...';
      try {
        const info = await window.LG.consultarDNI(dni);
        if (info && info.nombreCompleto) {
          document.getElementById('newPatNombre').value = info.nombreCompleto;
          showToast(`Datos RENIEC encontrados: ${info.nombreCompleto}`);
        } else {
          showToast('No se encontró el DNI en RENIEC. Ingréselo manualmente.');
        }
      } catch (err) {
        showToast('No se pudo conectar al servicio RENIEC. Ingréselo manualmente.');
      } finally {
        btnReniec.textContent = 'Consultar RENIEC';
      }
    });
  }

  // Listener submit
  const form = document.getElementById('formNewPatientCRM');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const dni = document.getElementById('newPatDni').value.trim();
      const nombre = document.getElementById('newPatNombre').value.trim();
      const telefono = document.getElementById('newPatTelefono').value.trim();
      const edad = parseInt(document.getElementById('newPatEdad').value, 10) || 30;
      const ocupacion = document.getElementById('newPatOcupacion').value.trim() || 'Particular';
      const direccion = document.getElementById('newPatDireccion').value.trim() || 'Trujillo';
      const ticket = document.getElementById('newPatTicket').value.trim() || randomTicket;
      const estado = document.getElementById('newPatEstado').value;
      const montura = document.getElementById('newPatMontura').value.trim();
      const lunas = document.getElementById('newPatLunas').value.trim();
      const nota = document.getElementById('newPatNota').value.trim() || 'Paciente registrado en el CRM.';

      const odEsf = document.getElementById('newPatOdEsf').value.trim() || '0.00';
      const odCil = document.getElementById('newPatOdCil').value.trim() || '0.00';
      const odEje = document.getElementById('newPatOdEje').value.trim() || '0°';
      const odAv = document.getElementById('newPatOdAv').value.trim() || '20/20';

      const oiEsf = document.getElementById('newPatOiEsf').value.trim() || '0.00';
      const oiCil = document.getElementById('newPatOiCil').value.trim() || '0.00';
      const oiEje = document.getElementById('newPatOiEje').value.trim() || '0°';
      const oiAv = document.getElementById('newPatOiAv').value.trim() || '20/20';

      const addVal = document.getElementById('newPatAdd').value.trim() || null;
      const dpVal = document.getElementById('newPatDp').value.trim() || '62 mm';

      const names = {
        listo: 'Listo p/ Retiro',
        adaptacion: 'En Adaptación',
        control: 'Control Anual',
        garantia: 'Garantía Vigente',
        fidelizado: 'Fidelizado / VIP'
      };

      const now = new Date();
      const fechaStr = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

      const newPat = {
        id: `crm-pat-${Date.now()}`,
        dni,
        nombre,
        edad,
        genero: 'M',
        telefono,
        direccion,
        ocupacion,
        ticket,
        montura,
        lunas,
        graduacion: {
          od: { esf: odEsf, cil: odCil, eje: odEje, av: odAv },
          oi: { esf: oiEsf, cil: oiCil, eje: oiEje, av: oiAv },
          add: addVal,
          dp: dpVal,
          diagnostico: 'Evaluación optométrica y adaptación de fórmula visual.'
        },
        estado,
        estadoTexto: names[estado] || estado,
        fechaEntrega: now.toLocaleDateString('es-PE'),
        fechaGarantia: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear() + 1}`,
        proximaRevision: `${now.getMonth() + 1}/${now.getFullYear() + 1}`,
        notaSeguimiento: nota,
        timeline: [
          {
            fecha: fechaStr,
            tipo: 'registro',
            autor: state.session?.name || 'Staff Óptico',
            detalle: `Paciente dado de alta en CRM con estado "${names[estado]}".`
          }
        ]
      };

      state.crmPatients.unshift(newPat);
      modal.classList.remove('active');
      renderCRM();
      showToast(`Paciente ${nombre} registrado con éxito en el CRM`);
    });
  }

  modal.classList.add('active');
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  }, { once: false });
};

window.openCrmTemplatesModal = function(patientId) {
  let modal = document.getElementById('modalCrmTemplates');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalCrmTemplates';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const patients = state.crmPatients || [];
  const selectedPatient = (patientId && patients.find(p => p.id === patientId)) || patients[0] || {
    id: 'pat-def',
    nombre: 'Paciente Ejemplo',
    telefono: '944123890',
    montura: 'Montura Ray-Ban Classic',
    lunas: 'Lunas Antirreflejo UV400'
  };

  const getMsg = (key, p) => {
    const fn = (p.nombre || 'estimado(a) paciente').split(' ')[0];
    switch (key) {
      case 'listo':
        return `¡Hola ${fn}! Te saludamos de Lens Group Trujillo.\nTe informamos que tus lentes con montura *${p.montura}* y lunas *${p.lunas}* ya se encuentran calibrados y listos en nuestra sede de Jr. Gamarra 778 (Galería San Antonio, Trujillo).\n¡Puedes pasar a recogerlos cuando gustes! Quedamos atentos para atenderte.`;
      case 'adaptacion':
        return `¡Hola ${fn}! Te saluda el equipo de Lens Group Trujillo.\nQueremos saber cómo te has sentido con tus nuevas lunas *${p.lunas}*. Recuerda que si necesitas algún ajuste en las plaquetas o calibración de la montura, puedes visitarnos en Jr. Gamarra 778 sin costo alguno. ¡Tu confort visual es nuestra prioridad!`;
      case 'control':
        return `¡Hola ${fn}! Esperamos que te encuentres muy bien. Te escribimos de Lens Group Trujillo.\nRevisando tu historial óptico, ha transcurrido un año desde tu última graduación. Te invitamos a una reevaluación optométrica preventiva gratuita en nuestra sede de Jr. Gamarra 778 para verificar tu agudeza visual. ¿Te gustaría agendar tu cita esta semana?`;
      case 'garantia':
        return `¡Hola ${fn}! En Lens Group Trujillo te recordamos que tu montura *${p.montura}* cuenta con garantía activa hasta el *${p.fechaGarantia || '2027'}*.\nPuedes visitarnos cuando desees para tu servicio gratuito de limpieza ultrasónica y ajuste de tornillos. ¡Te esperamos en Jr. Gamarra 778!`;
      case 'fidelizado':
        return `¡Hola ${fn}! Gracias por confiar tu salud visual en Lens Group Trujillo.\nPor ser un paciente preferencial, este mes cuentas con un beneficio exclusivo del 20% de descuento en gafas de sol polarizadas o para un familiar directo. ¡Pregúntanos por los nuevos modelos de catálogo!`;
      default:
        return '';
    }
  };

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 620px;">
      <div class="modal-header">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--admin-text-main);">Plantillas Oficiales de WhatsApp CRM</h3>
        <button type="button" class="modal-close-btn" onclick="document.getElementById('modalCrmTemplates').classList.remove('active')">&times;</button>
      </div>

      <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Seleccionar Paciente Destinatario:</label>
          <select id="tplPatientSelect" class="form-input">
            ${patients.map(p => `<option value="${p.id}" ${p.id === selectedPatient.id ? 'selected' : ''}>${p.nombre} — DNI ${p.dni} (${p.telefono})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de Notificación:</label>
          <select id="tplTypeSelect" class="form-input">
            <option value="listo">1. Notificación de Entrega / Lentes Listos en Tienda</option>
            <option value="adaptacion">2. Seguimiento Postventa / Adaptación y Confort Visual</option>
            <option value="control">3. Recordatorio de Examen Preventivo Anual (1 Año)</option>
            <option value="garantia">4. Garantía Activa / Limpieza Ultrasónica Gratuita</option>
            <option value="fidelizado">⭐ 5. Promoción de Fidelización / Beneficio VIP</option>
          </select>
        </div>

        <div>
          <label class="form-label">Vista Previa del Mensaje Personalizado:</label>
          <div style="background: #0b141a; border-radius: 12px; padding: 1rem; border: 1px solid rgba(255,255,255,0.08); margin-top: 0.35rem;">
            <div style="background: #005c4b; color: #e9edef; padding: 0.85rem 1rem; border-radius: 8px 8px 0 8px; font-size: 0.85rem; line-height: 1.45; white-space: pre-wrap;" id="tplPreviewText"></div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem;">
          <button type="button" class="btn-header-action" id="btnCopyTpl">
            ${window.LG.icon('fileText', { size: 15 })}
            <span>Copiar Texto</span>
          </button>
          <button type="button" class="crm-wa-btn" id="btnLaunchWa" style="padding: 0.6rem 1.25rem;">
            ${window.LG.icon('whatsapp', { size: 16 })}
            <span>Abrir en WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const selPat = document.getElementById('tplPatientSelect');
  const selType = document.getElementById('tplTypeSelect');
  const prevText = document.getElementById('tplPreviewText');

  const updatePreview = () => {
    const p = patients.find(x => x.id === selPat.value) || selectedPatient;
    const t = selType.value;
    prevText.textContent = getMsg(t, p);
  };

  selPat.addEventListener('change', updatePreview);
  selType.addEventListener('change', updatePreview);
  updatePreview();

  document.getElementById('btnCopyTpl').addEventListener('click', () => {
    navigator.clipboard.writeText(prevText.textContent).then(() => {
      showToast('Mensaje copiado al portapapeles');
    });
  });

  document.getElementById('btnLaunchWa').addEventListener('click', () => {
    const p = patients.find(x => x.id === selPat.value) || selectedPatient;
    const t = selType.value;
    sendPatientWhatsApp(p.id, t);
    modal.classList.remove('active');
  });

  modal.classList.add('active');
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  }, { once: false });
};

window.exportCrmCsv = function() {
  const patients = state.crmPatients || [];
  const rows = [
    ['DNI', 'Paciente', 'Celular', 'Edad', 'Ocupacion', 'Direccion', 'Ticket', 'Montura', 'Lunas', 'OD_Esf', 'OD_Cil', 'OD_Eje', 'OI_Esf', 'OI_Cil', 'OI_Eje', 'ADD', 'DP', 'Diagnostico', 'Estado_CRM', 'Proxima_Revision', 'Garantia_Hasta'],
    ...patients.map(p => [
      p.dni,
      `"${p.nombre}"`,
      p.telefono,
      p.edad || '',
      `"${p.ocupacion || ''}"`,
      `"${p.direccion || ''}"`,
      p.ticket || '',
      `"${p.montura || ''}"`,
      `"${p.lunas || ''}"`,
      p.graduacion?.od?.esf || '',
      p.graduacion?.od?.cil || '',
      p.graduacion?.od?.eje || '',
      p.graduacion?.oi?.esf || '',
      p.graduacion?.oi?.cil || '',
      p.graduacion?.oi?.eje || '',
      p.graduacion?.add || '',
      p.graduacion?.dp || '',
      `"${p.graduacion?.diagnostico || ''}"`,
      `"${p.estadoTexto || p.estado}"`,
      `"${p.proximaRevision || ''}"`,
      `"${p.fechaGarantia || ''}"`
    ])
  ];

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `crm_pacientes_lens_group_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Cartera de pacientes exportada como CSV');
};

