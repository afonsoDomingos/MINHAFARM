import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';

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

    // Find products with low stock (quantity <= 5)
    const lowStockProducts = await PharmacyMedicine.find({
      pharmacyId: pharmacy._id,
      available: true,
      quantity: { $lte: 5 },
    })
      .populate('medicineId')
      .sort({ quantity: 1 })
      .limit(10);

    const lowStockItems = lowStockProducts.map((pm) => {
      const medicine = pm.medicineId as any;
      return {
        id: pm._id.toString(),
        medicineId: medicine._id.toString(),
        name: medicine.name,
        category: medicine.category,
        quantity: pm.quantity,
        price: pm.price,
      };
    });

    return NextResponse.json({
      lowStock: lowStockItems,
      hasLowStock: lowStockItems.length > 0,
    });
  } catch (error) {
    console.error('Error fetching low stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
