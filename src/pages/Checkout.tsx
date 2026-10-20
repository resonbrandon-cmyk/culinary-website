import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { DeliveryAddress } from '../types';
import { MapPin, CreditCard, DollarSign, Smartphone, Check, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const {
    cart,
    user,
    deliveryType,
    subtotal,
    deliveryFee,
    discount,
    tax,
    tipAmount,
    setTipAmount,
    total,
    createOrder,
    navigate,
  } = useApp();

  // Pre-fill user data
  const [customerName, setCustomerName] = useState(user?.name || 'Alex Rivera');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'alex.rivera@example.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '(415) 890-2412');

  // Address state
  const defaultAddr = user?.addresses[0] || {
    id: 'custom-addr',
    label: 'Home',
    street: '742 Evergreen Terrace',
    aptSuite: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94110',
    deliveryNotes: 'Buzz 402 at front gate. Leave outside door.',
  };

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.defaultAddressId || defaultAddr.id
  );
  const [street, setStreet] = useState(defaultAddr.street);
  const [aptSuite, setAptSuite] = useState(defaultAddr.aptSuite || '');
  const [city, setCity] = useState(defaultAddr.city);
  const [state, setState] = useState(defaultAddr.state);
  const [zipCode, setZipCode] = useState(defaultAddr.zipCode);
  const [deliveryNotes, setDeliveryNotes] = useState(defaultAddr.deliveryNotes || '');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('123');

  // Tip presets
  const tipPresets = [
    { label: '15%', amount: Math.round(subtotal * 0.15 * 100) / 100 },
    { label: '18%', amount: Math.round(subtotal * 0.18 * 100) / 100 },
    { label: '20%', amount: Math.round(subtotal * 0.20 * 100) / 100 },
    { label: 'No Tip', amount: 0 },
  ];

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-display text-stone-900">
          No items in cart for checkout
        </h2>
        <p className="mt-2 text-xs text-stone-500">
          Please add dishes from our menu before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('menu')}
          className="mt-6 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl"
        >
          View Menu
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const finalAddress: DeliveryAddress = {
      id: selectedAddressId || `addr-${Date.now()}`,
      label: 'Delivery Location',
      street,
      aptSuite,
      city,
      state,
      zipCode,
      deliveryNotes,
    };

    createOrder({
      customerName,
      customerEmail,
      customerPhone,
      address: deliveryType === 'delivery' ? finalAddress : undefined,
      paymentMethod,
      paymentLast4: paymentMethod === 'card' ? '4242' : undefined,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('cart')}
          className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Order Bag</span>
        </button>
        <h1 className="text-3xl font-bold font-display text-stone-900 mt-2">
          Complete Your Order
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details, Address, Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Contact Details */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold font-display text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
              <span>1. Guest Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (for Courier SMS)
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (Receipt)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Destination */}
          {deliveryType === 'delivery' ? (
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold font-display text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>2. Delivery Address & Gate Instructions</span>
              </h2>

              {/* Saved addresses selector if user has them */}
              {user && user.addresses && user.addresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {user.addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setStreet(addr.street);
                          setAptSuite(addr.aptSuite || '');
                          setCity(addr.city);
                          setState(addr.state);
                          setZipCode(addr.zipCode);
                          if (addr.deliveryNotes) setDeliveryNotes(addr.deliveryNotes);
                        }}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/40 text-stone-900'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-stone-800 mb-1">
                          <span>{addr.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <div className="truncate text-stone-600">{addr.street} {addr.aptSuite}</div>
                        <div className="text-stone-400">{addr.city}, {addr.state} {addr.zipCode}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Apt / Suite / Floor
                  </label>
                  <input
                    type="text"
                    value={aptSuite}
                    onChange={(e) => setAptSuite(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Instructions for Driver
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="E.g., Call upon arrival, leave with doorman, gate code #402..."
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <h2 className="text-base font-bold font-display text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Kitchen Pickup Location</span>
              </h2>
              <div className="text-xs text-stone-700 space-y-1 pt-1">
                <p className="font-semibold text-stone-900">SAVOR Flagship Kitchen & Larder</p>
                <p className="text-stone-500">428 Valencia Street, Mission District, San Francisco, CA 94103</p>
                <p className="text-stone-500">Estimated ready time: 15 minutes from order confirmation</p>
              </div>
            </div>
          )}

          {/* Section 3: Driver Gratuity (if delivery) */}
          {deliveryType === 'delivery' && (
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="text-base font-bold font-display text-stone-900">
                  Courier Gratuity
                </h2>
                <span className="text-xs text-stone-500">
                  100% of driver tip goes directly to your courier
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {tipPresets.map((preset) => {
                  const isSelected = tipAmount === preset.amount;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTipAmount(preset.amount)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 text-stone-900 font-bold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div>{preset.label}</div>
                      {preset.amount > 0 && (
                        <div className="text-[11px] font-mono text-stone-500">
                          {formatCurrency(preset.amount)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold font-display text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>{deliveryType === 'delivery' ? '4.' : '3.'} Payment Method</span>
              <span className="text-xs text-stone-400 font-normal flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-bit Encrypted
              </span>
            </h2>

            {/* Payment type selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/50 text-stone-950 font-bold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-stone-700" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  paymentMethod === 'apple_pay'
                    ? 'border-amber-500 bg-amber-50/50 text-stone-950 font-bold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-stone-700" />
                <span>Apple / Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-amber-500 bg-amber-50/50 text-stone-950 font-bold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <DollarSign className="w-4 h-4 text-stone-700" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Method Details */}
            {paymentMethod === 'card' && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Expires / CVV
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-1/2 text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none font-mono"
                    />
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-1/2 text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-600">
                You will be prompted to authenticate with Touch ID / Face ID upon placing your order.
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg text-xs text-amber-900 leading-relaxed">
                Please prepare exact amount ({formatCurrency(total)}) or specify required bill change in delivery notes for your courier.
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4 sticky top-24">
            <h2 className="text-base font-bold font-display text-stone-900 pb-2 border-b border-stone-100">
              Review & Authorize
            </h2>

            {/* Items mini list */}
            <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 text-xs">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-semibold text-stone-900 block truncate">
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <span className="text-[11px] text-stone-400 block truncate">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-stone-800 shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-stone-900 font-medium">
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
                <span>Delivery</span>
                <span className="font-mono tabular-nums text-stone-900 font-medium">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono tabular-nums text-stone-900 font-medium">
                  {formatCurrency(tax)}
                </span>
              </div>

              {deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Courier Tip</span>
                  <span className="font-mono tabular-nums text-stone-900 font-medium">
                    {formatCurrency(tipAmount)}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
                <span>Total Due</span>
                <span className="font-mono tabular-nums text-lg">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Place Order · {formatCurrency(total)}</span>
            </button>

            <div className="text-[11px] text-stone-400 text-center">
              By authorizing, you agree to SAVOR terms of culinary service.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
