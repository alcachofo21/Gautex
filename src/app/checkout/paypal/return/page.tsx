import { redirect } from "next/navigation";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { sendPurchaseEmails } from "@/lib/email";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function PayPalReturnPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) redirect("/carrito");

  try {
    const result = await capturePayPalOrder(token);
    if (result.status === "COMPLETED") {
      const emailResult = await sendPurchaseEmails({
        provider: "paypal",
        orderId: token,
        locale: "es",
        totalCents: result.totalCents,
        customerEmail: result.payerEmail,
        customerName: result.payerName,
        itemsSummary: result.itemsSummary,
      });
      if (!emailResult.ok) {
        console.error("[PAYPAL RETURN] Email failed:", emailResult.error);
      }
      redirect("/checkout?success=true&provider=paypal");
    }
  } catch (error) {
    console.error("[PAYPAL RETURN]", error);
  }

  redirect("/checkout?error=paypal");
}
