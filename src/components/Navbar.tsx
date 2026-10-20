import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const {
    currentPage,
    navigate,
    cart,
    setIsCartDrawerOpen,
    isLoggedIn,
    user,
    orders,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrder = orders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Strict single text element) */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-amber-50 group-hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              SAVOR
            </span>
            <span className="text-xs font-serif italic text-amber-500/90 hidden sm:inline-block">
              · Kitchen & Larder
            </span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
            <button
              onClick={() => navigate('home')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                currentPage === 'home' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('menu')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                currentPage === 'menu' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Artisanal Menu
            </button>
            <button
              onClick={() => {
                if (activeOrder) {
                  navigate('order-tracking', { orderId: activeOrder.id });
                } else {
                  navigate('orders');
                }
              }}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
                currentPage === 'order-tracking' || currentPage === 'orders'
                  ? 'text-amber-400 font-semibold'
                  : ''
              }`}
            >
              <span>Tracking</span>
              {activeOrder && (
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => navigate('about')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                currentPage === 'about' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => navigate('contact')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                currentPage === 'contact' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions - Admin Switch, Profile/Auth, & Cart Bag */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Switch Portal */}
            <button
              onClick={() => navigate('admin-dashboard')}
              title="Store Operations & Kitchen Portal"
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentPage.startsWith('admin')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-100 border-stone-800 hover:border-stone-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Store Console</span>
            </button>

            {/* User Account / Login */}
            {isLoggedIn ? (
              <button
                onClick={() => navigate('account')}
                className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium focus:outline-none"
                title="Your Account"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden lg:inline text-stone-200 truncate max-w-[100px]">
                  {user?.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0 focus:outline-none"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-stone-950" />
              <span className="font-medium hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-stone-900 text-amber-300 rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-stone-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-800 space-y-2">
            <button
              onClick={() => {
                navigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded-md"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('menu');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded-md"
            >
              Artisanal Menu
            </button>
            <button
              onClick={() => {
                if (activeOrder) {
                  navigate('order-tracking', { orderId: activeOrder.id });
                } else {
                  navigate('orders');
                }
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded-md"
            >
              Order Status & History
            </button>
            <button
              onClick={() => {
                navigate('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded-md"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                navigate('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded-md"
            >
              Contact & Hours
            </button>
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between px-3">
              <button
                onClick={() => {
                  navigate('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-amber-400 font-medium flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Store Management Console
              </button>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    navigate('account');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-stone-300 font-medium flex items-center gap-1"
                >
                  My Profile <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-amber-300 font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
