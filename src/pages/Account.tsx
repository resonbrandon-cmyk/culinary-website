import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Plus, Trash2, CreditCard, LogOut, ShieldCheck, Check } from 'lucide-react';

export default function Account() {
  const {
    user,
    orders,
    isLoggedIn,
    updateUserProfile,
    addDeliveryAddress,
    deleteDeliveryAddress,
    logout,
    navigate,
  } = useApp();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApt, setAddrApt] = useState('');
  const [addrCity, setAddrCity] = useState('San Francisco');
  const [addrState, setAddrState] = useState('CA');
  const [addrZip, setAddrZip] = useState('94110');
  const [addrNotes, setAddrNotes] = useState('');

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-display text-stone-900">
          Account Not Signed In
        </h2>
        <p className="mt-2 text-xs text-stone-500">
          Please sign in to view your profile and saved delivery locations.
        </p>
        <button
          onClick={() => navigate('login')}
          className="mt-6 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet) return;
    addDeliveryAddress({
      label: addrLabel,
      street: addrStreet,
      aptSuite: addrApt,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      deliveryNotes: addrNotes,
    });
    setAddrStreet('');
    setAddrApt('');
    setAddrNotes('');
    setIsAddingAddress(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-extrabold text-2xl font-display shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-stone-900">
                {user.name}
              </h1>
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Gourmet Member
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-mono">
              {user.email} · {user.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('orders')}
            className="flex-1 sm:flex-none px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors"
          >
            Past Orders ({orders.length})
          </button>
          <button
            onClick={logout}
            className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-stone-50 text-stone-600 hover:text-red-600 border border-stone-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Saved Delivery Addresses */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold font-display text-stone-900">
                  Saved Delivery Addresses
                </h2>
              </div>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* New Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleSaveNewAddress} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                <div className="font-semibold text-stone-800">New Address Details</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Label</label>
                    <select
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-stone-200"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Partner">Partner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      placeholder="Street number and name"
                      className="w-full p-2 bg-white rounded border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Apt/Suite</label>
                    <input
                      type="text"
                      value={addrApt}
                      onChange={(e) => setAddrApt(e.target.value)}
                      placeholder="e.g. 4B"
                      className="w-full p-2 bg-white rounded border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Courier Gate Notes</label>
                  <input
                    type="text"
                    value={addrNotes}
                    onChange={(e) => setAddrNotes(e.target.value)}
                    placeholder="Gate code, door drop instruction"
                    className="w-full p-2 bg-white rounded border border-stone-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-stone-900 text-white rounded font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl border border-stone-200 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{addr.label}</span>
                      {user.defaultAddressId === addr.id && (
                        <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-mono">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-stone-700 font-medium">
                      {addr.street} {addr.aptSuite}
                    </p>
                    <p className="text-stone-400">
                      {addr.city}, {addr.state} {addr.zipCode}
                    </p>
                    {addr.deliveryNotes && (
                      <p className="text-[11px] text-stone-500 italic pt-0.5">
                        "{addr.deliveryNotes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteDeliveryAddress(addr.id)}
                    className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Cards & Perks */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold font-display text-stone-900">
                Saved Payment Methods
              </h2>
            </div>

            <div className="space-y-3">
              {user.savedCards.map((card) => (
                <div
                  key={card.id}
                  className="p-3.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-stone-900 text-white rounded font-bold text-[10px] flex items-center justify-center">
                      {card.brand.toUpperCase()}
                    </div>
                    <div>
                      <span className="font-mono font-semibold text-stone-900 block">
                        •••• •••• •••• {card.last4}
                      </span>
                      <span className="text-[11px] text-stone-400">Exp: {card.exp}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">Authorized</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savor Club Pass Card */}
          <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              SAVOR Culinary Membership
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              Complimentary Chef Tastings
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              As an active patron, your orders automatically receive priority kitchen routing and complimentary temperature-controlled courier dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
