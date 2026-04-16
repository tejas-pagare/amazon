"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationResults() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      {/* Success Animation Placeholder / Icon */}
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-10 animate-bounce-slow">
        <span className="material-symbols-outlined text-5xl text-primary font-bold">check_circle</span>
      </div>

      <h1 className="text-5xl font-headline font-black tracking-tighter mb-6 text-on-surface">Thank you for your order!</h1>
      <p className="text-xl text-on-surface-variant mb-12 max-w-xl mx-auto leading-relaxed">
        Your order <span className="font-bold text-on-surface">#{orderId?.toString().padStart(6, '0')}</span> has been placed successfully and is being processed.
      </p>

      <div className="bg-surface-container-low p-8 rounded-3xl border border-surface-container-high w-full max-w-md mb-12">
        <h3 className="font-bold text-lg mb-4">What happens next?</h3>
        <ul className="text-sm space-y-4 text-left">
          <li className="flex gap-4">
            <span className="material-symbols-outlined text-primary">mail</span>
            <span>A confirmation email has been sent to your registered email address.</span>
          </li>
          <li className="flex gap-4">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span>You'll receive another update once your items have shipped.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link 
          href="/orders" 
          className="bg-primary text-on-primary font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          Track your order
        </Link>
        <Link 
          href="/" 
          className="bg-surface-container-highest text-on-surface font-bold px-10 py-4 rounded-full border border-surface-container-high hover:bg-surface-container-high transition-all active:scale-95"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="mt-16 text-on-surface-variant flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">info</span>
        <p className="text-[11px] uppercase tracking-widest font-medium">Need help? Contact our 24/7 support team</p>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading confirmation...</div>}>
      <ConfirmationResults />
    </Suspense>
  );
}
