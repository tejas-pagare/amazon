"use client";

import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = {
    primary: "bg-primary-container text-on-primary-container hover:bg-opacity-90 active:scale-95 shadow-sm",
    secondary: "bg-secondary-container text-on-secondary-container hover:bg-opacity-90 active:scale-95",
    outline: "border border-outline text-on-background hover:bg-surface-container-high active:scale-95",
    ghost: "text-on-surface-variant hover:bg-surface-container-high",
    link: "text-primary hover:underline p-0 h-auto",
    error: "bg-error text-white hover:bg-opacity-90 active:scale-95",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
    icon: "p-2",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
