import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecommerce.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin already exists',
        email: adminEmail,
      });
    }

    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: String(admin._id),
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Init admin error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin account' },
      { status: 500 }
    );
  }
}
