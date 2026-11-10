/* ==========================================================================
   LENS GROUP TRUJILLO — SISTEMA DE PROTECCIÓN DE CÓDIGO Y ANTI-INSPECCIÓN
   --------------------------------------------------------------------------
   Restringe la inspección del DOM, atajos de desarrollador, clic derecho,
   descarga de código fuente HTML/JS y exposición de datos en consola.
   ========================================================================== */
(function () {
  'use strict';

  // 1. Deshabilitar Clic Derecho (Menú Contextual)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);

  // 2. Deshabilitar Selección y Arrastre de Elementos
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  }, false);

  // 3. Bloqueo de Atajos de Teclado de Desarrollador
  window.addEventListener('keydown', function (e) {
    // Tecla F12 (DevTools)
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const key = (e.key || '').toLowerCase();
    const code = e.keyCode || e.which;

    // Ctrl + Shift + I (Inspeccionar)
    // Ctrl + Shift + J (Consola)
    // Ctrl + Shift + C (Selector de elementos)
    // Ctrl + Shift + K (Consola Firefox)
    if (isCtrlOrCmd && isShift && (key === 'i' || key === 'j' || key === 'c' || key === 'k' || code === 73 || code === 74 || code === 67 || code === 75)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + U (Ver código fuente HTML)
    if (isCtrlOrCmd && (key === 'u' || code === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + S (Guardar página como HTML)
    if (isCtrlOrCmd && (key === 's' || code === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + P (Imprimir pantalla) - Permitir solo si el modal de ticket está imprimiendo
    if (isCtrlOrCmd && (key === 'p' || code === 80)) {
      if (!document.getElementById('printableInvoice')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + A (Seleccionar todo) - Permitir únicamente dentro de inputs o textareas
    if (isCtrlOrCmd && (key === 'a' || code === 65)) {
      const tag = (e.target && e.target.tagName) || '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.target?.isContentEditable) {
        e.preventDefault();
        return false;
      }
    }
  }, true);

  // 4. Sanitización y Ocultamiento de la Consola del Navegador
  (function sanitizeConsole() {
    try {
      if (window.sessionStorage && window.sessionStorage.getItem('lg_admin_debug') === 'true') {
        return; // Permite depuración interna si existe sesión autorizada
      }
    } catch (_) {}

    const noop = function () {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'dir', 'trace'];
    methods.forEach(function (m) {
      try {
        window.console[m] = noop;
      } catch (_) {}
    });

    try {
      window.console.clear();
    } catch (_) {}
  })();

  // 5. Inyección de Reglas CSS de Protección Visual
  (function injectProtectionStyles() {
    const css = `
      html, body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      input, textarea, select, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      img {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto;
      }
    `;
    const style = document.createElement('style');
    style.id = 'lg-anti-inspect-styles';
    style.textContent = css;
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.head.appendChild(style);
      });
    }
  })();

  // 6. Detección Inteligente de DevTools
  (function monitorDevTools() {
    let triggered = false;
    const threshold = 160;

    function verify() {
      const widthExceeded = window.outerWidth - window.innerWidth > threshold;
      const heightExceeded = window.outerHeight - window.innerHeight > threshold;
      if (widthExceeded || heightExceeded) {
        if (!triggered) {
          triggered = true;
          try {
            window.console.clear();
          } catch (_) {}
        }
      } else {
        triggered = false;
      }
    }

    window.addEventListener('resize', verify);
    setInterval(verify, 1500);
  })();

  // 7. Protección de Frame (Anti-Clickjacking en navegadores antiguos)
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (_) {}
})();
