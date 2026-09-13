import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pharmacyId, items, deliveryMethod, deliveryAddress, notes } = body;

    if (!pharmacyId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify all items are available and get prices
    const itemPromises = items.map(async (item: any) => {
      const pharmacyMedicine = await PharmacyMedicine.findOne({
        pharmacyId,
        medicineId: item.medicineId,
        available: true,
      }).populate('medicineId');

      if (!pharmacyMedicine) {
        throw new Error(`Medicine ${item.medicineId} not available`);
      }

      if (pharmacyMedicine.quantity < item.quantity) {
        const medicineName = (pharmacyMedicine.medicineId as any)?.name || 'Medicine';
        throw new Error(`Insufficient quantity for ${medicineName}`);
      }

      const medicineName = (pharmacyMedicine.medicineId as any)?.name || 'Medicine';

      return {
        medicineId: item.medicineId,
        medicineName,
        quantity: item.quantity,
        price: pharmacyMedicine.price,
      };
    });

    const orderItems = await Promise.all(itemPromises);

    // Calculate total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      userId: (session.user as any).id,
      pharmacyId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      deliveryMethod: deliveryMethod || 'pickup',
      deliveryAddress,
      notes,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name phone')
      .populate('pharmacyId', 'name address phone');

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}