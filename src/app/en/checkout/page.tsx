import { Suspense } from "react";
import { CheckoutPageContent } from "@/components/shop/CheckoutPageContent";
import { getUi } from "@/lib/locale";

export const metadata = {
  title: "Checkout",
  description: "Complete your Gautex Medica order or request a B2B quote.",
};

export default function EnCheckoutPage() {
  const t = getUi("en").checkout;

  return (
    <Suspense fallback={<div className="container-page py-20 text-center">{t.loading}</div>}>
      <CheckoutPageContent locale="en" />
    </Suspense>
  );
}
