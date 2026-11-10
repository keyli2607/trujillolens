import TopBar from "../../components/TopBar";
import Header from "../../components/Header";
import TrackingSection from "../../components/TrackingSection";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import MobileActionBar from "../../components/MobileActionBar";

export const metadata = {
  title: "Seguimiento de Pedido | Lens Group Trujillo",
  description:
    "Consulta el estado en tiempo real de tu pedido de lentes en Lens Group Trujillo. Ingresa tu código de seguimiento y conoce en qué etapa se encuentra tu orden.",
  keywords: [
    "seguimiento pedido optica trujillo",
    "estado lentes trujillo",
    "lens group trujillo seguimiento",
    "codigo orden optica",
  ],
  openGraph: {
    title: "Seguimiento de Pedido | Lens Group Trujillo",
    description:
      "Consulta el estado de tu pedido en nuestra óptica autorizada en Trujillo, Perú.",
    type: "website",
  },
};

export default function SeguimientoPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main style={{ minHeight: "75vh", paddingTop: "2rem" }}>
        <TrackingSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
