import { CartPageContent } from "@/components/shop/CartPageContent";

export const metadata = {
  title: "Carrito",
  description: "Tu carrito de compra en Gautex Medica.",
};

export default function CarritoPage() {
  return <CartPageContent locale="es" />;
}
