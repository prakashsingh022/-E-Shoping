import React, { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Collection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getSlug = (name) => {
    if (!name) return 'all-products';
    return name.toLowerCase().replace(/\s+/g, '-');
  };

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
          <Link to="/shop/all-products" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:text-primary-gold transition-colors group">
            Explore All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-slate-100 mb-6" />
                <div className="h-4 w-24 bg-slate-100 rounded mb-2" />
                <div className="h-3 w-16 bg-slate-50 rounded" />
              </div>
            ))
          ) : categories.map((item, index) => (
            <Link 
              to={`/shop/${getSlug(item.name)}`}
              key={item._id || index} 
              className="flex flex-col items-center group cursor-pointer"
            >
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
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{item.productCount || 0} ITEMS</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

