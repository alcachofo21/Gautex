import { redirect } from "next/navigation";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { sendEmail } from "@/lib/email";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function EnPayPalReturnPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) redirect("/en/carrito");

  try {
    const result = await capturePayPalOrder(token);
    if (result.status === "COMPLETED") {
      await sendEmail({
        subject: `[Gautex] PayPal payment completed — ${token}`,
        html: `<p>Payment received via PayPal.</p><p>Order: ${token}</p><p>Email: ${result.payerEmail || "—"}</p>`,
        text: `PayPal order ${token}`,
      });
      redirect("/en/checkout?success=true&provider=paypal");
    }
  } catch (error) {
    console.error("[PAYPAL RETURN]", error);
  }

  redirect("/en/checkout?error=paypal");
}
