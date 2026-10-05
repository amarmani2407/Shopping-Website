import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES } from '../data/mockProducts';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'FESTIVE ELECTRONICS GALA',
    title: 'Up to 40% Off Premium Audio & Laptops',
    subtitle: 'Experience industry-leading ANC, immersive 4K displays, and ultrafast next-gen tech.',
    ctaText: 'Explore Tech Deals',
    ctaLink: '/products?category=Electronics',
    bgGradient: 'from-slate-900 via-slate-800 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'slide-2',
    badge: 'AUTUMN FASHION & LIFESTYLE',
    title: 'Curated Apparel, Heritage Watches & Footwear',
    subtitle: 'Step into seasonal elegance with breathable fabrics, classic denim, and timeless craftsmanship.',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/products?category=Fashion',
    bgGradient: 'from-stone-900 via-slate-900 to-amber-950',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'slide-3',
    badge: 'SMART LIVING & GOURMET KITCHEN',
    title: 'Modern Essentials for the Discerning Home',
    subtitle: 'From espresso machines to air fryers, transform your everyday living rituals effortlessly.',
    ctaText: 'Discover Home Range',
    ctaLink: '/products?category=Home%20%26%20Kitchen',
    bgGradient: 'from-slate-950 via-zinc-900 to-slate-850',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
  },
];

export const HomePage: React.FC = () => {
  const { products, recentlyViewed } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Deals countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 48 });

  const dealsRowRef = useRef<HTMLDivElement>(null);
  const bestSellersRowRef = useRef<HTMLDivElement>(null);

  // Hero carousel auto-slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered product slices
  const dealsProducts = products.filter((p) => p.isDeal);
  const bestSellerProducts = products.filter((p) => p.isBestSeller);
  const recommendedProducts = products.slice(0, 12);
  const recentProducts = products.filter((p) => recentlyViewed.includes(p.id));

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. HERO CAROUSEL */}
      <section
        className="relative overflow-hidden bg-slate-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Promotional banner carousel"
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`w-full shrink-0 min-h-[380px] sm:min-h-[440px] md:min-h-[500px] flex items-center bg-gradient-to-r ${slide.bgGradient} relative`}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
                {/* Left Content */}
                <div className="md:col-span-7 space-y-4 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-['Outfit'] leading-tight text-white drop-shadow-sm">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 hover:scale-102 transition-all flex items-center gap-2"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/products"
                      className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all"
                    >
                      Browse All Categories
                    </Link>
                  </div>
                </div>

                {/* Right Image Feature */}
                <div className="md:col-span-5 hidden md:flex items-center justify-center">
                  <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-2xl p-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative background overlay gradient fade at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-100 dark:from-slate-950 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Carousel Prev / Next Controls */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-sm border border-white/10 shadow-md transition-all hover:scale-105"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-sm border border-white/10 shadow-md transition-all hover:scale-105"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORY SHOWCASE GRID ("Shop by Category") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore curated top-tier catalogs across all departments
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View all products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => {
            // Find sample product image for category
            const sample = products.find((p) => p.category === cat.name);
            const imgUrl =
              sample?.images[0] ||
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={imgUrl}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                  Explore deals
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TODAY'S DEALS (Horizontal Scroll Row with Countdown) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent dark:from-amber-950/30 dark:via-amber-900/10 p-4 sm:p-6 rounded-2xl border border-amber-200 dark:border-amber-900/40">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-xs">
                <Flame className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
                    Today&apos;s Flash Deals
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                    Limited Time
                  </span>
                </div>
                {/* Countdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Ends in:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRow(dealsRowRef, 'left')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRow(dealsRowRef, 'right')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Product Scroller */}
          <div
            ref={dealsRowRef}
            className="flex gap-4 overflow-x-auto custom-scrollbar pb-3 snap-x"
          >
            {dealsProducts.map((product) => (
              <div
                key={product.id}
                className="w-56 sm:w-64 shrink-0 snap-start flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS (Horizontal Product Scroller) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
                Best Sellers in All Departments
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most purchased and highest-rated items by Indian shoppers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollRow(bestSellersRowRef, 'left')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRow(bestSellersRowRef, 'right')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={bestSellersRowRef}
          className="flex gap-4 overflow-x-auto custom-scrollbar pb-3 snap-x"
        >
          {bestSellerProducts.map((product) => (
            <div
              key={product.id}
              className="w-56 sm:w-64 shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROMOTIONAL FEATURE BENTO (Highlights for Prime / ShopNest Express) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] mb-1">
                ShopNest Express Delivery
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy priority same-day or next-morning dispatch on over 10,000 top essentials.
              </p>
            </div>
            <Link
              to="/products?fast=true"
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>Explore Express eligible items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-400/20 text-indigo-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] mb-1">
                100% Brand Certified
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct authorized sourcing with manufacturer warranty and hassle-free replacements.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5"
            >
              <span>Learn about verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/80 to-slate-900 text-white flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] mb-1">
                Special Coupon Savings
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use code <span className="font-mono font-bold text-amber-300">SAVE10</span> for 10% off, or{' '}
                <span className="font-mono font-bold text-amber-300">WELCOME20</span> on your first order.
              </p>
            </div>
            <Link
              to="/cart"
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>Redeem code in cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDED FOR YOU (Product Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
              Recommended for You
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized selections tailored to popular trends
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>See full catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. RECENTLY VIEWED (If user has browsed items) */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 font-['Outfit']">
            Your Recently Viewed Items
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {recentProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
