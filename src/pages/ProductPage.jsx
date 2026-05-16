import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../components/product/ProductDetails';
import { Loader2 } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-gold" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
        <p className="text-slate-500">The product you are looking for might have been removed.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
