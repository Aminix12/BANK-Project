'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.images[0] || '/placeholder.jpg',
        stock: product.stock,
      });
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        <span>←</span> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden mb-4">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 bg-gray-200 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-gray-900' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 10 ? 'bg-green-100 text-green-800' :
              product.stock > 0 ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="mt-8 border-t pt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Category</dt>
                <dd className="font-medium text-gray-900 capitalize">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Stock Available</dt>
                <dd className="font-medium text-gray-900">{product.stock} units</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Total Sales</dt>
                <dd className="font-medium text-gray-900">{product.salesCount} sold</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
