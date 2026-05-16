import React from 'react';
import { ShoppingCart, Heart, Play, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onQuickView }) => {
  const mainMedia = product.media?.[0] || { url: product.image, type: 'image' };
  const price = product.priceAfter || product.price || 0;
  const oldPrice = product.priceBefore || product.oldPrice || 0;

  // Logic for "NEW" badge: if created within the last 7 days
  const isNew = product.createdAt && (new Date() - new Date(product.createdAt)) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-primary-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-gold/5 flex flex-col relative">
      <Link to={`/product/${product._id}`} className="flex flex-col flex-grow">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          {mainMedia.type === 'video' && mainMedia.url ? (
            <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
              <video src={mainMedia.url} className="w-full h-full object-cover" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <Play size={24} className="text-white opacity-60" />
              </div>
            </div>
          ) : mainMedia.url ? (
            <img
              src={mainMedia.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300">
              <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center mb-4">
                <ShoppingCart size={32} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Coming Soon</p>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {isNew && (
              <span className="bg-slate-950 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                New
              </span>
            )}
            {oldPrice > price && (
              <span className="bg-primary-gold text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Sale
              </span>
            )}
          </div>

          {/* Actions Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hover:bg-primary-gold hover:text-slate-950 shadow-md"
            >
              <Heart size={18} />
            </button>
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onQuickView && onQuickView(product); 
              }}
              className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hover:bg-primary-gold hover:text-slate-950 shadow-md delay-75"
            >
              <Eye size={18} />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-slate-950/80 to-transparent">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-full bg-white text-slate-950 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-gold transition-colors active:scale-95"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black text-primary-gold uppercase tracking-[0.2em] opacity-80">
              {product.category}
            </span>
          </div>

          <h3 className="text-slate-950 font-black text-sm uppercase tracking-tight mb-3 line-clamp-2 leading-snug group-hover:text-primary-gold transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-3">
            <span className="text-slate-950 font-black text-lg tracking-tight">
              ₹{price.toLocaleString()}
            </span>
            {oldPrice > price && (
              <span className="text-slate-400 line-through text-xs font-bold">
                ₹{oldPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

