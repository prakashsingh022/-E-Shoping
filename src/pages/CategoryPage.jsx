import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/productData';
import ProductCard from '../components/common/ProductCard';
import { ArrowLeft, SlidersHorizontal, ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    // Normalizing category slug to match data
    // Example: "kurta-sets" -> "Kurta sets"
    const normalizeSlug = (slug) => {
      if (!slug) return '';
      if (slug === 'all-products') return 'All Products';
      
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const currentCategory = normalizeSlug(categoryId);
    setCategoryName(currentCategory);

    if (currentCategory === 'All Products') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (p) => p.category.toLowerCase() === currentCategory.toLowerCase()
      );
      setProducts(filtered);
    }
    
    // Scroll to top on category change
    window.scrollTo(0, 0);
  }, [categoryId]);

  return (
    <main className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-slate-50 pt-16 pb-12 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-gold/5 via-transparent to-transparent opacity-50"></div>
        
        <div className="container-custom relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link to="/" className="hover:text-primary-gold transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-slate-950 italic">{categoryName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                {categoryName}
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary-gold"></span>
                Showing {products.length} Exquisite Pieces
              </p>
            </div>
            
            <button className="flex items-center gap-3 bg-slate-950 text-white px-8 py-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-gold hover:text-slate-950 transition-all active:scale-95 shadow-lg shadow-slate-950/10 group">
              <SlidersHorizontal size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Filter & Sort
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-20 lg:py-24">
        <div className="container-custom">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100">
               <SlidingBanner />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-8">No products found in this category.</p>
               <Link to="/category/all-products" className="mt-8 bg-slate-950 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-gold transition-all active:scale-95">
                 View All Products
               </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

// Simple placeholder for empty state
const SlidingBanner = () => (
  <div className="flex items-center gap-4 opacity-10 grayscale pointer-events-none">
      <div className="w-24 h-32 bg-slate-900 rounded-2xl"></div>
      <div className="w-24 h-40 bg-slate-900 rounded-2xl"></div>
      <div className="w-24 h-32 bg-slate-900 rounded-2xl"></div>
  </div>
)

export default CategoryPage;
