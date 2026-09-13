import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import Pharmacy from '@/lib/models/Pharmacy';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pharmacyName,
      email,
      password,
      address,
      neighborhood,
      city,
      phone,
      openingHours,
    } = body;

    console.log('Pharmacy registration data:', body);

    if (!pharmacyName || !email || !password || !address || !neighborhood || !city || !phone || !openingHours) {
      console.log('Missing fields:', { pharmacyName, email, password, address, neighborhood, city, phone, openingHours });
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A password deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Já existe uma conta com este email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with pharmacy role
    const user = await User.create({
      name: pharmacyName,
      email,
      password: hashedPassword,
      role: 'pharmacy',
    });

    // Create pharmacy record
    const pharmacy = await Pharmacy.create({
      name: pharmacyName,
      email,
      password: hashedPassword,
      address,
      neighborhood,
      city,
      phone,
      openingHours,
      userId: user._id,
      status: 'pending',
    });

    return NextResponse.json(
      {
        message: 'Farmácia registada com sucesso. Aguardando aprovação.',
        pharmacyId: pharmacy._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering pharmacy:', error);
    return NextResponse.json(
      { error: 'Erro ao registar farmácia' },
      { status: 500 }
    );
  }
}