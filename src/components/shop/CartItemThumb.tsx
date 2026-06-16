"use client";

import Image from "next/image";
import type { CartItem } from "@/types";
import { cn } from "@/lib/utils";

interface CartItemThumbProps {
  item: CartItem;
  className?: string;
}

export function CartItemThumb({ item, className }: CartItemThumbProps) {
  if (item.image) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-xl bg-[#fafafa]", className)}>
        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" quality={75} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-xl font-bold text-white", className)}
      style={{ backgroundColor: item.color }}
    >
      {item.name.charAt(0)}
    </div>
  );
}
