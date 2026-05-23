import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { Edit, Trash2, Plus, Search, Tag, X, Image as ImageIcon, Package, List } from 'lucide-react';
import { toast } from 'react-toastify';
import MediaPicker from '../components/MediaPicker';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please select a category image');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image: '', description: '' });
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      image: category.image,
      description: category.description || '',
    });
    setEditingId(category._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category removed');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
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
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Shop by Category</h1>
          <p className="text-surface-500 text-sm mt-1">Manage categories and their corresponding products.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card-premium h-64 animate-pulse bg-surface-50"></div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 text-center card-premium">
            <Tag size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500 font-medium">No categories found. Start by adding one.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="card-premium group overflow-hidden flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-surface-100">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2.5 bg-white text-surface-900 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category._id)}
                    className="p-2.5 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-surface-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{category.name}</h3>
                  <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {category.productCount || 0} Products
                  </span>
                </div>
                {category.description && (
                  <p className="text-surface-500 text-xs line-clamp-2">{category.description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-surface-100 flex gap-2">
                  <button 
                    onClick={() => navigate(`/admin/products?category=${encodeURIComponent(category.name)}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-surface-50 hover:bg-primary-50 text-surface-600 hover:text-primary-700 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <List size={14} />
                    View All
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/products/add?category=${encodeURIComponent(category.name)}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <Package size={14} />
                    Add Product
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
              <h3 className="text-lg font-bold text-surface-900">{editingId ? 'Edit Category' : 'Create New Category'}</h3>
              
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Category Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                  placeholder="e.g. Suit Sets"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Display Image</label>
                <div 
                  onClick={() => setShowMediaPicker(true)}
                  className="relative aspect-video rounded-xl border-2 border-dashed border-surface-200 overflow-hidden group cursor-pointer hover:border-primary-400 hover:bg-primary-50/10 transition-all flex flex-col items-center justify-center gap-2"
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
                  {editingId ? 'Update Category' : 'Create Category'}
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

export default CategoryManagement;
