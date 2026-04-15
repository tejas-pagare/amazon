"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const PRODUCT_FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDwOVPqfQEB4oyVnlaP9tjGSog3mqdWEunFHLJjvpF3i1Wf5DOy7Ka7JYNxgQeI7Tmvvp2x8lWJx8_ZuU2epRa0N7LLXPRrWrhs6zid1_OtGV9_5MRwUVbmeAqVXd31cEHLQGrI65LCcXfzqpUUu2VPMSaPfOUrn1hZC-_qAzVLW04YypvrA0mQo3_xnx8eLtm6hZIHNGg4adLkAxvwe9iUX_57ley2k5MRZe-ieghZkTz9TCT5KugX9vzWSqDYfBL-dJEB_-wVs4U";
const PAGE_SIZE = 12;

function SearchResultCardSkeleton() {
  return (
    <div className="skeleton-surface rounded-lg overflow-hidden">
      <div className="rounded-lg bg-surface p-3">
        <div className="shimmer aspect-[4/5] rounded-md" />
      </div>
      <div className="p-5">
        <div className="shimmer h-3 w-20 rounded-full" />
        <div className="mt-3 space-y-2.5">
          <div className="shimmer h-4 w-[92%] rounded-full" />
          <div className="shimmer h-4 w-[74%] rounded-full" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="shimmer h-3.5 w-3.5 rounded-full" />
            ))}
          </div>
          <div className="shimmer h-3.5 w-10 rounded-full" />
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="shimmer h-3 w-16 rounded-full" />
            <div className="shimmer h-7 w-24 rounded-full" />
          </div>
          <div className="shimmer h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <main className="pt-12 pb-20 max-w-screen-2xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12">
      <aside className="w-full md:w-[260px] flex-shrink-0 space-y-8">
        <div>
          <div className="shimmer h-3 w-16 rounded-full" />
          <div className="shimmer mt-4 h-0.5 w-8 rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="shimmer h-4 w-24 rounded-full" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="shimmer h-4 w-32 rounded-full" />
          ))}
        </div>
      </aside>

      <section className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div className="space-y-3">
            <div className="shimmer h-10 w-56 rounded-full" />
            <div className="shimmer h-4 w-72 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <div className="shimmer h-10 w-40 rounded-full" />
            <div className="shimmer h-10 w-20 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <SearchResultCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

function buildPagination(currentPage, totalPages) {
  if (totalPages <= 1) return [1];
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
}

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, actionLoading } = useCart();
  const { currentUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    total_pages: 0,
  });

  const searchText = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "featured";
  const currentPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));

  useEffect(() => {
    let isMounted = true;

    async function loadSearchPage() {
      setLoading(true);
      setErrorMsg("");

      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetchApi("/categories"),
          fetchApi(
            `/products?limit=${PAGE_SIZE}&page=${currentPage}${
              searchText ? `&search=${encodeURIComponent(searchText)}` : ""
            }${categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : ""}`
          ),
        ]);

        if (!isMounted) return;

        setCategories(categoriesRes.data || []);
        setProducts(productsRes.data || []);
        setPagination(
          productsRes.pagination || {
            page: currentPage,
            limit: PAGE_SIZE,
            total: productsRes.data?.length || 0,
            total_pages: 1,
          }
        );
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load search results:", err);
        setErrorMsg(err.message || "Failed to load search results.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSearchPage();

    return () => {
      isMounted = false;
    };
  }, [searchText, categorySlug, currentPage]);

  const activeCategory = categories.find((category) => category.slug === categorySlug);

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

  const paginationItems = buildPagination(pagination.page || currentPage, pagination.total_pages || 1);

  const resultsHeading = searchText
    ? `"${searchText}"`
    : activeCategory
      ? activeCategory.name
      : "Curated products";

  const resultsSubheading = searchText
    ? `Showing ${Math.min(((pagination.page || currentPage) - 1) * (pagination.limit || PAGE_SIZE) + 1, pagination.total || 0)}-${Math.min((pagination.page || currentPage) * (pagination.limit || PAGE_SIZE), pagination.total || 0)} of ${pagination.total || 0} results for curated search`
    : `Showing ${Math.min(((pagination.page || currentPage) - 1) * (pagination.limit || PAGE_SIZE) + 1, pagination.total || 0)}-${Math.min((pagination.page || currentPage) * (pagination.limit || PAGE_SIZE), pagination.total || 0)} of ${pagination.total || 0} products${activeCategory ? ` in ${activeCategory.name}` : ""}`;

  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/search?${params.toString()}`);
  };



  const renderStars = (rating) => {
    const num = Number.parseFloat(rating) || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (num >= i) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        );
      } else if (num >= i - 0.5) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>
            star
          </span>
        );
      }
    }

    return <div className="flex text-primary-container">{stars}</div>;
  };

  if (loading) {
    return <SearchResultsSkeleton />;
  }

  return (
    <main className="pt-12 pb-20 max-w-screen-2xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12">
      <aside className="w-full md:w-[260px] flex-shrink-0">
        <div className="sticky top-24 space-y-10">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-4">Filters</h2>
            <div className="h-0.5 w-8 bg-primary-container" />
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center justify-between">
              Category
              <span className="material-symbols-outlined text-sm opacity-40">expand_less</span>
            </h3>

            <ul className="space-y-3 text-sm text-on-surface-variant">
              <li>
                <button
                  type="button"
                  onClick={() => updateQuery({ category: null, page: 1 })}
                  className={`flex w-full items-center justify-between transition-colors ${
                    !categorySlug ? "font-semibold text-primary" : "hover:text-primary"
                  }`}
                >
                  <span>All categories</span>
                </button>
              </li>
              {categories.map((category) => {
                const isActive = category.slug === categorySlug;

                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => updateQuery({ category: category.slug, page: 1 })}
                      className={`flex w-full items-center justify-between transition-colors ${
                        isActive ? "font-semibold text-primary" : "hover:text-primary"
                      }`}
                    >
                      <span>{category.name}</span>
                      {isActive ? (
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center justify-between">
              Sort By
              <span className="material-symbols-outlined text-sm opacity-40">expand_less</span>
            </h3>

            <ul className="space-y-3 text-sm text-on-surface-variant">
              <li>
                <button
                  type="button"
                  onClick={() => updateQuery({ sort: "featured", page: 1 })}
                  className={`flex w-full items-center justify-between transition-colors ${
                    sortBy === "featured" ? "font-semibold text-primary" : "hover:text-primary"
                  }`}
                >
                  <span>Featured</span>
                  {sortBy === "featured" ? (
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  ) : null}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => updateQuery({ sort: "price-low", page: 1 })}
                  className={`flex w-full items-center justify-between transition-colors ${
                    sortBy === "price-low" ? "font-semibold text-primary" : "hover:text-primary"
                  }`}
                >
                  <span>Price: Low to High</span>
                  {sortBy === "price-low" ? (
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  ) : null}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => updateQuery({ sort: "price-high", page: 1 })}
                  className={`flex w-full items-center justify-between transition-colors ${
                    sortBy === "price-high" ? "font-semibold text-primary" : "hover:text-primary"
                  }`}
                >
                  <span>Price: High to Low</span>
                  {sortBy === "price-high" ? (
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  ) : null}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => updateQuery({ sort: "rating", page: 1 })}
                  className={`flex w-full items-center justify-between transition-colors ${
                    sortBy === "rating" ? "font-semibold text-primary" : "hover:text-primary"
                  }`}
                >
                  <span>Top Rated</span>
                  {sortBy === "rating" ? (
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  ) : null}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <section className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">{resultsHeading}</h1>
            <p className="text-sm text-on-surface-variant italic font-light">{resultsSubheading}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => updateQuery({ sort: e.target.value, page: 1 })}
                className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer pr-8"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="flex border border-outline-variant/30 rounded overflow-hidden">
              <button type="button" className="p-2 bg-surface-container-high">
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button type="button" className="p-2 opacity-40 cursor-not-allowed">
                <span className="material-symbols-outlined text-lg">list</span>
              </button>
            </div>
          </div>
        </div>

        {errorMsg ? (
          <p className="py-20 text-center font-bold text-error">{errorMsg}</p>
        ) : sortedProducts.length === 0 ? (
          <p className="py-20 text-center font-bold text-xl text-on-surface-variant">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedProducts.map((product, index) => {
                const isAdding = actionLoading[product.id];
                const imageSrc =
                  product.images && product.images.length > 0 ? product.images[0] : PRODUCT_FALLBACK_IMAGE;
                const displayPrice = Number.parseFloat(product.effective_price || product.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                const originalPrice = Number.parseFloat(product.price || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                const showBadge = index === 0 || index === 1;

                return (
                  <article
                    key={product.id}
                    className={`group bg-surface-container-lowest overflow-hidden transition-all duration-500 hover:shadow-[0px_20px_40px_rgba(138,81,0,0.08)] rounded ${isAdding ? 'opacity-75 pointer-events-none' : ''}`}
                  >
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="aspect-[4/5] relative bg-surface-container-low overflow-hidden">
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={imageSrc}
                          onError={(e) => {
                            e.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                          }}
                        />
                        {showBadge ? (
                          <div className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                            {index === 0 ? "Best Seller" : "New Release"}
                          </div>
                        ) : null}
                      </div>
                    </Link>

                    <div className="p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                        {product.category_name}
                      </p>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 leading-tight hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(product.avg_rating)}
                        <span className="text-[10px] text-on-surface-variant">
                          ({Number(product.review_count || 0).toLocaleString("en-IN")})
                        </span>
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex flex-col">
                          {Number.parseFloat(product.discount_pct) > 0 ? (
                            <span className="text-xs text-error font-medium line-through opacity-50">₹{originalPrice}</span>
                          ) : null}
                          <span className="text-2xl font-black tracking-tighter">₹{displayPrice}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(product.id)}
                          disabled={isAdding}
                          className={`flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-sm font-bold transition-all ${isAdding ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-95 active:scale-95'}`}
                        >
                          {isAdding ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : null}
                          {isAdding ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {(pagination.total_pages || 1) > 1 ? (
              <div className="mt-14 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => updateQuery({ page: Math.max(1, currentPage - 1) })}
                  disabled={currentPage <= 1}
                  className="h-10 w-10 rounded-lg border border-outline-variant/30 text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-on-surface-variant">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateQuery({ page: item })}
                      className={`h-10 min-w-10 px-3 rounded-lg text-sm font-bold transition-colors ${
                        item === currentPage
                          ? "bg-primary-container text-on-primary-container"
                          : "text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => updateQuery({ page: Math.min(pagination.total_pages || currentPage, currentPage + 1) })}
                  disabled={currentPage >= (pagination.total_pages || currentPage)}
                  className="h-10 w-10 rounded-lg border border-outline-variant/30 text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}
