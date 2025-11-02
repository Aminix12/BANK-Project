'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            ShopHub
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-gray-900 transition-colors">
              Admin
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              <span className="mr-2">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <Link
              href="/cart"
              className="block px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart ({getCartCount()})
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
