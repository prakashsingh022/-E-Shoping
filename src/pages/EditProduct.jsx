import React, { useState, useEffect } from 'react';
import { getProductById, updateProduct, getCategories } from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  UploadCloud,
  X,
  Layout,
  IndianRupee,
  Package,
  Tag,
  Film,
  FileText,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import MediaPicker from '../components/MediaPicker';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sections, setSections] = useState([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    salePrice: '',
    media: [],
    category: '',
    description: '',
    stock: '',
    sizes: [],
    colors: [],
    fabric: '',
    section: '',
  });

  const [currentColor, setCurrentColor] = useState({ name: '', code: '#000000' });

  const [categories, setCategories] = useState([]);

  // For Sizes UI
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', 'Free Size', 'Custom'];
  
  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const addColor = () => {
    if (!currentColor.name.trim()) {
      toast.error('Please enter a color name');
      return;
    }
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { ...currentColor }]
    }));
    setCurrentColor({ name: '', code: '#000000' });
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

    const fetchInitialData = async () => {
      try {
        setFetching(true);
        const [categoriesData, productData, sectionsData] = await Promise.all([
          getCategories(),
          getProductById(id),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/section`).then(res => res.json())
        ]);
        setCategories(categoriesData);
        setSections(sectionsData);
        setFormData({
          name: productData.name || '',
          price: productData.price || '',
          salePrice: productData.salePrice || '',
          media: productData.media || [],
          category: productData.category || '',
          description: productData.description || '',
          stock: productData.stock || '',
          sizes: productData.sizes || [],
          colors: productData.colors || [],
          fabric: productData.fabric || '',
          section: productData.section?._id || productData.section || '',
        });
      } catch (error) {
        toast.error('Failed to fetch product details');
        navigate('/admin/products');
      } finally {
        setFetching(false);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaSelect = (selectedMedia) => {
    setFormData((prev) => ({ ...prev, media: selectedMedia }));
    setShowMediaPicker(false);
  };

  const removeMedia = (mediaId) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m._id !== mediaId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.media.length === 0) {
      toast.error('Please select at least one media item');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
      };

      await updateProduct(id, payload);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-primary-600" size={40} />
        <p className="text-surface-500 font-medium">Loading product assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2.5 bg-white border border-surface-200 rounded-xl hover:bg-surface-50 text-surface-500 hover:text-surface-900 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Edit Product</h1>
            <p className="text-surface-500 text-sm mt-0.5">Modify your product details and media gallery.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={handleSubmit} className="btn-primary flex items-center gap-2" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="card-premium p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-surface-100">
              <Layout size={18} className="text-primary-600" />
              <h3 className="font-bold text-surface-900">General Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Product Title</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Fabric</label>
                  <input type="text" name="fabric" value={formData.fabric} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all" placeholder="e.g. 100% Cotton" />
                </div>
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Stock Level</label>
                  <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Description</label>
                <textarea name="description" required value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-surface-100">
              <Package size={18} className="text-primary-600" />
              <h3 className="font-bold text-surface-900">Pricing & Inventory</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Price (₹)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="number" name="price" step="0.01" required value={formData.price} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Sale Price (₹)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="number" name="salePrice" step="0.01" value={formData.salePrice} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all font-bold" />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-3 block">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                          : 'bg-surface-50 text-surface-600 border-surface-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-3 block">Color Options</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-surface-50 border border-surface-200 pl-2 pr-1 py-1 rounded-xl group hover:border-primary-300 transition-all">
                      <div className="w-5 h-5 rounded-lg shadow-sm" style={{ backgroundColor: color.code }}></div>
                      <span className="text-xs font-bold text-surface-700">{color.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeColor(index)}
                        className="p-1 hover:bg-red-50 text-surface-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-end gap-3 p-4 bg-surface-50 rounded-2xl border border-surface-200/50">
                  <div className="flex-grow">
                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1.5 block">Color Name</label>
                    <input 
                      type="text" 
                      value={currentColor.name}
                      onChange={(e) => setCurrentColor(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-surface-200 rounded-xl text-xs focus:border-primary-500 transition-all"
                      placeholder="e.g. Royal Blue"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1.5 block">Picker</label>
                    <input 
                      type="color" 
                      value={currentColor.code}
                      onChange={(e) => setCurrentColor(prev => ({ ...prev, code: e.target.value }))}
                      className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer rounded-xl overflow-hidden block"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={addColor}
                    className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-md active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-premium p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-surface-100">
              <Tag size={18} className="text-primary-600" />
              <h3 className="font-bold text-surface-900">Organization</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Category</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-2 block">Display Section (Optional)</label>
                <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 transition-all">
                  <option value="">None</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-surface-100">
              <div className="flex items-center gap-2">
                <UploadCloud size={18} className="text-primary-600" />
                <h3 className="font-bold text-surface-900">Media Assets</h3>
              </div>
              <button type="button" onClick={() => setShowMediaPicker(true)} className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-all">
                MANAGE
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {formData.media.map((m) => (
                <div key={m._id || m.url} className="relative aspect-square rounded-xl overflow-hidden border border-surface-200 group">
                  {m.type === 'image' && <img src={m.url} className="w-full h-full object-cover" alt="" />}
                  {m.type === 'video' && <div className="w-full h-full bg-surface-900 flex items-center justify-center"><Film size={20} className="text-white/50" /></div>}
                  {m.type === 'pdf' && <div className="w-full h-full bg-red-50 flex items-center justify-center"><FileText size={20} className="text-red-500" /></div>}
                  <button type="button" onClick={() => removeMedia(m._id)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="aspect-square rounded-xl border-2 border-dashed border-surface-200 flex flex-col items-center justify-center gap-2 text-surface-400 hover:border-primary-400 hover:bg-primary-50/10 transition-all"
              >
                <Plus size={20} />
                <span className="text-[10px] font-bold uppercase">Add Media</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker
          onClose={() => setShowMediaPicker(false)}
          selectedItems={formData.media}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
};

export default EditProduct;
