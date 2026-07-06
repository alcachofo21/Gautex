import { CheckoutPageContent } from "@/components/shop/CheckoutPageContent";

export const metadata = {
  title: "Checkout",
  description: "Complete your Gautex Medica order or request a B2B quote.",
};

interface Props {
  searchParams: Promise<{ success?: string }>;
}

export default async function EnCheckoutPage({ searchParams }: Props) {
  const { success } = await searchParams;
  return <CheckoutPageContent locale="en" paymentSuccess={success === "true"} />;
}
