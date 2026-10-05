import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { AuthModal } from '../components/common/AuthModal';
import {
  Package,
  Heart,
  MapPin,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    user,
    logout,
    orders,
    cancelOrder,
    wishlist,
    products,
    addToCart,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const tabParam = (searchParams.get('tab') as any) || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(tabParam);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Address modal form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home' as 'home' | 'work',
    isDefault: false,
  });

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'orders' | 'wishlist' | 'addresses' | 'profile') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Products in wishlist
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // If user is not logged in, prompt to log in or use demo account
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
          Sign In to Access Your ShopNest Account
        </h2>
        <p className="text-xs text-slate-500">
          Track packages, manage saved addresses, review previous orders, and curate your wishlist.
        </p>
        <button
          onClick={() => setIsAuthOpen(true)}
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          Sign In / Demo Login
        </button>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.addressLine1 || !newAddr.pincode) return;
    addAddress(newAddr);
    setShowAddressForm(false);
    setNewAddr({
      fullName: user.name,
      phone: user.phone,
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home',
      isDefault: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Account Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 font-black text-xl flex items-center justify-center border border-amber-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500">
              {user.email} · Customer since August 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
            >
              Seller Dashboard
            </Link>
          )}

          <button
            onClick={logout}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-2">
        {[
          { key: 'orders', label: 'My Orders', icon: Package, count: orders.length },
          { key: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
          { key: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user.addresses.length },
          { key: 'profile', label: 'Profile Settings', icon: UserIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={`py-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tabular-nums font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                No orders placed yet
              </h3>
              <p className="text-xs text-slate-500">
                You haven&apos;t placed any orders with this account yet.
              </p>
              <Link
                to="/products"
                className="inline-block px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const isCancelled = order.status === 'cancelled';

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs space-y-4"
                  >
                    {/* Order header ribbon */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                            Order Placed
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {new Date(order.date).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                            Total
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                            Ship To
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.shippingAddress.fullName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Order # {order.id}
                        </span>
                        <span
                          className={`font-bold uppercase tracking-wider text-[11px] ${
                            isDelivered
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isCancelled
                              ? 'text-rose-500'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Order Items & Live Tracking Stepper */}
                    <div className="p-4 sm:p-6 space-y-6">
                      {/* Tracking Progress Timeline */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Shipment Tracking Timeline
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          {order.trackingUpdates.map((step, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                                step.completed
                                  ? 'border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold">
                                {step.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="truncate">{step.label}</span>
                              </div>
                              <p className="text-[10px] opacity-75">{step.date}</p>
                              {step.detail && (
                                <p className="text-[10px] text-slate-500 truncate">{step.detail}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-14 h-14 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0"
                              />
                              <div>
                                <Link
                                  to={`/product/${item.product.id}`}
                                  className="font-bold text-slate-900 dark:text-slate-100 hover:text-amber-600 line-clamp-1"
                                >
                                  {item.product.title}
                                </Link>
                                <p className="text-slate-500">
                                  Qty: {item.quantity} · Price: ₹
                                  {item.product.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addToCart(item.product, 1, item.selectedVariants)}
                                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Buy Again</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-500">
                          Paid via {order.paymentMethod} ({order.paymentDetails || 'Verified'})
                        </span>

                        {!isDelivered && !isCancelled && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer"
                          >
                            Cancel this Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 2. WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Your Saved Items ({wishlistedProducts.length})
            </h3>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Your Wishlist is empty
              </h3>
              <p className="text-xs text-slate-500">
                Explore products and click the heart icon on any card to save it for later.
              </p>
              <Link
                to="/products"
                className="inline-block px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Discover Deals
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Manage Delivery Addresses
            </h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Add New Shipping Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Address Line 1 (Street, House No, Society)"
                value={newAddr.addressLine1}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="PIN Code"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 space-y-3 relative ${
                  addr.isDefault
                    ? 'border-amber-500 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {addr.fullName}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {addr.type}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                  <p>{addr.addressLine1}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-slate-500">Phone: {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-slate-400">Default destination</span>
                  )}

                  {user.addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Profile & App Preferences
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user.name}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Registered Phone</label>
              <input
                type="tel"
                disabled
                value={user.phone}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            {/* Dark Mode Preference */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Dark Theme</p>
                <p className="text-slate-500">Toggle high-contrast dark surface palette</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
