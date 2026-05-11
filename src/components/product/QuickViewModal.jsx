import React from "react";
import { X, ShoppingBag, Heart, Share2, Star } from "lucide-react";

const QuickViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

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
        <div className="w-full md:w-1/2 bg-slate-50 relative overflow-hidden flex items-center justify-center min-h-[400px]">
          {product.video ? (
            <video
              src={product.video}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={product.image}
              alt={product.name || product.title}
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            />
          )}
          
          {/* Subtle Video Badge */}
          {product.video && (
             <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
               Immersive Preview
             </div>
          )}
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
                {product.name || product.title}
              </h2>
            </div>
            
            <p className="text-slate-500 leading-relaxed font-medium text-sm sm:text-base">
              {product.description || "A stunning and elegantly crafted piece, designed to bring out your best look for any occasion. Made with premium materials for maximum comfort and style."}
            </p>
            
            <div className="flex items-center gap-4 py-4 border-y border-slate-50">
              <span className="text-3xl font-black text-slate-950">
                ₹{product.priceAfter || product.price || 1999}
              </span>
              <span className="text-lg line-through text-slate-400 font-medium">
                ₹{product.priceBefore || product.oldPrice || 2499}
              </span>
              <span className="text-[10px] font-black text-primary-gold bg-primary-gold/10 px-3 py-1.5 rounded-full uppercase tracking-widest ring-1 ring-primary-gold/20">
                {product.discountPercent || product.discount || 20}% OFF
              </span>
            </div>

            {/* Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">Select Size</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-950 transition-colors">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((size) => (
                  <button
                    key={size}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-slate-50 rounded-2xl font-black text-xs text-slate-900 hover:border-slate-950 transition-all active:scale-95"
                  >
                    {size}
                  </button>
                ))}
              </div>
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
