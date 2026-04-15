"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("addressId");
  
  const { cart, fetchCart } = useCart();
  const { currentUser } = useAuth();
  
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!currentUser || !addressId) {
      router.push("/checkout");
      return;
    }

    async function loadAddress() {
      try {
        const res = await fetchApi(`/addresses?user_id=${currentUser.id}`);
        const found = res.data?.find(a => a.id === parseInt(addressId));
        if (found) {
          setAddress(found);
        } else {
          router.push("/checkout");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAddress();
  }, [currentUser, addressId, router]);

  const cartItems = useMemo(() => cart.items || [], [cart.items]);
  const subtotal = useMemo(() => parseFloat(cart.subtotal || 0), [cart.subtotal]);
  const tax = useMemo(() => parseFloat((subtotal * 0.18).toFixed(2)), [subtotal]);
  const total = useMemo(() => (subtotal + tax).toFixed(2), [subtotal, tax]);
  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      const res = await fetchApi("/orders", {
        method: "POST",
        body: JSON.stringify({
          user_id: currentUser.id,
          addressId: parseInt(addressId)
        })
      });
      
      await fetchCart(); // Clear cart in context
      router.push(`/checkout/confirmation?orderId=${res.orderId}`);
    } catch (err) {
      alert("Failed to place order: " + err.message);
      setPlacingOrder(false);
    }
  };

  if (loading || !address) {
    return <div className="p-12 text-center text-on-surface-variant">Loading review...</div>;
  }

  const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCex6xyDHZZitOVcES-5_rYMWAmw31sLP89VuOigXyxi6V7rrFabDZdvSd7V72VCdgoM_DMvRgpTCpa-Fg5u0giLZla7bsDrwEDkyTH6XO2hW1WpzrjUMX3KHq5pA9K87_N18M6NoPbRxhqExR-SyxSQT37-qZaIl5aR0pYEdrfGDWn2mj-hIKdvCsqOQFP-2PETNiWpHstQeeT0Ni7byvwqVKDEUbUaeYai8lyBDvCOtXYsgNKnppJN_C21e-h9GfWyfoGnHDwkwY";

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
      {/* Progress Indicator */}
      <div className="flex justify-center items-center mb-16">
        <div className="flex items-center w-full max-w-2xl px-4">
          <div className="flex flex-col items-center relative flex-1">
            <Link href="/checkout" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold transition-transform hover:scale-110">
              <span className="material-symbols-outlined text-sm">check</span>
            </Link>
            <span className="absolute -bottom-8 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase whitespace-nowrap">1. Shipping</span>
          </div>
          <div className="h-[2px] bg-primary flex-1 -mx-4"></div>
          <div className="flex flex-col items-center relative flex-1">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold z-10 shadow-lg animate-pulse-slow">2</div>
            <span className="absolute -bottom-8 text-[10px] font-bold tracking-widest text-primary uppercase whitespace-nowrap">2. Review</span>
          </div>
          <div className="h-[2px] bg-surface-container-highest flex-1 -mx-4"></div>
          <div className="flex flex-col items-center relative flex-1">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-medium z-10">3</div>
            <span className="absolute -bottom-8 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase whitespace-nowrap">3. Done</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
        <div className="lg:col-span-8 space-y-8">
          <h1 className="text-4xl font-headline font-black tracking-tight text-on-surface mb-4">Review your order</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Block */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_20px_40px_rgba(15,17,17,0.06)] border border-surface-container-high/20">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Shipping Address</h2>
                <Link href="/checkout" className="text-primary font-bold text-sm hover:underline">Change</Link>
              </div>
              <div className="text-on-surface-variant leading-relaxed">
                <p className="font-bold text-on-surface text-lg mb-2">{address.full_name}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p>{address.country}</p>
              </div>
            </div>

            {/* Payment Block */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_20px_40px_rgba(15,17,17,0.06)] border border-surface-container-high/20">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Payment Method</h2>
                <button className="text-primary font-bold text-sm hover:underline">Change</button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-surface-container-high rounded-lg">
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                </div>
                <p className="font-bold">Visa ending in 4242</p>
              </div>
              <p className="text-sm text-on-surface-variant">Billing address same as shipping</p>
            </div>
          </div>

          {/* Items Review */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_20px_40px_rgba(15,17,17,0.06)] border border-surface-container-high/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-surface-container-high bg-surface-variant/10">
              <h2 className="text-xl font-bold">Review Items ({itemCount})</h2>
            </div>
            <div className="divide-y divide-surface-container-high">
              {cartItems.map((item) => (
                <div key={item.id} className="p-8 flex gap-8 group">
                  <div className="w-32 h-40 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-surface-container-low transition-transform group-hover:scale-105">
                    <img 
                      className="w-full h-full object-cover" 
                      alt={item.name} 
                      src={(item.images && item.images.length > 0) ? item.images[0] : fallbackImage}
                      onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-2 tracking-tight">{item.name}</h3>
                      <p className="text-sm text-on-surface-variant mb-4">Sold by Amazon</p>
                      <div className="flex items-center gap-6">
                        <div className="px-4 py-1.5 bg-surface-container-high rounded-full text-sm font-bold">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary tracking-tight">₹{item.effective_price || item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_30px_60px_rgba(15,17,17,0.1)] border border-primary-container/20">
              <button 
                onClick={handlePlaceOrder} 
                disabled={placingOrder}
                className="w-full bg-primary-container hover:bg-primary text-on-primary font-black py-5 rounded-full text-lg transition-all duration-300 shadow-lg active:scale-[0.97] mb-6 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {placingOrder ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Place your order"
                )}
              </button>
              <p className="text-[11px] text-on-surface-variant leading-relaxed text-center px-4 mb-8">
                By placing your order, you agree to Amazon's <a className="text-primary hover:underline font-bold" href="#">privacy notice</a> and <a className="text-primary hover:underline font-bold" href="#">conditions of use</a>.
              </p>
              
              <div className="space-y-4 pt-6 border-t border-surface-container-high">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Items ({itemCount}):</span>
                  <span className="font-medium text-on-surface">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping & handling:</span>
                  <span className="font-medium text-on-surface">₹0.00</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated tax (18%):</span>
                  <span className="font-medium text-on-surface">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-6 border-t-2 border-surface-container-high text-primary -mx-2">
                  <span className="px-2">Order total:</span>
                  <span className="px-2">₹{total}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container/30 p-6 rounded-2xl backdrop-blur-sm border border-surface-container-high/50">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Safe & Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
