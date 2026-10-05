import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Bookmark,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  X,
  Truck,
  Plus,
  Minus,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    savedForLater,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    moveToCartFromSaved,
    removeFromSaved,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalMrp = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const baseDiscount = totalMrp - subtotal;

  // Coupon discount
  const couponDiscountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  // Free shipping above ₹499
  const freeShippingThreshold = 499;
  const isFreeDelivery = subtotal >= freeShippingThreshold || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 50;
  const freeDeliveryRemaining = Math.max(0, freeShippingThreshold - subtotal);

  // Standard GST calculation (~5%)
  const tax = Math.round((subtotal - couponDiscountAmount) * 0.05);
  const finalTotal = subtotal - couponDiscountAmount + deliveryFee + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
          Shopping Cart
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your items, apply vouchers, and proceed to secure checkout.
        </p>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
            Your ShopNest Cart is empty
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore thousands of items with lightning-fast delivery and exclusive deals!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/products?deal=true"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Shop Today&apos;s Deals
            </Link>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-colors"
            >
              Explore All Categories
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Grid: Items (8 Cols) + Summary (4 Cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                {isFreeDelivery ? (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Congratulations! Your order qualifies for FREE Express Delivery.
                  </p>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Add ₹{freeDeliveryRemaining} more to unlock FREE Delivery!
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* List of Cart Items */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2 overflow-hidden flex items-center justify-center shrink-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-amber-600 transition-colors line-clamp-2"
                        >
                          {item.product.title}
                        </Link>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-1 space-x-2">
                        <span>Brand: {item.product.brand}</span>
                        {item.selectedVariants &&
                          Object.entries(item.selectedVariants).map(([k, v]) => (
                            <span key={k}>
                              · {k}: <strong className="text-slate-700 dark:text-slate-300">{v}</strong>
                            </span>
                          ))}
                      </div>

                      {item.product.stock > 0 && (
                        <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Stepper + Save for later + Delete */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Quantity stepper */}
                      <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariants)
                          }
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariants)
                          }
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 text-slate-500">
                        <button
                          onClick={() => saveForLater(item.product.id, item.selectedVariants)}
                          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save for later</span>
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                          className="hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-['Outfit'] border-b border-slate-100 dark:border-slate-800 pb-3">
                Order Summary
              </h2>

              {/* Price rows */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {baseDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Retail MRP Discount</span>
                    <span className="tabular-nums">-₹{baseDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <span>Promo ({appliedCoupon.code})</span>
                      <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                    <span className="tabular-nums font-bold">
                      -₹{couponDiscountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-semibold tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between text-slate-900 dark:text-slate-100">
                  <span className="text-sm font-bold">Order Total</span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Proceed to checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Coupon Code Input */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Apply Promotional Coupon</span>
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. SAVE10 or WELCOME20"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}
                <p className="text-[10px] text-slate-400">
                  Hint: Try <span className="font-mono font-bold text-amber-500">SAVE10</span> (10% off) or <span className="font-mono font-bold text-amber-500">WELCOME20</span> (20% off).
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>ShopNest 100% Purchase Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAVED FOR LATER SECTION */}
      {savedForLater.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-['Outfit'] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <span>Saved for Later ({savedForLater.length} items)</span>
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {savedForLater.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-600 line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => moveToCartFromSaved(item.product.id, item.selectedVariants)}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromSaved(item.product.id, item.selectedVariants)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Delete saved item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
