import React, { useState, useEffect } from "react";
import { ShoppingBag, Heart, Eye, ArrowRight, Share2 } from "lucide-react";
import QuickViewModal from "../product/QuickViewModal";
// No product data import needed

const LuxeSet = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?category=Luxe Sets`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch luxe sets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
      
      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-primary-gold text-xs font-bold tracking-[0.3em] uppercase">Premium Selection</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic">
              Luxe Luxe Set
            </h2>
            <p className="text-slate-500 leading-relaxed">
              Indulge in our most exclusive designs. High-end fabrics, intricate embroidery, and silhouettes that make a statement.
            </p>
          </div>
          <button className="btn-premium group gap-2">
            View All Luxe <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl overflow-hidden h-[550px] animate-pulse" />
            ))
          ) : products.map((product) => (
            <div 
              key={product._id} 
              className="group relative flex flex-col bg-slate-50 rounded-3xl overflow-hidden transition-all duration-700 hover:bg-white hover:shadow-2xl hover:shadow-slate-200"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.media?.[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-primary-gold hover:text-white transition-colors">
                    <Heart size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-primary-gold hover:text-white transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Bottom Overlay Quick View */}
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-gold"
                >
                  Quick Experience
                </button>

                {/* Discount Badge */}
                <div className="absolute top-6 left-0 bg-primary-gold text-slate-950 text-[10px] font-black px-4 py-1.5 uppercase tracking-tighter">
                  EXCLUSIVE
                </div>
              </div>

              {/* Info */}
              <div className="p-8 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-slate-900 font-bold text-xl group-hover:text-primary-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Limited Edition</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-950">₹{product.price}</span>
                  </div>
                  <button className="group flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 hover:border-slate-950 hover:bg-slate-950 transition-all duration-300">
                    <ShoppingBag size={20} className="text-slate-900 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <QuickViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
};

export default LuxeSet;
