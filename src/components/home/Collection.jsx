import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { collections } from "../../data/homeData";

export default function Collection() {

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-primary-gold text-xs font-bold tracking-[0.3em] uppercase">Curated Collections</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              Shop by <span className="text-primary-gold">Category</span>
            </h2>
          </div>
          <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:text-primary-gold transition-colors group">
            Explore All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Desktop grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {collections.map((item, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6">
                {/* Outer decorative ring */}
                <div className="absolute -inset-4 border border-slate-100 rounded-full scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700"></div>

                {/* Main Circle */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-slate-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:border-primary-gold transition-all duration-500 relative z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-950 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-black py-1.5 px-3 rounded-full opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20 whitespace-nowrap">
                  VIEW SHOP
                </div>
              </div>

              <div className="text-center space-y-1 relative z-10">
                <h3 className="text-slate-950 font-black text-lg uppercase tracking-tight group-hover:text-primary-gold transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
