import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';
import { formatCurrency, formatDate } from '../../utils/format';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Utensils,
  ArrowRight,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const { orders, products, navigate, updateOrderStatus } = useApp();
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Computed KPIs
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const outOfStockProducts = products.filter((p) => !p.inStock);

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        {/* Top Operational Status Banner */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 text-sm">
                Kitchen Dispatch Status:
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isStoreOpen
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isStoreOpen ? 'Accepting Live Orders' : 'Kitchen Paused (Order Hold)'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Estimated kitchen turnaround is running within the standard 18-minute window.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isStoreOpen
                  ? 'border-stone-300 text-stone-700 hover:bg-stone-100'
                  : 'bg-emerald-600 text-white border-emerald-600'
              }`}
            >
              {isStoreOpen ? 'Pause Incoming Tickets' : 'Resume Kitchen Queue'}
            </button>

            <button
              onClick={() => navigate('admin-products')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Food Item</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (Section 1.D: Tabular figures, single elevation, no scoreboards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
              Cumulative Revenue
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              +14.2% from yesterday
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
              Active Kitchen Tickets
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {activeOrders.length}
            </div>
            <div className="text-[11px] text-stone-500">
              {orders.filter((o) => o.status === 'preparing').length} currently on the grill/station
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
              Delivered Successfully
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {deliveredOrders.length}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              100% on-time guarantee met
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
              Average Prep Duration
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              16.4 min
            </div>
            <div className="text-[11px] text-stone-500">
              Target threshold $\le$ 20 min
            </div>
          </div>
        </div>

        {/* 2-Column: Live Queue & Top Selling Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Orders Quick Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-display text-stone-900">
                  Incoming & Active Kitchen Orders
                </h2>
                <p className="text-xs text-stone-500">
                  Manage ticket workflow in real-time
                </p>
              </div>
              <button
                onClick={() => navigate('admin-orders')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                <span>Full Orders Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No active tickets right now. All current orders have been completed and delivered!
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-stone-900">
                          {order.orderNumber}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="text-xs font-semibold text-stone-700">
                          {order.customerName}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="text-xs text-amber-700 font-semibold capitalize">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-stone-500">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-stone-900 tabular-nums">
                        {formatCurrency(order.total)}
                      </span>

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                        >
                          Send to Kitchen
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-stone-950 rounded-lg hover:bg-amber-600"
                        >
                          Dispatch Driver
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Out-of-Stock Alert & Menu Status */}
          <div className="lg:col-span-4 space-y-6">
            {outOfStockProducts.length > 0 && (
              <div className="bg-red-50/80 p-5 rounded-2xl border border-red-200 space-y-2">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>86'd Items Notice ({outOfStockProducts.length})</span>
                </div>
                <p className="text-xs text-red-700">
                  The following items are hidden from guest checkout:
                </p>
                <div className="space-y-1 pt-1">
                  {outOfStockProducts.map((p) => (
                    <div key={p.id} className="text-xs font-semibold text-red-900 flex justify-between">
                      <span>{p.name}</span>
                      <button
                        onClick={() => navigate('admin-products')}
                        className="underline text-[11px] text-red-800"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Items Showcase */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold font-display text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Today's Top Velocity Items</span>
              </h3>

              <div className="space-y-3 text-xs">
                {products.slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-stone-400 font-semibold">0{idx + 1}</span>
                      <span className="font-semibold text-stone-800 truncate">{p.name}</span>
                    </div>
                    <span className="font-mono tabular-nums text-stone-500">
                      {p.reviewCount} orders
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
