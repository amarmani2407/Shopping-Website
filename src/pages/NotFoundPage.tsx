import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-flex p-4 rounded-3xl bg-amber-400/10 text-amber-500 font-extrabold text-5xl font-['Outfit']">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Outfit']">
          Looking for Something?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          We&apos;re sorry. The Web address you entered is not a functioning page on our site.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <Home className="w-4 h-4" />
          <span>ShopNest Home Page</span>
        </Link>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
};
