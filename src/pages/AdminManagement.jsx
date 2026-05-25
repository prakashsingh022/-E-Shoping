import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Shield, 
  Check, 
  Mail, 
  User, 
  Lock, 
  Search, 
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Loader2,
  Clock
} from 'lucide-react';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active',
    permissions: []
  });

  const availablePermissions = [
    { label: 'View Products', value: 'view_products' },
    { label: 'Manage Products', value: 'manage_products' },
    { label: 'View Orders', value: 'view_orders' },
    { label: 'Manage Orders', value: 'manage_orders' },
    { label: 'View Users', value: 'view_users' },
    { label: 'View Analytics', value: 'view_analytics' },
    { label: 'Manage Admins', value: 'manage_admins' },
  ];

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/admin');
      setAdmins(data);
    } catch (error) {
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const openModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        password: '',
        role: admin.role,
        status: admin.status,
        permissions: admin.permissions || []
      });
    } else {
      setEditingAdmin(null);
      setFormData({ name: '', email: '', password: '', role: 'admin', status: 'active', permissions: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleToggleStatus = async (admin) => {
    try {
      const newStatus = admin.status === 'active' ? 'inactive' : 'active';
      await api.put(`/admin/${admin._id}`, { status: newStatus });
      toast.success(`Admin ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAdmin) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/admin/${editingAdmin._id}`, updateData);
        toast.success('Admin updated successfully');
      } else {
        await api.post('/admin/create', formData);
        toast.success('Admin created successfully');
      }
      closeModal();
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/${id}`);
        toast.success('Admin deleted successfully');
        fetchAdmins();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Admin Management</h1>
          <p className="text-surface-500 text-sm mt-1">Manage privileged users and system access roles.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Create Admin
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search admins by name or email..." 
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
                <th className="px-6 py-4 font-bold">Admin Details</th>
                <th className="px-6 py-4 font-bold text-center">Role</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Last Login</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="h-10 bg-surface-100 rounded-full w-48"></div></td>
                    <td colSpan={4}></td>
                  </tr>
                ))
              ) : filteredAdmins.map((admin) => (
                <tr key={admin._id} className="group hover:bg-primary-50/30 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm overflow-hidden ${admin.role === 'superadmin' ? 'bg-indigo-600' : 'bg-primary-500'}`}>
                        {admin.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-surface-900 truncate">{admin.name}</p>
                        <p className="text-xs text-surface-500 truncate">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      admin.role === 'superadmin' ? 'bg-indigo-50 text-indigo-700' : 'bg-surface-100 text-surface-600'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleStatus(admin)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        admin.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${admin.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {admin.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs text-surface-500 flex items-center justify-center gap-1.5">
                       <Clock size={12} />
                       {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(admin)} className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white rounded-lg transition-all" title="Edit Admin">
                            <Edit size={16} />
                        </button>
                        {admin.role !== 'superadmin' && (
                          <button onClick={() => handleDelete(admin._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all" title="Delete Admin">
                              <Trash2 size={16} />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between bg-surface-50">
               <h3 className="font-bold text-surface-900 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary-600" />
                  {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
               </h3>
               <button onClick={closeModal} className="p-2 text-surface-400 hover:text-surface-900 rounded-lg transition-all">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              

              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-1.5 block">
                   {editingAdmin ? 'New Password (Optional)' : 'Default Password'}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="password" name="password" required={!editingAdmin} value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-1.5 block">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-bold">
                    <option value="admin">Administrator</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-1.5 block">Account Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-bold">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formData.role === 'admin' && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-1.5 block">Access Permissions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availablePermissions.map((perm) => (
                      <label key={perm.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.permissions.includes(perm.value) ? 'border-primary-500 bg-primary-50/50' : 'border-surface-100 bg-surface-50 hover:border-surface-200'
                      }`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          formData.permissions.includes(perm.value) ? 'bg-primary-600' : 'bg-white border-2 border-surface-300'
                        }`}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={formData.permissions.includes(perm.value)}
                            onChange={() => handlePermissionToggle(perm.value)}
                          />
                          {formData.permissions.includes(perm.value) && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-[11px] font-bold uppercase ${formData.permissions.includes(perm.value) ? 'text-primary-700' : 'text-surface-500'}`}>
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 text-surface-600 font-bold text-sm bg-surface-100 hover:bg-surface-200 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-[2] px-4 py-3 text-sm font-bold rounded-xl text-white bg-primary-600 shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <span>{editingAdmin ? 'Update Admin' : 'Create Admin'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
