import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://lensgrouptrujillo.com"),
  title: "Lens Group Trujillo | Óptica y Distribuidor Autorizado de Lentes en Trujillo",
  description:
    "Distribuidor autorizado de lentes y gafas de sol en Trujillo, Perú. Monturas de diseñador, lentes con receta, examen visual computarizado y garantía oficial de las mejores marcas.",
  keywords: [
    "optica trujillo",
    "lentes trujillo",
    "gafas de sol trujillo",
    "ray-ban trujillo",
    "oakley trujillo",
    "monturas opticas trujillo",
    "examen de la vista trujillo",
    "lens group trujillo",
  ],
  authors: [{ name: "Lens Group Trujillo" }],
  openGraph: {
    title: "Lens Group Trujillo | Distribuidor Autorizado",
    description:
      "Especialistas en salud visual y estilo. Gafas de sol polarizadas, lentes oftálmicos con filtro azul y monturas de alta gama en Trujillo.",
    images: ["/images/hero_eyewear.jpg"],
    type: "website",
  },
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script src="/js/core/anti-inspect.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
