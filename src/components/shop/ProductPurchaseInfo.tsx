import { ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { canPurchaseOnline } from "@/lib/products";
import { getUi, localizedPath, type Locale } from "@/lib/locale";
import type { Product } from "@/types";

interface ProductPurchaseInfoProps {
  product: Product;
  locale?: Locale;
}

export function ProductPurchaseInfo({ product, locale = "es" }: ProductPurchaseInfoProps) {
  const ui = getUi(locale).productPage.purchaseInfo;
  const purchasable = canPurchaseOnline(product);

  return (
    <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-5">
      <h2 className="font-display text-base font-bold text-primary">{ui.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {purchasable ? ui.onlineDesc : ui.quoteDesc}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {purchasable ? (
          <div className="flex items-center gap-2 text-sm font-medium text-text">
            <ShoppingCart className="h-4 w-4 text-primary" />
            {ui.onlineCta}
          </div>
        ) : (
          <Button href={localizedPath("/contacto", locale)} size="sm" variant="secondary">
            <FileText className="h-4 w-4" />
            {ui.quoteCta}
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-text-muted">{ui.priceNote}</p>
    </div>
  );
}
