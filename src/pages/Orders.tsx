import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { RotateCcw, MapPin, ExternalLink, Receipt, ArrowRight } from 'lucide-react';

export default function Orders() {
  const { orders, reorder, navigate } = useApp();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((order) => {
    const isActive = order.status !== 'delivered' && order.status !== 'cancelled';
    if (filter === 'active') return isActive;
    if (filter === 'completed') return !isActive;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-bold font-display text-stone-900">
            Your Order History
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            View status, receipt invoices, or quickly re-order your favorite culinary dishes.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'active'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Active ({orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'completed'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8">
          <h3 className="text-base font-semibold text-stone-900">
            No orders found in this view
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            Hungry for dinner? Discover tonight's culinary specials.
          </p>
          <button
            onClick={() => navigate('menu')}
            className="mt-6 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isActive = order.status !== 'delivered' && order.status !== 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden transition-all hover:border-stone-300"
              >
                {/* Header row */}
                <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500">
                      {formatDate(order.createdAt)}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    {/* Unboxed status text with color pairing */}
                    <span
                      className={`text-xs font-semibold capitalize ${
                        order.status === 'delivered'
                          ? 'text-emerald-700'
                          : order.status === 'cancelled'
                          ? 'text-red-600'
                          : 'text-amber-700 font-bold'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => navigate('order-tracking', { orderId: order.id })}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Live Track</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => reorder(order.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reorder Dishes</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Receipt</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="text-xs text-stone-700 font-medium space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-baseline gap-2">
                          <span className="font-semibold text-stone-900 font-mono">
                            {item.quantity}x
                          </span>
                          <span className="truncate">{item.name}</span>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <span className="text-[11px] text-stone-400 hidden sm:inline">
                              ({item.selectedOptions.map((o) => o.optionName).join(', ')})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.address && (
                      <div className="pt-2 flex items-center gap-1.5 text-xs text-stone-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {order.address.street}, {order.address.city}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0 pt-2 md:pt-0 border-t md:border-0 border-stone-100 w-full md:w-auto flex md:block justify-between items-center">
                    <span className="text-xs text-stone-400 md:block">Total Charged</span>
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  Culinary Order Receipt
                </h3>
                <span className="text-xs font-mono text-stone-500">
                  {selectedReceiptOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="text-stone-400 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Guest:</span>
                  <span className="font-semibold text-stone-900">{selectedReceiptOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{formatDate(selectedReceiptOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="capitalize">{selectedReceiptOrder.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-b border-stone-100 py-3 space-y-2">
                {selectedReceiptOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-semibold text-stone-900">{item.quantity}x {item.name}</span>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="text-[11px] text-stone-400">
                          {item.selectedOptions.map((o) => o.optionName).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-stone-900">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Math breakdown */}
              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">{formatCurrency(selectedReceiptOrder.subtotal)}</span>
                </div>
                {selectedReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-mono tabular-nums">-{formatCurrency(selectedReceiptOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-mono tabular-nums">
                    {selectedReceiptOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(selectedReceiptOrder.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-mono tabular-nums">{formatCurrency(selectedReceiptOrder.tax)}</span>
                </div>
                {selectedReceiptOrder.tip > 0 && (
                  <div className="flex justify-between">
                    <span>Courier Tip:</span>
                    <span className="font-mono tabular-nums">{formatCurrency(selectedReceiptOrder.tip)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total:</span>
                  <span className="font-mono tabular-nums">{formatCurrency(selectedReceiptOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
