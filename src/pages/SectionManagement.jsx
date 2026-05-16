import React, { useState, useEffect } from 'react';
import { getSections, createSection, updateSection, deleteSection } from '../services/api';
import { Edit, Trash2, Plus, Search, Layers, X } from 'lucide-react';
import { toast } from 'react-toastify';

const SectionManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await getSections();
      setSections(data);
    } catch (error) {
      toast.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSection(editingId, formData);
        toast.success('Section updated successfully');
      } else {
        await createSection(formData);
        toast.success('Section created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchSections();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '' });
    setEditingId(null);
  };

  const handleEdit = (section) => {
    setFormData({
      title: section.title,
      slug: section.slug,
    });
    setEditingId(section._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section? This will not delete the products in it.')) {
      try {
        await deleteSection(id);
        toast.success('Section removed');
        fetchSections();
      } catch (error) {
        toast.error('Failed to delete section');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Sections</h1>
          <p className="text-surface-500 text-sm mt-1">Manage home page sections and their titles.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Section
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card-premium h-48 animate-pulse bg-surface-50"></div>
          ))
        ) : sections.length === 0 ? (
          <div className="col-span-full py-20 text-center card-premium">
            <Layers size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500 font-medium">No sections found. Start by adding one.</p>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section._id} className="card-premium group p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                   <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                      <Layers size={24} />
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(section)}
                        className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(section._id)}
                        className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
                <h3 className="font-bold text-lg text-surface-900 mb-1">{section.title}</h3>
                <p className="text-surface-400 text-xs font-mono">Slug: {section.slug}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-surface-50">
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Type: Collection Section</span>
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
              <h3 className="text-lg font-bold text-surface-900">{editingId ? 'Edit Section' : 'Create New Section'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-50 rounded-lg text-surface-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Section Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                  placeholder="e.g. The Suit Set Edition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Slug</label>
                <input 
                  type="text" 
                  required 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-mono"
                  placeholder="e.g. suit-set-edition"
                />
                <p className="mt-2 text-[10px] text-surface-400 italic">This slug is used in the frontend to fetch products.</p>
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
                  {editingId ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManagement;
