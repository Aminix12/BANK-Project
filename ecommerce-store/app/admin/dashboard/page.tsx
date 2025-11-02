'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Analytics {
  totalRevenue: number;
  monthlyRevenue: number;
  lastMonthRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  bestSellingProducts: Array<{
    _id: string;
    title: string;
    salesCount: number;
    price: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    title: string;
    stock: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">Failed to load analytics</p>
        </div>
      </AdminLayout>
    );
  }

  const revenueGrowth = analytics.lastMonthRevenue > 0
    ? ((analytics.monthlyRevenue - analytics.lastMonthRevenue) / analytics.lastMonthRevenue * 100).toFixed(1)
    : '0';

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your store performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${analytics.monthlyRevenue.toFixed(2)}</p>
            <p className={`text-sm mt-2 ${parseFloat(revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(revenueGrowth) >= 0 ? '+' : ''}{revenueGrowth}% from last month
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Monthly Orders</h3>
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.monthlyOrders}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend (Last 12 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1f2937" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Orders Trend (Last 12 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#1f2937" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Best Selling Products</h2>
            <div className="space-y-4">
              {analytics.bestSellingProducts.length === 0 ? (
                <p className="text-gray-600">No sales data available</p>
              ) : (
                analytics.bestSellingProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{product.salesCount}</p>
                      <p className="text-sm text-gray-600">sold</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Low Stock Alert</h2>
            <div className="space-y-4">
              {analytics.lowStockProducts.length === 0 ? (
                <p className="text-gray-600">All products are well stocked</p>
              ) : (
                analytics.lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="font-medium text-gray-900">{product.title}</p>
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                      {product.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
