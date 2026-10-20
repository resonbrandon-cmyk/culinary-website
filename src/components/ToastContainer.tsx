import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs sm:text-sm font-medium transition-all duration-200 ${
              isSuccess
                ? 'bg-stone-900 text-stone-50 border-stone-800'
                : isError
                ? 'bg-red-900 text-white border-red-800'
                : 'bg-stone-900 text-stone-100 border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
              <span className="truncate">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white ml-2 p-1 focus:outline-none"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
