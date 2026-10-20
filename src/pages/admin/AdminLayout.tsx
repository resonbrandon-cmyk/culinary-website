import { ReactNode } from 'react';
import { useApp, PageRoute } from '../../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Users,
  Store,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({
  activeTab,
  children,
}: {
  activeTab: 'dashboard' | 'products' | 'orders' | 'customers';
  children: ReactNode;
}) {
  const { navigate, orders } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const navItems: { id: PageRoute; tab: 'dashboard' | 'products' | 'orders' | 'customers'; label: string; icon: any; badge?: number }[] = [
    { id: 'admin-dashboard', tab: 'dashboard', label: 'Store Overview', icon: LayoutDashboard },
    { id: 'admin-orders', tab: 'orders', label: 'Live Kitchen Orders', icon: ClipboardList, badge: activeOrdersCount },
    { id: 'admin-products', tab: 'products', label: 'Menu & Inventory', icon: UtensilsCrossed },
    { id: 'admin-customers', tab: 'customers', label: 'Customer Directory', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16">
      {/* Admin Top Header */}
      <div className="bg-stone-900 text-stone-200 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wide">
                SAVOR · Kitchen Management Console
              </span>
              <span className="text-[11px] text-stone-400 block">
                Flagship Store #01 · Valencia St, SF
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('home')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-700"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Return to Diner Storefront</span>
          </button>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="bg-white border-b border-stone-200 sticky top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                      isActive ? 'bg-amber-400 text-stone-950' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
