"use client";

import React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "secondary", children, ...props }) {
  const variants = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-surface-container-high text-on-surface-variant",
    error: "bg-error-container text-on-error-container",
    outline: "border border-outline text-on-background",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
