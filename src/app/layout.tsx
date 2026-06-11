import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { corporate } from "@/lib/products";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: {
    default: "Gautex Medica — Repartiendo salud",
    template: "%s | Gautex Medica",
  },
  description:
    "Distribución y fabricación de productos sanitarios certificados CE. Preservativos, geles, tests COVID-19 y campañas personalizadas.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gautex.onrender.com"),
  openGraph: {
    title: "Gautex Medica — Repartiendo salud",
    description: "Productos sanitarios certificados para farmacia y sector hospitalario.",
    locale: "es_ES",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: corporate.company.name,
  slogan: corporate.company.slogan,
  telephone: corporate.company.phone,
  email: corporate.company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: corporate.company.address,
    addressLocality: "Barcelona",
    postalCode: "08007",
    addressCountry: "ES",
  },
  foundingDate: "2002",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <TopBar />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <CookieBanner />
      </body>
    </html>
  );
}
