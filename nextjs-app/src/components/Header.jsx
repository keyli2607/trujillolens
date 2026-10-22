"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? "scrolled" : ""}`} id="siteHeader">
        <div className="container navbar">
          {/* Brand Logo */}
          <Link href="/#inicio" className="nav-brand" title="Lens Group Trujillo" onClick={closeMenu}>
            <Image
              src="/images/logo.svg"
              alt="Lens Group Trujillo - Distribuidor Autorizado"
              width={160}
              height={44}
              priority
              className="brand-logo-img"
            />
          </Link>

          {/* Navigation Links */}
          <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`} id="navMenu">
            <button
              className="mobile-close-btn"
              id="mobileCloseBtn"
              aria-label="Cerrar menú"
              onClick={closeMenu}
            >
              &times;
            </button>

            <div className="nav-menu-divider"></div>
            <Link href="/#inicio" className="nav-link" onClick={closeMenu}>
              Inicio
            </Link>
            <Link href="/#simulador" className="nav-link" onClick={closeMenu}>
              Simulador de Lunas
            </Link>
            <Link href="/#nosotros" className="nav-link" onClick={closeMenu}>
              Nosotros
            </Link>
            <Link href="/#testimonios" className="nav-link" onClick={closeMenu}>
              Testimonios
            </Link>
            <Link href="/#contacto" className="nav-link" onClick={closeMenu}>
              Contacto
            </Link>
            <Link href="/seguimiento" className="nav-link" title="Seguimiento de Pedido" onClick={closeMenu}>
              Seguimiento
            </Link>

            {/* Mobile Drawer CTA */}
            <div className="nav-menu-divider"></div>
            <Link href="/#contacto" className="btn btn-primary drawer-contact-btn" onClick={closeMenu}>
              Agendar Cita en Trujillo
            </Link>
            <Link href="/admin.html" className="btn btn-outline drawer-contact-btn" style={{ marginTop: "0.5rem" }} onClick={closeMenu}>
              Portal Staff
            </Link>
          </nav>

          {/* Nav Actions */}
          <div className="nav-actions">
            <a
              href="https://wa.me/51958169535?text=Hola%20Lens%20Group%20Trujillo,%20deseo%20m%C3%A1s%20informaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              title="Atención directa por WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.776.84 2.8.84 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.766-5.772-5.766zm8.845 5.767c-.002 4.887-3.974 8.859-8.861 8.859-1.547 0-3.056-.408-4.381-1.182l-4.872 1.278 1.301-4.747c-.854-1.378-1.309-2.977-1.31-4.208 0-4.888 3.973-8.86 8.861-8.86 4.888.001 8.862 3.973 8.862 8.86z" />
              </svg>
              WhatsApp
            </a>
            <Link href="/#contacto" className="btn btn-navy btn-sm btn-contact">
              Agendar Cita
            </Link>

          </div>
        </div>
      </header>

      {/* Overlay para menú mobile */}
      <div
        className={`nav-menu-overlay ${isMenuOpen ? "active" : ""}`}
        id="navMenuOverlay"
        onClick={closeMenu}
      ></div>
    </>
  );
}
