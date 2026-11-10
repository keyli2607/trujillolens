/* ==========================================================================
   LENS GROUP TRUJILLO — VISOR MODAL DE PRODUCTO (IMAGEN DIRECTA)
   ========================================================================== */

let activeProduct = null;

function openProductModal(productId) {
  activeProduct = (typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(p => p.id === productId) : null)
    || (window.KIDS_PRODUCTS ? window.KIDS_PRODUCTS.find(p => p.id === productId) : null);
  if (!activeProduct) return;

  const modal = document.getElementById('productModal');
  const imgEl = document.getElementById('modalZoomImage');
  const brandEl = document.getElementById('modalBrand');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const priceEl = document.getElementById('modalPrice');
  const oldPriceEl = document.getElementById('modalOldPrice');
  const tagEl = document.getElementById('modalTag');
  const specsListEl = document.getElementById('modalSpecsList');
  const waBtn = document.getElementById('modalWhatsAppBtn');

  // Cargar contenido de imagen y texto
  imgEl.src = activeProduct.image;
  imgEl.alt = activeProduct.name;
  if (brandEl) brandEl.textContent = `${activeProduct.brand} • ${activeProduct.categoryLabel}`;
  titleEl.textContent = activeProduct.name;
  descEl.textContent = activeProduct.description;
  priceEl.textContent = `S/ ${activeProduct.price}`;
  
  if (activeProduct.oldPrice) {
    oldPriceEl.textContent = `S/ ${activeProduct.oldPrice}`;
    oldPriceEl.style.display = 'inline';
  } else {
    oldPriceEl.style.display = 'none';
  }

  if (tagEl) {
    if (activeProduct.tag) {
      tagEl.textContent = activeProduct.tag;
      tagEl.style.display = 'inline-block';
    } else {
      tagEl.textContent = '';
      tagEl.style.display = 'none';
    }
  }

  // Renderizar especificaciones técnicas
  const details = activeProduct.details;
  specsListEl.innerHTML = `
    <div class="modal-spec-row">
      <span class="modal-spec-label">Material de Montura</span>
      <span class="modal-spec-value">${details.material}</span>
    </div>
    <div class="modal-spec-row">
      <span class="modal-spec-label">Tratamiento de Cristales</span>
      <span class="modal-spec-value">${details.lenses}</span>
    </div>
    <div class="modal-spec-row">
      <span class="modal-spec-label">Nivel de Protección</span>
      <span class="modal-spec-value">${details.protection}</span>
    </div>
    <div class="modal-spec-row">
      <span class="modal-spec-label">Dimensiones Oficiales</span>
      <span class="modal-spec-value">${details.measurements}</span>
    </div>
    <div class="modal-spec-row">
      <span class="modal-spec-label">Accesorios Incluidos</span>
      <span class="modal-spec-value">${details.included}</span>
    </div>
  `;

  // Botón WhatsApp con enlace de cotización directa
  waBtn.href = buildWhatsAppProductLink(activeProduct);

  // Mostrar modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Inicialización de listeners para cerrar el modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProductModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
    }
  });
});
