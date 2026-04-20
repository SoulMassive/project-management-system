import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  console.log('⏳ Connecting to MongoDB...');
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'pms_db',
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    } else {
      console.error(`   ${error}`);
    }
    process.exit(1);
  }
};
