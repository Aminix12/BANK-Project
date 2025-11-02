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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { items, total, customerEmail, customerName, paymentIntentId } = body;

    if (!items || items.length === 0 || !total || !customerEmail || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, salesCount: item.quantity },
      });
    }

    const order = await Order.create({
      items,
      total,
      customerEmail,
      customerName,
      paymentIntentId,
      paymentStatus: 'succeeded',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
