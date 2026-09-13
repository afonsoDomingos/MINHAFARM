import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';
import Medicine from '@/lib/models/Medicine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const pharmacyMedicines = await PharmacyMedicine.find({
      pharmacyId: params.id,
    })
      .populate('medicineId')
      .sort({ 'medicineId.name': 1 });

    return NextResponse.json(pharmacyMedicines);
  } catch (error) {
    console.error('Error fetching pharmacy medicines:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}