import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import Pharmacy from '@/lib/models/Pharmacy';
import Medicine from '@/lib/models/Medicine';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';

export async function POST() {
  try {
    await connectDB();

    // Clear existing pharmacy data
    await User.deleteMany({ role: 'pharmacy' });
    await Pharmacy.deleteMany();
    await Medicine.deleteMany();
    await PharmacyMedicine.deleteMany();

    // Create pharmacy users
    const hashedPassword = await bcrypt.hash('pharmacy123', 10);

    const pharmacy1User = await User.create({
      name: 'Farmácia Central',
      email: 'farmacia1@conectlife.co.mz',
      password: hashedPassword,
      role: 'pharmacy',
    });

    const pharmacy2User = await User.create({
      name: 'Farmácia São João',
      email: 'farmacia2@conectlife.co.mz',
      password: hashedPassword,
      role: 'pharmacy',
    });

    // Create pharmacies
    const pharmacy1 = await Pharmacy.create({
      name: 'Farmácia Central',
      email: 'farmacia1@conectlife.co.mz',
      password: hashedPassword,
      address: 'Av. 25 de Setembro, 123',
      neighborhood: 'Sommerschield',
      city: 'Maputo',
      phone: '+258 84 123 4567',
      openingHours: 'Seg-Sex: 8h-20h, Sáb: 9h-13h',
      userId: pharmacy1User._id,
      status: 'approved',
      rating: 4.5,
    });

    const pharmacy2 = await Pharmacy.create({
      name: 'Farmácia São João',
      email: 'farmacia2@conectlife.co.mz',
      password: hashedPassword,
      address: 'Av. Mao Tse Tung, 456',
      neighborhood: 'Polana',
      city: 'Maputo',
      phone: '+258 84 987 6543',
      openingHours: 'Seg-Sáb: 8h-18h',
      userId: pharmacy2User._id,
      status: 'approved',
      rating: 4.2,
    });

    // Create medicines
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
      {
        name: 'Dipirona 500 mg',
        description: 'Analgésico',
        category: 'Analgésicos',
        dosage: '500 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
      {
        name: 'Omeprazol 20 mg',
        description: 'Antiulceroso',
        category: 'Gastrointestinais',
        dosage: '20 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
    ]);

    // Create pharmacy-medicine relationships for Pharmacy 1
    await PharmacyMedicine.create([
      {
        pharmacyId: pharmacy1._id,
        medicineId: medicines[0]._id,
        price: 150,
        available: true,
        quantity: 50,
      },
      {
        pharmacyId: pharmacy1._id,
        medicineId: medicines[1]._id,
        price: 200,
        available: true,
        quantity: 30,
      },
      {
        pharmacyId: pharmacy1._id,
        medicineId: medicines[2]._id,
        price: 350,
        available: true,
        quantity: 20,
      },
      {
        pharmacyId: pharmacy1._id,
        medicineId: medicines[3]._id,
        price: 120,
        available: true,
        quantity: 40,
      },
      {
        pharmacyId: pharmacy1._id,
        medicineId: medicines[4]._id,
        price: 280,
        available: true,
        quantity: 25,
      },
    ]);

    // Create pharmacy-medicine relationships for Pharmacy 2
    await PharmacyMedicine.create([
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[0]._id,
        price: 145,
        available: true,
        quantity: 45,
      },
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[1]._id,
        price: 190,
        available: true,
        quantity: 35,
      },
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[2]._id,
        price: 380,
        available: true,
        quantity: 15,
      },
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[3]._id,
        price: 115,
        available: false,
        quantity: 0,
      },
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[4]._id,
        price: 270,
        available: true,
        quantity: 30,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: 'Test data seeded successfully',
      pharmacies: [
        {
          name: pharmacy1.name,
          email: pharmacy1.email,
          password: 'pharmacy123',
        },
        {
          name: pharmacy2.name,
          email: pharmacy2.email,
          password: 'pharmacy123',
        },
      ],
      medicines: medicines.length,
    });
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: error.message || 'Error seeding data' },
      { status: 500 }
    );
  }
}