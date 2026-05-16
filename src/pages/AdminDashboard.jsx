import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Download,
  Plus,
  Eye,
  ShieldCheck,
  RefreshCcw,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  getDashboardStats, 
  getRevenueAnalytics, 
  getRecentOrders, 
  getTopProducts 
} from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000'); // Adjust for production

const StatCard = ({ title, value, change, trend, icon: Icon, color, loading }) => (
  <div className="card-premium p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <button className="text-surface-400 hover:text-surface-600 transition-colors">
        <MoreVertical size={20} />
      </button>
    </div>
    <div>
      <p className="text-sm font-medium text-surface-500">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-surface-100 animate-pulse rounded mt-1"></div>
      ) : (
        <div className="flex items-end gap-3 mt-1">
          <h3 className="text-2xl font-bold text-surface-900">{value}</h3>
          <span className={`text-xs font-medium flex items-center mb-1 px-1.5 py-0.5 rounded-lg ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
        </div>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState(7);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsData, revenue, orders, top] = await Promise.all([
        getDashboardStats(),
        getRevenueAnalytics(daysFilter),
        getRecentOrders(),
        getTopProducts()
      ]);
      setStats(statsData);
      setRevenueData(revenue);
      setRecentOrders(orders);
      setTopProducts(top);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'superadmin' || user?.status === 'active') {
        fetchData();
        
        socket.on('new_activity', (data) => {
            fetchData();
        });

        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => {
            clearInterval(interval);
            socket.off('new_activity');
        };
    }
  }, [daysFilter, user]);

  if (user?.status === 'inactive') {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-red-500" />
            </div>
            <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-surface-900">Account Deactivated</h1>
                <p className="text-surface-500">
                    Your administrative access has been suspended. 
                    Please contact system administrator.
                </p>
            </div>
        </div>
    );
  }

  const { hasPermission } = useAuth();

  const kpiCards = [
    { title: 'Total Revenue', value: stats ? `₹${stats.revenue.value.toLocaleString('en-IN')}` : '0', change: stats?.revenue.growth, trend: stats?.revenue.trend, icon: TrendingUp, color: 'bg-emerald-500', permission: 'view_analytics' },
    { title: 'Total Orders', value: stats ? stats.orders.value : '0', change: stats?.orders.growth, trend: stats?.orders.trend, icon: ShoppingCart, color: 'bg-primary-500', permission: 'view_orders' },
    { title: 'Total Users', value: stats ? stats.users.value : '0', change: stats?.users.growth, trend: stats?.users.trend, icon: Users, color: 'bg-purple-500', permission: 'view_users' },
    { title: 'Total Products', value: stats ? stats.products.value : '0', change: stats?.products.growth, trend: stats?.products.trend, icon: Package, color: 'bg-orange-500', permission: 'view_products' },
  ].filter(card => hasPermission(card.permission));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight flex items-center gap-3">
            Admin Dashboard
            {refreshing && <RefreshCcw size={18} className="text-primary-500 animate-spin" />}
          </h1>
          <p className="text-surface-500 text-sm mt-1">Real-time statistics and business analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-surface-200 p-1 rounded-xl shadow-sm">
            <button 
                onClick={() => setDaysFilter(7)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${daysFilter === 7 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-surface-500 hover:text-surface-900'}`}
            >
                7 Days
            </button>
            <button 
                onClick={() => setDaysFilter(30)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${daysFilter === 30 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-surface-500 hover:text-surface-900'}`}
            >
                30 Days
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </div>

      {/* Analytics Section */}
      {hasPermission('view_analytics') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Line Chart (70%) */}
          <div className="lg:col-span-2 card-premium p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-lg text-surface-900">Revenue Analytics</h3>
                <p className="text-xs text-surface-500">Gross revenue over the selected period</p>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                 Live Data
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                      dy={10}
                      tickFormatter={(str) => {
                          const date = new Date(str);
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                  />
                  <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                      tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      itemStyle={{fontSize: '12px', fontWeight: 700}}
                      labelStyle={{fontSize: '10px', color: '#64748b', marginBottom: '4px'}}
                  />
                  <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products (30%) */}
          <div className="card-premium p-6 flex flex-col">
            <h3 className="font-bold text-lg text-surface-900 mb-6 font-display">Top Sellers</h3>
            <div className="space-y-5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                  Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="w-12 h-12 bg-surface-100 rounded-xl"></div>
                          <div className="flex-1 space-y-2">
                              <div className="h-3 bg-surface-100 rounded w-2/3"></div>
                              <div className="h-2 bg-surface-50 rounded w-1/3"></div>
                          </div>
                      </div>
                  ))
              ) : topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 group cursor-pointer hover:bg-surface-50 p-2 rounded-xl transition-all">
                  <div className="w-12 h-12 rounded-xl border border-surface-100 overflow-hidden bg-surface-50 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-surface-900 truncate">{product.name}</p>
                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">{product.sales} Sales</p>
                  </div>
                  <div className="text-right">
                      <p className="text-sm font-bold text-primary-600">₹{product.revenue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all uppercase tracking-widest">
              Detailed Inventory
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Actions (1 Column) */}
          <div className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-surface-900 ml-1">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                  {hasPermission('manage_products') && (
                    <Link to="/admin/products/add" className="flex items-center gap-3 p-4 bg-white border border-surface-100 rounded-2xl hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/5 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                          <Plus size={20} />
                      </div>
                      <span className="font-bold text-sm text-surface-700">Add Product</span>
                    </Link>
                  )}
                  {hasPermission('view_orders') && (
                    <Link to="/admin/orders" className="flex items-center gap-3 p-4 bg-white border border-surface-100 rounded-2xl hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <ShoppingCart size={20} />
                      </div>
                      <span className="font-bold text-sm text-surface-700">View Orders</span>
                    </Link>
                  )}
                  {hasPermission('manage_admins') && (
                    <Link to="/admin/management" className="flex items-center gap-3 p-4 bg-white border border-surface-100 rounded-2xl hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <ShieldCheck size={20} />
                      </div>
                      <span className="font-bold text-sm text-surface-700">Manage Admins</span>
                    </Link>
                  )}
              </div>
          </div>

          {/* Recent Orders Table (3 Columns) */}
          {hasPermission('view_orders') && (
            <div className="lg:col-span-3 card-premium overflow-hidden flex flex-col">
              <div className="p-6 border-b border-surface-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-surface-900">Recent Transactions</h3>
                  <p className="text-xs text-surface-500">Live feed of store orders</p>
                </div>
                <Link to="/admin/orders" className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-all">VIEW ALL</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-50/50 text-surface-500 text-[11px] uppercase tracking-widest border-b border-surface-100">
                      <th className="px-6 py-4 font-bold">Order ID</th>
                      <th className="px-6 py-4 font-bold">Customer</th>
                      <th className="px-6 py-4 font-bold">Amount</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100 font-sans">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-surface-50 rounded w-full"></div></td>
                            </tr>
                        ))
                    ) : recentOrders.map((order) => (
                      <tr key={order._id} className="group hover:bg-primary-50/20 transition-all">
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-primary-600">#{order._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-surface-900">{order.user?.name || 'Guest'}</td>
                        <td className="px-6 py-4 text-sm font-bold text-surface-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            order.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-primary-50 text-primary-700 border-primary-100'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-surface-400 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-surface-400 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
