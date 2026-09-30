import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "whatsapp";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2";

    const variants = {
      primary:
        "bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-orange-600/20 hover:shadow-md",
      secondary:
        "bg-stone-100 hover:bg-stone-200 text-stone-800",
      outline:
        "border border-stone-300 hover:border-orange-500 hover:bg-orange-50/50 text-stone-700 hover:text-orange-700",
      ghost:
        "hover:bg-stone-100 text-stone-600 hover:text-stone-900",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-600/20",
      whatsapp:
        "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow-emerald-600/20 hover:shadow-md font-semibold",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs sm:text-sm gap-1.5",
      md: "h-11 px-4 text-sm sm:text-base gap-2",
      lg: "h-13 px-6 text-base sm:text-lg gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
