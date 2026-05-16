import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import { ArrowLeft, SlidersHorizontal, ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const catRes = await fetch('http://localhost:5000/api/categories');
        const categories = await catRes.json();
        
        let targetCategory = null;
        if (categoryId !== 'all-products') {
          targetCategory = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === categoryId);
        }

        let url = 'http://localhost:5000/api/products';
        if (targetCategory) {
          url += `?category=${encodeURIComponent(targetCategory.name)}`;
          setCategoryName(targetCategory.name);
        } else if (categoryId === 'all-products') {
          setCategoryName('All Products');
        } else {
          const fallbackName = categoryId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setCategoryName(fallbackName);
          url += `?category=${encodeURIComponent(fallbackName)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        const totalDesired = 15;
        const realProducts = data;
        const placeholderCount = Math.max(0, totalDesired - realProducts.length);
        
        const placeholders = Array(placeholderCount).fill(0).map((_, i) => ({
          _id: `placeholder-${i}`,
          name: `Exquisite Item ${realProducts.length + i + 1}`,
          price: 0,
          category: targetCategory ? targetCategory.name : categoryName,
          image: '', 
          media: [],
          description: 'New arrival coming soon. Stay tuned for our latest collection.',
          isPlaceholder: true
        }));

        setProducts([...realProducts, ...placeholders]);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
                {loading ? 'Discovering...' : `Showing ${products.length} Exquisite Pieces`}
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-slate-100 aspect-[4/5] rounded-3xl"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onQuickView={setSelectedProduct}
                />
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

      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </main>
  );
};

const SlidingBanner = () => (
  <div className="flex items-center gap-4 opacity-10 grayscale pointer-events-none">
    <div className="w-24 h-32 bg-slate-900 rounded-2xl"></div>
    <div className="w-24 h-40 bg-slate-900 rounded-2xl"></div>
    <div className="w-24 h-32 bg-slate-900 rounded-2xl"></div>
  </div>
)

export default CategoryPage;




