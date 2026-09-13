import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import Pharmacy from '@/lib/models/Pharmacy';
import Order from '@/lib/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const [totalPharmacies, pendingPharmacies, totalUsers, totalOrders] = await Promise.all([
      Pharmacy.countDocuments(),
      Pharmacy.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
    ]);

    return NextResponse.json({
      totalPharmacies,
      pendingPharmacies,
      totalUsers,
      totalOrders,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}