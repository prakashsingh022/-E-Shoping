import React, { useState, useEffect } from 'react';
import { getVideos, addVideo, updateVideo, deleteVideo, getProducts } from '../services/api';
import { 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Play, 
  Film, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import MediaPicker from '../components/MediaPicker';

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pickerType, setPickerType] = useState('video');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stock: 100,
    videoUrl: '',
    thumbnail: '',
    productId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const vData = await getVideos();
      setVideos(vData);
      const pData = await getProducts();
      setProducts(pData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoUrl) {
      toast.error('Please select a video');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateVideo(editingId, formData);
        toast.success('Broadcast updated');
      } else {
        await addVideo(formData);
        toast.success('Broadcast launched');
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
    setFormData({ 
      title: '', 
      description: '',
      stock: 100,
      videoUrl: '', 
      thumbnail: '', 
      productId: '',
    });
    setEditingId(null);
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title || '',
      description: video.description || '',
      stock: video.stock || 100,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail || '',
      productId: video.productId?._id || video.productId || '',
    });
    setEditingId(video._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        toast.success('Video removed');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  const handleMediaSelect = (selectedMedia) => {
    if (selectedMedia.length > 0) {
      const media = selectedMedia[0];
      if (pickerType === 'video') {
        if (media.type !== 'video') {
           toast.error('Please select a video file');
           return;
        }
        setFormData({ ...formData, videoUrl: media.url });
      } else {
        if (media.type !== 'image') {
           toast.error('Please select an image file');
           return;
        }
        setFormData({ ...formData, thumbnail: media.url });
      }
    }
    setShowMediaPicker(false);
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Campaign Broadcasts</h1>
          <p className="text-surface-500 text-sm mt-1">Manage interactive shopping reels and product footage.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card-premium h-[450px] animate-pulse bg-surface-50"></div>
          ))
        ) : videos.length === 0 ? (
          <div className="col-span-full py-20 text-center card-premium">
            <Film size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500 font-medium">No active broadcasts. Launch your first one!</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="card-premium group overflow-hidden flex flex-col h-full bg-slate-950 border-slate-900 shadow-2xl transition-all hover:shadow-primary-500/10 hover:border-primary-500/30">
              <div className="relative aspect-[9/16] overflow-hidden bg-slate-900">
                <video 
                  src={video.videoUrl} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  muted
                  loop
                  playsInline
                  crossOrigin="anonymous"
                  preload="auto"
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => e.target.pause()}
                />
                
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 pointer-events-none group-hover:pointer-events-auto">
                  <button 
                    onClick={() => handleEdit(video)}
                    className="p-3 bg-white text-surface-900 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-xl hover:scale-110 duration-200"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(video._id)}
                    className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl hover:scale-110 duration-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="absolute top-4 left-4 z-10">
                   <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                      <Play size={10} className="text-white fill-white" strokeWidth={3} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mt-0.5">{video.views || 0} Discovery</span>
                   </div>
                </div>
                
                {video.stock > 0 && (
                   <div className="absolute top-4 right-4 z-10">
                      <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">{video.stock} In Stock</span>
                      </div>
                   </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col bg-slate-950 space-y-3">
                <h3 className="font-bold text-white text-sm line-clamp-1 uppercase tracking-tight">{video.title || 'In-House Creative'}</h3>
                {video.description && (
                   <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed h-8">
                     {video.description}
                   </p>
                )}
                
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                   <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest">Interactive Video</span>
                   <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="px-8 py-5 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
              <div>
                <h3 className="text-xl font-black text-surface-900 uppercase tracking-tight">
                  {editingId ? 'Edit Performance Settings' : 'Campaign Broadcast Setup'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl text-surface-400 hover:text-surface-900 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                 {/* Left Column: Visuals */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] block pl-1">Creative Footage</label>
                       <div 
                         onClick={() => { setPickerType('video'); setShowMediaPicker(true); }}
                         className="aspect-[9/16] relative rounded-[32px] border-2 border-dashed border-surface-200 overflow-hidden cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-all group shadow-sm bg-surface-50 flex items-center justify-center p-6 text-center"
                       >
                         {formData.videoUrl ? (
                            <div className="absolute inset-0">
                               <video 
                                src={formData.videoUrl} 
                                className="w-full h-full object-cover" 
                                autoPlay 
                                muted 
                                loop 
                                playsInline 
                                crossOrigin="anonymous"
                                preload="auto"
                             />
                               <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/40 px-4 py-2 rounded-full">Change Video</span>
                               </div>
                            </div>
                         ) : (
                           <div className="space-y-3">
                             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-primary-500">
                                <Play size={24} strokeWidth={3} fill="currentColor" />
                             </div>
                             <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Select Footage</p>
                           </div>
                         )}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] block pl-1">Cover Card</label>
                       <div 
                         onClick={() => { setPickerType('thumbnail'); setShowMediaPicker(true); }}
                         className="aspect-[9/16] relative rounded-[32px] border-2 border-dashed border-surface-200 overflow-hidden cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-all group shadow-sm bg-surface-50 flex items-center justify-center p-6 text-center"
                       >
                         {formData.thumbnail ? (
                            <div className="absolute inset-0">
                               <img src={formData.thumbnail} className="w-full h-full object-cover" alt="" />
                               <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/40 px-4 py-2 rounded-full">Change Card</span>
                               </div>
                            </div>
                         ) : (
                           <div className="space-y-3">
                             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-primary-500">
                                <ImageIcon size={24} strokeWidth={3} />
                             </div>
                             <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Select Cover</p>
                           </div>
                         )}
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Information */}
                 <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2.5 block pl-1">Product Display Title</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4.5 bg-surface-50 border border-surface-200 rounded-[20px] text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-surface-900 shadow-sm"
                        placeholder="e.g. Summer Handblock Silk Saree"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2.5 block pl-1">Initial Inventory (Qty)</label>
                          <input 
                            type="number" 
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                            className="w-full px-6 py-4.5 bg-surface-50 border border-surface-200 rounded-[20px] text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-black text-surface-900 shadow-sm"
                            placeholder="e.g. 50"
                          />
                        </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2.5 block pl-1">Campaign Product Description</label>
                      <textarea 
                        rows={6}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-6 py-5 bg-surface-50 border border-surface-200 rounded-[24px] text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-surface-700 shadow-sm resize-none leading-relaxed"
                        placeholder="Tell the story of this product look..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2.5 block pl-1">Linked Catalog Product</label>
                      <select
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        className="w-full px-6 py-4.5 bg-surface-50 border border-surface-200 rounded-[20px] text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-surface-900 shadow-sm"
                      >
                        <option value="">-- None / Select Product --</option>
                        {products.map((prod) => (
                          <option key={prod._id} value={prod._id}>
                            {prod.name} (₹{prod.price})
                          </option>
                        ))}
                      </select>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-surface-100">
                <button 
                   type="submit"
                   disabled={submitting}
                   className="w-full btn-primary py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/30 active:scale-95 transition-all"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Update Connection' : 'Broadcast Campaign')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMediaPicker && (
        <MediaPicker 
          onClose={() => setShowMediaPicker(false)} 
          selectedItems={[]} 
          onSelect={handleMediaSelect}
          singleSelect={true}
          initialType={pickerType === 'video' ? 'video' : 'image'}
        />
      )}
    </div>
  );
};

export default VideoManagement;
