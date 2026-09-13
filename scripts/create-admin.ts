import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import User from '../src/lib/models/User';
import Pharmacy from '../src/lib/models/Pharmacy';
import Medicine from '../src/lib/models/Medicine';
import PharmacyMedicine from '../src/lib/models/PharmacyMedicine';
import Order from '../src/lib/models/Order';

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@conectlife.co.mz' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@conectlife.co.mz',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@conectlife.co.mz');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

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

    console.log('Sample medicines created');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();