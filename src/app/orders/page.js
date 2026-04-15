"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }
    
    async function loadOrders() {
      try {
        const res = await fetchApi(`/orders?user_id=${currentUser.id}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadOrders();
  }, [currentUser, router]);

  if (!currentUser) return null;
  if (loading) return <div className="p-8 text-center text-on-surface-variant">Loading orders...</div>;

  const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCex6xyDHZZitOVcES-5_rYMWAmw31sLP89VuOigXyxi6V7rrFabDZdvSd7V72VCdgoM_DMvRgpTCpa-Fg5u0giLZla7bsDrwEDkyTH6XO2hW1WpzrjUMX3KHq5pA9K87_N18M6NoPbRxhqExR-SyxSQT37-qZaIl5aR0pYEdrfGDWn2mj-hIKdvCsqOQFP-2PETNiWpHstQeeT0Ni7byvwqVKDEUbUaeYai8lyBDvCOtXYsgNKnppJN_C21e-h9GfWyfoGnHDwkwY";

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
      {/* Header & Search */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant mb-4">
              <span className="hover:text-primary cursor-pointer">Your Account</span>
              <span>/</span>
              <span className="text-on-surface font-bold">Your Orders</span>
            </nav>
            <h1 className="text-4xl font-headline font-black tracking-tighter mb-2">Your Orders</h1>
            <p className="text-on-surface-variant">{orders.length} orders placed in total</p>
          </div>
          <div className="w-full md:max-w-xs">
            <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Search all orders</label>
            <div className="relative flex items-center">
              <input className="w-full bg-surface-container-high border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary-container/40 transition-all outline-none" placeholder="Filter by product or brand" type="text"/>
              <span className="material-symbols-outlined absolute right-4 text-on-surface-variant">search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-label text-sm whitespace-nowrap transition-transform active:scale-95 cursor-pointer">All Orders</button>
        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-label text-sm whitespace-nowrap transition-transform active:scale-95 cursor-pointer">Last 30 days</button>
        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-label text-sm whitespace-nowrap transition-transform active:scale-95 cursor-pointer">Cancelled</button>
      </div>

      {/* Order List */}
      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center text-on-surface-variant border border-outline-variant/30 flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-4 text-outline/50">inbox</span>
            <p>You haven't placed any orders yet.</p>
            <Link href="/" className="mt-4 text-primary font-bold hover:underline">Start shopping</Link>
          </div>
        ) : (
          orders.map((order) => {
            const dateStr = new Date(order.placed_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div key={order.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[1.01] duration-300 border border-outline-variant/30">
                <div className="bg-surface-container-high px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-sm border-b border-outline-variant/30">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1">Order Placed</p>
                      <p className="font-bold">{dateStr}</p>
                    </div>
                    <div>
                      <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1">Total</p>
                      <p className="font-bold">₹{order.total}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1">Status</p>
                      <p className="font-bold uppercase tracking-widest text-[#8a5100]">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1">Order # {order.id.toString().padStart(6, '0')}</p>
                    <div className="flex gap-3 text-primary font-bold justify-end">
                      <a className="hover:underline cursor-pointer">View details</a>
                      <span className="text-outline-variant">|</span>
                      <a className="hover:underline cursor-pointer">Invoice</a>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 pb-4">
                  {(order.items || []).map((item, idx) => {
                    const imgUrl = (item.images && item.images.length > 0) ? item.images[0] : fallbackImage;
                    
                    return (
                      <div key={idx} className="flex flex-col md:flex-row gap-8 mb-6 pb-6 border-b border-surface-container last:border-0 last:mb-0 last:pb-0">
                        <div className="flex-1 flex gap-6">
                          <Link href={`/product/${item.product_id}`} className="w-28 h-28 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center cursor-pointer border border-surface-container-high/50">
                            <img alt={item.name} className="object-cover w-full h-full" src={imgUrl} onError={(e) => { e.currentTarget.src = fallbackImage; }}/>
                          </Link>
                          <div className="flex-1">
                            <h3 className="text-lg font-headline font-bold text-on-surface mb-1">
                              <Link href={`/product/${item.product_id}`} className="hover:text-primary transition-colors">{item.name}</Link>
                            </h3>
                            <p className="text-sm text-on-surface-variant mb-2">Qty: {item.quantity} • ₹{item.unit_price}</p>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <Link href={`/product/${item.product_id}`} className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm inline-block cursor-pointer">Buy it again</Link>
                              <button className="bg-surface-container text-on-surface px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm cursor-pointer">Write review</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

    </main>
  );
}
