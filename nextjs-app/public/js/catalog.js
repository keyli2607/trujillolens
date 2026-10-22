/* ==========================================================================
   LENS GROUP TRUJILLO — CATALOG & PRODUCTS MODULE
   ========================================================================== */

const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Ray-Ban Aviator Classic Polarized',
    brand: 'Ray-Ban',
    category: 'sol',
    categoryLabel: 'Gafas de Sol',
    price: 520,
    oldPrice: 590,
    tag: 'Más Vendido',
    image: 'assets/images/sunglasses_aviator.jpg',
    specs: ['Polarizado G-15', 'Filtro UV400 100%', 'Marco Metálico Dorado', 'Calibre 58mm'],
    description: 'El diseño legendario que nunca pasa de moda. Cristales verdes G-15 de alto contraste con marco metálico resistente en acabado oro pulido. Protección total contra deslumbramientos solares.',
    details: {
      material: 'Metal anticorrosivo de alta densidad',
      lenses: 'Cristal mineral templado Polarizado G-15',
      protection: '100% Protección UV400 (Rayos UVA/UVB)',
      measurements: 'Calibre: 58mm | Puente: 14mm | Patilla: 135mm',
      included: 'Estuche rígido de cuero original, paño de microfibra Ray-Ban y certificado de autenticidad.'
    }
  },
  {
    id: 'prod-2',
    name: 'Wayfarer Midnight Black Acetate',
    brand: 'Ray-Ban',
    category: 'sol',
    categoryLabel: 'Gafas de Sol',
    price: 480,
    oldPrice: 540,
    tag: 'Clásico',
    image: 'assets/images/sunglasses_wayfarer.jpg',
    specs: ['Acetato Italiano', 'UV400', 'Lunas Grises Degradadas'],
    description: 'El ícono del estilo contemporáneo. Fabricado con acetato premium negro brillante y bisagras reforzadas de 7 dientes para máxima durabilidad.',
    details: {
      material: 'Acetato de celulosa pulido a mano',
      lenses: 'Policarbonato resistente a impactos',
      protection: 'Filtro UV400 Categoría 3',
      measurements: 'Calibre: 54mm | Puente: 18mm | Patilla: 145mm',
      included: 'Estuche original, paño limpiador y garantía Lens Group Trujillo.'
    }
  },
  {
    id: 'prod-3',
    name: 'Montura Studio Blue Defense',
    brand: 'Inka Lens',
    category: 'monturas',
    categoryLabel: 'Monturas',
    price: 360,
    oldPrice: 420,
    tag: 'Salud Visual',
    image: 'assets/images/optics_acetate.jpg',
    specs: ['Filtro Luz Azul', 'Antirreflejo Digital', 'Acetato Liviano'],
    description: 'Especialmente calibrado para profesionales que pasan más de 6 horas al día frente a pantallas. Reduce la fatiga ocular, dolor de cabeza y mejora el descanso nocturno.',
    details: {
      material: 'Polímero ultraligero TR-90 flexible',
      lenses: 'Lunas Blue Protect Inka Lens con recubrimiento hidrofóbico',
      protection: 'Bloqueo del 40% de luz azul nociva + 100% UV',
      measurements: 'Calibre: 52mm | Puente: 17mm | Patilla: 140mm',
      included: 'Estuche protector, líquido limpiador antiestático y microfibra.'
    }
  },
  {
    id: 'prod-4',
    name: 'Fiorella Conte Cat-Eye Glamour',
    brand: 'Fiorella Conte',
    category: 'sol',
    categoryLabel: 'Gafas de Sol',
    price: 440,
    oldPrice: 510,
    tag: 'Tendencia 2026',
    image: 'assets/images/sunglasses_cateye.jpg',
    specs: ['Estilo Cat-Eye', 'Carey Habana', 'Lunas Marrón Cálido'],
    description: 'Silueta femenina estilizada en patrón carey con acentos dorados. Realza las facciones del rostro con un toque de sofisticación y distinción europea.',
    details: {
      material: 'Acetato italiano moldeado',
      lenses: 'Lunas orgánicas de policarbonato marrón degradé',
      protection: '100% Protección UV400',
      measurements: 'Calibre: 53mm | Puente: 16mm | Patilla: 140mm',
      included: 'Estuche de diseño Fiorella Conte, certificado oficial y garantía de fábrica.'
    }
  },
  {
    id: 'prod-5',
    name: 'Titanium Air Ultra-Lightweight',
    brand: 'D&L',
    category: 'monturas',
    categoryLabel: 'Monturas de Diseñador',
    price: 490,
    oldPrice: 560,
    tag: 'Titanio Puro',
    image: 'assets/images/optics_titanium.jpg',
    specs: ['Titanio Quirúrgico', 'Peso: 8.5g', 'Plaquetas de Silicona'],
    description: 'La máxima expresión del confort visual. Una montura que apenas se siente en el rostro gracias a su aleación de titanio aeroespacial con memoria de forma.',
    details: {
      material: 'Titanio puro hipoalergénico',
      lenses: 'Montura lista para graduación monofocal o progresiva digital',
      protection: 'Tratamiento anticorrosión al sudor y clima costero',
      measurements: 'Calibre: 51mm | Puente: 19mm | Patilla: 142mm',
      included: 'Estuche rígido D&L Eyewear y microfibra de alta densidad.'
    }
  },
  {
    id: 'prod-6',
    name: 'Oakley Holbrook Sport Performance',
    brand: 'Oakley',
    category: 'sol',
    categoryLabel: 'Gafas de Sol',
    price: 560,
    oldPrice: 620,
    tag: 'Rendimiento',
    image: 'assets/images/sunglasses_sport.jpg',
    specs: ['Lentes Prizm™', 'Marco O-Matter™', 'Agarre Unobtainium®'],
    description: 'Diseñado para entusiastas del deporte y actividades al aire libre. La tecnología Prizm™ realza los colores y contrastes del entorno para una visión nítida y segura.',
    details: {
      material: 'O-Matter™ termoplástico resistente a impactos extremos',
      lenses: 'Plutonite® Prizm Daily Polarized',
      protection: 'Protección UV 100% y norma ANSI Z87.1 contra impactos',
      measurements: 'Calibre: 57mm | Puente: 18mm | Patilla: 137mm',
      included: 'Bolsa de microfibra Microclear™ y garantía internacional Oakley.'
    }
  },
  {
    id: 'prod-7',
    name: 'Kit de Limpieza Profesional',
    brand: 'Lens Care',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 45,
    oldPrice: 65,
    tag: 'Más Vendido',
    image: 'assets/images/accesorio-1.jpg',
    specs: ['Spray Limpiador 60ml', 'Paño Microfibra Premium', 'Tela Limpiadora Antiestática'],
    description: 'Kit completo para el cuidado y mantenimiento diario de tus lentes. Incluye spray limpiador biodegradable de alta eficacia y paño de microfibra ultrafina que no raya las lunas.',
    details: {
      material: 'Paño de microfibra 320 GSM libre de pelusas',
      lenses: 'Compatible con lentes antireflex, polarizadas, fotocromáticas y con recubrimientos especiales',
      protection: 'Fórmula neutra sin alcohol — apta para todos los tratamientos',
      measurements: 'Spray: 60ml | Paño: 20×20cm',
      included: 'Spray limpiador, paño de microfibra premium y tela limpiadora de algodón.'
    }
  },
  {
    id: 'prod-8',
    name: 'Kevin Aviador Titanium Modern',
    brand: 'Kevin',
    category: 'monturas',
    categoryLabel: 'Monturas',
    price: 430,
    oldPrice: 490,
    tag: 'Novedad',
    image: 'assets/images/optics_acetate.jpg',
    specs: ['Doble Puente', 'Inyección Resistente', 'Diseño Urbano'],
    description: 'Montura vanguardista con doble puente estilizado y textura ergonómica en las patillas con acabados premium y máxima comodidad.',
    details: {
      material: 'Polímero termoplástico ultraligero y flexible',
      lenses: 'Adaptable a cualquier fórmula oftálmica computarizada',
      protection: 'Resistencia a deformaciones térmicas',
      measurements: 'Calibre: 55mm | Puente: 16mm | Patilla: 145mm',
      included: 'Estuche rígido Kevin Collection, paño de microfibra y garantía.'
    }
  },
  {
    id: 'prod-9',
    name: 'Estuche Rígido Premium',
    brand: 'Lens Group',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 35,
    oldPrice: 50,
    tag: 'Alta Protección',
    image: 'assets/images/accesorio-2.jpg',
    specs: ['Carcasa ABS Resistente', 'Interior Felpa Suave', 'Cierre Magnético'],
    description: 'Estuche rígido de alta resistencia con interior acolchado en felpa suave que protege tus lentes contra golpes, polvo y humedad. Diseño compacto con cierre magnético seguro.',
    details: {
      material: 'Exterior ABS de alto impacto | Interior felpa suave aterciopelada',
      lenses: 'Protege monturas de hasta 58mm de calibre',
      protection: 'Resistente a golpes, agua y polvo',
      measurements: 'Largo: 16cm | Ancho: 7cm | Alto: 5cm',
      included: 'Estuche rígido premium y paño limpiador de microfibra.'
    }
  }
];

const WHATSAPP_NUMBER = '51958169535';

function buildWhatsAppProductLink(product) {
  const text = `¡Hola Lens Group Trujillo! Me interesa consultar por este modelo:\n\n*${product.name}*\nMarca: ${product.brand}\nPrecio: S/ ${product.price}\n\n¿Tienen disponibilidad en su tienda de Trujillo o envíos? ¡Muchas gracias!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// ----------------------------------------------------------
// Render de productos (una sola pasada, SIN duplicar)
// ----------------------------------------------------------
function renderProducts(productList) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  if (productList.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-dark-400);">
        <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--color-dark-400);">${window.LG?.icon ? window.LG.icon('search', { size: 48 }) : ''}</div>
        <h3 style="margin-bottom: 0.5rem;">No encontramos modelos que coincidan</h3>
        <p>Prueba buscando con otro término o selecciona la categoría "Todos".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = productList.map(prod => `
    <article class="product-card" data-id="${prod.id}" data-category="${prod.category}">
      <div class="product-media">
        <span class="product-tag-badge ${prod.tag.includes('Vendido') ? 'badge-sale' : ''}">${prod.tag}</span>

        <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy">
        <div class="product-quick-actions">
          <button class="btn-icon-zoom" title="Ver en 3D interactivo y zoom" onclick="openProductModal('${prod.id}')" aria-label="Ver en 3D interactivo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="product-body">
        <h3 class="product-title">${prod.name}</h3>
        <div class="product-specs">
          ${prod.specs.map(s => `<span class="spec-chip">${s}</span>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price-box">
            <span class="product-price-label">Precio Especial</span>
            <div>
              <span class="product-price">S/ ${prod.price}</span>
              ${prod.oldPrice ? `<span class="product-price-old">S/ ${prod.oldPrice}</span>` : ''}
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; width: 100%;">
            <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="openProductModal('${prod.id}')">
              Detalle
            </button>
            <a href="${buildWhatsAppProductLink(prod)}" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp" style="flex: 1; justify-content: center;" title="Consultar por WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z"/>
              </svg>
              Cotizar
            </a>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

// ----------------------------------------------------------
// Filtros y búsqueda
// ----------------------------------------------------------
let currentFilter = 'todos'; // valid values: 'todos' | 'monturas' | 'sol' | 'accesorios'
let searchQuery = '';

function setupCatalogFilters() {
  const filterBtns = document.querySelectorAll('#catalogo .filter-btn');
  const searchInput = document.getElementById('catalogSearch');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      // Marca active en TODOS los botones con ese data-filter (del catálogo principal)
      document.querySelectorAll('#catalogo .filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === filter);
      });
      currentFilter = filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

function applyFilters() {
  let list = PRODUCTS;

  if (currentFilter !== 'todos') {
    list = list.filter(p => p.category === currentFilter);
  }

  if (searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.specs.some(s => s.toLowerCase().includes(searchQuery))
    );
  }

  renderProducts(list);
}

// ----------------------------------------------------------
// Init
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  setupCatalogFilters();
});

// ----------------------------------------------------------
// Catálogo de Niños — Datos para visor modal y cotización
// ----------------------------------------------------------
window.KIDS_PRODUCTS = [
  {
    id: 'kids-receta-1',
    name: 'Darleen Kids Flex Ultra',
    brand: 'Darleen Kids',
    category: 'monturas',
    categoryLabel: 'Monturas para Niños',
    price: 180,
    oldPrice: 220,
    tag: 'Silicona Flexible',
    image: 'assets/images/kids-receta-1.jpg',
    specs: ['Silicona Flexible 180°', 'Filtro Luz Azul Digital', 'Banda Sujetadora'],
    description: 'Montura de silicona irrompible hipoalergénica con bisagras de 180° de alta flexibilidad y banda elástica de sujeción para niños activos.',
    details: {
      material: 'Silicona médica hipoalergénica y flexible',
      lenses: 'Lunas Blue Protect con filtro UV400 y antirreflejo',
      protection: '100% UV400 + Filtro Luz Azul Digital',
      measurements: 'Calibre: 46mm | Puente: 15mm | Patilla: 125mm',
      included: 'Estuche rígido infantil, banda elástica y paño de microfibra.'
    }
  },
  {
    id: 'kids-receta-2',
    name: 'Tony Lu Kids Active Blue Block',
    brand: 'Tony Lu Kids',
    category: 'monturas',
    categoryLabel: 'Monturas para Niños',
    price: 195,
    oldPrice: 240,
    tag: 'Salud Visual Kids',
    image: 'assets/images/kids-receta-2.jpg',
    specs: ['TR-90 Ultraliviano', 'Filtro Pantallas', 'Puente Anatómico'],
    description: 'Montura ligera con estilo metálico pulido y polímero resistente para clases virtuales, uso de pantallas y protección diaria.',
    details: {
      material: 'TR-90 y aleación ultraligera con memoria anatómica',
      lenses: 'Lunas policarbonato con protección digital Blue Block',
      protection: '100% UV400 + 40% Luz Azul nociva',
      measurements: 'Calibre: 48mm | Puente: 16mm | Patilla: 130mm',
      included: 'Estuche oficial Tony Lu Kids y paño especial.'
    }
  },
  {
    id: 'kids-sol-1',
    name: 'DEBBY Kids Polarized Sun Junior',
    brand: 'DEBBY Kids',
    category: 'sol',
    categoryLabel: 'Gafas de Sol para Niños',
    price: 160,
    oldPrice: 195,
    tag: 'Protección UV400',
    image: 'assets/images/kids-sol-1.jpg',
    specs: ['Filtro UV400 100%', 'Lunas Polarizadas', 'Marco Antigolpes'],
    description: 'Gafas de sol para niños con lunas polarizadas de alta fidelidad que eliminan el brillo molesto y cuidan la retina infantil.',
    details: {
      material: 'Polímero engomado antigolpes',
      lenses: 'Polarizadas TAC con protección UV total',
      protection: '100% Protección UV400 Categoría 3',
      measurements: 'Calibre: 47mm | Puente: 16mm | Patilla: 128mm',
      included: 'Funda protectora DEBBY Kids y paño limpiador.'
    }
  },
  {
    id: 'kids-sol-2',
    name: 'DEBBY Kids Explorer Sport Solar',
    brand: 'DEBBY Kids',
    category: 'sol',
    categoryLabel: 'Gafas de Sol para Niños',
    price: 170,
    oldPrice: 210,
    tag: 'Resistente a Caídas',
    image: 'assets/images/kids-sol-2.jpg',
    specs: ['Goma Antideslizante', 'Lunas Antirayaduras', 'Protección UV Total'],
    description: 'Lentes solares deportivos infantiles diseñados para resistir caídas y brindar confort durante el juego y deportes.',
    details: {
      material: 'Acetato flexible con inserciones de goma antideslizante',
      lenses: 'Policarbonato solar resistente a impactos',
      protection: '100% UV400 categoría 3 deportiva',
      measurements: 'Calibre: 49mm | Puente: 15mm | Patilla: 130mm',
      included: 'Estuche protector deportivo y paño de microfibra.'
    }
  }
];