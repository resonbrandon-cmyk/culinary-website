import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="font-display text-2xl font-bold tracking-tight text-stone-900 block">
            Welcome Back to SAVOR
          </span>
          <p className="text-xs text-stone-500">
            Sign in to track orders, access saved addresses, and manage payment options.
          </p>
        </div>

        {/* Quick Demo Sign-in Banner */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>Demo credentials pre-filled</span>
          </div>
          <button
            type="button"
            onClick={() => login('alex.rivera@example.com')}
            className="text-amber-800 font-bold underline hover:text-amber-950 text-xs"
          >
            Instant Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => {}}
                className="text-[11px] text-amber-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <button
            onClick={() => navigate('register')}
            className="text-amber-800 font-semibold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
