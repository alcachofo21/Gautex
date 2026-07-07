"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { ProductImage } from "./ProductImage";

interface ProductImageLightboxProps {
  src?: string;
  alt: string;
  color: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export function ProductImageLightbox({
  src,
  alt,
  color,
  className,
  sizes,
  priority,
  quality,
}: ProductImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => src && setOpen(true)}
        className={`group relative block w-full text-left ${src ? "cursor-zoom-in" : "cursor-default"}`}
        aria-label={src ? `Ampliar imagen de ${alt}` : undefined}
        disabled={!src}
      >
        <ProductImage
          src={src}
          alt={alt}
          color={color}
          className={className}
          sizes={sizes}
          priority={priority}
          quality={quality}
        />
        {src && (
          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-5 w-5" />
          </span>
        )}
      </button>

      {open && src && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[90vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
              <Image src={src} alt={alt} fill className="object-contain p-8" sizes="90vw" quality={90} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
