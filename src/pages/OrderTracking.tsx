import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { OrderStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  Utensils,
  ChevronRight,
  ShieldCheck,
  FastForward,
} from 'lucide-react';

export default function OrderTracking() {
  const { orders, trackedOrderId, updateOrderStatus, navigate } = useApp();

  // Pick target order: trackedOrderId, or first active order, or first order in history
  const activeOrder =
    orders.find((o) => o.id === trackedOrderId) ||
    orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') ||
    orders[0];

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [courierMsg, setCourierMsg] = useState('');
  const [sentMsgs, setSentMsgs] = useState<string[]>([
    'Driver: Hi Alex, I picked up your order and am en route with thermal bag!',
  ]);

  if (!activeOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-display text-stone-900">
          No active order found
        </h2>
        <p className="mt-2 text-xs text-stone-500">
          Place a culinary order from our menu to track live kitchen preparation and courier transit.
        </p>
        <button
          onClick={() => navigate('menu')}
          className="mt-6 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'confirmed',
      label: 'Order Confirmed',
      desc: 'Ticket printed & accepted by kitchen',
    },
    {
      key: 'preparing',
      label: 'Kitchen Crafting',
      desc: 'Chef cooking with fresh farm ingredients',
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      desc: 'Courier dispatched with insulated thermal pack',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: 'Handed off · Enjoy your meal!',
    },
  ];

  // Helper to determine stage state
  const stageIndexMap: Record<OrderStatus, number> = {
    confirmed: 0,
    preparing: 1,
    ready: 2,
    out_for_delivery: 2,
    delivered: 3,
    cancelled: -1,
  };

  const currentStageIndex = stageIndexMap[activeOrder.status] ?? 0;

  // Simulator for instant testing
  const advanceStage = () => {
    if (activeOrder.status === 'confirmed') {
      updateOrderStatus(activeOrder.id, 'preparing');
    } else if (activeOrder.status === 'preparing') {
      updateOrderStatus(activeOrder.id, 'out_for_delivery');
    } else if (activeOrder.status === 'out_for_delivery') {
      updateOrderStatus(activeOrder.id, 'delivered');
    } else {
      updateOrderStatus(activeOrder.id, 'confirmed');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierMsg.trim()) return;
    setSentMsgs((prev) => [...prev, `You: ${courierMsg}`]);
    setCourierMsg('');
    setTimeout(() => {
      setSentMsgs((prev) => [
        ...prev,
        'Driver: Got it! Approaching your gate in a couple minutes.',
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-mono font-semibold text-stone-900">
              {activeOrder.orderNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span>Placed {formatDate(activeOrder.createdAt)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            {activeOrder.status === 'delivered'
              ? 'Order Delivered · Bon Appétit'
              : 'Live Kitchen & Delivery Status'}
          </h1>
        </div>

        {/* Status simulator control (Helpful for test verification) */}
        <div className="flex items-center gap-3">
          <button
            onClick={advanceStage}
            className="px-3.5 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Advance status to next step to test UI"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Next Step</span>
          </button>

          <button
            onClick={() => navigate('orders')}
            className="px-3.5 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Order History
          </button>
        </div>
      </div>

      {/* Progress Stepper (Section 1.A DO: clean typography and explicit stages) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {stages.map((stage, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={stage.key}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : isCompleted
                    ? 'border-stone-200 bg-stone-50 text-stone-600'
                    : 'border-stone-100 bg-white opacity-60 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-stone-500">
                    Step 0{idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-amber-600" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-stone-200" />
                  )}
                </div>

                <div className="text-sm font-semibold text-stone-900">
                  {stage.label}
                </div>
                <div className="text-xs text-stone-500 mt-1 leading-snug">
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Delivery Route Map + Driver Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map visual frame */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-stone-800">
                Live Courier Transit Corridor · San Francisco
              </span>
            </div>
            <span className="text-xs font-mono text-stone-500">
              ETA: <strong className="text-stone-900 font-bold">{activeOrder.estimatedDeliveryTime}</strong>
            </span>
          </div>

          {/* Stylized SVG Map */}
          <div className="relative aspect-[16/9] w-full bg-stone-900 overflow-hidden">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 800 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Map grid streets */}
              <defs>
                <pattern id="street-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#292524" strokeWidth="1" />
                </pattern>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              <rect width="800" height="450" fill="#1c1917" />
              <rect width="800" height="450" fill="url(#street-grid)" opacity="0.6" />

              {/* Major arterial roads */}
              <path d="M 50 120 L 750 120" stroke="#38332e" strokeWidth="6" />
              <path d="M 50 280 L 750 280" stroke="#38332e" strokeWidth="6" />
              <path d="M 220 30 L 220 420" stroke="#38332e" strokeWidth="6" />
              <path d="M 540 30 L 540 420" stroke="#38332e" strokeWidth="6" />

              {/* Highway arc */}
              <path
                d="M 120 420 Q 300 240 680 80"
                stroke="#2c2825"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Active transit delivery route path */}
              <path
                d="M 180 320 L 220 280 L 380 280 L 460 210 L 540 210 L 580 160"
                stroke="url(#routeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />

              {/* Restaurant Marker (Valencia St) */}
              <g transform="translate(180, 320)">
                <circle r="14" fill="#78350f" opacity="0.6" />
                <circle r="9" fill="#f59e0b" />
                <circle r="4" fill="#ffffff" />
                <text x="18" y="4" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  SAVOR Flagship Kitchen
                </text>
              </g>

              {/* Destination Marker */}
              <g transform="translate(580, 160)">
                <circle r="14" fill="#14532d" opacity="0.6" />
                <circle r="9" fill="#22c55e" />
                <circle r="4" fill="#ffffff" />
                <text x="18" y="4" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  Your Address
                </text>
              </g>

              {/* Courier Vehicle Marker positioned dynamically */}
              {activeOrder.status === 'out_for_delivery' && (
                <g transform="translate(430, 235)">
                  <circle r="18" fill="#f59e0b" opacity="0.3" />
                  <circle r="12" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  {/* Courier Car icon */}
                  <path
                    d="M -6 -2 L -4 -5 L 4 -5 L 6 -2 L 7 1 L -7 1 Z"
                    fill="#1c1917"
                  />
                  <circle cx="-4" cy="2" r="1.5" fill="#1c1917" />
                  <circle cx="4" cy="2" r="1.5" fill="#1c1917" />
                  <text x="18" y="4" fill="#fcd34d" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                    Courier En Route (6 min away)
                  </text>
                </g>
              )}

              {activeOrder.status === 'preparing' && (
                <g transform="translate(200, 305)">
                  <circle r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="16" y="4" fill="#fcd34d" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                    Assembling & Packaging in Kitchen
                  </text>
                </g>
              )}

              {activeOrder.status === 'delivered' && (
                <g transform="translate(580, 160)">
                  <circle r="22" fill="#22c55e" opacity="0.4" />
                </g>
              )}
            </svg>

            <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] text-stone-300">
              San Francisco · Real-time dispatch coordinates
            </div>
          </div>

          {/* Courier profile card */}
          {activeOrder.driver && (
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-50 border-t border-stone-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-base border-2 border-amber-400">
                  {activeOrder.driver.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">
                      {activeOrder.driver.name}
                    </h3>
                    <span className="text-xs text-amber-700 font-semibold">
                      ★ {activeOrder.driver.rating}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {activeOrder.driver.vehicle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call Courier</span>
                </button>

                <button
                  onClick={() => setMessageModalOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Message</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Receipt Column */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
          <h2 className="text-base font-bold font-display text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-mono font-semibold text-stone-600">
              {activeOrder.items.length} items
            </span>
          </h2>

          {/* Delivery destination if delivery */}
          {activeOrder.address && (
            <div className="text-xs text-stone-600 pb-3 border-b border-stone-100 space-y-1">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                Destination Address
              </span>
              <p className="font-medium text-stone-800">
                {activeOrder.address.street} {activeOrder.address.aptSuite}
              </p>
              <p className="text-stone-500">
                {activeOrder.address.city}, {activeOrder.address.state} {activeOrder.address.zipCode}
              </p>
              {activeOrder.address.deliveryNotes && (
                <p className="text-[11px] text-amber-800 bg-amber-50/70 p-1.5 rounded mt-1">
                  Note: {activeOrder.address.deliveryNotes}
                </p>
              )}
            </div>
          )}

          {/* Itemized list */}
          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100 text-xs">
            {activeOrder.items.map((item) => (
              <div key={item.cartItemId} className="pt-2 flex justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 block truncate">
                    {item.quantity}x {item.name}
                  </span>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <span className="text-[11px] text-stone-400 block truncate">
                      {item.selectedOptions.map((o) => o.optionName).join(' · ')}
                    </span>
                  )}
                </div>
                <span className="font-mono tabular-nums font-semibold text-stone-800 shrink-0">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>

          {/* Receipt Math */}
          <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums font-medium text-stone-800">
                {formatCurrency(activeOrder.subtotal)}
              </span>
            </div>

            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-mono tabular-nums">-{formatCurrency(activeOrder.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-mono tabular-nums font-medium text-stone-800">
                {activeOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(activeOrder.deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-mono tabular-nums font-medium text-stone-800">
                {formatCurrency(activeOrder.tax)}
              </span>
            </div>

            {activeOrder.tip > 0 && (
              <div className="flex justify-between">
                <span>Driver Tip</span>
                <span className="font-mono tabular-nums font-medium text-stone-800">
                  {formatCurrency(activeOrder.tip)}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums text-lg">
                {formatCurrency(activeOrder.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Call Courier Simulation Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-stone-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Connecting to {activeOrder.driver?.name}
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-mono">
                {activeOrder.driver?.phone}
              </p>
            </div>
            <p className="text-xs text-stone-500">
              Your number is masked for guest privacy. Call connected via dispatch switchboard.
            </p>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Direct Message Courier Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 flex flex-col overflow-hidden max-h-[80vh]">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Chat with {activeOrder.driver?.name}
                </h3>
                <span className="text-[11px] text-stone-500">
                  Assigned courier for {activeOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setMessageModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs">
              {sentMsgs.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg max-w-[85%] ${
                    msg.startsWith('You:')
                      ? 'ml-auto bg-amber-500 text-stone-950 font-medium'
                      : 'mr-auto bg-stone-100 text-stone-800'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={courierMsg}
                onChange={(e) => setCourierMsg(e.target.value)}
                placeholder="Type a message (e.g. gate code is 402)..."
                className="flex-1 text-xs p-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
