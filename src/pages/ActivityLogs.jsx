import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  Database,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { getRecentOrders } from '../services/api'; // I'll use a new service call
import api from '../utils/api';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL);

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/activity-logs');
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    socket.on('new_activity', (newLog) => {
        setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    });

    return () => socket.off('new_activity');
  }, []);

  const getActionColor = (action) => {
    if (action.includes('ADD')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (action.includes('DELETE') || action.includes('REJECT')) return 'text-red-600 bg-red-50 border-red-100';
    if (action.includes('UPDATE') || action.includes('APPROVE')) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-surface-600 bg-surface-50 border-surface-100';
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.admin?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Activity Logs</h1>
          <p className="text-surface-500 text-sm mt-1">Audit trail of all administrative actions in the system.</p>
        </div>
        <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-all shadow-sm"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by action, user, or details..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-surface-500 text-[11px] uppercase tracking-widest border-b border-surface-100">
                <th className="px-6 py-4 font-bold">Timestamp</th>
                <th className="px-6 py-4 font-bold">Admin</th>
                <th className="px-6 py-4 font-bold">Action Taken</th>
                <th className="px-6 py-4 font-bold">Detailed Description</th>
                <th className="px-6 py-4 font-bold text-right">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-surface-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-active transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-surface-400">
                        <Clock size={14} />
                        <span className="text-xs font-semibold">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="text-[10px] text-surface-400 mt-1 ml-6 uppercase font-bold tracking-tighter">
                        {new Date(log.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${log.admin?.role === 'superadmin' ? 'bg-indigo-100 text-indigo-700' : 'bg-surface-100 text-surface-600'}`}>
                            {log.admin?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-surface-900 truncate">{log.admin?.name || 'System'}</p>
                            <p className="text-[10px] text-surface-400 font-medium truncate uppercase tracking-widest">{log.admin?.role || 'automatic'}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border shadow-sm ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                     <span className="text-[10px] font-mono font-bold text-surface-400 bg-surface-50 px-2 py-1 rounded border border-surface-100">
                        {log.ip || '0.0.0.0'}
                     </span>
                  </td>
                </tr>
              ))}
              {!loading && filteredLogs.length === 0 && (
                  <tr>
                      
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
