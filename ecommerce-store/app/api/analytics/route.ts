import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      totalOrders,
      monthlyOrders,
      bestSellingProducts,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'succeeded',
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'succeeded',
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ paymentStatus: 'succeeded' }),
      Order.countDocuments({
        paymentStatus: 'succeeded',
        createdAt: { $gte: startOfMonth },
      }),
      Product.find().sort({ salesCount: -1 }).limit(5).lean(),
      Product.find({ stock: { $lt: 10 } }).sort({ stock: 1 }).limit(10).lean(),
      Order.find({ paymentStatus: 'succeeded' })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthData = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'succeeded',
            createdAt: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
      ]);

      last12Months.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: monthData[0]?.revenue || 0,
        orders: monthData[0]?.orders || 0,
      });
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
        totalOrders,
        monthlyOrders,
        bestSellingProducts,
        lowStockProducts,
        recentOrders,
        monthlyTrends: last12Months,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
