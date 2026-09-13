import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('=== MongoDB Connection Test ===');
console.log('MongoDB URI:', MONGODB_URI ? MONGODB_URI.substring(0, 40) + '...' : 'Not set');

async function testConnection() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Attempting to connect...');
    
    // Try with different connection options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
      // Disable SRV lookup if it's causing issues
      // Note: This may not work with Atlas connection strings
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test a simple query
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('Collections:', collections.map((c: any) => c.name || c.collectionName));
    }
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 POSSIBLE SOLUTIONS:');
      console.log('1. Check if MongoDB Atlas cluster is active (not paused)');
      console.log('2. Verify Network Access in MongoDB Atlas (whitelist your IP)');
      console.log('3. Check if connection string is correct in MongoDB Atlas');
      console.log('4. Wait 2-3 minutes after resuming cluster');
      console.log('5. Try copying connection string again from MongoDB Atlas');
      console.log('6. Verify cluster is in the correct region');
    }
  }
}

testConnection();