import { CheckoutPageContent } from "@/components/shop/CheckoutPageContent";

export const metadata = {
  title: "Checkout",
  description: "Complete your Gautex Medica order or request a B2B quote.",
};

interface Props {
  searchParams: Promise<{ success?: string; provider?: string; session_id?: string; error?: string }>;
}

export default async function EnCheckoutPage({ searchParams }: Props) {
  const { success, provider, session_id, error } = await searchParams;
  return (
    <CheckoutPageContent
      locale="en"
      paymentSuccess={success === "true"}
      paymentProvider={provider === "stripe" || provider === "paypal" ? provider : undefined}
      stripeSessionId={session_id}
      paymentError={error === "paypal" ? "paypal" : undefined}
    />
  );
}
