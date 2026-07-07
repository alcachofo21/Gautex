import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  fullWidth?: boolean;
}

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover shadow-md",
  secondary: "bg-primary text-white hover:bg-primary-dark shadow-md",
  outline: "border-2 border-primary text-primary hover:bg-primary/5",
  ghost: "text-text hover:bg-black/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm min-h-[44px]",
  md: "px-6 py-3 text-base min-h-[48px]",
  lg: "px-8 py-4 text-lg min-h-[52px]",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  fullWidth,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
