"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart } = useCart();
  const { currentUser } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
    // Helping fields for the UI
    flat: "",
    area: "",
    landmark: ""
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/cart");
      return;
    }
    
    loadAddresses();
  }, [currentUser, router]);

  async function loadAddresses() {
    try {
      setLoading(true);
      const res = await fetchApi(`/addresses?user_id=${currentUser.id}`);
      const userAddresses = res.data || [];
      setAddresses(userAddresses);
      
      const defaultAddr = userAddresses.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleProceedToReview = () => {
    if (!selectedAddressId) return alert("Please select an address");
    router.push(`/checkout/review?addressId=${selectedAddressId}`);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSavingAddress(true);
      const street = `${addressForm.flat}, ${addressForm.area}${addressForm.landmark ? ', Landmark: ' + addressForm.landmark : ''}`;
      
      await fetchApi("/addresses", {
        method: "POST",
        body: JSON.stringify({
          user_id: currentUser.id,
          full_name: addressForm.full_name,
          street,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode,
          country: addressForm.country,
          is_default: addressForm.is_default
        })
      });

      setShowAddressModal(false);
      setAddressForm({
        full_name: "", street: "", city: "", state: "", pincode: "", country: "India", is_default: false, flat: "", area: "", landmark: ""
      });
      await loadAddresses();
    } catch (err) {
      alert("Failed to save address: " + err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading checkout...</div>;
  }

  const items = cart.items || [];
  if (items.length === 0) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => router.push("/")} className="text-primary font-bold">Go shopping</button>
      </main>
    );
  }

  const taxNumber = parseFloat(cart.subtotal) * 0.18;
  const tax = taxNumber.toFixed(2);
  const total = (parseFloat(cart.subtotal) + taxNumber).toFixed(2);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCex6xyDHZZitOVcES-5_rYMWAmw31sLP89VuOigXyxi6V7rrFabDZdvSd7V72VCdgoM_DMvRgpTCpa-Fg5u0giLZla7bsDrwEDkyTH6XO2hW1WpzrjUMX3KHq5pA9K87_N18M6NoPbRxhqExR-SyxSQT37-qZaIl5aR0pYEdrfGDWn2mj-hIKdvCsqOQFP-2PETNiWpHstQeeT0Ni7byvwqVKDEUbUaeYai8lyBDvCOtXYsgNKnppJN_C21e-h9GfWyfoGnHDwkwY";

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-12">
        <div className="flex items-center w-full max-w-2xl">
          <div className="flex flex-col items-center relative flex-1">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold z-10 shadow-lg">1</div>
            <span className="absolute -bottom-7 text-xs font-bold tracking-wider text-primary uppercase">1. Address</span>
          </div>
          <div className="h-1 bg-surface-container-highest flex-1 -mx-4"></div>
          <div className="flex flex-col items-center relative flex-1">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-medium z-10">2</div>
            <span className="absolute -bottom-7 text-xs font-medium tracking-wider text-on-surface-variant uppercase">2. Review</span>
          </div>
          <div className="h-1 bg-surface-container-highest flex-1 -mx-4"></div>
          <div className="flex flex-col items-center relative flex-1">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-medium z-10">3</div>
            <span className="absolute -bottom-7 text-xs font-medium tracking-wider text-on-surface-variant uppercase">3. Done</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
        {/* Left Column: Address Selection */}
        <div className="lg:col-span-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-on-surface">Select a delivery address</h1>
          <div className="space-y-6">
            {addresses.map((address) => {
              const isSelected = selectedAddressId === address.id;
              return (
                <div 
                  key={address.id} 
                  onClick={() => setSelectedAddressId(address.id)}
                  className={`bg-surface-container-lowest p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer ${isSelected ? 'border-primary-container' : 'border-transparent hover:border-outline-variant shadow-sm'}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="mt-1">
                      <input 
                        type="radio" 
                        name="address" 
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="w-5 h-5 text-primary border-outline-variant focus:ring-primary/40 cursor-pointer"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg mb-1">
                            {address.full_name}
                            {address.is_default && <span className="ml-2 px-2 py-0.5 bg-surface-container-high text-[10px] uppercase tracking-widest rounded-full font-bold">Default</span>}
                          </p>
                          <p className="text-on-surface-variant body-md leading-relaxed">
                            {address.street}<br/>
                            {address.city}, {address.state} {address.pincode}<br/>
                            {address.country}
                          </p>
                        </div>
                        <button className="text-primary font-bold text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                      </div>
                      {isSelected && (
                        <div className="mt-8">
                          <button onClick={handleProceedToReview} className="bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed px-8 py-3 rounded-full font-bold transition-all duration-200 transform active:scale-95 shadow-sm">
                            Deliver to this address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Add New Address */}
            <button 
              onClick={() => setShowAddressModal(true)}
              className="w-full py-6 px-8 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-3 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all duration-200 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-outline">add_location</span>
              <span className="font-bold">Add a new delivery address</span>
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(15,17,17,0.06)]">
              <button 
                onClick={handleProceedToReview} 
                disabled={!selectedAddressId}
                className="w-full bg-primary-container hover:bg-primary text-on-primary font-bold py-4 rounded-full transition-all duration-200 mb-6 shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                Use this address
              </button>
              <p className="text-[11px] text-on-surface-variant leading-tight text-center px-4 mb-8">
                By placing your order, you agree to Amazon's <a className="text-primary hover:underline" href="#">privacy notice</a> and <a className="text-primary hover:underline" href="#">conditions of use</a>.
              </p>
              <div className="space-y-4 pt-6 border-t border-surface-container-high">
                <h2 className="font-bold text-lg tracking-tight mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Items ({itemCount}):</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Shipping & handling:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Estimated tax:</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold pt-4 border-t border-surface-container-high text-primary">
                  <span>Order total:</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            {/* Cart Preview */}
            <div className="bg-surface-container-high/50 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-4 text-on-surface-variant">Review Items</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        className="w-full h-full object-cover" 
                        alt={item.name} 
                        src={(item.images && item.images.length > 0) ? item.images[0] : fallbackImage}
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a className="block text-center mt-4 text-xs font-bold text-primary hover:underline" href="/cart">Change quantities</a>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
              <h2 className="text-lg font-bold">Add a new address</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress} className="px-6 py-6 overflow-y-auto space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-bold">Full Name</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                  value={addressForm.full_name}
                  onChange={e => setAddressForm({...addressForm, full_name: e.target.value})}
                  placeholder="First and Last name" 
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold">Pincode</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                  value={addressForm.pincode}
                  onChange={e => setAddressForm({...addressForm, pincode: e.target.value})}
                  placeholder="6 digits [0-9] PIN code" 
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold">Flat, House no., Building, Company, Apartment</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                  value={addressForm.flat}
                  onChange={e => setAddressForm({...addressForm, flat: e.target.value})}
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold">Area, Street, Sector, Village</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                  value={addressForm.area}
                  onChange={e => setAddressForm({...addressForm, area: e.target.value})}
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold">Landmark</label>
                <input 
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                  value={addressForm.landmark}
                  onChange={e => setAddressForm({...addressForm, landmark: e.target.value})}
                  placeholder="E.g. near apollo hospital" 
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-bold">Town/City</label>
                  <input 
                    required
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                    value={addressForm.city}
                    onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold">State</label>
                  <input 
                    required
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                    value={addressForm.state}
                    onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                    placeholder="State"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input 
                  className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30" 
                  id="defaultAddr" 
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                />
                <label className="text-sm cursor-pointer" htmlFor="defaultAddr">Make this my default address</label>
              </div>

              <div className="pt-4">
                <button 
                  disabled={savingAddress}
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-xl shadow-sm hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50"
                >
                  {savingAddress ? "Saving..." : "Use this address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
