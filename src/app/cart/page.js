"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { fetchApi } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, fetchCart } = useCart();
  const { currentUser } = useAuth();
  
  const { addToast } = useToast();
  // Map: loadingKey -> true. Keys are like "dec-5", "inc-5", "del-5"
  const [loadingKeys, setLoadingKeys] = useState({});

  const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCex6xyDHZZitOVcES-5_rYMWAmw31sLP89VuOigXyxi6V7rrFabDZdvSd7V72VCdgoM_DMvRgpTCpa-Fg5u0giLZla7bsDrwEDkyTH6XO2hW1WpzrjUMX3KHq5pA9K87_N18M6NoPbRxhqExR-SyxSQT37-qZaIl5aR0pYEdrfGDWn2mj-hIKdvCsqOQFP-2PETNiWpHstQeeT0Ni7byvwqVKDEUbUaeYai8lyBDvCOtXYsgNKnppJN_C21e-h9GfWyfoGnHDwkwY";

  const setKey = (key, val) => setLoadingKeys(prev => ({ ...prev, [key]: val }));

  const handleUpdateQuantity = async (itemId, newQuantity, direction) => {
    if (newQuantity < 1) return;
    const key = `${direction}-${itemId}`;
    setKey(key, true);
    try {
      await fetchApi(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ user_id: currentUser.id, quantity: newQuantity })
      });
      await fetchCart();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setKey(key, false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!currentUser) return;
    const key = `del-${itemId}`;
    setKey(key, true);
    try {
      await fetchApi(`/cart/${itemId}?user_id=${currentUser.id}`, {
        method: "DELETE",
      });
      await fetchCart();
      addToast("Item removed from cart");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setKey(key, false);
    }
  };

  if (!currentUser) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">shopping_cart</span>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-on-surface-variant mb-6">Sign in to add items to your cart.</p>
        <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold cursor-pointer hover:bg-opacity-90">Sign in now</button>
      </main>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-medium">Loading your cart...</div>;
  }

  const items = cart.items || [];
  const taxNumber = parseFloat(cart.subtotal) * 0.18;
  const tax = taxNumber.toFixed(2);
  const total = (parseFloat(cart.subtotal) + taxNumber).toFixed(2);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-[3.5rem] font-bold tracking-[-0.02em] text-on-surface leading-none">Shopping Cart</h1>
        <p className="text-on-surface-variant font-medium mt-2">Check out your curated selection before final delivery.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-8 space-y-6">
          {items.length === 0 ? (
             <div className="bg-surface-container-lowest p-12 text-center rounded-xl border border-outline-variant/30">
               <span className="material-symbols-outlined text-4xl text-outline mb-2">production_quantity_limits</span>
               <h3 className="text-xl font-bold">Your cart is empty</h3>
               <Link href="/" className="text-primary font-bold hover:underline mt-4 inline-block">Continue Shopping</Link>
             </div>
          ) : (
            <>
              {items.map(item => {
                const imgUrl = (item.images && item.images.length > 0) ? item.images[0] : fallbackImage;
                const isDecLoading = loadingKeys[`dec-${item.id}`];
                const isIncLoading = loadingKeys[`inc-${item.id}`];
                const isDelLoading = loadingKeys[`del-${item.id}`];
                const isAnyLoading = isDecLoading || isIncLoading || isDelLoading;
                
                return (
                  <div key={item.id} className={`bg-surface-container-lowest p-6 transition-all duration-300 ease-in-out group rounded-xl ${isAnyLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <Link href={`/product/${item.product_id}`} className="w-full md:w-48 aspect-square overflow-hidden bg-surface-container-low rounded-lg flex-shrink-0 cursor-pointer block">
                        <img 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          src={imgUrl}
                          onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        />
                      </Link>
                      
                      <div className="flex-grow flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/product/${item.product_id}`}>
                              <h3 className="text-xl font-bold tracking-tight text-on-surface hover:text-orange-500">{item.name}</h3>
                            </Link>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-sm">In Stock</span>
                          </div>
                          <span className="text-xl font-extrabold text-on-surface">₹{item.effective_price}</span>
                        </div>
                        
                        <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/15">
                          <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, "dec")}
                              disabled={isDecLoading}
                              className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer"
                            >
                              {isDecLoading
                                ? <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-lg">remove</span>}
                            </button>
                            <span className="px-4 font-bold text-sm w-12 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, "inc")}
                              disabled={isIncLoading}
                              className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer"
                            >
                              {isIncLoading
                                ? <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-lg">add</span>}
                            </button>
                          </div>
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={() => handleRemove(item.id)}
                              disabled={isDelLoading}
                              className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider hover:text-error transition-colors cursor-pointer"
                            >
                              {isDelLoading
                                ? <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                                : <span className="material-symbols-outlined text-base">delete</span>}
                              Delete
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider hover:text-primary transition-colors cursor-pointer">
                              <span className="material-symbols-outlined text-base">bookmark</span>
                              Save for later
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-end p-4">
                <p className="text-xl text-on-surface-variant">Subtotal ({itemCount} items): <span className="text-2xl font-black text-on-surface ml-2">₹{cart.subtotal}</span></p>
              </div>
            </>
          )}
        </section>

        {items.length > 0 && (
          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-surface-container p-8 rounded-xl shadow-[0px_20px_40px_rgba(15,17,17,0.06)]">
              <h2 className="text-xl font-black tracking-tight mb-6">Order Summary</h2>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Items ({itemCount}):</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Shipping:</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Estimated tax apx (18%):</span>
                  <span>₹{tax}</span>
                </div>
                <div className="h-px bg-outline-variant/20 my-4"></div>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-3xl font-black text-primary">₹{total}</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <Link href="/checkout" className="w-full py-4 bg-secondary-container text-on-secondary-container font-black rounded-full hover:shadow-lg transition-all active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer block">
                  Proceed to Checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <p className="text-[10px] text-center text-on-surface-variant leading-relaxed">
                  By placing your order, you agree to Amazon's <a className="underline" href="#">privacy notice</a> and <a className="underline" href="#">conditions of use</a>.
                </p>
              </div>
              
              <div className="mt-10 p-4 bg-surface-container-lowest rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Curator's Assurance</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1">Every purchase is protected by our global authenticity and protection guarantee.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-outline">
              <span className="material-symbols-outlined text-2xl">payment</span>
              <span className="material-symbols-outlined text-2xl">shield</span>
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
