import type { CartItem } from "@/types";

export type PaymentProvider = "paypal";

export interface PricedCartLine {
  item: CartItem;
  productId: string;
  name: string;
  quantity: number;
  unitAmountCents: number;
  currency: "eur";
}

export interface CartPricing {
  payable: boolean;
  unpublishable: string[];
  lines: PricedCartLine[];
  totalCents: number;
  currency: "eur";
}

export interface EnabledPaymentMethod {
  id: PaymentProvider;
  label: string;
  description: string;
  brands?: string[];
}
