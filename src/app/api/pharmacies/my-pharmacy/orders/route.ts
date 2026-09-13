import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

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

    const orders = await Order.find({ pharmacyId: pharmacy._id })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    // For guest orders, populate guest information
    const ordersWithGuestInfo = orders.map(order => {
      const orderObj = order.toObject() as any;
      if (orderObj.isGuestOrder) {
        orderObj.user = {
          name: orderObj.guestName,
          phone: orderObj.guestPhone,
        };
      }
      return orderObj;
    });

    return NextResponse.json(ordersWithGuestInfo);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}