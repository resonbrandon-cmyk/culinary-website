import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { X, Trash2, ArrowRight, Tag, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartItemQuantity,
    removeFromCart,
    deliveryType,
    setDeliveryType,
    promoCode,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    subtotal,
    deliveryFee,
    discount,
    tax,
    total,
    navigate,
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 45;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountRemaining = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = applyPromoCode(inputCode);
    if (ok) setInputCode('');
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-display text-stone-900">
                Your Order Bag
              </h2>
              <span className="text-xs font-semibold text-stone-500 font-mono">
                ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors focus:outline-none"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery / Pickup Segmented Control */}
          <div className="p-4 bg-white border-b border-stone-100">
            <div className="flex p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  deliveryType === 'delivery'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Delivery (25-35 min)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  deliveryType === 'pickup'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pickup (15 min)
              </button>
            </div>

            {/* Free Delivery Threshold Bar */}
            {deliveryType === 'delivery' && (
              <div className="mt-3 pt-2">
                <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                  <span>
                    {amountRemaining <= 0 ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Free delivery unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="font-mono text-stone-900">{formatCurrency(amountRemaining)}</strong> more for free delivery
                      </span>
                    )}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">{progressToFreeDelivery}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${progressToFreeDelivery}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <UtensilsCrossed className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">Your bag is empty</h3>
                <p className="mt-1 text-xs text-stone-500 max-w-xs">
                  Discover our chef-curated selection of dry-aged burgers, woodfired pizzas, and fresh bowls.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('menu');
                  }}
                  className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-3 group">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-0.5 focus:outline-none"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Options list */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="mt-1 text-xs text-stone-500 space-y-0.5">
                        {item.selectedOptions.map((opt, idx) => (
                          <div key={idx} className="truncate">
                            <span className="text-stone-400">{opt.groupName}:</span> {opt.optionName}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="mt-1 text-[11px] text-amber-700 italic truncate">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}

                    {/* Stepper + Unit Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-semibold font-mono text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-4">
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedPromo.label} ({appliedPromo.code})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter coupon (e.g. SAVOR10)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase placeholder:normal-case font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-stone-800 text-white hover:bg-stone-900 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-medium text-stone-800">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-mono tabular-nums font-medium text-stone-800">
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes (8.75%)</span>
                  <span className="font-mono tabular-nums font-medium text-stone-800">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-base">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-sm transition-colors flex items-center justify-between shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono tabular-nums">{formatCurrency(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
