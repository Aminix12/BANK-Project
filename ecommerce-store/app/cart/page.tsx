'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
            >
              <div className="relative w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-4">${item.price.toFixed(2)}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-auto text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors mb-4"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/"
              className="block text-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
