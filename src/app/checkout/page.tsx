import { CheckoutPageContent } from "@/components/shop/CheckoutPageContent";

export const metadata = {
  title: "Checkout",
  description: "Finaliza tu pedido o solicita presupuesto B2B en Gautex Medica.",
};

interface Props {
  searchParams: Promise<{ success?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { success } = await searchParams;
  return <CheckoutPageContent locale="es" paymentSuccess={success === "true"} />;
}
