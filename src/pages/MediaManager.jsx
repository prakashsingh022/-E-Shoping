import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Film, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  X,
  ExternalLink,
  Plus,
  Loader2
} from 'lucide-react';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);

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
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Media uploaded successfully');
      fetchMedia();
    } catch (error) {
      console.error('Full upload error:', error);
      toast.error(error.response?.data?.message || error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.delete(`/media/${id}`);
        toast.success('Media deleted');
        setMedia(media.filter(m => m._id !== id));
      } catch (error) {
        toast.error('Failed to delete media');
      }
    }
  };

  const filteredMedia = media.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const MediaCard = ({ item }) => {
    const renderPreview = () => {
      if (item.type === 'image') {
        return <img src={item.url} alt={item.name} className="w-full h-full object-cover" />;
      }
      if (item.type === 'video') {
        return (
          <div className="w-full h-full bg-surface-900 flex items-center justify-center relative group">
            <Film size={32} className="text-white/50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
               <Film size={24} className="text-white" />
            </div>
          </div>
        );
      }
      if (item.type === 'pdf') {
        return (
          <div className="w-full h-full bg-red-50 flex items-center justify-center">
            <FileText size={32} className="text-red-500" />
          </div>
        );
      }
    };

    return (
      <div className="card-premium overflow-hidden group relative animate-in fade-in duration-300">
        <div className="aspect-square bg-surface-100 overflow-hidden relative">
          {renderPreview()}
          
          <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
             <div className="flex gap-2">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-primary-600 transition-all"
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
             </div>
             <p className="text-[10px] text-white font-bold text-center break-all line-clamp-2">{item.name}</p>
          </div>

          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${
            item.type === 'image' ? 'bg-emerald-500/80 text-white' : 
            item.type === 'video' ? 'bg-primary-500/80 text-white' : 'bg-red-500/80 text-white'
          }`}>
             {item.type}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Media Manager</h1>
          <p className="text-surface-500 text-sm mt-1">Upload and manage images, videos, and documents.</p>
        </div>
        
        <label className="btn-primary flex items-center gap-2 cursor-pointer relative overflow-hidden group">
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
          <input 
            type="file" 
            multiple 
            onChange={handleFileUpload} 
            className="hidden" 
            disabled={uploading}
            accept="image/*,video/*,.pdf"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search filenames..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex bg-white border border-surface-200 p-1 rounded-xl shadow-sm">
          {['all', 'image', 'video', 'pdf'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                typeFilter === type 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-surface-500 hover:text-surface-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-surface-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="card-premium p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center text-surface-300">
             <ImageIcon size={32} />
          </div>
          <p className="text-surface-500 font-medium">No media found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMedia.map((item) => (
            <MediaCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
