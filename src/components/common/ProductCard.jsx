import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-primary-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-gold/5 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges & Actions */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.priceBefore > product.priceAfter && (
            <span className="bg-primary-gold text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Sale
            </span>
          )}
        </div>

        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hover:bg-primary-gold hover:text-slate-950 shadow-md">
          <Heart size={18} />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-slate-950/80 to-transparent">
          <button className="w-full bg-white text-slate-950 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-gold transition-colors active:scale-95">
            <ShoppingCart size={16} />
            Quick Add
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
            ₹{product.priceAfter.toLocaleString()}
          </span>
          {product.priceBefore > product.priceAfter && (
            <span className="text-slate-400 line-through text-xs font-bold">
              ₹{product.priceBefore.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
