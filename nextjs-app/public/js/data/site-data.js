(function () {
  'use strict';

  window.LG = window.LG || {};
  window.LG.data = window.LG.data || {};

  window.LG.data.site = {

    contact: {
      brand: 'Lens Group Trujillo',
      address: 'Galeria San Antonio, Jr. Gamarra N° 778, Trujillo 13001',
      addressShort: 'Galeria San Antonio, Jr. Gamarra N° 778, Trujillo',
      phone: '+51 958 169 535',
      whatsapp: '51958169535',
      ruc: '20609502623',
      mapsUrl: 'https://maps.app.goo.gl/xGcnJzLPnmXBZScR8',
      mapsEmbed: 'https://maps.google.com/maps?q=Galeria%20San%20Antonio%2C%20Jr.%20Gamarra%20N%C2%B0%20778%2C%20Trujillo%2013001&t=&z=17&ie=UTF8&iwloc=&output=embed',
      hours: {
        weekdays: 'Lunes a Sábado: 9:00 AM – 9:00 PM',
        sunday: 'Domingos: 9:30 AM – 2:00 PM'
      },
      badge: 'Distribuidor Autorizado Oficial • Trujillo, La Libertad'
    },

    nav: {
      home: [
        { label: 'Inicio', href: '#inicio' },
        { label: 'Simulador de Lunas', href: '#simulador' },
        { label: 'Nosotros', href: '#nosotros' },
        { label: 'Testimonios', href: '#testimonios' },
        { label: 'Contacto', href: '#contacto' },
        { label: 'Seguimiento', href: '#seguimiento', title: 'Seguimiento de Pedido' }
      ],
      tracking: [
        { label: 'Inicio', href: 'index.html#inicio' },
        { label: 'Catálogo', href: 'index.html#catalogo' },
        { label: 'Marcas', href: 'index.html#marcas' },
        { label: 'Simulador de Lunas', href: 'index.html#simulador' },
        { label: 'Nosotros', href: 'index.html#nosotros' },
        { label: 'Testimonios', href: 'index.html#testimonios' },
        { label: 'Contacto', href: 'index.html#contacto' },
        { label: 'Seguimiento', href: 'seguimiento.html' }
      ]
    },

    
    // Hero
  
    hero: {
      badge: 'Distribuidor Autorizado',
      titleTop: 'Visión clara,',
      titleHighlight: 'estilo insuperable',
      titleBottom: 'en Trujillo',
      description: 'Descubre la colección más exclusiva de gafas de sol, monturas de diseñador y lentes oftálmicos con tecnología digital. Cuidamos de tu salud visual con precisión médica y elegancia.',
      image: 'assets/images/hero_eyewear.jpg',
      metrics: [
        { number: '+6', unit: 'Años', label: 'Liderando la óptica en Trujillo' },
        { number: '+100', unit: '', label: 'Modelos y monturas disponibles' },
        { number: '100', unit: '%', label: 'Garantía oficial y autenticidad' }
      ],
      floatingCards: [
        { icon: 'shield', title: 'Garantía Certificada', sub: 'Marcas nacionales 100% originales' },
        { icon: 'aperture', title: 'Laboratorio Digital', sub: 'Corte computarizado de lunas' }
      ]
    },

    // Marcas del carrusel (se duplican automáticamente para el loop)
  
    brands: [
      { title: 'TROPIC Sunglasses', alt: 'TROPIC Sunglasses', logo: 'brands/tropic.png' },
      { title: 'SYLVANE Sunglasses', alt: 'SYLVANE Sunglasses', logo: 'brands/sylvane.png' },
      { title: 'MELY Sunglasses RTD', alt: 'MELY Sunglasses', logo: 'brands/mely.png' },
      { title: 'Darleen Kids Sunglasses', alt: 'Darleen Kids', logo: 'brands/darleen.png' },
      { title: 'DEBBY Sunglassss Kids', alt: 'DEBBY Kids', logo: 'brands/debby.png' },
      { title: 'Tony Lu Sunglasses Kids', alt: 'Tony Lu Kids', logo: 'brands/tony_lu.png' },
      { title: 'DORIAN Sunglasses Kids', alt: 'DORIAN Sunglasses Kids', logo: 'brands/dorian.png' },
      { title: 'FREDD Sunglasses Kids', alt: 'FREDD Sunglasses Kids', logo: 'brands/fredd.png' },
      { title: 'Greisy Sunglasses', alt: 'Greisy Sunglasses', logo: 'brands/greisy.png' },
      { title: 'Fiorella Conte', alt: 'Fiorella Conte', logo: 'brands/fiorellaconte.svg' },
      { title: 'Inka Lens', alt: 'Inka Lens', logo: 'brands/inkalens.svg' },
      { title: 'D&L Optical', alt: 'D&L Optical', logo: 'brands/dandl.svg' },
      { title: 'Kevin Collection', alt: 'Kevin Collection', logo: 'brands/kevin.svg' }
    ],

    trustPillars: [
      { icon: 'shield', title: 'Procedencia Garantizada', desc: 'Todos nuestros lentes incluyen código de serie, estuche oficial y certificado internacional de fábrica.' },
      { icon: 'gear', title: 'Taller & Calibración Propia', desc: 'Contamos con biselado digital de última generación en Trujillo para una adaptación milimétrica a tu receta.' },
      { icon: 'users', title: 'Optómetras Colegiados', desc: 'Evaluación visual completa, refracción computarizada y asesoramiento estético según la anatomía de tu rostro.' },
      { icon: 'truck', title: 'Entrega Rápida en Trujillo', desc: 'Retira en nuestra tienda del Centro Histórico o solicita envío seguro a domicilio en toda la provincia de Trujillo.' }
    ],

    // Catálogos
    
    catalogFilters: [
      { value: 'todos', label: 'Todos' },
      { value: 'monturas', label: 'Monturas' },
      { value: 'sol', label: 'Gafas de Sol' },
      { value: 'accesorios', label: 'Accesorios' }
    ],
    kidsFilters: [
      { value: 'todos', label: 'Todos' },
      { value: 'monturas', label: 'Monturas' },
      { value: 'sol', label: 'Gafas de Sol' }
    ],
    // Tarjetas del catálogo infantil (el detalle del modal está en catalog.js -> KIDS_PRODUCTS)
    kidsProducts: [
      {
        id: 'kids-receta-1', category: 'monturas', name: 'Darleen Kids Flex Ultra',
        badge: 'Silicona Irrompible', image: 'assets/images/kids-receta-1.jpg',
        alt: 'Lentes de receta para niños - Montura Flexible',
        specs: ['Silicona Flexible 180°', 'Filtro Luz Azul', 'Banda Elástica'],
        price: 180, oldPrice: 220, type: 'Lentes con Receta'
      },
      {
        id: 'kids-receta-2', category: 'monturas', name: 'Tony Lu Kids Active Blue Block',
        badge: 'Salud Visual Kids', image: 'assets/images/kids-receta-2.jpg',
        alt: 'Lentes de receta para niños - Estilo Metálico',
        specs: ['TR-90 Ultraliviano', 'Filtro Pantallas', 'Puente Anatómico'],
        price: 195, oldPrice: 240, type: 'Lentes con Receta'
      },
      {
        id: 'kids-sol-1', category: 'sol', name: 'DEBBY Kids Polarized Sun Junior',
        badge: 'Protección UV400', image: 'assets/images/kids-sol-1.jpg',
        alt: 'Gafas de sol para niños - Polarizadas',
        specs: ['Filtro UV400 100%', 'Lunas Polarizadas', 'Marco Antigolpes'],
        price: 160, oldPrice: 195, type: 'Gafas de Sol'
      },
      {
        id: 'kids-sol-2', category: 'sol', name: 'DEBBY Kids Explorer Sport Solar',
        badge: 'Resistente a Caídas', image: 'assets/images/kids-sol-2.jpg',
        alt: 'Gafas de sol para niños - Estilo Deportivo',
        specs: ['Goma Antideslizante', 'Lunas Antirayaduras', 'Protección UV Total'],
        price: 170, oldPrice: 210, type: 'Gafas de Sol'
      }
    ],

    // Simulador de lunas (títulos largos/descripciones en lens-simulator.js)

    treatments: [
      { key: 'blue', icon: 'monitor', title: 'Filtro Blue Defense', short: 'Blue Defense', desc: 'Protege tus ojos de monitores y celulares' },
      { key: 'antireflective', icon: 'sun', title: 'Antirreflejo Crizal', short: 'Antirreflejo', desc: 'Máxima transparencia sin reflejos nocturnos' },
      { key: 'polarized', icon: 'starOutline', title: 'Polarizado Pro UV400', short: 'Polarizado', desc: 'Elimina encandilamientos en sol brillante' },
      { key: 'transitions', icon: 'moon', title: 'Fotocromático Transitions', short: 'Transitions', desc: 'Se adapta a la luz: claro en interiores, oscuro afuera' }
    ],

    
    // Nosotros
    
    about: {
      tag: 'Conoce Lens Group Trujillo',
      title: 'Pasión por la salud visual y la elegancia en cada mirada',
      paragraphs: [
        'Fundada con la convicción de ofrecer a los trujillanos un estándar superior en óptica, Lens Group Trujillo se ha consolidado como distribuidor autorizado oficial de las marcas oftálmicas y de sol más reconocidas a nivel global.',
        'Nuestro equipo está conformado por optómetras titulados y asesores especializados en visagismo. Combinamos instrumental computarizado de precisión milimétrica con una curaduría estética moderna para que tus lentes sean una extensión perfecta de tu personalidad.'
      ],
      features: [
        { title: 'Ajuste & Mantenimiento', desc: 'Calibración y limpieza ultrasónica gratuita.' },
        { title: 'Garantía de Adaptación', desc: 'Respaldamos tu comodidad visual al 100%.' },
        { title: 'Atención Personalizada', desc: 'Asesoría de estilo según tu tipo de rostro.' }
      ]
    },

    // Testimonios
    
    testimonials: [
      {
        initials: 'CA', name: 'Carlos Alva Ramos', location: 'Trujillo • Local Guide',
        text: 'Compré mis gafas de sol Ray-Ban Aviator y comprobé el número de serie directamente en la web oficial: ¡100% auténticos! La atención en su local de la Galería San Antonio fue impecable y rápida.'
      },
      {
        initials: 'MV', name: 'Mariana Vásquez E.', location: 'Trujillo • Cliente Verificado',
        text: 'Excelente atención y gran variedad de monturas. Me asesoraron con mis lunas Blue Defense para trabajar en computadora y el alivio en la vista fue instantáneo. Muy recomendados en el centro de Trujillo.'
      },
      {
        initials: 'JT', name: 'Jorge Torres Mendocilla', location: 'Trujillo • Cliente Verificado',
        text: 'Me graduaron mis lentes con cristales Inka Lens y montura ultraligera. La nitidez y acabado son excelentes, además tienen los mejores precios de Trujillo en marcas reconocidas.'
      }
    ],

    // Formulario de citas
    
    appointment: {
      services: [
        'Examen de Vista Computarizado',
        'Graduación de Nuevas Lunas',
        'Compra de Gafas de Sol',
        'Adaptación Lentes de Contacto',
        'Mantenimiento y Calibración'
      ],
      shifts: [
        'Mañana (9:30 AM - 1:00 PM)',
        'Tarde (2:30 PM - 5:00 PM)',
        'Noche (5:30 PM - 7:45 PM)'
      ]
    },

    // Seguimiento de pedidos
    
    trackingChips: [
      { code: 'LGT-2025-0450', tag: 'Cola' },
      { code: 'LGT-2025-0105', tag: 'Proceso' },
      { code: 'LGT-2025-0342', tag: 'Listo' }
    ],

    // FAQ compacto (index.html)
    faqShort: [
      { icon: 'receiptShort', q: '¿Perdí mi código?', a: 'Está impreso en tu boleta o te lo enviamos por WhatsApp. Escribenos con tu nombre y lo ubicamos al instante.' },
      { icon: 'clock', q: '¿Cuánto demora mi pedido?', a: 'Monofocales: 1–2 días. Progresivos: 2–3 días. Fotocromáticos / Polarizados: 2–4 días. Te notificamos por WhatsApp cuando esté listo.' },
      { icon: 'pin', q: 'Horario de recojo', a: '<strong>Galería San Antonio, Jr. Gamarra N° 778.</strong><br>Lun–Sáb: 9:00 a.m.–9:00 p.m. &nbsp;|&nbsp; Dom: 9:30 a.m.–2:00 p.m.<br>Trae tu DNI o boleta. Ajuste facial gratuito.' }
    ],

    // FAQ completo (seguimiento.html)
    faqFull: [
      {
        icon: 'receiptShort', q: '¿Perdí mi código de seguimiento?',
        a: 'Tu código está impreso en tu boleta o ticket de recepción. También te lo enviamos por WhatsApp al registrar tu pedido. Si no lo encuentras, escríbenos con tu nombre completo y lo ubicamos en segundos.',
        cta: { label: 'Consultar por WhatsApp', message: 'Hola, perdí mi código de seguimiento.' }
      },
      {
        icon: 'clock', q: '¿Cuánto tiempo demora mi pedido?',
        a: 'El tiempo depende del tipo de lente:',
        list: [
          ['Cristales monofocales', '1 a 2 días hábiles'],
          ['Cristales progresivos / bifocales', '2 a 3 días hábiles'],
          ['Fotocromáticos / Polarizados', '2 a 4 días hábiles'],
          ['Lentes de contacto', 'Mismo día o 24 horas']
        ]
      },
      {
        icon: 'pin', q: 'Horario de recojo — ¿Dónde y cuándo?',
        a: '<strong>Galería San Antonio, Jr. Gamarra N° 778, Trujillo 13001</strong><br><br><strong>Lunes a Sábado:</strong> 9:00 a.m. – 9:00 p.m.<br><strong>Domingos:</strong> 9:30 a.m. – 2:00 p.m.<br><br>Trae tu <strong>DNI</strong> o el número de boleta. Un optómetra hará el ajuste facial gratis.'
      },
      {
        icon: 'shield', q: '¿Cuánto tiempo tengo para recoger?',
        a: 'Una vez <strong>Listo para Recoger</strong>, guardamos tu pedido por hasta <strong>30 días calendario</strong>. Si necesitas más tiempo, avísanos por WhatsApp. Todos los pedidos incluyen <strong>1 año de garantía oficial</strong> desde la entrega.'
      },
      {
        icon: 'wrench', q: '¿Puedo hacer cambios a mi pedido?',
        a: 'Si el pedido está en <strong>Cola</strong> o <strong>Proceso</strong>, puedes solicitar cambios contactándonos de inmediato por WhatsApp antes de que culmine el montaje final.'
      },
      {
        icon: 'phone', q: '¿Hay servicio de delivery?',
        a: 'Actualmente los pedidos <strong>solo se entregan en tienda</strong> para garantizar el ajuste y calibración profesional. Si tienes dificultad para acudir, contáctanos y evaluaremos opciones.',
        cta: { label: 'Preguntar por WhatsApp', message: 'Hola Lens Group Trujillo, quisiera consultar sobre delivery.' }
      }
    ],

    // Footer
  
    socials: [
      { icon: 'facebook', url: 'https://facebook.com', label: 'Facebook Lens Group Trujillo' },
      { icon: 'instagram', url: 'https://instagram.com', label: 'Instagram Lens Group Trujillo' },
      { icon: 'tiktok', url: 'https://tiktok.com', label: 'TikTok Lens Group Trujillo' }
    ],
    footer: {
      description: 'Óptica y distribuidora autorizada de las firmas líderes de lentes y monturas. Innovación oftálmica, garantía oficial y estilo inigualable en Trujillo, Perú.',
      columns: {
        home: {
          title: 'Categorías',
          links: [
            { label: 'Gafas de Sol Polarizadas', href: '#catalogo' },
            { label: 'Lentes con Filtro Blue Light', href: '#catalogo' },
            { label: 'Monturas de Titanio &amp; Acetato', href: '#catalogo' },
            { label: 'Lunas Progresivas Digitales', href: '#catalogo' },
            { label: 'Lentes de Contacto', href: '#catalogo' },
            { label: 'Seguimiento de Pedido', href: 'seguimiento.html', style: 'color: var(--color-teal-300);' },
            { label: 'Portal &amp; Dashboard BI', href: 'admin.html', style: 'color: var(--color-teal-400); font-weight: 700;' }
          ]
        },
        tracking: {
          title: 'Navegación',
          links: [
            { label: 'Inicio', href: 'index.html#inicio' },
            { label: 'Catálogo de Lentes', href: 'index.html#catalogo' },
            { label: 'Marcas Oficiales', href: 'index.html#marcas' },
            { label: 'Simulador de Lunas', href: 'index.html#simulador' },
            { label: 'Testimonios', href: 'index.html#testimonios' },
            { label: 'Seguimiento de Pedido', href: 'seguimiento.html', style: 'color: var(--color-teal-300);' }
          ]
        }
      },
      legal: ['Políticas de Garantía Oficial', 'Términos y Condiciones', 'Protección de Datos Personales']
    },

    // Barra inferior móvil
    mobileActions: [
      { id: 'mab-inicio', href: '#inicio', icon: 'home', label: 'Inicio', active: true },
      { id: 'mab-catalogo', href: '#catalogo', icon: 'grid', label: 'Catálogo' },
      { id: 'mab-whatsapp', whatsapp: true, icon: 'whatsapp', label: 'WhatsApp' },
      { id: 'mab-seguimiento', href: '#seguimiento', icon: 'searchPlus', label: 'Seguimiento' },
      { id: 'mab-contacto', href: '#contacto', icon: 'calendar', label: 'Cita' }
    ],

    // Mensajes de WhatsApp predefinidos
    messages: {
      advice: 'Hola Lens Group Trujillo, deseo asesoría para elegir mis lentes.',
      orderQuestion: 'Hola Lens Group Trujillo, tengo una consulta sobre mi pedido de lentes.',
      prescription: 'Hola Lens Group Trujillo, adjunto mi receta médica para cotizar mis lunas.',
      lostCode: 'Hola Lens Group Trujillo, no encuentro mi código de seguimiento.'
    }
  };
})();
