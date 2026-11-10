/* ==========================================================================
   LENS GROUP TRUJILLO — MICRO FRAMEWORK DE COMPONENTES (LG)
   --------------------------------------------------------------------------
   Utilidades mínimas para construir la interfaz desde JavaScript:
     - LG.html   : template tag que acepta arrays, null y false.
     - LG.each   : mapea una lista a HTML.
     - LG.attrs  : convierte un objeto en atributos HTML.
     - LG.esc    : escapa texto para insertarlo de forma segura.
     - LG.wa     : genera enlaces de WhatsApp.
     - LG.mount  : reemplaza un contenedor por los componentes renderizados.
   Se carga como script clásico (sin módulos) para funcionar también
   abriendo los archivos directamente desde el disco.
   ========================================================================== */
(function () {
  'use strict';

  const LG = (window.LG = window.LG || {});
  LG.components = LG.components || {};
  LG.data = LG.data || {};

  /** Convierte cualquier valor en HTML (arrays se unen, null/false se omiten). */
  LG.toHtml = function toHtml(value) {
    if (Array.isArray(value)) return value.map(toHtml).join('');
    if (value === null || value === undefined || value === false) return '';
    return String(value);
  };

  /** Template tag: LG.html`<div>${valor}</div>` */
  LG.html = (strings, ...values) =>
    strings.reduce((out, str, i) => out + str + (i < values.length ? LG.toHtml(values[i]) : ''), '');

  /** Renderiza una lista con una función plantilla. */
  LG.each = (list, render) => (list || []).map(render).join('');

  /** Escapa caracteres especiales de HTML. */
  LG.esc = (text) =>
    String(text ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  /** { id: 'x', required: true, hidden: false } -> ' id="x" required' */
  LG.attrs = (obj = {}) =>
    Object.entries(obj)
      .filter(([, v]) => v !== false && v !== null && v !== undefined)
      .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${LG.esc(v)}"`))
      .join('');

  /** Enlace de WhatsApp al número oficial con mensaje prellenado. */
  LG.wa = (message) => {
    const phone = LG.data.site?.contact?.whatsapp || '';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  /**
   * Reemplaza el elemento `target` por el HTML de los componentes.
   * Los componentes quedan como hijos directos de <body>, igual que antes,
   * para no romper estilos (position: sticky, selectores, etc.).
   */
  LG.mount = (target, parts) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) {
      console.error(`[LG] No se encontró el contenedor ${target}`);
      return;
    }
    const markup = parts.map((part) => (typeof part === 'function' ? part() : part)).join('\n');
    el.insertAdjacentHTML('beforebegin', markup);
    el.remove();
  };
})();
