import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { Users, Search, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export const CustomersTab: React.FC = () => {
  const { orders } = useStore();
  const [search, setSearch] = useState('');

  // Extract unique customers from orders
  const customerMap = new Map<string, {
    email: string;
    name: string;
    phone: string;
    city: string;
    state: string;
    orderCount: number;
    totalSpent: number;
    lastOrder: string;
  }>();

  orders.forEach(o => {
    const key = o.customerEmail.toLowerCase().trim();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        email: o.customerEmail,
        name: o.customerName,
        phone: o.customerPhone,
        city: o.shippingAddress.city,
        state: o.shippingAddress.state,
        orderCount: 1,
        totalSpent: o.total,
        lastOrder: o.createdAt,
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.orderCount += 1;
      existing.totalSpent += o.total;
    }
  });

  const customerList = Array.from(customerMap.values()).filter(c => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Customer Directory ({customerList.length})
          </h2>
          <p className="text-xs text-[#948282]">
            Parents and families who have purchased from Little Sprout.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF8EF] px-3 py-2 rounded-xl border border-[#F4EADB] w-full sm:w-72">
          <Search className="w-4 h-4 text-[#948282]" />
          <input
            type="text"
            placeholder="Search by parent name, email, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#3B2F2F] placeholder-[#948282] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#F4EADB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8EF] text-[#948282] uppercase font-bold border-b border-[#F4EADB]">
              <tr>
                <th className="py-3.5 px-6">Parent Customer</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-6 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EADB]">
              {customerList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#948282]">
                    No customer profiles found. Orders placed at checkout will automatically appear here!
                  </td>
                </tr>
              ) : (
                customerList.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-[#FFFDF9] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#7BA88B]/20 text-[#588469] flex items-center justify-center font-bold text-xs">
                          {cust.name[0] || 'P'}
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-[#3B2F2F] block">
                            {cust.name}
                          </span>
                          <span className="text-[10px] text-[#7BA88B] font-bold">
                            Verified Family
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[#3B2F2F]">
                        <Mail className="w-3.5 h-3.5 text-[#948282]" />
                        <span>{cust.email}</span>
                      </div>
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-[#948282]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[#6E5A5A]">
                        <MapPin className="w-3.5 h-3.5 text-[#7BA88B]" />
                        <span>{cust.city}, {cust.state}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#3B2F2F]">
                      {cust.orderCount} order{cust.orderCount > 1 ? 's' : ''}
                    </td>

                    <td className="py-4 px-6 text-right font-serif font-bold text-sm text-[#588469]">
                      {formatPrice(cust.totalSpent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
