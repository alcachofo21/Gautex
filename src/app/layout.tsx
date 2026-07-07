import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { LocaleSync } from "@/components/layout/LocaleSync";
import { SkipLink } from "@/components/layout/SkipLink";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { corporate } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
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
  icons: {
    icon: "/images/logo/gautex.webp",
    apple: "/images/logo/gautex.webp",
  },
  metadataBase: new URL(absoluteUrl("/")),
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      es: absoluteUrl("/"),
      en: absoluteUrl("/en"),
      "x-default": absoluteUrl("/"),
    },
  },
  openGraph: {
    title: "Gautex Medica — Repartiendo salud",
    description: "Productos sanitarios certificados para farmacia y sector hospitalario.",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/hero/condones-seguro.webp",
        width: 1280,
        height: 720,
        alt: "Gautex Medica — Productos sanitarios certificados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/hero/condones-seguro.webp"],
  },
  verification: {
    google: "d4vwHHQu4itMGMEAxovFaR-d5KRbr2nIIuZBYLt98DY",
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
    streetAddress: `${corporate.company.street}, ${corporate.company.floor}, ${corporate.company.office}`,
    addressLocality: corporate.company.city,
    postalCode: corporate.company.postalCode,
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
        <LocaleSync />
        <SkipLink />
        <TopBar />
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <CookieBanner />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
