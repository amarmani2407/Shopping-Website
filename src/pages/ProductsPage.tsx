import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES } from '../data/mockProducts';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  RotateCcw,
  Zap,
  Star,
  Search,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialDeal = searchParams.get('deal') === 'true';
  const initialFast = searchParams.get('fast') === 'true';
  const initialSort = (searchParams.get('sort') as any) || 'featured';

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState<boolean>(initialFast);
  const [discountMin, setDiscountMin] = useState<number>(0);
  const [dealsOnly, setDealsOnly] = useState<boolean>(initialDeal);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Layout & Pagination
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearchKeyword(searchParams.get('q') || '');
    if (searchParams.get('deal') === 'true') setDealsOnly(true);
    if (searchParams.get('fast') === 'true') setFastDeliveryOnly(true);
    if (searchParams.get('sort')) setSortBy(searchParams.get('sort')!);
    setCurrentPage(1);
  }, [searchParams]);

  // Dynamic available brands based on category
  const availableBrands = useMemo(() => {
    const relevant =
      selectedCategory === 'All'
        ? products
        : products.filter((p) => p.category === selectedCategory);
    return Array.from(new Set(relevant.map((p) => p.brand))).sort();
  }, [products, selectedCategory]);

  // Main filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase().trim();
        const matches =
          product.title.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Price
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      // Fast delivery
      if (fastDeliveryOnly && !product.fastDelivery) {
        return false;
      }
      // Deals only
      if (dealsOnly && !product.isDeal) {
        return false;
      }
      // Discount percentage
      if (discountMin > 0 && product.discountPercent < discountMin) {
        return false;
      }
      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      return true;
    });
  }, [
    products,
    selectedCategory,
    searchKeyword,
    priceRange,
    minRating,
    fastDeliveryOnly,
    dealsOnly,
    discountMin,
    selectedBrands,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter reset
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchKeyword('');
    setPriceRange([0, 150000]);
    setMinRating(0);
    setSelectedBrands([]);
    setFastDeliveryOnly(false);
    setDiscountMin(0);
    setDealsOnly(false);
    setSortBy('featured');
    setSearchParams({});
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            {searchKeyword && (
              <span className="text-sm font-normal text-slate-500 ml-2">
                for &ldquo;{searchKeyword}&rdquo;
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{sortedProducts.length}</span> results
          </p>
        </div>

        {/* View Toggle, Sort & Mobile Filters button */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 appearance-none outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Grid / List layout toggle */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-white dark:bg-slate-900">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'list'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              aria-label="List layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory !== 'All' ||
        selectedBrands.length > 0 ||
        minRating > 0 ||
        fastDeliveryOnly ||
        dealsOnly ||
        discountMin > 0 ||
        searchKeyword) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Active Filters:</span>

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200/60 font-medium">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')}>
                <X className="w-3.5 h-3.5 hover:text-rose-500" />
              </button>
            </span>
          )}

          {searchKeyword && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
              Query: &ldquo;{searchKeyword}&rdquo;
              <button onClick={() => setSearchKeyword('')}>
                <X className="w-3.5 h-3.5 hover:text-rose-500" />
              </button>
            </span>
          )}

          {fastDeliveryOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 font-medium">
              ShopNest Express
              <button onClick={() => setFastDeliveryOnly(false)}>
                <X className="w-3.5 h-3.5 hover:text-rose-500" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 font-medium">
              {minRating}★ & Up
              <button onClick={() => setMinRating(0)}>
                <X className="w-3.5 h-3.5 hover:text-rose-500" />
              </button>
            </span>
          )}

          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 font-medium"
            >
              {b}
              <button onClick={() => toggleBrand(b)}>
                <X className="w-3.5 h-3.5 hover:text-rose-500" />
              </button>
            </span>
          ))}

          <button
            onClick={handleResetFilters}
            className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Fast Delivery Checkbox */}
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={fastDeliveryOnly}
                onChange={(e) => {
                  setFastDeliveryOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
              />
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold">ShopNest Express</span> (Next Day)
              </span>
            </label>
          </div>

          {/* Department / Category */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Category
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
                className={`block w-full text-left py-1 px-2 rounded-md transition-colors ${
                  selectedCategory === 'All'
                    ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left py-1 px-2 rounded-md transition-colors ${
                    selectedCategory === cat.name
                      ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Price Range
            </h4>
            <div className="space-y-2 text-xs">
              <input
                type="range"
                min={0}
                max={150000}
                step={500}
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([priceRange[0], Number(e.target.value)]);
                  setCurrentPage(1);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 tabular-nums">
                <span>Up to:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  ₹{priceRange[1].toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Rating */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => {
                    setMinRating(minRating === stars ? 0 : stars);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center gap-1.5 py-1 px-2 rounded-md text-left transition-colors ${
                    minRating === stars
                      ? 'bg-amber-50 dark:bg-amber-950/30 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount % */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Discount
            </h4>
            <div className="space-y-1 text-xs">
              {[10, 25, 40, 50].map((disc) => (
                <button
                  key={disc}
                  onClick={() => {
                    setDiscountMin(discountMin === disc ? 0 : disc);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left py-1 px-2 rounded-md transition-colors ${
                    discountMin === disc
                      ? 'font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {disc}% Off or more
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          {availableBrands.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Brands
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-3.5 h-3.5 rounded text-amber-500 accent-amber-500"
                    />
                    <span className="truncate">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* PRODUCTS LISTING / GRID */}
        <div className="lg:col-span-3 space-y-6">
          {displayedProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any items matching your selected criteria. Try broadening your filters or resetting them.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid / List Container */}
              <div
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5'
                    : 'space-y-4'
                }
              >
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout={layout} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="py-4 space-y-6 flex-1">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left py-1 px-2 rounded ${
                      selectedCategory === 'All' ? 'font-bold text-amber-500' : ''
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setCurrentPage(1);
                      }}
                      className={`block w-full text-left py-1 px-2 rounded ${
                        selectedCategory === c.name ? 'font-bold text-amber-500' : ''
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Express delivery */}
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={fastDeliveryOnly}
                  onChange={(e) => setFastDeliveryOnly(e.target.checked)}
                  className="w-4 h-4 text-amber-500 accent-amber-500"
                />
                <span>ShopNest Express</span>
              </label>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Max Price</h4>
                <input
                  type="range"
                  min={0}
                  max={150000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-amber-500"
                />
                <span className="text-xs font-bold tabular-nums">
                  ₹{priceRange[1].toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              Apply Filters ({sortedProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
