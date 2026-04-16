"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { Button } from "./Button";

const FALLBACK_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDwOVPqfQEB4oyVnlaP9tjGSog3mqdWEunFHLJjvpF3i1Wf5DOy7Ka7JYNxgQeI7Tmvvp2x8lWJx8_ZuU2epRa0N7LLXPRrWrhs6zid1_OtGV9_5MRwUVbmeAqVXd31cEHLQGrI65LCcXfzqpUUu2VPMSaPfOUrn1hZC-_qAzVLW04YypvrA0mQo3_xnx8eLtm6hZIHNGg4adLkAxvwe9iUX_57ley2k5MRZe-ieghZkTz9TCT5KugX9vzWSqDYfBL-dJEB_-wVs4U";

function ProductCard({ product, onAddToCart, isAdding, className }) {
  const renderStars = (rating) => {
    const num = parseFloat(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (num >= i) {
        stars.push(<span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>);
      } else if (num >= i - 0.5) {
        stars.push(<span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>);
      } else {
        stars.push(<span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>);
      }
    }
    return <div className="flex text-orange-500">{stars}</div>;
  };

  const img = (product.images && product.images[0]) || FALLBACK_IMAGE;

  return (
    <Card className={cn(
      "p-6 flex flex-col group hover:shadow-[0px_20px_40px_rgba(15,17,17,0.06)] transition-all duration-300",
      isAdding && "opacity-75 pointer-events-none",
      className
    )}>
      <Link href={`/product/${product.id}`} className="relative aspect-square mb-6 overflow-hidden rounded-lg block">
        <img 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
          alt={product.name} 
          src={img}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
      </Link>
      <div className="flex-1 flex flex-col">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-on-surface font-medium text-base mb-1 line-clamp-2 leading-snug hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.avg_rating)}
          <span className="text-xs text-outline font-medium">{product.review_count || 0}</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-on-surface">₹{product.effective_price || product.price}</span>
            {parseFloat(product.discount_pct) > 0 && (
              <span className="text-sm text-outline line-through">₹{product.price}</span>
            )}
          </div>
          <Button 
            variant="primary"
            className="w-full"
            onClick={() => onAddToCart && onAddToCart(product.id)}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { ProductCard };
