import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, X, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  { city: 'Mumbai', pincode: '400001' },
  { city: 'New Delhi', pincode: '110001' },
  { city: 'Bengaluru', pincode: '560001' },
  { city: 'Hyderabad', pincode: '500001' },
  { city: 'Chennai', pincode: '600001' },
  { city: 'Pune', pincode: '411001' },
  { city: 'Kolkata', pincode: '700001' },
  { city: 'Ahmedabad', pincode: '380001' },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { deliveryLocation, setDeliveryLocation, user } = useApp();
  const [customPincode, setCustomPincode] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(customPincode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    const city = customCity.trim() || 'Your Location';
    setDeliveryLocation(city, customPincode.trim());
    setError('');
    onClose();
  };

  const handleSelectCity = (city: string, pincode: string) => {
    setDeliveryLocation(city, pincode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h2 id="location-modal-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Choose your delivery location
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a delivery location to see product availability and shipping estimates for ShopNest Express.
          </p>

          {/* Saved addresses if logged in */}
          {user && user.addresses.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Your Saved Addresses
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {user.addresses.map((addr) => {
                  const isCurrent =
                    deliveryLocation.pincode === addr.pincode && deliveryLocation.city === addr.city;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => handleSelectCity(addr.city, addr.pincode)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="text-xs space-y-0.5 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{addr.fullName}</span>
                          <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 truncate">{addr.addressLine1}</p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-amber-500 shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enter pincode */}
          <form onSubmit={handleApplyPincode} className="space-y-2">
            <label htmlFor="pincode-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Or enter an Indian PIN code
            </label>
            <div className="flex gap-2">
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                value={customPincode}
                onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 400001"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </form>

          {/* Quick city selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Popular Delivery Hubs
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_CITIES.map((c) => {
                const isActive = deliveryLocation.city === c.city && deliveryLocation.pincode === c.pincode;
                return (
                  <button
                    key={c.city}
                    onClick={() => handleSelectCity(c.city, c.pincode)}
                    className={`px-2.5 py-2 text-xs font-medium rounded-lg text-center border transition-all ${
                      isActive
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c.city}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
