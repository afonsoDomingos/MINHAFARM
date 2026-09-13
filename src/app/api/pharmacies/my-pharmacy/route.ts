import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';

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

    return NextResponse.json(pharmacy);
  } catch (error) {
    console.error('Error fetching pharmacy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, address, neighborhood, city, phone, openingHours, logo, location } = body;

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

    if (name) pharmacy.name = name;
    if (address) pharmacy.address = address;
    if (neighborhood) pharmacy.neighborhood = neighborhood;
    if (city) pharmacy.city = city;
    if (phone) pharmacy.phone = phone;
    if (openingHours) pharmacy.openingHours = openingHours;
    if (logo) pharmacy.logo = logo;
    if (location) pharmacy.location = location;

    await pharmacy.save();

    return NextResponse.json(pharmacy);
  } catch (error) {
    console.error('Error updating pharmacy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}