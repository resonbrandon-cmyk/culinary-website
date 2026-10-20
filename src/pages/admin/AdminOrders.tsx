import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';
import { OrderStatus, Order } from '../../types';
import { formatCurrency, formatDate, formatTimeOnly } from '../../utils/format';
import { Clock, CheckCircle2, ChevronRight, XCircle, MapPin, Phone } from 'lucide-react';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'preparing':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'ready':
      case 'out_for_delivery':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'cancelled':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-stone-800 bg-stone-50 border-stone-200';
    }
  };

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-bold font-display text-stone-900">
              Live Kitchen Orders & Dispatch
            </h1>
            <p className="text-xs text-stone-500">
              Accept incoming diner orders, route tickets to kitchen lines, and track driver dispatch.
            </p>
          </div>

          <div className="text-xs font-mono text-stone-500">
            Active: <strong className="text-stone-900">{orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length}</strong> tickets
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-2 rounded-xl border border-stone-200 scrollbar-none">
          {(
            [
              { id: 'all', label: 'All Orders' },
              { id: 'confirmed', label: '1. New Tickets' },
              { id: 'preparing', label: '2. In Kitchen' },
              { id: 'out_for_delivery', label: '3. Out with Courier' },
              { id: 'delivered', label: '4. Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Grid / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
            No orders match this status criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const isConfirmed = order.status === 'confirmed';
              const isPreparing = order.status === 'preparing';
              const isOut = order.status === 'out_for_delivery';
              const isDelivered = order.status === 'delivered';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        {formatTimeOnly(order.createdAt)} · {order.deliveryType}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="p-4 space-y-3 flex-1">
                    <div className="flex items-start justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          {order.customerName}
                        </span>
                        <span className="text-stone-500 text-[11px] font-mono">
                          {order.customerPhone}
                        </span>
                      </div>
                      <span className="font-bold font-mono text-sm text-stone-900 tabular-nums">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {order.address && (
                      <div className="text-[11px] text-stone-500 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {order.address.street}, {order.address.city}
                        </span>
                      </div>
                    )}

                    {/* Order Items Table */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between font-semibold text-stone-800">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-mono text-stone-600 font-normal">
                              {formatCurrency(item.price)}
                            </span>
                          </div>

                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="text-[11px] text-stone-500 pl-3">
                              {item.selectedOptions.map((o) => o.optionName).join(' · ')}
                            </div>
                          )}

                          {item.specialInstructions && (
                            <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                              NOTE: "{item.specialInstructions}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                    {isConfirmed && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Accept & Start Cooking
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors"
                      >
                        Ready · Hand to Courier
                      </button>
                    )}

                    {isOut && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Mark Handed to Diner
                      </button>
                    )}

                    {isDelivered && (
                      <div className="w-full text-center text-xs text-emerald-700 font-semibold py-1">
                        ✓ Completed & Settled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
