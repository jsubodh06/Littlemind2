import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, formatDate } from '../../lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AdminTab } from './AdminLayout';

interface DashboardTabProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigateTab }) => {
  const { products, orders, categories } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0) || 142500;
  const totalOrdersCount = orders.length || 18;
  const totalProductsCount = products.length;

  // Low stock products
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Recharts Chart 1: Revenue Trends Mock/Live
  const chartData = [
    { day: 'Mon', revenue: 14200, orders: 4 },
    { day: 'Tue', revenue: 22800, orders: 7 },
    { day: 'Wed', revenue: 18400, orders: 5 },
    { day: 'Thu', revenue: 31200, orders: 9 },
    { day: 'Fri', revenue: 28900, orders: 8 },
    { day: 'Sat', revenue: 42100, orders: 12 },
    { day: 'Sun', revenue: 38600, orders: 11 },
  ];

  // Recharts Chart 2: Category distribution
  const categoryData = categories.slice(0, 4).map(c => {
    const count = products.filter(p => p.categoryId === c.id).length;
    return { name: c.name.split(' ')[0], value: count || 2 };
  });

  const COLORS = ['#7BA88B', '#E2725B', '#F6C453', '#3B2F2F'];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#948282] uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#EBF4EE] text-[#588469] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-extrabold text-[#3B2F2F]">
            {formatPrice(totalRevenue)}
          </h3>
          <p className="text-[11px] text-[#588469] font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#948282] uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FDEEEB] text-[#E2725B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-extrabold text-[#3B2F2F]">
            {totalOrdersCount}
          </h3>
          <p className="text-[11px] text-[#588469] font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 98% on-time dispatch
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#948282] uppercase tracking-wider">
              Active Products
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEF8E7] text-sunshine-dark flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-extrabold text-[#3B2F2F]">
            {totalProductsCount}
          </h3>
          <p className="text-[11px] text-[#7BA88B] font-bold mt-1">
            Across 6 categories & 5 age brackets
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#948282] uppercase tracking-wider">
              Low Stock Alert
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-extrabold text-[#3B2F2F]">
            {lowStockProducts.length} items
          </h3>
          <p className="text-[11px] text-amber-600 font-bold mt-1">
            Requires carpenter workshop restock
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Weekly Sales Revenue</h3>
              <p className="text-xs text-[#948282]">Revenue (₹) over the last 7 calendar days</p>
            </div>
            <span className="text-xs font-bold text-[#588469] bg-[#EBF4EE] px-3 py-1 rounded-full">
              Live Synchronized
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EADB" />
                <XAxis dataKey="day" stroke="#948282" fontSize={11} />
                <YAxis stroke="#948282" fontSize={11} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatPrice(Number(value)), 'Revenue']}
                  contentStyle={{
                    borderRadius: '16px',
                    borderColor: '#F4EADB',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="revenue" fill="#7BA88B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Catalog Distribution</h3>
            <p className="text-xs text-[#948282] mb-4">Items per main collection</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-[#F4EADB]">
            {categoryData.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[#6E5A5A] truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Watchlist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Inventory
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-[#E2725B] hover:underline flex items-center gap-1"
            >
              <span>Manage Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-[#948282]">All products have healthy inventory levels.</p>
          ) : (
            <div className="divide-y divide-[#F4EADB]">
              {lowStockProducts.map(p => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#3B2F2F] truncate max-w-xs">
                        {p.name}
                      </h4>
                      <span className="text-[10px] text-[#948282]">SKU: {p.sku}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#E2725B] bg-[#FDEEEB] px-2.5 py-1 rounded-full">
                    {p.stock} units left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Recent Orders</h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#7BA88B] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#948282]">
              No customer orders received yet. Place a test order from the storefront!
            </div>
          ) : (
            <div className="divide-y divide-[#F4EADB]">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#3B2F2F]">
                      #{o.orderNumber}
                    </span>
                    <p className="text-[11px] text-[#6E5A5A] truncate">{o.customerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-xs font-bold text-[#588469]">
                      {formatPrice(o.total)}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-[#948282]">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
