"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileActionBar() {
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset + window.innerHeight * 0.4;
      const sectionIds = ["inicio", "catalogo", "simulador", "nosotros", "testimonios", "contacto", "seguimiento"];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="mobile-action-bar" id="mobileActionBar" aria-label="Acciones rápidas">
      <Link
        href="/#inicio"
        className={`mobile-action-btn ${activeSection === "inicio" ? "active" : ""}`}
        id="mab-inicio"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Inicio
      </Link>

      <Link
        href="/#catalogo"
        className={`mobile-action-btn ${activeSection === "catalogo" ? "active" : ""}`}
        id="mab-catalogo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="2" y="3" width="7" height="7" />
          <rect x="15" y="3" width="7" height="7" />
          <rect x="2" y="14" width="7" height="7" />
          <rect x="15" y="14" width="7" height="7" />
        </svg>
        Catálogo
      </Link>

      <a
        href="https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo,%20deseo%20asesor%C3%ADa%20para%20elegir%20mis%20lentes."
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-action-btn whatsapp-action"
        id="mab-whatsapp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
        </svg>
        WhatsApp
      </a>
      <Link
        href="/#testimonios"
        className={`mobile-action-btn ${activeSection === "testimonios" ? "active" : ""}`}
        id="mab-testimonios"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        Reseñas
      </Link>
      <Link
        href="/#contacto"
        className={`mobile-action-btn ${activeSection === "contacto" ? "active" : ""}`}
        id="mab-contacto"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Cita
      </Link>
    </nav>
  );
}
