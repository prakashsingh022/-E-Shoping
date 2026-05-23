import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, MoreVertical, Eye, Download, Calendar, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.user?.name || 'Guest').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Orders Management</h1>
          <p className="text-surface-500 text-sm mt-1">Track and manage all customer purchases.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-all shadow-sm">
            <Calendar size={18} className="text-surface-400" />
            Last 30 Days
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-all shadow-sm">
          <Filter size={18} className="text-surface-400" />
          Filter Status
        </button>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-surface-500 text-[11px] uppercase tracking-widest border-b border-surface-100">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-8 bg-surface-50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-surface-500 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order._id} className="group hover:bg-primary-50/30 transition-all duration-200">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-surface-900">{order.user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-surface-400">{order.user?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-surface-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-surface-600 bg-surface-100 px-2 py-1 rounded-md border border-surface-200">{order.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      order.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-surface-50 text-surface-600 border-surface-100'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white rounded-lg transition-all" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-surface-400 hover:text-surface-900 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="p-4 border-t border-surface-100 flex items-center justify-between">
            <span className="text-sm text-surface-500">Showing {filteredOrders.length} orders</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-surface-200 rounded-lg text-sm text-surface-400 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 bg-white border border-surface-200 rounded-lg text-sm text-surface-700 hover:bg-surface-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
