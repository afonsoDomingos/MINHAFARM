import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import Order from '@/lib/models/Order';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      _id: id,
      pharmacyId: pharmacy._id,
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const previousStatus = order.status;
    order.status = status;
    if (rejectionReason) {
      order.rejectionReason = rejectionReason;
    }

    // Update stock when order is confirmed
    if (status === 'confirmed' && previousStatus !== 'confirmed') {
      for (const item of order.items) {
        const pharmacyMedicine = await PharmacyMedicine.findOne({
          pharmacyId: pharmacy._id,
          medicineId: item.medicineId,
        });

        if (pharmacyMedicine) {
          pharmacyMedicine.quantity -= item.quantity;
          if (pharmacyMedicine.quantity < 0) {
            pharmacyMedicine.quantity = 0;
            pharmacyMedicine.available = false;
          }
          await pharmacyMedicine.save();
        }
      }
    }

    // Restore stock when order is rejected
    if (status === 'rejected' && previousStatus !== 'rejected') {
      for (const item of order.items) {
        const pharmacyMedicine = await PharmacyMedicine.findOne({
          pharmacyId: pharmacy._id,
          medicineId: item.medicineId,
        });

        if (pharmacyMedicine) {
          pharmacyMedicine.quantity += item.quantity;
          pharmacyMedicine.available = true;
          await pharmacyMedicine.save();
        }
      }
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