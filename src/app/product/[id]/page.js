"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

function SimilarProductsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="skeleton-surface flex h-full flex-col overflow-hidden rounded-2xl px-4 py-4"
        >
          <div className="rounded-xl bg-surface p-3">
            <div className="shimmer aspect-square rounded-lg bg-surface-container-low" />
          </div>
          <div className="mt-4 flex flex-1 flex-col">
            <div className="shimmer h-3 w-18 rounded-full" />
            <div className="mt-3 space-y-2.5">
              <div className="shimmer h-4 w-[94%] rounded-full" />
              <div className="shimmer h-4 w-[68%] rounded-full" />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <div key={starIndex} className="shimmer h-3.5 w-3.5 rounded-full" />
                ))}
              </div>
              <div className="shimmer h-3.5 w-8 rounded-full" />
            </div>
            <div className="mt-4 flex items-end gap-2">
              <div className="shimmer h-6 w-24 rounded-full" />
              <div className="shimmer h-4 w-12 rounded-full" />
            </div>
            <div className="shimmer mt-auto h-10 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-2">
        <div className="shimmer h-4 w-16 rounded-full" />
        <div className="shimmer h-4 w-4 rounded-full" />
        <div className="shimmer h-4 w-48 rounded-full" />
      </div>

      <div className="bg-surface-container-low p-0 shadow-none rounded-none">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(280px,430px)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="shimmer aspect-[4/5] rounded-[24px]" />
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shimmer h-16 w-16 flex-shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]" />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:pt-1">
              <div className="space-y-3">
                <div className="shimmer h-4 w-28 rounded-full" />
                <div className="shimmer h-12 w-5/6 rounded-2xl" />
                <div className="shimmer h-12 w-2/3 rounded-2xl" />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="shimmer h-5 w-28 rounded-full" />
                  <div className="shimmer h-5 w-20 rounded-full" />
                  <div className="shimmer h-5 w-24 rounded-full" />
                </div>
                <div className="shimmer h-8 w-36 rounded-full" />
              </div>

              <div className="grid gap-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-surface px-4 py-4 shadow-[inset_0_0_0_1px_rgba(136,115,97,0.12)]"
                  >
                    <div className="shimmer h-3 w-24 rounded-full" />
                    <div className="mt-3 space-y-2">
                      <div className="shimmer h-4 w-full rounded-full" />
                      <div className="shimmer h-4 w-5/6 rounded-full" />
                    </div>
                    <div className="shimmer mt-4 h-4 w-16 rounded-full" />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-2xl bg-surface px-4 py-4">
                    <div className="shimmer h-3 w-16 rounded-full" />
                    <div className="shimmer mt-3 h-5 w-28 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/40 pt-8 xl:border-t-0 xl:border-l xl:pl-8 xl:pt-0">
            <div className="flex flex-col gap-8">
              <div>
                <div className="shimmer h-14 w-44 rounded-2xl" />
                <div className="shimmer mt-3 h-7 w-44 rounded-full" />
                <div className="mt-5 space-y-2">
                  <div className="shimmer h-4 w-52 rounded-full" />
                  <div className="shimmer h-4 w-48 rounded-full" />
                </div>
                <div className="shimmer mt-5 h-8 w-52 rounded-full" />
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="shimmer h-5 w-full rounded-full" />
                  ))}
                </div>
                <div className="shimmer mt-5 h-12 w-full rounded-2xl" />
                <div className="mt-5 space-y-3">
                  <div className="shimmer h-12 w-full rounded-full" />
                  <div className="shimmer h-12 w-full rounded-full" />
                </div>
                <div className="shimmer mt-5 h-14 w-full rounded-2xl" />
              </div>

              <div className="border-t border-outline-variant/40 pt-6">
                <div className="shimmer h-10 w-32 rounded-full" />
                <div className="mt-4 space-y-2">
                  <div className="shimmer h-4 w-full rounded-full" />
                  <div className="shimmer h-4 w-4/5 rounded-full" />
                </div>
                <div className="shimmer mt-5 h-11 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 pt-16 border-t border-surface-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-3">
            <div className="shimmer h-8 w-48 rounded-full" />
            <div className="shimmer h-4 w-full rounded-full" />
            <div className="shimmer h-4 w-5/6 rounded-full" />
            <div className="shimmer h-4 w-4/5 rounded-full" />
          </div>
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="shimmer h-8 w-8 rounded-full" />
                  <div className="shimmer h-5 w-40 rounded-full" />
                  <div className="shimmer h-4 w-full rounded-full" />
                  <div className="shimmer h-4 w-5/6 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="space-y-2">
            <div className="shimmer h-8 w-56 rounded-full" />
            <div className="shimmer h-4 w-72 rounded-full" />
          </div>
          <SimilarProductsSkeleton />
        </div>
      </section>
    </main>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [similarError, setSimilarError] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [quantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart, actionLoading } = useCart();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [buyLoading, setBuyLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const toCategorySlug = (value) =>
      (value || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    async function loadProduct() {
      setLoading(true);
      setErrorMsg("");
      setSimilarLoading(true);
      setSimilarError("");
      setSimilarProducts([]);
      try {
        const res = await fetchApi(`/products/${id}`);
        if (!isMounted) return;

        const loadedProduct = res.data;
        setProduct(loadedProduct);
        setActiveImage(0);

        const categorySlug = loadedProduct.category_slug || toCategorySlug(loadedProduct.category_name);

        if (!categorySlug) {
          setSimilarProducts([]);
          setSimilarLoading(false);
          return;
        }

        try {
          const similarRes = await fetchApi(`/products?category=${encodeURIComponent(categorySlug)}&limit=5`);
          if (!isMounted) return;

          const related = (similarRes.data || [])
            .filter((item) => Number(item.id) !== Number(loadedProduct.id))
            .slice(0, 4);

          setSimilarProducts(related);
        } catch (similarErr) {
          if (!isMounted) return;
          console.error(similarErr);
          setSimilarError(similarErr.message || "Failed to load similar products.");
          setSimilarProducts([]);
        } finally {
          if (isMounted) {
            setSimilarLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setProduct(null);
          setErrorMsg(err.message || "Failed to load product details.");
          setSimilarProducts([]);
          setSimilarLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);



  const handleBuyNow = async () => {
    if (!currentUser) return addToast("Please sign in first!", "error");
    try {
      setBuyLoading(true);
      const addresses = await fetchApi(`/addresses?user_id=${currentUser.id}`);
      if (!addresses.data?.length) {
        setBuyLoading(false);
        return addToast("You need an address to buy now. Please setup address in Account.", "error");
      }

      const defaultAddress = addresses.data.find(a => a.is_default) || addresses.data[0];

      const order = await fetchApi("/orders/buy-now", {
        method: "POST",
        body: JSON.stringify({
          user_id: currentUser.id,
          productId: Number(id),
          quantity,
          addressId: defaultAddress.id
        })
      });

      addToast("Order placed successfully!");
      router.push(`/orders/${order.orderId}`);
    } catch (err) {
      addToast("Failed to buy: " + err.message, "error");
    } finally {
      setBuyLoading(false);
    }
  };

  const renderCompactPrice = (item) => {
    const value = Number.parseFloat(item.effective_price || item.price) || 0;
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-error">{errorMsg || "Product not found"}</p>
      </div>
    );
  }

  const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCex6xyDHZZitOVcES-5_rYMWAmw31sLP89VuOigXyxi6V7rrFabDZdvSd7V72VCdgoM_DMvRgpTCpa-Fg5u0giLZla7bsDrwEDkyTH6XO2hW1WpzrjUMX3KHq5pA9K87_N18M6NoPbRxhqExR-SyxSQT37-qZaIl5aR0pYEdrfGDWn2mj-hIKdvCsqOQFP-2PETNiWpHstQeeT0Ni7byvwqVKDEUbUaeYai8lyBDvCOtXYsgNKnppJN_C21e-h9GfWyfoGnHDwkwY";
  const images = product.images && product.images.length > 0 ? product.images : [fallbackImage];
  const safeStock = Math.max(Number(product.stock) || 0, 0);
  const ratingValue = Number.parseFloat(product.avg_rating) || 0;
  const reviewCount = Number(product.review_count) || 0;
  const displayPriceValue = Number.parseFloat(product.effective_price || product.price) || 0;
  const originalPriceValue = Number.parseFloat(product.price) || displayPriceValue;
  const hasDiscount = Number.parseFloat(product.discount_pct) > 0 && originalPriceValue > displayPriceValue;
  const formattedDisplayPrice = displayPriceValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [priceWhole, priceFraction] = formattedDisplayPrice.split(".");
  const formattedOriginalPrice = originalPriceValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const reviewLabel = reviewCount.toLocaleString("en-IN");
  const offerCards = [
    {
      label: "Cashback",
      body: "Up to 5% cashback on eligible cards and partner wallets.",
      link: "1 offer",
    },
    {
      label: "Partner Offers",
      body: "Get GST invoice support and curated marketplace savings on select orders.",
      link: "1 offer",
    },
  ];
  const deliveryWindow = safeStock > 0 ? "Available to ship in 1-2 days" : "Currently unavailable";
  const availabilityTone = safeStock > 0 ? "text-emerald-700" : "text-error";
  const sellerName = "Amazon Official";

  const renderStars = (rating) => {
    const num = parseFloat(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (num >= i) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        );
      } else if (num >= i - 0.5) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
            star
          </span>
        );
      }
    }
    return <div className="flex items-center text-secondary-container">{stars}</div>;
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8 flex items-center gap-2 text-xs font-label tracking-wide text-on-surface-variant/70">
        <Link 
          className="hover:text-primary transition-colors hover:underline" 
          href={`/search?category=${product.category_slug}`}
        >
          {product.category_name}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-background font-medium">{product.name}</span>
      </nav>

      <div className="bg-surface-container-low p-0 shadow-none rounded-none">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(280px,430px)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-surface">
                <img
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src={images[activeImage]}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface outline-none transition-all sm:h-[72px] sm:w-[72px] ${
                      activeImage === index
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest"
                        : "hover:scale-[1.02] hover:ring-1 hover:ring-outline-variant"
                    }`}
                    aria-label={`Show product image ${index + 1}`}
                  >
                    <img
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      src={imgUrl}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                    {activeImage === index ? (
                      <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-primary" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:pt-1">
              <div className="space-y-3">
                <span className="inline-flex text-sm font-medium text-primary">
                  Category: {product.category_name}
                </span>
                <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-on-surface sm:text-4xl">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {renderStars(ratingValue)}
                  <span className="text-sm font-medium text-on-surface-variant">
                    {ratingValue.toFixed(1)} rating
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {reviewLabel} ratings
                  </span>
                </div>
                {hasDiscount ? (
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                      Save {Number.parseFloat(product.discount_pct).toFixed(0)}%
                    </span>
                    <span className="text-on-surface-variant line-through">₹{formattedOriginalPrice}</span>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3">
                {offerCards.map((offer) => (
                  <div
                    key={offer.label}
                    className="rounded-2xl bg-surface px-4 py-4 shadow-[inset_0_0_0_1px_rgba(136,115,97,0.12)]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant/75">
                      {offer.label}
                    </p>
                    <p className="mt-1.5 max-w-md text-sm leading-6 text-on-surface">
                      {offer.body}
                    </p>
                    <button
                      type="button"
                      className="mt-3 text-xs font-medium text-primary transition-colors hover:text-on-surface"
                    >
                      {offer.link} <span aria-hidden="true">›</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant/70">
                    Category
                  </p>
                  <p className="mt-2 text-sm font-medium text-on-surface">{product.category_name}</p>
                </div>
                <div className="rounded-2xl bg-surface px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant/70">
                    Stock
                  </p>
                  <p className="mt-2 text-sm font-medium text-on-surface">
                    {safeStock > 0 ? `${safeStock} available now` : "Out of stock"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/40 pt-8 xl:border-t-0 xl:border-l xl:pl-8 xl:pt-0">
            <div className="flex flex-col gap-8">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start leading-none text-on-surface">
                    <span className="mt-1 text-xl font-semibold">₹</span>
                    <span className="text-5xl font-semibold tracking-[-0.05em]">{priceWhole}</span>
                    <span className="mt-2 text-base font-semibold">{priceFraction}</span>
                  </div>
                </div>

                <span className="mt-3 inline-flex rounded-full bg-primary-container/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  Curated Fulfillment
                </span>

                <div className="mt-5 space-y-2 text-sm text-on-surface">
                  <p>
                    <span className="font-semibold">FREE delivery</span> between{" "}
                    <span className="font-semibold">1-3 business days</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-primary">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Delivering to your default saved address
                  </p>
                </div>

                <p className={`mt-4 text-xl font-medium ${availabilityTone}`}>
                  {deliveryWindow}
                </p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3">
                    <dt className="text-on-surface-variant">Ships from</dt>
                    <dd className="font-medium text-on-surface">Amazon</dd>
                  </div>
                  <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3">
                    <dt className="text-on-surface-variant">Sold by</dt>
                    <dd className="font-medium text-primary">{sellerName}</dd>
                  </div>
                  <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3">
                    <dt className="text-on-surface-variant">Packaging</dt>
                    <dd className="font-medium text-on-surface">Protected marketplace packaging</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  Secure transaction
                </button>

                <div className="mt-5 rounded-2xl bg-surface/50 border border-outline-variant px-4 py-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Available Stock</span>
                  <span className={`text-sm font-black ${safeStock > 5 ? 'text-primary' : 'text-error animate-pulse'}`}>
                    {safeStock > 0 ? `${safeStock} units left` : "Out of stock"}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() => addToCart(id, quantity)}
                    disabled={safeStock === 0 || actionLoading[id]}
                    className={`w-full flex items-center justify-center gap-2 rounded-full bg-secondary-container px-5 py-3 text-sm font-semibold text-on-secondary-container transition-all ${actionLoading[id] ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-[0.98] active:scale-[0.99]'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {actionLoading[id] && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                    {actionLoading[id] ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={safeStock === 0 || buyLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-primary-container px-5 py-3 text-sm font-semibold text-on-primary-container transition-all hover:brightness-[0.98] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {buyLoading && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </button>

                </div>

                <div className="mt-5 border-t border-outline-variant/40 pt-4 text-xs leading-5 text-on-surface-variant">
                  Eligible for replacement support and curated order assistance after purchase.
                </div>
              </div>

              <div className="border-t border-outline-variant/40 pt-6">
                <p className="text-3xl font-semibold italic leading-none text-on-surface">business</p>
                <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                  Save up to 4% on this product with business pricing and GST input tax credit.
                </p>
                <button
                  type="button"
                  className="mt-5 w-full rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
                >
                  Create a free account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 pt-16 border-t border-surface-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-4">Detailed Description</h2>
            <p className="text-sm leading-relaxed text-on-surface-variant">{product.description}</p>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                <h4 className="font-bold text-on-surface">Premium Quality</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">This product has been specially curated for the Amazon collection.</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                <h4 className="font-bold text-on-surface">24/7 Support</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Purchasing this grants you access to our premium support hotline.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-on-surface">Similar in {product.category_name}</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              More picks from the same category using the products API filter.
            </p>
          </div>

          {similarLoading ? (
            <SimilarProductsSkeleton />
          ) : similarError ? (
            <div className="rounded-2xl bg-surface px-6 py-12 text-center text-sm font-medium text-error">
              {similarError}
            </div>
          ) : similarProducts.length === 0 ? (
            <div className="rounded-2xl bg-surface px-6 py-12 text-center text-sm font-medium text-on-surface-variant">
              No similar products found in this category yet.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {similarProducts.map((item) => {
                const itemImage =
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : fallbackImage;

                return (
                  <article
                    key={item.id}
                    className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-surface px-4 py-4 shadow-[inset_0_0_0_1px_rgba(136,115,97,0.12)] ${actionLoading[item.id] ? 'opacity-75 pointer-events-none' : ''}`}
                  >
                    <Link
                      href={`/product/${item.id}`}
                      className="block overflow-hidden rounded-xl bg-surface-container-low"
                    >
                      <img
                        alt={item.name}
                        className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        src={itemImage}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </Link>

                    <div className="mt-4 flex flex-1 flex-col">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant/75">
                        {item.category_name}
                      </p>
                      <Link href={`/product/${item.id}`} className="mt-2">
                        <h4 className="line-clamp-2 text-base font-semibold leading-6 text-on-surface transition-colors group-hover:text-primary">
                          {item.name}
                        </h4>
                      </Link>

                      <div className="mt-3 flex items-center gap-2">
                        {renderStars(item.avg_rating)}
                        <span className="text-xs font-medium text-on-surface-variant">
                          {Number(item.review_count || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-on-surface">
                          ₹{renderCompactPrice(item)}
                        </span>
                        {Number.parseFloat(item.discount_pct) > 0 ? (
                          <span className="text-xs text-on-surface-variant line-through">
                            ₹{Number.parseFloat(item.price || 0).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(item.id, 1)}
                        disabled={Number(item.stock) === 0 || actionLoading[item.id]}
                        className={`mt-auto flex items-center justify-center gap-2 rounded-full bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary-container transition-all ${actionLoading[item.id] ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-[0.98] active:scale-[0.99]'} disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {actionLoading[item.id] && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                        {Number(item.stock) === 0 ? "Out of Stock" : actionLoading[item.id] ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
