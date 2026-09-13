import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import Medicine from '@/lib/models/Medicine';

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@minhafarm.co.mz' });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@minhafarm.co.mz',
      password: hashedPassword,
      role: 'admin',
    });

    // Create some sample medicines
    const medicines = await Medicine.create([
      {
        name: 'Paracetamol 500 mg',
        description: 'Analgésico e antitérmico',
        category: 'Analgésicos',
        dosage: '500 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
      {
        name: 'Ibuprofeno 400 mg',
        description: 'Anti-inflamatório',
        category: 'Anti-inflamatórios',
        dosage: '400 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
      {
        name: 'Amoxicilina 500 mg',
        description: 'Antibiótico',
        category: 'Antibióticos',
        dosage: '500 mg',
        manufacturer: 'Generico',
        requiresPrescription: true,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: 'Admin and sample medicines created successfully',
      admin: {
        email: admin.email,
        password: 'admin123',
      },
    });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating admin' },
      { status: 500 }
    );
  }
}