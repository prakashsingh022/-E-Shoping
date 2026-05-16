import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Heart, Share2, Star, Play } from "lucide-react";

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const [activeMedia, setActiveMedia] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (product && product.media && product.media.length > 0) {
      setActiveMedia(product.media[0]);
    }
    setSelectedSize('');
    setSelectedColor(null);
  }, [product]);

  if (!isOpen || !product) return null;

  const price = product.priceAfter || product.price || 0;
  const oldPrice = product.priceBefore || product.oldPrice || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md transition-all animate-in fade-in duration-300">
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white transition-all z-50 group shadow-lg"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left: Product Media Gallery */}
        <div className="w-full md:w-1/2 bg-slate-50 relative overflow-hidden flex flex-col">
          <div className="flex-1 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            {activeMedia?.type === 'video' ? (
              <video
                src={activeMedia.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={activeMedia?.url || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
            )}
            
            {activeMedia?.type === 'video' && (
              <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                Immersive Preview
              </div>
            )}
          </div>

          {/* Thumbnails Overlay */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 overflow-x-auto custom-scrollbar-hide">
            {product.media?.map((m, i) => (
              <div 
                key={m._id || i}
                onClick={() => setActiveMedia(m)}
                className={`w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                  activeMedia?.url === m.url ? 'border-primary-gold scale-95' : 'border-transparent'
                }`}
              >
                {m.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                    <video src={m.url} className="w-full h-full object-cover opacity-60" />
                    <Play size={12} className="text-white absolute" />
                  </div>
                ) : (
                  <img src={m.url} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 flex flex-col p-8 sm:p-12 overflow-y-auto bg-white">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex text-primary-gold items-center">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Premium Choice</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">
                {product.name}
              </h2>
            </div>
            
            <p className="text-slate-500 leading-relaxed font-medium text-sm sm:text-base">
              {product.description}
            </p>
            
            <div className="flex items-center gap-4 py-4 border-y border-slate-50">
              <span className="text-3xl font-black text-slate-950">
                ₹{price.toLocaleString()}
              </span>
              {oldPrice > price && (
                <span className="text-lg line-through text-slate-400 font-medium">
                  ₹{oldPrice.toLocaleString()}
                </span>
              )}
              <span className="text-[10px] font-black text-primary-gold bg-primary-gold/10 px-3 py-1.5 rounded-full uppercase tracking-widest ring-1 ring-primary-gold/20">
                {product.discountPercent || 20}% OFF
              </span>
            </div>

            {/* Selection */}
            <div className="space-y-6">
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">Select Size</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-950 transition-colors">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 rounded-2xl font-black text-xs transition-all active:scale-95 ${
                          selectedSize === size 
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xl scale-105' 
                            : 'bg-white text-slate-900 border-slate-50 hover:border-slate-950'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">Color Options</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {selectedColor ? selectedColor.name : `${product.colors.length} Variants`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, idx) => (
                      <div key={idx} className="group flex flex-col items-center gap-2">
                        <div 
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full ring-offset-2 transition-all cursor-pointer ${
                            selectedColor?.name === color.name 
                              ? 'ring-2 ring-primary-gold scale-125' 
                              : 'ring-1 ring-slate-100 ring-offset-slate-50 hover:scale-110'
                          }`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                        <span className={`text-[7px] font-black uppercase tracking-tighter transition-opacity ${
                          selectedColor?.name === color.name ? 'text-primary-gold opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                        }`}>
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="flex-1 btn-premium py-5 rounded-3xl flex items-center justify-center gap-3 shadow-primary-gold/20">
                <ShoppingBag size={20} /> Add To Bag
              </button>
              <div className="flex gap-2">
                <button className="w-16 h-16 flex items-center justify-center border-2 border-slate-50 rounded-3xl hover:border-slate-950 transition-all text-slate-900 group">
                  <Heart size={22} className="group-hover:fill-slate-950 transition-colors" />
                </button>
                <button className="w-16 h-16 flex items-center justify-center border-2 border-slate-50 rounded-3xl hover:border-slate-950 transition-all text-slate-900">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.3em] pt-4">
              Free Shipping & Returns on all orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
