'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

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

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '/placeholder.jpg',
      stock: product.stock,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-64 bg-gray-200">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Low Stock
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-gray-700 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">{product.stock} in stock</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAdding
              ? 'bg-green-500 text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : isAdding ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
