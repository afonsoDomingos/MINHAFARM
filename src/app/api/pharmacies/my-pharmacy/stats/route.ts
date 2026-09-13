import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';
import Order from '@/lib/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const pharmacy = await Pharmacy.findOne({
      userId: (session.user as any).id,
    });

    if (!pharmacy) {
      return NextResponse.json(
        { error: 'Pharmacy not found' },
        { status: 404 }
      );
    }

    // Count total medicines
    const totalMedicines = await PharmacyMedicine.countDocuments({
      pharmacyId: pharmacy._id,
    });

    // Count pending orders
    const pendingOrders = await Order.countDocuments({
      pharmacyId: pharmacy._id,
      status: 'pending',
    });

    // Count completed orders this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedOrders = await Order.countDocuments({
      pharmacyId: pharmacy._id,
      status: 'completed',
      createdAt: { $gte: startOfMonth },
    });

    return NextResponse.json({
      totalMedicines,
      pendingOrders,
      completedOrders,
    });
  } catch (error) {
    console.error('Error fetching pharmacy stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
