import { redirect } from "next/navigation";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { sendEmail } from "@/lib/email";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function PayPalReturnPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) redirect("/carrito");

  try {
    const result = await capturePayPalOrder(token);
    if (result.status === "COMPLETED") {
      await sendEmail({
        subject: `[Gautex] Pago PayPal completado — ${token}`,
        html: `<p>Pago recibido vía PayPal.</p><p>Pedido: ${token}</p><p>Email: ${result.payerEmail || "—"}</p>`,
        text: `PayPal order ${token}`,
      });
      redirect("/checkout?success=true&provider=paypal");
    }
  } catch (error) {
    console.error("[PAYPAL RETURN]", error);
  }

  redirect("/checkout?error=paypal");
}
