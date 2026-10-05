import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Package, ArrowRight, Truck, MapPin } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Order Confirmed & Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-['Outfit']">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            An order confirmation and tax invoice have been dispatched to your email address.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Order ID</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {order ? order.id : orderId}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Delivery</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {order ? order.estimatedDeliveryDate : 'Tomorrow by 11:00 AM'}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Paid</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              ₹{order ? order.totalAmount.toLocaleString('en-IN') : '0'}
            </span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/account?tab=orders"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Track Order in My Account</span>
          </Link>
          <Link
            to="/"
            className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Itemized Summary Card */}
      {order && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-['Outfit'] border-b border-slate-100 dark:border-slate-800 pb-3">
            Order Summary & Dispatch Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Delivery destination */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Delivery Address</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {order.shippingAddress.fullName} ({order.shippingAddress.type})
              </p>
              <p className="text-slate-500">{order.shippingAddress.addressLine1}</p>
              <p className="text-slate-500">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-slate-500">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Payment method */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>Delivery Method</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                ShopNest Express Guaranteed Dispatch
              </p>
              <p className="text-slate-500">Payment: {order.paymentMethod} ({order.paymentDetails || 'Verified'})</p>
              <p className="text-slate-500">Status: <strong className="text-amber-600 dark:text-amber-400 capitalize">{order.status}</strong></p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Purchased Items ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-12 h-12 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.product.title}
                      </p>
                      <p className="text-slate-500">Qty: {item.quantity} · Brand: {item.product.brand}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
