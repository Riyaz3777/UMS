const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (uri && !uri.includes('user:password@cluster0')) {
    try {
      console.log('Connecting to MongoDB Atlas cloud database...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
      });
      console.log(`[MongoDB Atlas Connected]: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`MongoDB Atlas connection error: ${err.message}`);
      throw err;
    }
  }

  try {
    const localUri = 'mongodb://127.0.0.1:27017/ums_database';
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Local MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn('⚠️ No database connection established.');
  }
};

module.exports = connectDB;
