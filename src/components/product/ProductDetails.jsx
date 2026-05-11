import React, { useState } from "react";
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus, Share2 } from "lucide-react";

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left: Image Gallery (Mock) */}
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-[40px] overflow-hidden bg-slate-100 group relative">
              <img
                src="/Images/model1.png"
                alt="Product"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <button className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-slate-900 hover:text-primary-gold transition-colors">
                <Heart size={20} />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border-2 border-transparent hover:border-primary-gold transition-all">
                  <img src="/Images/model1.png" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
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
              
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight uppercase">
                Premium Silk Embroidered Suit Set
              </h1>
              
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-black text-slate-950">₹4,999</span>
                <span className="text-xl text-slate-400 line-through font-medium">₹6,999</span>
                <span className="bg-primary-gold/10 text-primary-gold text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  30% OFF
                </span>
              </div>
              
              <p className="text-slate-500 leading-relaxed text-lg pt-4">
                A masterpiece of traditional craftsmanship blended with modern silhouette. 
                Features intricate zari work on premium silk fabric, perfect for festive celebrations.
              </p>
            </div>

            {/* Selection */}
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-950 font-bold text-sm uppercase tracking-widest">Select Size</span>
                  <button className="text-primary-gold text-xs font-bold uppercase underline tracking-widest">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all border-2 ${
                        selectedSize === size 
                        ? "bg-slate-950 text-white border-slate-950 shadow-xl scale-105" 
                        : "bg-white text-slate-900 border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <button className="btn-premium py-5 rounded-2xl flex items-center justify-center gap-3">
                <ShoppingBag size={20} /> Add To Bag
              </button>
              <button className="px-8 py-5 bg-slate-100 text-slate-950 font-black rounded-2xl uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Share2 size={20} /> Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                  <Truck size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Authentic Only</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                  <RotateCcw size={20} />
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
