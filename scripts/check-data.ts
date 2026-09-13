import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import User from '../src/lib/models/User';
import Pharmacy from '../src/lib/models/Pharmacy';
import Medicine from '../src/lib/models/Medicine';
import PharmacyMedicine from '../src/lib/models/PharmacyMedicine';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('=== VERIFICAÇÃO DE DADOS MINHAFARM ===');
console.log('MongoDB URI:', MONGODB_URI ? MONGODB_URI.substring(0, 30) + '...' : 'Not set');

async function checkData() {
  try {
    console.log('\n📊 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Conectado ao MongoDB!');

    // Contar farmácias
    const pharmacyCount = await Pharmacy.countDocuments();
    console.log(`\n🏥 Farmácias cadastradas: ${pharmacyCount}`);

    if (pharmacyCount > 0) {
      const pharmacies = await Pharmacy.find({}).select('name neighborhood city status');
      console.log('\nFarmácias encontradas:');
      pharmacies.forEach((pharmacy, index) => {
        console.log(`${index + 1}. ${pharmacy.name} - ${pharmacy.neighborhood}, ${pharmacy.city} (${pharmacy.status})`);
      });
    }

    // Contar medicamentos únicos
    const medicineCount = await Medicine.countDocuments();
    console.log(`\n💊 Medicamentos únicos cadastrados: ${medicineCount}`);

    if (medicineCount > 0) {
      const medicines = await Medicine.find({}).select('name category requiresPrescription');
      console.log('\nMedicamentos encontrados:');
      medicines.forEach((medicine, index) => {
        console.log(`${index + 1}. ${medicine.name} - ${medicine.category} ${medicine.requiresPrescription ? '(Receita)' : ''}`);
      });
    }

    // Contar relacionamentos farmácia-medicamento
    const pharmacyMedicineCount = await PharmacyMedicine.countDocuments();
    console.log(`\n📦 Relacionamentos Farmácia-Medicamento: ${pharmacyMedicineCount}`);

    // Detalhes por farmácia
    if (pharmacyCount > 0) {
      console.log('\n📋 Medicamentos por Farmácia:');
      for (const pharmacy of await Pharmacy.find({})) {
        const pharmacyMedicines = await PharmacyMedicine.find({ pharmacyId: pharmacy._id })
          .populate('medicineId')
          .select('medicineId price available quantity');
        
        console.log(`\n${pharmacy.name} (${pharmacy.neighborhood}, ${pharmacy.city}):`);
        console.log(`  Total de medicamentos: ${pharmacyMedicines.length}`);
        console.log(`  Disponíveis: ${pharmacyMedicines.filter(pm => pm.available).length}`);
        
        pharmacyMedicines.forEach((pm) => {
          const med = pm.medicineId as any;
          console.log(`  - ${med.name}: ${pm.price} MT (${pm.available ? 'Disponível' : 'Indisponível'}, Qtd: ${pm.quantity})`);
        });
      }
    }

    // Contar utilizadores
    const userCount = await User.countDocuments();
    console.log(`\n👤 Utilizadores totais: ${userCount}`);

    const adminCount = await User.countDocuments({ role: 'admin' });
    const pharmacyUserCount = await User.countDocuments({ role: 'pharmacy' });
    const regularUserCount = await User.countDocuments({ role: 'user' });
    
    console.log('Por tipo:');
    console.log(`  - Admin: ${adminCount}`);
    console.log(`  - Farmácia: ${pharmacyUserCount}`);
    console.log(`  - Utilizador regular: ${regularUserCount}`);

    console.log('\n✅ Verificação concluída com sucesso!');

  } catch (error: any) {
    console.error('❌ Erro ao verificar dados:', error.message);
    console.error('Erro code:', error.code);
    
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 O MongoDB não está acessível.');
      console.log('   Execute: npm run test-connection para diagnosticar');
      console.log('   Ou teste o sistema sem dados pré-carregados.');
    }
  } finally {
    await mongoose.disconnect();
  }
}

checkData();