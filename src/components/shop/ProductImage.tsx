import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  color: string;
  letter?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  color,
  letter,
  className,
  sizes = "(max-width: 640px) 50vw, 25vw",
  priority = false,
}: ProductImageProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-2"
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ backgroundColor: `${color}15` }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg sm:h-20 sm:w-20"
        style={{ backgroundColor: color }}
      >
        {letter || alt.charAt(0)}
      </div>
    </div>
  );
}
