import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const pharmacies = await Pharmacy.find({ status: 'approved' })
      .select('name address neighborhood city phone openingHours rating')
      .sort({ name: 1 });

    return NextResponse.json(pharmacies);
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}