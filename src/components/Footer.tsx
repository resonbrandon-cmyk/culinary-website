import { useApp } from '../context/AppContext';
import { Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800/80 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Ethos */}
          <div className="md:col-span-1 space-y-4">
            <span className="font-display text-2xl font-bold tracking-tight text-white block">
              SAVOR
            </span>
            <p className="text-stone-400 text-xs leading-relaxed">
              Chef-driven dining delivered with white-glove speed. Sustainably sourced produce, 72-hour fermented doughs, and line-caught seafood.
            </p>
            <div className="pt-2 text-xs text-stone-500">
              San Francisco, CA · Est. 2021
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-stone-200 uppercase">
              Dining & Menu
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('menu')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Full Kitchen Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('menu')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Chef Reserve Specials
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('orders')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Past Orders & Reorder
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Kitchen Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Kitchen */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-stone-200 uppercase">
              Kitchen Hours
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-200 block">Mon – Fri: 11:00 AM – 10:30 PM</span>
                  <span className="text-stone-200 block">Sat – Sun: 10:00 AM – 11:00 PM</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>428 Valencia Street, Mission District, San Francisco</span>
              </div>
            </div>
          </div>

          {/* Management & Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-stone-200 uppercase">
              Guest Care & Operations
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>(415) 890-SAVOR (7286)</span>
              </div>
              <p className="text-stone-500 pt-1">
                Guaranteed insulated temperature-controlled transport on all bicycle and courier orders.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('admin-dashboard')}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 transition-colors font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Store Admin Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div>
            © {new Date().getFullYear()} SAVOR Hospitality Group. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('about')} className="hover:text-stone-400">Privacy & Sourcing</button>
            <button onClick={() => navigate('contact')} className="hover:text-stone-400">Terms of Service</button>
            <button onClick={() => navigate('contact')} className="hover:text-stone-400">Allergen Declarations</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
