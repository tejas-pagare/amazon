"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(); // Uses mock global state
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-8 px-4 bg-surface text-on-surface font-body">
      {/* Brand Header */}
      <header className="mb-5">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black italic tracking-tighter text-[#131921] flex items-center">
          <Link href="/" className="flex items-center justify-center group transition-transform active:scale-95 pt-2">
            <img 
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" 
              alt="Amazon Logo"
              className="w-32 h-10 object-contain brightness-0 filter" 
            />
          </Link>
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-[350px] bg-surface-container-lowest border border-surface-container-highest rounded-lg p-5 shadow-sm">
        <h1 className="text-[28px] font-bold leading-tight mb-4 text-on-surface">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-on-surface" htmlFor="email">
              Email or mobile phone number
            </label>
            <input 
              className="w-full h-8 px-2 py-1.5 border border-outline rounded-sm text-sm focus:outline-none focus:border-primary-container focus:ring-[3px] focus:ring-primary-container/20 transition-all duration-200" 
              id="email" 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Mock login (any input works)"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-secondary-container hover:bg-[#F7CA00] active:bg-[#F0B800] text-on-secondary-fixed py-1.5 rounded-xl text-sm font-medium transition-colors shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] cursor-pointer"
          >
            Continue
          </button>
        </form>

        {/* Legal Notice */}
        <div className="mt-4">
          <p className="text-[12px] leading-snug text-on-surface-variant">
            By continuing, you agree to Amazon's{' '}
            <a className="text-primary hover:text-primary-container hover:underline decoration-primary-container cursor-pointer">Conditions of Use</a>{' '}
            and{' '}
            <a className="text-primary hover:text-primary-container hover:underline decoration-primary-container cursor-pointer">Privacy Notice</a>.
          </p>
        </div>

        {/* Help */}
        <div className="mt-6 border-t border-surface-container-low pt-4">
          <details className="group">
            <summary className="flex items-center text-sm text-primary hover:text-primary-container hover:underline cursor-pointer list-none">
              <span className="material-symbols-outlined text-[16px] transition-transform group-open:rotate-90">play_arrow</span>
              <span className="ml-1">Need help?</span>
            </summary>
            <div className="pl-5 pt-2 space-y-1">
              <a className="block text-xs text-primary hover:text-primary-container hover:underline cursor-pointer">Forgot your password?</a>
              <a className="block text-xs text-primary hover:text-primary-container hover:underline cursor-pointer">Other issues with Sign-In</a>
            </div>
          </details>
        </div>
      </main>

      {/* New to Section */}
      <div className="w-full max-w-[350px] mt-6 flex flex-col items-center">
        <div className="relative w-full mb-3 flex items-center justify-center">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container-highest"></div>
          </div>
          <div className="relative px-2 bg-surface">
            <span className="text-xs text-on-surface-variant">New to Amazon?</span>
          </div>
        </div>
        <button className="w-full text-center bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant py-1.5 rounded-xl text-sm font-medium transition-all shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] cursor-pointer">
          Create your Amazon account
        </button>
      </div>
      
      {/* Footer */}
      <footer className="w-full mt-8 py-8 border-t border-surface-container-low">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-6">
            <a className="text-xs text-primary hover:text-primary-container hover:underline cursor-pointer">Conditions of Use</a>
            <a className="text-xs text-primary hover:text-primary-container hover:underline cursor-pointer">Privacy Notice</a>
            <a className="text-xs text-primary hover:text-primary-container hover:underline cursor-pointer">Help</a>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            © 1996-2024 Amazon, Inc. or its affiliates
          </p>
        </div>
      </footer>
    </div>
  );
}
