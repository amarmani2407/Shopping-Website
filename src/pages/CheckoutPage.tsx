import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import {
  Check,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Plus,
  Lock,
  Smartphone,
  Building,
  Banknote,
  Loader2,
  MapPin,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, user, createOrder, appliedCoupon, addAddress } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(user ? 2 : 1);

  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.defaultAddressId || (user?.addresses[0]?.id ?? '')
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home' as 'home' | 'work',
    isDefault: false,
  });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('amar@okaxis');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8912',
    name: 'Amar Gupta',
    expiry: '08/28',
    cvv: '•••',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Your cart is currently empty
        </h2>
        <p className="text-xs text-slate-500">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-amber-400 font-bold text-slate-950 text-xs rounded-xl"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  // Cost calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const couponDiscount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const deliveryFee = subtotal >= 499 ? 0 : 50;
  const tax = Math.round((subtotal - couponDiscount) * 0.05);
  const totalAmount = subtotal - couponDiscount + deliveryFee + tax;

  const currentSelectedAddress: Address =
    user?.addresses.find((a) => a.id === selectedAddressId) ||
    user?.addresses[0] || {
      id: 'default',
      fullName: 'Amar Gupta',
      phone: '+91 98765 43210',
      addressLine1: 'Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      isDefault: true,
      type: 'home',
    };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.fullName || !newAddrForm.addressLine1 || !newAddrForm.pincode) return;
    addAddress(newAddrForm);
    setIsAddingNewAddress(false);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    let paymentDetails = '';
    if (paymentMethod === 'UPI') paymentDetails = `UPI ID: ${upiId}`;
    if (paymentMethod === 'Card') paymentDetails = `Card ending ${cardDetails.number.slice(-4)}`;
    if (paymentMethod === 'Net Banking') paymentDetails = `${selectedBank} NetBanking`;
    if (paymentMethod === 'Cash on Delivery') paymentDetails = 'Pay on delivery (Cash / QR)';

    setTimeout(() => {
      const order = createOrder({
        items: cart,
        shippingAddress: currentSelectedAddress,
        paymentMethod,
        paymentDetails,
        subtotal,
        discount: couponDiscount,
        deliveryFee,
        tax,
        totalAmount,
      });
      setIsProcessing(false);
      navigate(`/order-confirmation/${order.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Checkout Header with Progress Stepper */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit'] flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              <span>Secure Checkout</span>
            </h1>
            <p className="text-xs text-slate-500">
              Complete your order with ShopNest buyer protection
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Review' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                {idx > 0 && (
                  <div
                    className={`w-6 h-0.5 ${
                      currentStep >= step.num ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
                <button
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num as any);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                    currentStep === step.num
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : currentStep > step.num
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep > step.num ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{step.num}.</span>
                  )}
                  <span>{step.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Checkout Grid: Steps (8 Cols) + Summary (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* STEPS CONTAINER */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: ACCOUNT DETAILS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Account Details
                </h3>
              </div>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-amber-600 font-semibold hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {currentStep === 1 ? (
              <div className="space-y-3 pt-2 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Signed in as{' '}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {user?.name || 'Customer'}
                  </strong>{' '}
                  ({user?.email || 'amar.gupta@shopnest.com'})
                </p>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Continue to Delivery Address
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {user?.name} · {user?.email}
              </p>
            )}
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Select Delivery Address
                </h3>
              </div>
              {currentStep > 2 && (
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-amber-600 font-semibold hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {currentStep === 2 ? (
              <div className="space-y-4 pt-2">
                {/* Saved addresses options */}
                <div className="space-y-2.5">
                  {user?.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-amber-500 accent-amber-500"
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {addr.fullName}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{addr.addressLine1}</p>
                        <p className="text-slate-500">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-slate-500 font-medium">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Add new address toggle */}
                {!isAddingNewAddress ? (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add a new delivery address</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveNewAddress} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">New Address Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={newAddrForm.fullName}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, fullName: e.target.value })}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number (+91)"
                        value={newAddrForm.phone}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Flat, House no., Building, Apartment"
                      value={newAddrForm.addressLine1}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, addressLine1: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newAddrForm.city}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newAddrForm.state}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="PIN Code"
                        value={newAddrForm.pincode}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg"
                      >
                        Save and Use Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="px-4 py-2 text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Deliver to this Address
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {currentSelectedAddress.fullName}, {currentSelectedAddress.addressLine1},{' '}
                {currentSelectedAddress.city} - {currentSelectedAddress.pincode}
              </p>
            )}
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Select Payment Method
                </h3>
              </div>
              {currentStep > 3 && (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-amber-600 font-semibold hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {currentStep === 3 ? (
              <div className="space-y-4 pt-2">
                {/* Method Choices */}
                <div className="space-y-3">
                  {/* UPI */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          <span>UPI (Google Pay, PhonePe, Paytm, QR)</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Instant 0% Fee
                      </span>
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div className="mt-3 pl-6 space-y-2">
                        <label className="text-[11px] text-slate-500 block">Enter your UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-full sm:w-64"
                        />
                      </div>
                    )}
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'Card'}
                          onChange={() => setPaymentMethod('Card')}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>Credit or Debit Card (Visa, Mastercard, RuPay)</span>
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'Card' && (
                      <div className="mt-3 pl-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="Card Number"
                          className="sm:col-span-3 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="Name on Card"
                          className="sm:col-span-2 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    )}
                  </label>

                  {/* Net Banking */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Net Banking'
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === 'Net Banking'}
                        onChange={() => setPaymentMethod('Net Banking')}
                        className="accent-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-purple-600" />
                        <span>Net Banking (All Indian Major Banks)</span>
                      </span>
                    </div>
                    {paymentMethod === 'Net Banking' && (
                      <div className="mt-3 pl-6">
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 w-full sm:w-64"
                        >
                          <option>HDFC Bank</option>
                          <option>State Bank of India (SBI)</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="accent-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-amber-600" />
                        <span>Cash on Delivery (Pay cash or scan QR at doorstep)</span>
                      </span>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Continue to Order Review
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Payment via {paymentMethod}
              </p>
            )}
          </div>

          {/* STEP 4: REVIEW ITEMS & PLACE ORDER */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Review Items & Delivery
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.product.title}
                        </p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-3">
                <Truck className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    Guaranteed Delivery: Tomorrow by 11:00 AM
                  </p>
                  <p className="text-slate-500">Dispatched via ShopNest Express Logistics</p>
                </div>
              </div>

              {/* Final Place Order button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Confirming your order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Your Order (₹{totalAmount.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 sticky top-28">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Payment Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span className="font-bold tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Charges</span>
              <span className="font-semibold tabular-nums">
                {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Taxes (GST 5%)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                ₹{tax.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Order Total</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">ShopNest Secure Purchase</span>
            </div>
            <p>By placing your order, you agree to ShopNest&apos;s conditions of use and sale notice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
