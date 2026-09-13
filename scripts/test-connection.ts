import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('=== MongoDB Connection Test ===');
console.log('MongoDB URI:', MONGODB_URI ? MONGODB_URI.substring(0, 30) + '...' : 'Not set');

async function testConnection() {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.collectionName));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes('querySrv')) {
      console.log('\n💡 POSSIBLE SOLUTIONS:');
      console.log('1. Check if MongoDB Atlas cluster is active');
      console.log('2. Verify Network Access in MongoDB Atlas (whitelist your IP)');
      console.log('3. Check if connection string is correct');
      console.log('4. Try using local MongoDB instead');
    }
  }
}

testConnection();