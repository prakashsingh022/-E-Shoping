import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronRight, Star, ShoppingCart, CreditCard, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopInteractivePage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

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
        let currentCategoryName = '';
        if (targetCategory) {
          url += `?category=${encodeURIComponent(targetCategory.name)}`;
          currentCategoryName = targetCategory.name;
        } else if (categoryId === 'all-products') {
          currentCategoryName = 'All Products';
        } else {
          const fallbackName = categoryId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          currentCategoryName = fallbackName;
          url += `?category=${encodeURIComponent(fallbackName)}`;
        }
        setCategoryName(currentCategoryName);

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [categoryId]);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize('');
    setSelectedColor(null);
  }, [selectedProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary-gold rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Collection...</p>
      </div>
    );
  }

  const getDisplayMedia = (product) => {
    if (!product) return [];
    let mediaList = [];
    if (product.media && product.media.length > 0) {
      mediaList = [...product.media];
    } else if (product.image) {
      mediaList = [{ url: product.image, type: 'image' }];
    } else {
      mediaList = [{ url: '/placeholder.png', type: 'image' }];
    }

    while (mediaList.length < 4) {
      mediaList.push(mediaList[0]);
    }
    return mediaList.slice(0, 4);
  };

  const displayMedia = getDisplayMedia(selectedProduct);

  return (
    <main className="min-h-screen bg-white flex flex-col lg:flex-row relative">
      {/* Left Pane: Detailed Product View */}
      <div className="w-full lg:w-[65%] p-6 lg:p-12 xl:p-20 bg-slate-50/50">
        <div className="lg:sticky lg:top-28">
          <AnimatePresence mode="wait">
            {selectedProduct && (
              <motion.div
                key={selectedProduct._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-start"
              >
                {/* Image Section */}
                <div className="w-full xl:w-[55%] space-y-6">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-white shadow-2xl group border border-slate-100">
                    {displayMedia[activeImageIndex]?.type === 'video' ? (
                      <video src={displayMedia[activeImageIndex].url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      <img src={displayMedia[activeImageIndex]?.url} alt={selectedProduct.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-slate-950 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl">
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar custom-scrollbar">
                    {displayMedia.map((media, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${activeImageIndex === idx
                          ? 'border-primary-gold scale-105 shadow-md'
                          : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                      >
                        {media.type === 'video' ? (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Play size={16} className="text-white/50" />
                          </div>
                        ) : (
                          <img src={media.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>

                  <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 justify-center">
                    <Link to="/" className="hover:text-primary-gold transition-colors">Home</Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-900">{categoryName}</span>
                  </nav>
                </div>

                {/* Info Section */}
                <div className="w-full xl:w-[45%] space-y-10 py-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                      {selectedProduct.name}
                    </h1>
                    
                    <div className="flex flex-col gap-4 pt-4 pb-8 border-b border-slate-200">
                      <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-slate-950 tracking-tighter italic">
                          ₹{(selectedProduct.salePrice && selectedProduct.salePrice > 0) ? selectedProduct.salePrice.toLocaleString() : selectedProduct.price.toLocaleString()}
                        </span>
                        {(selectedProduct.salePrice && selectedProduct.salePrice > 0) && (
                          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest line-through decoration-primary-gold/30">
                            ₹{selectedProduct.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < 4 ? "fill-primary-gold text-primary-gold" : "text-slate-200"} />
                          ))}
                          <span className="text-[9px] font-black text-slate-950 ml-1">4.8</span>
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">120+ Reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">Description</h4>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium border-l-4 border-primary-gold pl-5 whitespace-pre-wrap italic">
                      {selectedProduct.description || "Premium collection crafted for those who value elegance and quality above all else."}
                    </p>
                  </div>

                  {selectedProduct.sizes?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">Select Size</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-5 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                              selectedSize === size ? 'bg-slate-950 text-white border-slate-950 shadow-xl scale-105' : 'bg-white border-slate-100 hover:border-primary-gold text-slate-500'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.colors?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">Color Palette</h4>
                      <div className="flex flex-wrap gap-4">
                        {selectedProduct.colors.map((color, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-4 cursor-pointer transition-all ${
                              selectedColor?.name === color.name ? 'border-primary-gold scale-110 shadow-lg' : 'border-white ring-1 ring-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.code }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 space-y-4">
                    <button className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-primary-gold hover:text-slate-950 transition-all shadow-2xl active:scale-95">
                      <ShoppingCart size={20} />
                      Add To Cart
                    </button>
                    <button className="w-full h-16 border-2 border-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-950 hover:text-white transition-all">
                      Buy It Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Pane: Gallery */}
      <div className="w-full lg:w-[35%] bg-white p-8 lg:p-16 border-l border-slate-100 min-h-screen">
        <div className="space-y-12">
          <div className="space-y-3 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-gold">Curated Collection</span>
            <h2 className="text-3xl font-black tracking-tighter text-slate-950 uppercase italic">{categoryName}</h2>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="group cursor-pointer flex flex-col items-center text-center"
              >
                <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 transition-all duration-700 ${
                  selectedProduct?._id === product._id ? 'ring-4 ring-primary-gold ring-offset-4 scale-105' : 'ring-1 ring-slate-100 hover:ring-primary-gold/30 hover:ring-offset-2'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-inner">
                    <img src={product.image || product.media?.[0]?.url || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </div>
                </div>
                <div className="mt-6 space-y-1">
                  <p className={`text-[10px] font-black uppercase tracking-widest truncate max-w-[120px] ${selectedProduct?._id === product._id ? 'text-primary-gold' : 'text-slate-950'}`}>
                    {product.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                    ₹{(product.salePrice && product.salePrice > 0) ? product.salePrice.toLocaleString() : product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShopInteractivePage;
