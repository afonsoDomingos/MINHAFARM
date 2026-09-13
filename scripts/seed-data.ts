import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User';
import Pharmacy from '../src/lib/models/Pharmacy';
import Medicine from '../src/lib/models/Medicine';
import PharmacyMedicine from '../src/lib/models/PharmacyMedicine';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/minhafarm';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({ role: 'pharmacy' });
    await Pharmacy.deleteMany();
    await Medicine.deleteMany();
    await PharmacyMedicine.deleteMany();

    // Create pharmacy users
    const hashedPassword = await bcrypt.hash('pharmacy123', 10);

    const pharmacy1User = await User.create({
      name: 'Farmácia Central',
      email: 'farmacia1@minhafarm.co.mz',
      password: hashedPassword,
      role: 'pharmacy',
    });

    const pharmacy2User = await User.create({
      name: 'Farmácia São João',
      email: 'farmacia2@minhafarm.co.mz',
      password: hashedPassword,
      role: 'pharmacy',
    });

    console.log('Pharmacy users created');

    // Create pharmacies
    const pharmacy1 = await Pharmacy.create({
      name: 'Farmácia Central',
      email: 'farmacia1@minhafarm.co.mz',
      password: hashedPassword,
      address: 'Av. Julius Nyerere, 1234',
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
      email: 'farmacia2@minhafarm.co.mz',
      password: hashedPassword,
      address: 'Av. Mao Tse Tung, 567',
      neighborhood: 'Polana',
      city: 'Maputo',
      phone: '+258 84 987 6543',
      openingHours: 'Seg-Sáb: 8h-18h',
      userId: pharmacy2User._id,
      status: 'approved',
      rating: 4.2,
    });

    console.log('Pharmacies created');

    // Create medicines
    const medicines = await Medicine.create([
      {
        name: 'Paracetamol 500 mg',
        description: 'Analgésico e antitérmico para alívio de dor e febre',
        category: 'Analgésicos',
        dosage: '500 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
      {
        name: 'Ibuprofeno 400 mg',
        description: 'Anti-inflamatório para alívio de dor e inflamação',
        category: 'Anti-inflamatórios',
        dosage: '400 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
      {
        name: 'Amoxicilina 500 mg',
        description: 'Antibiótico para tratamento de infecções bacterianas',
        category: 'Antibióticos',
        dosage: '500 mg',
        manufacturer: 'Generico',
        requiresPrescription: true,
      },
      {
        name: 'Dipirona 500 mg',
        description: 'Analgésico e antitérmico potente',
        category: 'Analgésicos',
        dosage: '500 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
      {
        name: 'Omeprazol 20 mg',
        description: 'Inibidor da bomba de prótons para tratamento de gastrite',
        category: 'Gastrointestinais',
        dosage: '20 mg',
        manufacturer: 'Generico',
        requiresPrescription: false,
      },
    ]);

    console.log('Medicines created');

    // Add medicines to pharmacies
    const pharmacy1Medicines = await PharmacyMedicine.create([
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

    const pharmacy2Medicines = await PharmacyMedicine.create([
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[0]._id,
        price: 145,
        available: true,
        quantity: 35,
      },
      {
        pharmacyId: pharmacy2._id,
        medicineId: medicines[1]._id,
        price: 190,
        available: true,
        quantity: 45,
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

    console.log('Pharmacy medicines created');

    console.log('\n=== DADOS DE TESTE CRIADOS COM SUCESSO ===\n');
    console.log('FARMÁCIAS:');
    console.log('1. Farmácia Central');
    console.log('   Email: farmacia1@minhafarm.co.mz');
    console.log('   Password: pharmacy123');
    console.log('   Localização: Sommerschield, Maputo');
    console.log('   Telefone: +258 84 123 4567');
    console.log('\n2. Farmácia São João');
    console.log('   Email: farmacia2@minhafarm.co.mz');
    console.log('   Password: pharmacy123');
    console.log('   Localização: Polana, Maputo');
    console.log('   Telefone: +258 84 987 6543');

    console.log('\nMEDICAMENTOS CRIADOS:');
    medicines.forEach((med, index) => {
      console.log(`${index + 1}. ${med.name} - ${med.category} ${med.requiresPrescription ? '(Receita)' : ''}`);
    });

    console.log('\nPREÇOS NAS FARMÁCIAS:');
    console.log('Farmácia Central:');
    pharmacy1Medicines.forEach((pm) => {
      const med = medicines.find(m => m._id.equals(pm.medicineId));
      console.log(`  - ${med?.name}: ${pm.price} MT (${pm.available ? 'Disponível' : 'Indisponível'})`);
    });

    console.log('\nFarmácia São João:');
    pharmacy2Medicines.forEach((pm) => {
      const med = medicines.find(m => m._id.equals(pm.medicineId));
      console.log(`  - ${med?.name}: ${pm.price} MT (${pm.available ? 'Disponível' : 'Indisponível'})`);
    });

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();