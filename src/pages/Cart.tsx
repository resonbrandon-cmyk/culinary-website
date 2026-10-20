import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { Trash2, ArrowRight, ArrowLeft, Tag, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
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

  const freeDeliveryThreshold = 45;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountRemaining = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = applyPromoCode(inputCode);
    if (ok) setInputCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="text-2xl font-bold font-display text-stone-900">
          Your Dining Bag is Empty
        </h1>
        <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
          Explore our seasonal menu to select artisanal burgers, wood-fired pizzas, nourish bowls, or omakase sushi.
        </p>
        <button
          onClick={() => navigate('menu')}
          className="mt-8 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl transition-colors shadow-xs"
        >
          Browse Culinary Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => navigate('menu')}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Adding Dishes</span>
          </button>
          <h1 className="text-3xl font-bold font-display text-stone-900">
            Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-600 transition-colors self-start sm:self-auto underline"
        >
          Clear entire bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Delivery vs Pickup Toggle Card */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                  deliveryType === 'delivery'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Courier Delivery (25-35 min)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                  deliveryType === 'pickup'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kitchen Pickup (15 min)
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                  <span>
                    {amountRemaining <= 0 ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Free delivery threshold unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="font-mono text-stone-900">{formatCurrency(amountRemaining)}</strong> more to receive free delivery
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

          {/* Items Cards */}
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 shadow-2xs overflow-hidden">
            {cart.map((item) => (
              <div key={item.cartItemId} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-stone-900">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="mt-1 text-xs text-stone-500 space-y-0.5">
                      {item.selectedOptions.map((opt, idx) => (
                        <div key={idx}>
                          <span className="text-stone-400">{opt.groupName}:</span> {opt.optionName}{' '}
                          {opt.price > 0 && (
                            <span className="text-stone-400 font-mono">(+{formatCurrency(opt.price)})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <p className="mt-1 text-xs text-amber-800 bg-amber-50/60 px-2 py-0.5 rounded inline-block">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>

                {/* Stepper and Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                    <button
                      onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 text-xs font-bold transition-colors"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-stone-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 text-xs font-bold transition-colors"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {formatCurrency(item.price)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[11px] text-stone-400 font-mono tabular-nums">
                        {formatCurrency(item.unitPrice)} each
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-base font-bold font-display text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Promo code */}
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{appliedPromo.label}</span>
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
                  placeholder="Promo code (e.g. SAVOR10)"
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount</span>
                  <span className="font-mono tabular-nums">-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.75%)</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  {formatCurrency(tax)}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-lg">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-sm transition-colors flex items-center justify-between shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <span className="flex items-center gap-1">
                <span className="font-mono tabular-nums">{formatCurrency(total)}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200/80 text-xs text-stone-500 space-y-1">
            <div className="font-semibold text-stone-700">Kitchen Guarantee:</div>
            <p>Every dish is temperature-sealed with food security tape upon dispatch.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
