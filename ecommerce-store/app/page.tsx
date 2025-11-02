'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  salesCount: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({ search });
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ShopHub</h1>
        <p className="text-lg text-gray-600">Discover amazing products with express checkout</p>
      </div>

      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
