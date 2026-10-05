import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { RatingStars } from './RatingStars';
import { Heart, Zap, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // High-reliability curated fallback SVG placeholder if remote image fails
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23f1f5f9" width="400" height="400"/><text fill="%2364748b" font-family="sans-serif" font-size="20" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(
    product.brand + ' - ' + product.category
  )}</text></svg>`;

  if (layout === 'list') {
    return (
      <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 relative">
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 shadow-sm transition-all"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Thumbnail Image */}
        <Link
          to={`/product/${product.id}`}
          className="w-full sm:w-48 h-48 rounded-xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center shrink-0 relative"
        >
          <img
            src={imgError ? fallbackSvg : product.images[0]}
            alt={product.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.isDeal && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded">
              {product.dealTag || 'Deal'}
            </span>
          )}
        </Link>

        {/* Info Column */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
            </div>

            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                {product.title}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.rating} count={product.ratingCount} size="sm" />
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {product.discountPercent}% off
                    </span>
                  </>
                )}
              </div>
              {product.fastDelivery && (
                <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>ShopNest Express — Delivery Tomorrow</span>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 relative">
      {/* Top badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div>
          {product.isDeal ? (
            <span className="text-[10px] font-bold tracking-tight text-rose-700 bg-rose-50/90 dark:bg-rose-950/90 dark:text-rose-300 px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
              {product.dealTag || `${product.discountPercent}% OFF`}
            </span>
          ) : product.isBestSeller ? (
            <span className="text-[10px] font-bold tracking-tight text-amber-800 bg-amber-100/90 dark:bg-amber-950/90 dark:text-amber-300 px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
              Best Seller
            </span>
          ) : null}
        </div>

        <button
          onClick={handleToggleWishlist}
          className="pointer-events-auto p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 shadow-xs hover:scale-110 transition-all"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="w-full aspect-square rounded-xl bg-slate-50 dark:bg-slate-800/40 overflow-hidden flex items-center justify-center p-3 relative mb-3 group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800/60 transition-colors"
      >
        <img
          src={imgError ? fallbackSvg : product.images[0]}
          alt={product.title}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Meta & Title */}
      <div className="space-y-1.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{product.brand}</span>
          <span className="truncate">{product.category}</span>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Stars */}
        <div className="pt-0.5">
          <RatingStars rating={product.rating} count={product.ratingCount} size="sm" />
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-2 space-y-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-[11px] text-slate-400 line-through tabular-nums">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {product.fastDelivery && (
            <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <span>Tomorrow by 11 AM</span>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAddToCart}
        className={`w-full mt-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
          isAdded
            ? 'bg-emerald-600 text-white'
            : 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-98 shadow-xs'
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added to Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
};
