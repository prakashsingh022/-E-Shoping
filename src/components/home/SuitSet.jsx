import React, { useState, useEffect } from "react";
import { ShoppingBag, Heart, Eye, ArrowRight } from "lucide-react";
import QuickViewModal from "../product/QuickViewModal";
// No product data import needed

export default function SuitSet() {
  const [products, setProducts] = useState([]);
  const [sectionData, setSectionData] = useState({ title: 'The Suit Set Edition' });
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Section Title
        const sectionRes = await fetch('http://localhost:5000/api/section');
        const sections = await sectionRes.json();
        const currentSection = sections.find(s => s.slug === 'suit-set-edition');
        if (currentSection) {
          setSectionData(currentSection);
        }

        // Fetch Products by Section Slug
        const productRes = await fetch('http://localhost:5000/api/products?section=suit-set-edition');
        const productData = await productRes.json();
        setProducts(productData);
      } catch (error) {
        console.error('Failed to fetch suit sets data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="text-primary-gold text-xs font-bold tracking-[0.3em] uppercase">Curated Collections</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            {sectionData.title}
          </h2>
          <p className="text-slate-500 max-w-xl text-balance">
            Discover our signature suit sets, where craftsmanship meets contemporary fashion.
            Perfect for occasions that demand grace and style.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] overflow-hidden shadow-sm h-[500px] animate-pulse">
                <div className="aspect-[3/4] bg-slate-100" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-50 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-8 bg-slate-100 rounded w-20" />
                    <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
                  </div>
                </div>
              </div>
            ))
          ) : products.map((product) => (
            <div
              key={product._id}
              className="group flex flex-col h-full bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 card-hover-effect"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src={product.image || (product.media?.[0]?.url || '/placeholder.png')}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg hover:bg-primary-gold hover:text-white transition-colors">
                      <Heart size={18} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary-gold hover:text-white transition-colors"
                    >
                      <Eye size={16} /> Quick View
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-slate-950 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    New
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-slate-900 font-bold text-lg mb-1 truncate group-hover:text-primary-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary-gold transition-all duration-300 active:scale-90 shadow-lg shadow-slate-950/10 hover:shadow-primary-gold/20">
                    <ShoppingBag size={20} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-20 flex justify-center">
          <button className="btn-outline min-w-[200px] gap-2 group">
            Explore All Suits
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <QuickViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
}
