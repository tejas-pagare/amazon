"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { fetchApi } from "@/lib/api";
import { Button } from "./Button";
import { Input } from "./Input";

const FALLBACK_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDwOVPqfQEB4oyVnlaP9tjGSog3mqdWEunFHLJjvpF3i1Wf5DOy7Ka7JYNxgQeI7Tmvvp2x8lWJx8_ZuU2epRa0N7LLXPRrWrhs6zid1_OtGV9_5MRwUVbmeAqVXd31cEHLQGrI65LCcXfzqpUUu2VPMSaPfOUrn1hZC-_qAzVLW04YypvrA0mQo3_xnx8eLtm6hZIHNGg4adLkAxvwe9iUX_57ley2k5MRZe-ieghZkTz9TCT5KugX9vzWSqDYfBL-dJEB_-wVs4U";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSearch, setActiveSearch] = useState("");

  // Live search state
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setShowDropdown(false);
      router.push(`/search?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Debounced live search using /api/v1/search
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetchApi(`/search?q=${encodeURIComponent(query.trim())}&limit=6`);
      const hits = res.data || res.results || [];
      setSuggestions(hits.slice(0, 6));
      setShowDropdown(hits.length > 0);
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowDropdown(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetchApi("/categories");
        if (isMounted) setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setSearch(activeSearch);
    setShowDropdown(false);
  }, [activeSearch]);

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamHandler 
          setActiveCategory={setActiveCategory} 
          setActiveSearch={setActiveSearch} 
        />
      </Suspense>
      <header className="bg-[#131921]/90 backdrop-blur-xl sticky top-0 w-full z-50 flex items-center justify-between px-6 py-3 transition-colors duration-200 shadow-none">
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center group transition-transform active:scale-95 pt-1">
            <img 
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" 
              alt="Amazon Logo"
              className="w-24 h-8 object-contain"
            />
          </Link>
          {/* Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form
              onSubmit={handleSearch}
              className="flex w-full bg-surface-container-lowest rounded-lg overflow-hidden h-10 group focus-within:ring-2 ring-primary-container ring-opacity-40"
            >
              <Button 
                type="button" 
                variant="ghost" 
                className="bg-surface-container-high px-3 text-on-surface-variant font-label text-xs hover:bg-surface-dim transition-colors shrink-0 rounded-none h-full"
              >
                All
              </Button>
              <Input
                value={search}
                onChange={handleInputChange}
                onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                className="flex-1 border-none focus:ring-0 bg-transparent text-sm px-4 font-body outline-none h-full rounded-none"
                placeholder="Search Amazon"
                type="text"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                variant="primary" 
                className="px-5 flex items-center shrink-0 rounded-none h-full"
              >
                {searchLoading
                  ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  : <span className="material-symbols-outlined">search</span>}
              </Button>
            </form>

            {/* Live suggestions dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-50 overflow-hidden">
                <ul>
                  {suggestions.map((product) => {
                    const img = product.images?.[0] || FALLBACK_IMAGE;
                    const price = parseFloat(product.effective_price || product.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    return (
                      <li key={product.id}>
                        <Link
                          href={`/product/${product.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors group/item"
                        >
                          <img
                            src={img}
                            alt={product.name}
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                            className="w-10 h-10 rounded-lg object-cover bg-surface-container-low flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-on-surface line-clamp-1 group-hover/item:text-primary transition-colors">{product.name}</p>
                            <p className="text-xs text-on-surface-variant">{product.category_name}</p>
                          </div>
                          <span className="text-sm font-bold text-on-surface shrink-0">₹{price}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-outline-variant/20 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => { setShowDropdown(false); router.push(`/search?search=${encodeURIComponent(search.trim())}`); }}
                    className="w-full text-sm text-primary font-bold flex items-center justify-center gap-1 hover:underline"
                  >
                    See all results for &ldquo;{search}&rdquo;
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Trailing Actions */}
        <nav className="flex items-center gap-6 ml-6">
          {currentUser ? (
            <div className="hidden lg:flex flex-col text-white font-medium text-sm tracking-tight cursor-pointer" onClick={() => logout()}>
              <span className="text-[10px] text-white/80 font-normal">
                Hello, {currentUser.name.split(' ')[0]} (Sign Out)
              </span>
              <span className="font-bold">Account &amp; Lists</span>
            </div>
          ) : (
            <Link href="/login" className="hidden lg:flex flex-col text-white font-medium text-sm tracking-tight cursor-pointer">
              <span className="text-[10px] text-white/80 font-normal">
                Hello, Sign in
              </span>
              <span className="font-bold">Account &amp; Lists</span>
            </Link>
          )}
          <div className="flex items-center gap-5 text-white">
            <Link href="/orders" className="relative group cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200 active:scale-90">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link href="/cart" className="relative group cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200 active:scale-90">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>
      {/* Horizontal Category Filter Strip */}
      <div className="bg-surface-container-high w-full px-6 py-2 flex items-center gap-6 overflow-x-auto no-scrollbar shadow-sm">
        <Link
          href="/search"
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors shrink-0 ${
            pathname === "/search" && !activeCategory && !activeSearch
              ? "text-orange-500 font-bold"
              : "text-on-surface font-bold hover:bg-white/50"
          }`}
        >
          <span className="material-symbols-outlined text-lg">menu</span>
          All
        </Link>
        <div className="h-4 w-[1px] bg-outline-variant/30"></div>
        <nav className="flex items-center gap-6">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <Link
                key={category.id}
                href={`/search?category=${encodeURIComponent(category.slug)}`}
                className={`whitespace-nowrap text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-orange-500 pb-1 font-bold text-orange-500"
                    : "font-medium text-on-surface hover:text-orange-500"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

function SearchParamHandler({ setActiveCategory, setActiveSearch }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    
    setActiveCategory(category);
    setActiveSearch(search);
  }, [searchParams, setActiveCategory, setActiveSearch]);

  return null;
}
