import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Share2,
  Check,
  Star,
  Sparkles,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    deliveryLocation,
    addProductReview,
    addToast,
  } = useApp();

  const product = products.find((p) => p.id === id);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Pincode live check
  const [pincodeCheck, setPincodeCheck] = useState(deliveryLocation.pincode);
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  // Customer review form
  const [newRating, setNewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Add to recently viewed on mount
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // initialize default variant selections
      if (product.variants && product.variants.length > 0) {
        const defaults: Record<string, string> = {};
        product.variants.forEach((v) => {
          defaults[v.type] = v.options[0];
        });
        setSelectedVariants(defaults);
      }
      setSelectedImageIndex(0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Product Not Found
        </h2>
        <p className="text-slate-500 text-sm">
          The requested product may have been relocated or is no longer listed.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-500 transition-colors"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  // Customers also bought (same category or top deals excluding current)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    navigate('/checkout');
  };

  const handlePincodeVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeCheck)) {
      setPincodeMessage('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeMessage(
      `Eligible for FREE Express delivery by Tomorrow, 11:00 AM to ${pincodeCheck}`
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on ShopNest!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      addToast('Please complete all review fields', 'warning');
      return;
    }
    setIsSubmittingReview(true);
    addProductReview(product.id, {
      userName: reviewName,
      rating: newRating,
      title: reviewTitle,
      comment: reviewComment,
      verified: true,
    });
    setReviewTitle('');
    setReviewComment('');
    setIsSubmittingReview(false);
  };

  // Image hover zoom position handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Star breakdown calculation
  const totalReviews = product.reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = product.reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : stars === 5 ? 70 : 15;
    return { stars, count, percent };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-amber-500 transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-amber-500 transition-colors shrink-0"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-400 dark:text-slate-500 truncate max-w-xs">{product.brand}</span>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-sm">
          {product.title}
        </span>
      </nav>

      {/* Main PDP Grid: Gallery (Left) + Details (Middle) + Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MULTI-IMAGE GALLERY (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4 sticky top-28">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 p-1 bg-white dark:bg-slate-900 overflow-hidden transition-all ${
                  selectedImageIndex === idx
                    ? 'border-amber-500 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
                aria-label={`Product thumbnail ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.title} thumb ${idx}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Main Showcase Image with Hover Zoom */}
          <div
            className="flex-1 aspect-square rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex items-center justify-center relative overflow-hidden group cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Deals Badge */}
            {product.isDeal && (
              <span className="absolute top-4 left-4 z-10 text-xs font-bold text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-1 rounded-md">
                {product.dealTag || 'Special Deal'}
              </span>
            )}

            {/* Share & Wishlist quick buttons */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 shadow-xs transition-colors"
                aria-label="Share product"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 shadow-xs transition-colors"
                aria-label="Add to wishlist"
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Main Img */}
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* MIDDLE COLUMN: TITLE, SPECS, VARIANTS (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Brand & Title */}
          <div>
            <Link
              to={`/products?brand=${encodeURIComponent(product.brand)}`}
              className="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase hover:underline"
            >
              Visit the {product.brand} Store
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug font-['Outfit']">
              {product.title}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <RatingStars rating={product.rating} count={product.ratingCount} size="md" />
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              1,000+ bought in past month
            </span>
          </div>

          {/* Pricing Module */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    -{product.discountPercent}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Inclusive of all taxes</p>
          </div>

          {/* Variants Selectors (e.g. Size, Color, Storage) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              {product.variants.map((v) => (
                <div key={v.type} className="space-y-2">
                  <span className="text-xs font-semibold capitalize text-slate-700 dark:text-slate-300">
                    {v.type}: <span className="font-bold text-slate-900 dark:text-slate-100">{selectedVariants[v.type]}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => {
                      const isSelected = selectedVariants[v.type] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() =>
                            setSelectedVariants((prev) => ({ ...prev, [v.type]: opt }))
                          }
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Features Bullet List */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About this item
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold leading-none mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: BUY BOX (3 Cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4 sticky top-28">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              ₹{(product.price * quantity).toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>FREE Delivery</span>
            </div>
          </div>

          {/* Estimated delivery date */}
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
            <p>
              Delivery by{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Tomorrow, 11:00 AM
              </span>
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Deliver to {deliveryLocation.city} {deliveryLocation.pincode}
              </span>
            </div>
          </div>

          {/* Stock Availability */}
          <div>
            {product.stock > 10 ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                In Stock ({product.stock} units available)
              </span>
            ) : product.stock > 0 ? (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Only {product.stock} left in stock — order soon!
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-500">Currently Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="qty-select" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Quantity:
            </label>
            <select
              id="qty-select"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Secure transaction assurance */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Secure transaction encrypted with 256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500 shrink-0" />
              <span>7 Days Returnable & Exchangeable</span>
            </div>
          </div>

          {/* Check delivery pincode form */}
          <form onSubmit={handlePincodeVerify} className="pt-2 space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
              Check delivery for your pincode
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                maxLength={6}
                value={pincodeCheck}
                onChange={(e) => setPincodeCheck(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit PIN"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg shrink-0"
              >
                Check
              </button>
            </div>
            {pincodeMessage && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {pincodeMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* TABS: Description, Specifications, Customer Reviews */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'desc'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({product.reviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Product Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    Authentic Guarantee
                  </span>
                  <p className="text-xs text-slate-500">
                    Sourced directly from authorized distributors and verified sellers with intact serial tracking.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    Eco-Friendly Packaging
                  </span>
                  <p className="text-xs text-slate-500">
                    Delivered in 100% recyclable, tamper-evident protective transit cartons.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={
                        idx % 2 === 0
                          ? 'bg-slate-50 dark:bg-slate-800/50'
                          : 'bg-white dark:bg-slate-900'
                      }
                    >
                      <td className="py-2.5 px-4 font-semibold text-slate-500 w-1/3 border-b border-slate-100 dark:border-slate-800">
                        {key}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Star Breakdown (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                      {product.rating}
                    </span>
                    <span className="text-xs text-slate-400">out of 5 stars</span>
                  </div>
                  <RatingStars rating={product.rating} size="md" />
                  <p className="text-xs text-slate-500">
                    Based on {product.ratingCount.toLocaleString()} global ratings
                  </p>
                </div>

                {/* Rating Distribution Bars */}
                <div className="space-y-2 pt-2">
                  {ratingDistribution.map(({ stars, percent }) => (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-slate-600 dark:text-slate-400 shrink-0">
                        {stars} star
                      </span>
                      <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-slate-400 tabular-nums">
                        {percent}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Form to submit review */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Write a Customer Review
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block mb-1">
                        Overall Rating
                      </span>
                      <RatingStars
                        rating={newRating}
                        interactive
                        size="md"
                        onRatingChange={(r) => setNewRating(r)}
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Your Name (e.g. Ramesh K.)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />

                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Review Headline (e.g. Exceptional build & sound)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />

                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your detailed experience with this product..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                </div>
              </div>

              {/* Reviews List (8 Cols) */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Top Customer Reviews
                </h3>

                {product.reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No written reviews yet. Be the first to share your experience!
                  </p>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 font-bold text-[10px] flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {rev.userName}
                          </span>
                          {rev.verified && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                              <Check className="w-3 h-3" />
                              <span>Verified Purchase</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <RatingStars rating={rev.rating} size="sm" />
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rev.title}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>

                        <span className="text-[10px] text-slate-400 block">
                          Reviewed in India on {rev.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOMERS ALSO BOUGHT CAROUSEL */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
              Customers Who Bought This Item Also Bought
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
