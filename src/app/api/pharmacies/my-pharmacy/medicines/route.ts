import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import Medicine from '@/lib/models/Medicine';
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

    const pharmacyMedicines = await PharmacyMedicine.find({
      pharmacyId: pharmacy._id,
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
    const {
      name,
      description,
      category,
      dosage,
      manufacturer,
      requiresPrescription,
      price,
      quantity,
    } = body;

    if (!name || !category || !price || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if medicine already exists
    let medicine = await Medicine.findOne({ name });

    if (!medicine) {
      medicine = await Medicine.create({
        name,
        description,
        category,
        dosage,
        manufacturer,
        requiresPrescription: requiresPrescription || false,
      });
    }

    // Check if pharmacy already has this medicine
    const existingPharmacyMedicine = await PharmacyMedicine.findOne({
      pharmacyId: pharmacy._id,
      medicineId: medicine._id,
    });

    if (existingPharmacyMedicine) {
      return NextResponse.json(
        { error: 'Medicine already exists in pharmacy' },
        { status: 400 }
      );
    }

    const pharmacyMedicine = await PharmacyMedicine.create({
      pharmacyId: pharmacy._id,
      medicineId: medicine._id,
      price,
      quantity,
      available: true,
    });

    const populatedPharmacyMedicine = await PharmacyMedicine.findById(
      pharmacyMedicine._id
    ).populate('medicineId');

    return NextResponse.json(populatedPharmacyMedicine, { status: 201 });
  } catch (error) {
    console.error('Error adding medicine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}