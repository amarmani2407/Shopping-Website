import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockProducts';
import { LocationModal } from './LocationModal';
import { AuthModal } from './AuthModal';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  User,
  Heart,
  Package,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlist,
    user,
    logout,
    deliveryLocation,
    darkMode,
    toggleDarkMode,
    products,
  } = useApp();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Total cart items count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Autosuggest matches based on searchQuery and category
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      })
      .slice(0, 6);
  }, [searchQuery, selectedCategory, products]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  const handleSuggestionClick = (productId: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-md bg-slate-900 text-slate-100">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* ZONE 1: BRAND LOGO & LOCATION */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Open categories menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ShopNest Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group py-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-['Outfit'] leading-none">
                  Shop<span className="text-amber-400">Nest</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium hidden sm:inline">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Delivery Location Button */}
            <button
              onClick={() => setIsLocationOpen(true)}
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-700 hover:bg-slate-800/80 transition-all text-left"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-tight">
                <span className="text-slate-400 text-[11px] block">Deliver to</span>
                <span className="font-semibold text-slate-100 truncate max-w-[110px] block">
                  {deliveryLocation.city} {deliveryLocation.pincode}
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: SEARCH BAR WITH AUTOSUGGEST */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full rounded-xl overflow-hidden bg-white text-slate-900 border-2 border-transparent focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30 transition-all shadow-inner"
            >
              {/* Category Dropdown */}
              <div className="relative hidden sm:block shrink-0 border-r border-slate-200">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 pl-3 pr-7 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 cursor-pointer appearance-none outline-none transition-colors"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-3.5 pointer-events-none" />
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search across 60+ products, electronics, apparel, brands..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="h-10 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-medium transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Autosuggest Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Product Suggestions
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSuggestionClick(item.id)}
                      className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-9 h-9 object-contain rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          in {item.category} · {item.brand}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                >
                  See all results for &ldquo;{searchQuery}&rdquo; →
                </button>
              </div>
            )}
          </div>

          {/* ZONE 3: ACTIONS (LANGUAGE, ACCOUNT, ORDERS, CART, DARK MODE) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Selector */}
            <div ref={langMenuRef} className="relative hidden xl:block">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                <span>{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
                  {['EN - English', 'HI - हिन्दी', 'ES - Español'].map((lang) => {
                    const code = lang.slice(0, 2);
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrentLang(code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium ${
                          currentLang === code ? 'text-amber-500 font-semibold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Account / Sign In Dropdown */}
            <div ref={accountMenuRef} className="relative">
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthOpen(true);
                  } else {
                    setIsAccountMenuOpen(!isAccountMenuOpen);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <div className="text-xs leading-tight">
                  <span className="text-slate-400 text-[11px] block truncate max-w-[100px]">
                    {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, Sign in'}
                  </span>
                  <span className="font-semibold text-slate-100 flex items-center gap-0.5">
                    Account & Lists
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                </div>
              </button>

              {/* Account Dropdown popup */}
              {isAccountMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Package className="w-4 h-4 text-amber-500" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account?tab=wishlist"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Wishlist ({wishlist.length})</span>
                    </Link>

                    <Link
                      to="/account?tab=profile"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      <span>Profile & Saved Addresses</span>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-500" />
                      <span>Seller Dashboard</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders direct link */}
            <Link
              to="/account?tab=orders"
              className="hidden lg:flex flex-col text-left px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors text-xs leading-tight"
            >
              <span className="text-slate-400 text-[11px]">Returns</span>
              <span className="font-semibold text-slate-100">& Orders</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Icon & Badge */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-sm active:scale-95 group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Cart</span>
              <span className="bg-slate-950 text-white text-[11px] font-black px-1.5 py-0.2 rounded-full tabular-nums group-hover:scale-105 transition-transform">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* SECONDARY CATEGORY SUB-NAV */}
        <div className="bg-slate-800/90 border-t border-slate-700/60 text-xs text-slate-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar py-1.5">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* All categories drawer button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-white hover:bg-slate-700 transition-colors shrink-0"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>All Categories</span>
              </button>

              {/* Category links */}
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="px-2.5 py-1 rounded-md hover:text-amber-400 hover:bg-slate-750 transition-colors shrink-0 font-medium text-slate-300"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Quick deals & Admin links */}
            <div className="hidden md:flex items-center gap-2 pl-4 shrink-0 border-l border-slate-700">
              <Link
                to="/products?deal=true"
                className="px-2.5 py-1 text-amber-400 font-bold hover:underline shrink-0"
              >
                Today&apos;s Deals
              </Link>
              <Link
                to="/products?sort=rating"
                className="px-2.5 py-1 text-slate-300 hover:text-white shrink-0"
              >
                Best Sellers
              </Link>
              <Link
                to="/admin"
                className="px-2.5 py-1 text-indigo-300 hover:text-indigo-200 font-medium shrink-0"
              >
                Seller Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE CATEGORY SLIDE-OVER DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">
                  {user ? `Hello, ${user.name}` : 'Hello, Sign In'}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Shop by Department
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Programs & Features
                </h4>
                <div className="space-y-1">
                  <Link
                    to="/products?deal=true"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  >
                    Today&apos;s Top Deals 🔥
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Your Orders
                  </Link>
                  <Link
                    to="/account?tab=wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Your Wishlist ({wishlist.length})
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400"
                  >
                    Seller / Admin Center
                  </Link>
                </div>
              </div>

              {/* Location in drawer for mobile */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLocationOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Deliver to</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deliveryLocation.city} - {deliveryLocation.pincode}
                      </span>
                    </div>
                  </div>
                  <span className="text-amber-600 font-semibold">Change</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
