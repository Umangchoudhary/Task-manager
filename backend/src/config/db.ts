import mongoose from 'mongoose';
import crypto from 'crypto';

// Polyfill for environments where globalThis.crypto is missing (needed by some mongodb driver versions)
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = crypto;
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables!');
      process.exit(1);
    }
    console.log('Connecting to local MongoDB...');
  } else {
    const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
    console.log(`Connecting to MongoDB: ${maskedUri}`);
  }

  try {
    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/taskmanager');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
