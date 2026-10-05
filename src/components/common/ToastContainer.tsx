import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100';
        let iconColor = 'text-emerald-600 dark:text-emerald-400';

        if (toast.type === 'error') {
          Icon = XCircle;
          colorClasses = 'border-rose-500/20 bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100';
          iconColor = 'text-rose-600 dark:text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          colorClasses = 'border-amber-500/20 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-100';
          iconColor = 'text-amber-600 dark:text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'border-blue-500/20 bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-100';
          iconColor = 'text-blue-600 dark:text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${colorClasses}`}
            role="status"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-xs font-medium leading-tight truncate">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
