import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  X, 
  Search, 
  ImageIcon, 
  Film, 
  FileText, 
  Check, 
  Upload, 
  Loader2,
  Package
} from 'lucide-react';
import { toast } from 'react-toastify';

const MediaPicker = ({ onSelect, selectedItems = [], onClose, allowMultiple = true, initialType = 'all' }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [tempSelection, setTempSelection] = useState(selectedItems);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/media');
      setMedia(data);
    } catch (error) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      setUploading(true);
      const { data } = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Media uploaded successfully');
      fetchMedia();
      
      if (!allowMultiple) {
         setTempSelection([data[0]]);
      } else {
         setTempSelection(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      const message = error.response?.data?.message || 'Upload failed. Check your file size or format.';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (item) => {
    if (!allowMultiple) {
      setTempSelection([item]);
      return;
    }

    const exists = tempSelection.find(m => m._id === item._id);
    if (exists) {
      setTempSelection(tempSelection.filter(m => m._id !== item._id));
    } else {
      setTempSelection([...tempSelection, item]);
    }
  };

  const filteredMedia = media.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-bold text-surface-900 text-lg">Select Media</h3>
              <p className="text-xs text-surface-500 font-medium">Pick images, videos or documents for your product</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-200 rounded-xl text-surface-500 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-surface-100 bg-white flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            <div className="flex bg-surface-100 p-1 rounded-xl w-full sm:w-auto">
              {['all', 'image', 'video', 'pdf'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${
                    typeFilter === type ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <label className="btn-primary flex items-center gap-2 text-xs py-2 cursor-pointer w-full sm:w-auto justify-center">
               {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
               <span>Upload</span>
               <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {Array(18).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-surface-50 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-surface-400 space-y-4">
                <ImageIcon size={48} className="opacity-20" />
                <p className="font-medium text-sm">No media found in library</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = tempSelection.some(m => m._id === item._id);
                return (
                  <div 
                    key={item._id} 
                    onClick={() => toggleSelect(item)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 group ${
                      isSelected ? 'border-primary-600 scale-95 shadow-lg' : 'border-transparent hover:border-surface-300'
                    }`}
                  >
                    {item.type === 'image' && <img src={item.url} alt={item.name} className="w-full h-full object-cover" />}
                    {item.type === 'video' && (
                      <div className="w-full h-full bg-surface-900 flex items-center justify-center">
                        <Film size={24} className="text-white/50" />
                      </div>
                    )}
                    {item.type === 'pdf' && (
                      <div className="w-full h-full bg-red-50 flex items-center justify-center">
                        <FileText size={24} className="text-red-500" />
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center animate-in fade-in zoom-in-50 duration-200">
                        <div className="bg-primary-600 text-white p-1 rounded-full shadow-lg">
                           <Check size={16} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                       <p className="text-[8px] text-white font-bold truncate">{item.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-100 flex items-center justify-between bg-surface-50/50">
            <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">
                {tempSelection.length} {tempSelection.length === 1 ? 'item' : 'items'} selected
            </p>
            <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-surface-600 hover:text-surface-900 transition-all">Cancel</button>
                <button 
                    onClick={() => onSelect(tempSelection)} 
                    className="btn-primary px-8 py-2.5 text-xs"
                    disabled={tempSelection.length === 0}
                >
                    Confirm Selection
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPicker;
