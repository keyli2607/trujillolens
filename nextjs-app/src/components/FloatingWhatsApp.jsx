export default function FloatingWhatsApp() {
  return (
    <div className="floating-whatsapp" id="floatingWhatsApp">
      <div className="whatsapp-bubble">
        ¡Hola! ¿Necesitas asesoría con tus lentes en Trujillo? Chatea con nosotros
      </div>
      <a
        href="https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo,%20deseo%20asesor%C3%ADa%20para%20elegir%20mis%20lentes."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-trigger-btn"
        aria-label="Abrir chat de WhatsApp de Lens Group Trujillo"
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
        </svg>
      </a>
    </div>
  );
}
