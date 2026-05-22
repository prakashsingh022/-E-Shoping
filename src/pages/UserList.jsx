import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, Mail, Shield, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User removed successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Users Management</h1>
          <p className="text-surface-500 text-sm mt-1">Manage customer profiles and access control.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-all shadow-sm">
                <Filter size={18} className="text-surface-400" />
                Filter
            </button>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-surface-500 text-[11px] uppercase tracking-widest border-b border-surface-100">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Joined Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-8 bg-surface-50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-surface-500 font-medium">
                    No customers found.
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-primary-50/30 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                         {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-surface-900 truncate">{user.name}</p>
                        <p className="text-xs text-surface-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-surface-600">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${
                      user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white rounded-lg transition-all" title="Message User">
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all" 
                        title="Delete User"
                      >
                        <Trash2 size={16} />
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
      </div>
    </div>
  );
};

export default UserList;
