import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus, Share2, Play } from "lucide-react";

export default function ProductDetails({ product }) {
  const location = useLocation();
  const fallbackVideo = location.state?.fallbackVideo;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (product) {
      let mediaList = [...(product.media || [])];
      if (fallbackVideo && !mediaList.some(m => m.url === fallbackVideo)) {
        mediaList.unshift({
          url: fallbackVideo,
          type: 'video',
          public_id: 'visual-shop-video'
        });
      }
      product.mediaList = mediaList;
      setActiveMedia(mediaList[0] || null);
      setSelectedSize("");
      setSelectedColor(null);
      setQuantity(1);
    }
  }, [product, fallbackVideo]);

  if (!product) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Image/Video Gallery */}
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-[40px] overflow-hidden bg-slate-100 group relative shadow-2xl">
              {activeMedia?.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  crossOrigin="anonymous"
                  preload="auto"
                />
              ) : (
                <img
                  src={activeMedia?.url || "/Images/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              )}
              <button className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-slate-900 hover:text-primary-gold transition-colors">
                <Heart size={20} />
              </button>

              {activeMedia?.type === 'video' && (
                <div className="absolute bottom-8 left-8 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                  <Play size={12} className="text-white fill-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Footage</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {(product.mediaList || product.media || []).map((m, i) => (
                <div
                  key={m._id || i}
                  onClick={() => setActiveMedia(m)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border-2 transition-all ${activeMedia?.url === m.url
                      ? 'border-primary-gold scale-95 shadow-lg'
                      : 'border-transparent hover:border-slate-300'
                    }`}
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                      <video src={m.url} className="w-full h-full object-cover opacity-60" />
                      <Play size={16} className="text-white absolute" />
                    </div>
                  ) : (
                    <img src={m.url} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex text-primary-gold items-center">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">(128 Reviews)</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight uppercase leading-[1.1]">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-slate-950">₹{product.price?.toLocaleString()}</span>
                {product.oldPrice && <span className="text-xl text-slate-400 line-through font-medium">₹{product.oldPrice.toLocaleString()}</span>}
                <span className="bg-primary-gold/10 text-primary-gold text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  NEW ARRIVAL
                </span>
              </div>

              <p className="text-slate-500 leading-relaxed text-lg pt-4">
                {product.description}
              </p>
            </div>

            {/* Selection */}
            <div className="space-y-8 pt-4">
              {product.fabric && (
                <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <span className="text-slate-950 font-bold text-sm uppercase tracking-widest block">Premium Fabric</span>
                  <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-gold animate-pulse"></span>
                    <span className="text-slate-700 font-extrabold text-xs uppercase tracking-widest">{product.fabric}</span>
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-950 font-bold text-sm uppercase tracking-widest">Select Size</span>
                    <button className="text-primary-gold text-xs font-bold uppercase underline tracking-widest">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all border-2 ${selectedSize === size
                            ? "bg-slate-950 text-white border-slate-950 shadow-xl scale-105"
                            : "bg-white text-slate-900 border-slate-100 hover:border-slate-300"
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
                  <div className="flex justify-between items-center">
                    <span className="text-slate-950 font-bold text-sm uppercase tracking-widest">Available Colors</span>
                    {selectedColor && <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{selectedColor.name}</span>}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-4 transition-all shadow-sm ${selectedColor?.name === color.name
                              ? "border-primary-gold scale-110 shadow-lg"
                              : "border-white ring-1 ring-slate-100 hover:ring-primary-gold/50"
                            }`}
                          style={{ backgroundColor: color.code }}
                        />
                        <span className={`text-[8px] font-bold uppercase tracking-tighter transition-colors ${selectedColor?.name === color.name ? 'text-primary-gold' : 'text-slate-400'}`}>
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-slate-950 font-bold text-sm uppercase tracking-widest">Quantity</span>
                <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-white rounded-xl transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-black text-slate-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-white rounded-xl transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="btn-premium py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
                  <ShoppingBag size={20} /> Add To Bag
                </button>
                <button className="w-full py-5 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 border border-slate-950 shadow-xl shadow-slate-950/10">
                  Buy Now
                </button>
              </div>
              <button className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all active:scale-98 flex items-center justify-center gap-3 border border-slate-100/50">
                <Share2 size={16} /> Share Product
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary-gold/10 group-hover:text-primary-gold transition-colors">
                  <Truck size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary-gold/10 group-hover:text-primary-gold transition-colors">
                  <ShieldCheck size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Authentic Only</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary-gold/10 group-hover:text-primary-gold transition-colors">
                  <RotateCcw size={22} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
