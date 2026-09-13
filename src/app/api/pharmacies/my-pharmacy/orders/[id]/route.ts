import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import Order from '@/lib/models/Order';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
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

    const order = await Order.findOne({
      _id: params.id,
      pharmacyId: pharmacy._id,
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    order.status = status;
    if (rejectionReason) {
      order.rejectionReason = rejectionReason;
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name phone');

    return NextResponse.json(populatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}