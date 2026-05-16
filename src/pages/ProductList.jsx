import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import { Edit, Trash2, Plus, Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState(initialCategory || '');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product removed successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
        console.error(error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Products Management</h1>
          <p className="text-surface-500 text-sm mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-all shadow-sm">
          <Filter size={18} className="text-surface-400" />
          Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-surface-500 text-[11px] uppercase tracking-widest border-b border-surface-100">
                <th className="px-6 py-4 font-bold">Product Details</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Inventory</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-200 rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-surface-200 rounded"></div>
                          <div className="h-3 w-48 bg-surface-100 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td colSpan={5} className="px-6 py-4">
                       <div className="h-4 bg-surface-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center text-surface-300">
                        <Search size={32} />
                      </div>
                      <p className="text-surface-500 font-medium">No products found matching your search.</p>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="text-primary-600 text-sm font-semibold hover:underline"
                      >
                        Clear search filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="group hover:bg-primary-50/30 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-surface-100 flex-shrink-0 overflow-hidden border border-surface-200 shadow-sm relative group-hover:shadow-md transition-shadow">
                          {product.media && product.media.length > 0 ? (
                            <img 
                              src={product.media.find(m => m.type === 'image')?.url || product.media[0].url} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-surface-300 font-bold text-[10px] uppercase">No Assets</div>
                          )}
                          {product.media && product.media.some(m => m.type === 'video') && (
                            <div className="absolute top-1 right-1 bg-primary-600 text-white p-0.5 rounded-md shadow-lg">
                               <Plus size={8} strokeWidth={4} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-surface-900 group-hover:text-primary-700 transition-colors">{product.name}</p>
                          <div className="flex gap-1.5 mt-0.5">
                             {product.media && product.media.map((m, idx) => (
                               <div key={idx} className={`w-1.5 h-1.5 rounded-full ${m.type === 'image' ? 'bg-emerald-400' : m.type === 'video' ? 'bg-primary-400' : 'bg-red-400'}`} />
                             ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-surface-100 text-surface-600 border border-surface-200">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-surface-900">₹{product.price.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className={product.stock < 10 ? 'text-red-500' : 'text-surface-400'}>
                             {product.stock} Units
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              product.stock < 10 ? 'bg-red-500' : 
                              product.stock < 50 ? 'bg-orange-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                         product.stock > 0 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-red-50 text-red-700 border border-red-100'
                       }`}>
                         <div className={`w-1 h-1 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                         {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white rounded-lg transition-all"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
