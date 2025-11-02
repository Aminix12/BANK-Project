'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, admin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600 mt-1">{admin?.email}</p>
          </div>

          <nav className="px-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              View Store
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
