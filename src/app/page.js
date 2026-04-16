"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function ProductCardSkeleton() {
  return (
    <div className="skeleton-surface rounded-xl overflow-hidden p-6 flex flex-col">
      <div className="mb-6 rounded-lg bg-surface p-4">
        <div className="shimmer aspect-square rounded-lg" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="space-y-2.5">
          <div className="shimmer h-4 w-[88%] rounded-full" />
          <div className="shimmer h-4 w-[62%] rounded-full" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="shimmer h-3.5 w-3.5 rounded-full" />
            ))}
          </div>
          <div className="shimmer h-3.5 w-10 rounded-full" />
        </div>
        <div className="mt-auto pt-5">
          <div className="flex items-end gap-2 mb-4">
            <div className="shimmer h-7 w-24 rounded-full" />
            <div className="shimmer h-4 w-14 rounded-full" />
          </div>
          <div className="shimmer h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProductGrid() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { addToCart, actionLoading } = useCart();

  const searchParams = useSearchParams();
  const categoryStr = searchParams.get("category");
  const searchStr = searchParams.get("search");
  const sortBy = searchParams.get("sort") || "featured";

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      setErrorMsg("");
      try {
        let endpoint = "/products";
        const queryArgs = [];
        if (categoryStr) queryArgs.push(`category=${categoryStr}`);
        if (searchStr) queryArgs.push(`search=${searchStr}`);
        
        if (queryArgs.length > 0) {
          endpoint += `?${queryArgs.join("&")}`;
        }

        const res = await fetchApi(endpoint);
        if (isMounted) {
          setProducts(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching products:", err);
          setErrorMsg(err.message || "Failed to load products. Make sure backend is running.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, [categoryStr, searchStr]);




  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];

    if (sortBy === "price-low") {
      nextProducts.sort(
        (a, b) => Number.parseFloat(a.effective_price || a.price) - Number.parseFloat(b.effective_price || b.price)
      );
    } else if (sortBy === "price-high") {
      nextProducts.sort(
        (a, b) => Number.parseFloat(b.effective_price || b.price) - Number.parseFloat(a.effective_price || a.price)
      );
    } else if (sortBy === "rating") {
      nextProducts.sort((a, b) => Number.parseFloat(b.avg_rating || 0) - Number.parseFloat(a.avg_rating || 0));
    }

    return nextProducts;
  }, [products, sortBy]);

  const updateSort = (nextSort) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!nextSort || nextSort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `/?${nextQuery}` : "/");
  };

  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (errorMsg) {
    return <p className="col-span-full text-center py-20 font-bold text-error">{errorMsg}</p>;
  }

  if (products.length === 0) {
    return <p className="col-span-full text-center py-20 font-bold text-xl text-on-surface-variant">No products found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => updateSort(e.target.value)}
            className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer pr-8"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart}
            isAdding={actionLoading[product.id]}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySlider({ categories }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const categoryImages = {
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop",
    clothing: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    "home-kitchen": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
    beauty: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1935&auto=format&fit=crop",
    books: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
    sports: "https://images.unsplash.com/photo-1461896704690-48443ef4910f?q=80&w=2070&auto=format&fit=crop",
  };

  const defaultImage = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop";

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (categories.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [categories.length, isPaused]);

  if (categories.length === 0) return null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % categories.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-2xl overflow-hidden mb-12 h-[350px] md:h-[500px] bg-slate-200 group shadow-lg"
    >
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {categories.map((cat, idx) => (
          <div 
            key={cat.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
          >
            <img 
              className="w-full h-full object-cover" 
              alt={cat.name} 
              src={cat.image_url || categoryImages[cat.slug] || defaultImage} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8 md:px-16 text-white">
              <Badge variant="primary" className="w-fit mb-4 uppercase tracking-widest text-[10px] py-1 px-4 shadow-sm">Featured Category</Badge>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter max-w-2xl mb-4 drop-shadow-lg leading-none">{cat.name}</h1>
              <p className="text-base md:text-xl text-gray-100 max-w-lg mb-8 drop-shadow-md font-medium">{cat.description || "Discover the best limited-time deals on our curated collections."}</p>
              <Button 
                onClick={() => router.push(`/search?category=${cat.slug}`)}
                variant="outline"
                className="bg-white text-slate-900 w-fit px-10 py-7 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                Shop the Collection
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-slate-900">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-slate-900">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {categories.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-500 w-8' : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchApi("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories for slider:", err);
      }
    }
    loadCategories();
  }, []);

  return (
    <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
      <CategorySlider categories={categories} />

      {/* Main product view with fallback suspenses mapping API queries */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>

      {/* Secondary Banner Section (Asymmetric Bento) */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-on-surface mb-4">The Smart Home Curator</h2>
            <p className="text-on-surface-variant mb-6 font-body">Transform your living space with our selection of integrated smart devices. From lighting to security, curated for the modern home.</p>
            <Button variant="secondary" className="px-6 py-2.5">Explore Smart Home</Button>
          </div>
          <div className="flex-1">
            <img className="w-full rounded-lg shadow-md" alt="Smart speaker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpYfmByp3LzRGN1_yUUK4dl_pL0EKlKdXICHtcTyKGS0gbQJWPQH9YMjziez_ITqRgxZ5xvsA_dgkOp2opJcTJtViZ2N01LBj5XGrsB11nCoi_Q-QrgiXV5KGmqvughhtkCGGenW9hnOUYb_VES5Xk39N85Gur_2XrAjwCFlVfF_Frc2yj9ZupXuwhILYKgM9eD2QIk0KbEpRUMLEcWQhKwf08j5SBfFsWLt5c-BhQbQ1v1YAOeq2oSChLnEfGKmshK81aQnP5MFI" />
          </div>
        </div>
        <div className="bg-surface-container-highest rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-orange-500 mb-4">local_shipping</span>
          <h3 className="text-xl font-bold mb-2">Prime Fast Delivery</h3>
          <p className="text-sm text-on-surface-variant mb-4">Get your essentials delivered within 24 hours with our premium membership.</p>
          <a className="text-orange-500 font-bold text-sm hover:underline" href="#">Learn more about Prime</a>
        </div>
      </section>
    </main>
  );
}
