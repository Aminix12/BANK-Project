import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sort = searchParams.get('sort') || '-createdAt';

    let query: Record<string, unknown> = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, description, price, images, stock, category } = body;

    if (!title || !description || price === undefined || stock === undefined || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      title,
      description,
      price,
      images: images || [],
      stock,
      category,
      salesCount: 0,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
