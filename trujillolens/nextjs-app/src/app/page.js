import TopBar from "../components/TopBar";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import BrandsSection from "../components/BrandsSection";
import CatalogSection from "../components/CatalogSection";
import LensSimulator from "../components/LensSimulator";
import AboutSection from "../components/AboutSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import TrackingSection from "../components/TrackingSection";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import MobileActionBar from "../components/MobileActionBar";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <HeroSection />
        <BrandsSection />
        <CatalogSection />
        <LensSimulator />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <TrackingSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
