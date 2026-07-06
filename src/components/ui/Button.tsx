import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/25",
  secondary: "bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20",
  outline: "border-2 border-primary/25 text-primary hover:border-primary hover:bg-primary/5",
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
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-[0.98]",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  const { onClick, ...rest } = props;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
