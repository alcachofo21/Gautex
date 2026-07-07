import { CheckoutPageContent } from "@/components/shop/CheckoutPageContent";

export const metadata = {
  title: "Checkout",
  description: "Finaliza tu pedido o solicita presupuesto B2B en Gautex Medica.",
};

interface Props {
  searchParams: Promise<{ success?: string; provider?: string; session_id?: string; error?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { success, provider, session_id, error } = await searchParams;
  return (
    <CheckoutPageContent
      locale="es"
      paymentSuccess={success === "true"}
      paymentProvider={provider === "stripe" || provider === "paypal" ? provider : undefined}
      stripeSessionId={session_id}
      paymentError={error === "paypal" ? "paypal" : undefined}
    />
  );
}
