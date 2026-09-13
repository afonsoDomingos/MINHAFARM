import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
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
    const { available, price, quantity } = body;

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

    const pharmacyMedicine = await PharmacyMedicine.findOne({
      _id: id,
      pharmacyId: pharmacy._id,
    });

    if (!pharmacyMedicine) {
      return NextResponse.json(
        { error: 'Pharmacy medicine not found' },
        { status: 404 }
      );
    }

    if (available !== undefined) pharmacyMedicine.available = available;
    if (price !== undefined) pharmacyMedicine.price = price;
    if (quantity !== undefined) pharmacyMedicine.quantity = quantity;

    await pharmacyMedicine.save();

    const populatedPharmacyMedicine = await PharmacyMedicine.findById(
      pharmacyMedicine._id
    ).populate('medicineId');

    return NextResponse.json(populatedPharmacyMedicine);
  } catch (error) {
    console.error('Error updating pharmacy medicine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const pharmacyMedicine = await PharmacyMedicine.findOneAndDelete({
      _id: id,
      pharmacyId: pharmacy._id,
    });

    if (!pharmacyMedicine) {
      return NextResponse.json(
        { error: 'Pharmacy medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Medicine removed successfully' });
  } catch (error) {
    console.error('Error deleting pharmacy medicine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}