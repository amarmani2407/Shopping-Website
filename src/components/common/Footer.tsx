import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RotateCcw, Truck, Award, ChevronUp, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 text-xs">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-t border-slate-700/60"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Back to top</span>
      </button>

      {/* Value Proposition Badges */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Free Express Delivery</p>
              <p className="text-[11px] text-slate-400">On all eligible orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Easy 7-Day Returns</p>
              <p className="text-[11px] text-slate-400">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">100% Secure Checkout</p>
              <p className="text-[11px] text-slate-400">UPI, Cards, NetBanking & COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Genuine Brand Assurance</p>
              <p className="text-[11px] text-slate-400">Directly sourced verified goods</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Link Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">About ShopNest</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Careers & Culture</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Press Releases</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">ShopNest Science & Tech</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Connect with Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">X (formerly Twitter)</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors font-semibold text-amber-400/90">Sell on ShopNest Dashboard</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Become an Affiliate</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Fulfilment by ShopNest</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Advertise Your Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/account?tab=orders" className="hover:text-amber-400 transition-colors">Your Account & Orders</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-amber-400 transition-colors">Returns Centre</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400 transition-colors">Purchase Protection</Link></li>
              <li><Link to="/account?tab=profile" className="hover:text-amber-400 transition-colors">Help & Customer Support</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Logo, Languages & Copyright */}
      <div className="border-t border-slate-800 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            </div>
            <span className="font-bold text-white font-['Outfit'] text-base tracking-tight">
              Shop<span className="text-amber-400">Nest</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[11px]">
            <span>Conditions of Use & Sale</span>
            <span>·</span>
            <span>Privacy Notice</span>
            <span>·</span>
            <span>Interest-Based Ads</span>
            <span>·</span>
            <span>© 2026 ShopNest, Inc. or its affiliates. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
