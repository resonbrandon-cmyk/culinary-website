import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';
import { formatCurrency } from '../../utils/format';
import { Search, Mail, Phone, Award } from 'lucide-react';

export default function AdminCustomers() {
  const { customers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout activeTab="customers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-bold font-display text-stone-900">
              Customer & Diner Directory
            </h1>
            <p className="text-xs text-stone-500">
              Track loyal diners, order volumes, lifetime spend, and guest preferences.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4 font-mono">Total Orders</th>
                  <th className="p-4 font-mono">Lifetime Spend</th>
                  <th className="p-4">Last Order</th>
                  <th className="p-4 text-right">Loyalty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <span className="font-bold text-stone-900 text-sm">
                          {cust.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-stone-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-stone-900 tabular-nums">
                      {cust.ordersCount} orders
                    </td>

                    <td className="p-4 font-mono font-bold text-stone-900 tabular-nums">
                      {formatCurrency(cust.totalSpent)}
                    </td>

                    <td className="p-4 text-stone-500">
                      {cust.lastOrderDate}
                    </td>

                    <td className="p-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          cust.status === 'vip'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : cust.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
