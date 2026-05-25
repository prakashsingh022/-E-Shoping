import React, { useState, useEffect } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../services/api';
import { Edit, Trash2, Plus, X, Image as ImageIcon, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import MediaPicker from '../components/MediaPicker';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '/',
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners(true); // admin = true
      setBanners(data);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please select a banner image');
      return;
    }

    try {
      if (editingId) {
        await updateBanner(editingId, formData);
        toast.success('Banner updated successfully');
      } else {
        await createBanner(formData);
        toast.success('Banner created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', image: '', link: '/', isActive: true });
    setEditingId(null);
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title || '',
      image: banner.image,
      link: banner.link || '/',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setEditingId(banner._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id);
        toast.success('Banner removed');
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const toggleStatus = async (banner) => {
    try {
      await updateBanner(banner._id, { isActive: !banner.isActive });
      fetchBanners();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleMediaSelect = (selectedMedia) => {
    if (selectedMedia.length > 0) {
      setFormData({ ...formData, image: selectedMedia[0].url });
    }
    setShowMediaPicker(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Homepage Banners</h1>
          <p className="text-surface-500 text-sm mt-1">Configure the main promotional sliders on the home page.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="card-premium h-48 animate-pulse bg-surface-50"></div>
          ))
        ) : banners.length === 0 ? (
          <div className="py-20 text-center card-premium">
            <ImageIcon size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500 font-medium">No banners found. Add one to show on the homepage.</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="card-premium group overflow-hidden flex flex-col md:flex-row gap-6 p-4">
              <div className="w-full md:w-80 h-48 md:h-auto rounded-xl overflow-hidden bg-surface-100 flex-shrink-0 relative border border-surface-100 shadow-sm">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-surface-900/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Inactive</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-surface-900">{banner.title || 'Promotional Banner'}</h3>
                      <div className="flex items-center gap-2 text-primary-600 mt-1">
                        <LinkIcon size={14} />
                        <span className="text-xs font-medium">{banner.link || '/'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => toggleStatus(banner)}
                        className={`p-2 rounded-xl transition-all shadow-sm border ${
                          banner.isActive 
                           ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                           : 'bg-surface-50 text-surface-400 border-surface-200 hover:bg-surface-100'
                        }`}
                        title={banner.isActive ? "Deactivate" : "Activate"}
                       >
                         {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                       </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 flex-1 bg-surface-50 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${banner.isActive ? 'bg-emerald-500' : 'bg-surface-200'}`} style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={() => handleEdit(banner)}
                    className="flex-1 md:flex-none px-4 py-2 bg-white text-surface-900 border border-surface-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm"
                  >
                    Edit Details
                  </button>
                  <button 
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-900">{editingId ? 'Edit Banner' : 'Create New Banner'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-50 rounded-lg text-surface-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Banner Title (Optional)</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-medium"
                  placeholder="e.g. Summer Collection"
                />
              </div>
              <div>
                
                
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input 
                    type="text" 
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all"
                    placeholder="/shop/category-name"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-surface-100">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-surface-700 cursor-pointer select-none">Show Banner on Home Page</label>
              </div>
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Banner Image</label>
                <div 
                  onClick={() => setShowMediaPicker(true)}
                  className="relative aspect-[21/9] rounded-xl border-2 border-dashed border-surface-200 overflow-hidden group cursor-pointer hover:border-primary-400 hover:bg-primary-50/10 transition-all flex flex-col items-center justify-center gap-2"
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-surface-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg">CHANGE IMAGE</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-surface-50 rounded-full flex items-center justify-center text-surface-400">
                        <ImageIcon size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-surface-400 uppercase">Click to Select Media</span>
                    </>
                  )}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-surface-200 text-surface-600 rounded-xl font-bold text-sm hover:bg-surface-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] btn-primary py-3"
                >
                  {editingId ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMediaPicker && (
        <MediaPicker 
          onClose={() => setShowMediaPicker(false)} 
          selectedItems={formData.image ? [{ url: formData.image }] : []} 
          onSelect={handleMediaSelect}
          singleSelect={true}
        />
      )}
    </div>
  );
};

export default BannerManagement;
