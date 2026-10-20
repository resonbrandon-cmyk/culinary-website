import { useApp } from '../context/AppContext';
import { Utensils, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const { navigate } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
        <Utensils className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <span className="font-mono text-xs font-bold text-amber-800 tracking-wider uppercase block">
          404 · Page Not Found
        </span>
        <h1 className="text-2xl font-bold font-display text-stone-900">
          We couldn't find that culinary page
        </h1>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          The dish or destination you requested might have been updated or moved.
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <button
          onClick={() => navigate('menu')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors"
        >
          View Menu
        </button>
        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
