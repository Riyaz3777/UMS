const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  // 1. If user provided a valid MongoDB Atlas URI in .env, connect to Atlas
  if (uri && !uri.includes('user:password@cluster0')) {
    try {
      console.log('Connecting to MongoDB Atlas cloud database...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[MongoDB Atlas Connected]: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`MongoDB Atlas connection failed: ${err.message}`);
    }
  }

  // 2. Try local MongoDB instance if available on default port 27017
  try {
    const localUri = 'mongodb://127.0.0.1:27017/ums_database';
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 1500 });
    console.log(`[Local MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.log('ℹ️ Server listening on http://localhost:5000.');
    console.log('   Please set your MONGODB_URI in .env to connect to your MongoDB Atlas Cluster.');
  }
};

module.exports = connectDB;
