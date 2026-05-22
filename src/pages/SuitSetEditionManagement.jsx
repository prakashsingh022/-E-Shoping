import React, { useState, useEffect } from 'react';
import { api, getProducts, addProduct, updateProduct, deleteProduct, getSections } from '../services/api';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  X,
  Upload,
  Loader2,
  Package,
  IndianRupee,
  Tag,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';

const SuitSetEditionManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Suit Sets',
    image: '',
    section: '', // Will be set to the ID of 'suit-set-edition'
    sizes: [],
    colors: [],
    fabric: '',
    media: [],
    stock: 0,
  });

  const [currentColor, setCurrentColor] = useState({ name: '', code: '#000000' });

  // For Sizes UI
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', 'Free Size', 'Custom'];

  // Color Dictionary & Resolution Helpers
  const COLOR_NAMES_DICT = {
    "#000000": "Black",
    "#ffffff": "White",
    "#ff0000": "Red",
    "#00ff00": "Lime",
    "#0000ff": "Blue",
    "#ffff00": "Yellow",
    "#00ffff": "Cyan",
    "#ff00ff": "Magenta",
    "#c0c0c0": "Silver",
    "#808080": "Gray",
    "#800000": "Maroon",
    "#808000": "Olive",
    "#008000": "Green",
    "#800080": "Purple",
    "#008080": "Teal",
    "#000080": "Navy",
    "#ffa500": "Orange",
    "#ffc0cb": "Pink",
    "#4b0082": "Indigo",
    "#ee82ee": "Violet",
    "#ffd700": "Gold",
    "#f5f5dc": "Beige",
    "#a52a2a": "Brown",
    "#40e0d0": "Turquoise",
    "#e6e6fa": "Lavender",
    "#fa8072": "Salmon",
    "#ff7f50": "Coral",
    "#ffe4c4": "Bisque",
    "#ffdab9": "Peach",
    "#d2b48c": "Tan",
    "#8b4513": "Saddle Brown",
    "#228b22": "Forest Green",
    "#1e90ff": "Dodger Blue",
    "#4682b4": "Steel Blue",
    "#00bfff": "Deep Sky Blue",
    "#6a5acd": "Slate Blue",
    "#708090": "Slate Gray",
    "#800020": "Burgundy",
    "#da70d6": "Orchid",
    "#d8bfd8": "Thistle",
    "#ff007f": "Rose",
    "#e0b0ff": "Mauve",
    "#ff7f00": "Neon Orange",
    "#bfff00": "Lime Green",
    "#c5a059": "Mustard Gold",
    "#30b3a8": "Teal Blue",
    "#f0e68c": "Khaki",
    "#e6ccb2": "Nude",
    "#b38b6d": "Taupe",
    "#d8a47f": "Terracotta",
    "#7a1f1d": "Crimson",
    "#5c0632": "Plum",
    "#3b1301": "Chocolate",
    "#a0522d": "Sienna",
    "#8fbc8f": "Sage Green",
    "#2e8b57": "Sea Green",
    "#00a86b": "Jade",
    "#f4f0ec": "Ivory",
    "#eae0d5": "Alabaster",
    "#6c757d": "Charcoal",
    "#1c2541": "Midnight Blue",
    "#3a506b": "Steel",
    "#00ffff": "Aqua"
  };

  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getClosestColorName = (hex) => {
    const targetRgb = hexToRgb(hex);
    if (!targetRgb) return "";

    let minDistance = Infinity;
    let closestName = "";

    for (const [key, value] of Object.entries(COLOR_NAMES_DICT)) {
      const currRgb = hexToRgb(key);
      if (!currRgb) continue;

      const distance = Math.sqrt(
        Math.pow(targetRgb.r - currRgb.r, 2) +
        Math.pow(targetRgb.g - currRgb.g, 2) +
        Math.pow(targetRgb.b - currRgb.b, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestName = value;
      }
    }

    return closestName;
  };

  const handleColorNameChange = (nameValue) => {
    setCurrentColor(prev => {
      const next = { ...prev, name: nameValue };
      const tempElem = document.createElement("div");
      tempElem.style.color = nameValue.trim().toLowerCase();
      document.body.appendChild(tempElem);
      const resolvedColor = window.getComputedStyle(tempElem).color;
      document.body.removeChild(tempElem);

      const isBlack = ["black", "#000", "#000000", "rgb(0, 0, 0)"].includes(nameValue.trim().toLowerCase());
      const match = resolvedColor.match(/\d+/g);

      if (match && match.length >= 3) {
        const r = parseInt(match[0], 10);
        const g = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

        if (hex !== "#000000" || isBlack) {
          next.code = hex;
        }
      }
      return next;
    });
  };

  const handleColorPickerChange = (codeValue) => {
    const name = getClosestColorName(codeValue);
    setCurrentColor({ name, code: codeValue });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Get Section ID for 'suit-set-edition'
      const sections = await getSections();
      const suitSection = sections.find(s => s.slug === 'suit-set-edition');

      if (suitSection) {
        setFormData(prev => ({ ...prev, section: suitSection._id }));

        // 2. Get Products for this section
        const response = await api.get(`/products?section=suit-set-edition`);
        setProducts(response.data);
      } else {
        toast.error('The Suit Set Edition section not found. Please create it first.');
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach(file => {
      uploadData.append('files', file);
    });

    try {
      setUploading(true);
      const { data } = await api.post('/media/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data && data.length > 0) {
        const newMedia = data.map(item => ({
          url: item.url,
          public_id: item.public_id,
          type: item.type || 'image'
        }));

        setFormData(prev => {
          const updatedMedia = [...prev.media, ...newMedia];
          return {
            ...prev,
            image: updatedMedia[0]?.url || '',
            media: updatedMedia
          };
        });
        toast.success(`${data.length} photo(s) uploaded successfully`);
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload a product image');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock || 0),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products/add', payload);
        toast.success('Product added to The Suit Set Edition');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      image: '',
      sizes: [],
      colors: [],
      fabric: '',
      media: [],
    }));
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category || 'Suit Sets',
      image: product.image || (product.media?.[0]?.url || ''),
      section: product.section?._id || product.section,
      sizes: product.sizes || [],
      colors: product.colors || [],
      fabric: product.fabric || '',
      media: product.media || [],
    });
    setEditingId(product._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product removed');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">The Suit Set Edition</h1>
          <p className="text-surface-500 text-sm mt-1">Manage products featured in the Suit Set section.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Suit Set Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
        <input
          type="text"
          placeholder="Search products in this section..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card-premium h-80 animate-pulse bg-surface-50"></div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center card-premium">
            <Package size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500 font-medium">No products found in this section.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="card-premium group overflow-hidden flex flex-col bg-white">
              <div className="aspect-[3/4] relative overflow-hidden bg-surface-100">
                <img
                  src={product.image || (product.media?.[0]?.url || '/placeholder.png')}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2.5 bg-white text-surface-900 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2.5 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/20">
                  <span className="text-[10px] font-bold text-surface-900 uppercase tracking-wider">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-surface-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">{product.category}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-900">{editingId ? 'Edit Product' : 'Add New Suit Set'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-50 rounded-lg text-surface-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Silk Embroidered Suit"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Price (₹)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 outline-none transition-all font-bold"
                      placeholder="2999"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Silk, Cotton, etc."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:border-primary-500 outline-none transition-all resize-none"
                  placeholder="Describe the suit set..."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-3 block">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${formData.sizes.includes(size)
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                          : 'bg-surface-50 text-surface-600 border-surface-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest pl-1 mb-1 block">Colors</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 bg-surface-50 border border-surface-200 pl-2 pr-1 py-1 rounded-lg group">
                        <div className="w-4 h-4 rounded shadow-sm" style={{ backgroundColor: color.code }}></div>
                        <span className="text-[10px] font-bold text-surface-700">{color.name}</span>
                        <button type="button" onClick={() => removeColor(index)} className="p-0.5 hover:bg-red-50 text-surface-400 hover:text-red-500 rounded transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-2 p-3 bg-surface-50 rounded-xl border border-surface-200/50">
                    <div className="flex-grow">
                      <input type="text" value={currentColor.name} onChange={(e) => handleColorNameChange(e.target.value)} className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-[10px] focus:border-primary-500 outline-none" placeholder="Color Name" />
                    </div>
                    <input type="color" value={currentColor.code} onChange={(e) => handleColorPickerChange(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden" />
                    <button type="button" onClick={addColor} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 block pl-1">
                  Product Gallery (Upload at least 4 photos)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {formData.media.map((m, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-surface-200 bg-surface-50 group">
                      <img src={m.url} className="w-full h-full object-cover" alt="" />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedMedia = formData.media.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            image: updatedMedia[0]?.url || '',
                            media: updatedMedia
                          });
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {uploading ? (
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-surface-200 bg-surface-50 flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary-600" size={20} />
                    </div>
                  ) : (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-surface-200 flex flex-col items-center justify-center gap-1.5 text-surface-400 hover:border-primary-400 hover:bg-primary-50/10 cursor-pointer transition-all">
                      <Plus size={20} />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Add Photo</span>
                      <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                  )}
                </div>
                {formData.media.length > 0 && formData.media.length < 4 && (
                  <p className="text-[10px] text-amber-500 font-bold tracking-wide mt-2">
                    💡 Uploaded {formData.media.length}/4. Please upload at least 4 photos for a premium experience.
                  </p>
                )}
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
                  disabled={submitting || uploading}
                  className="flex-[2] btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'Update Product' : 'Add to Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuitSetEditionManagement;
