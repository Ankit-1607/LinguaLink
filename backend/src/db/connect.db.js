import mongoose from 'mongoose';

const connectDB = async (url) => {
  try {
    const conn = await mongoose.connect(url)
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return mongoose.connect(url);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1); // failure
  }
};

export default connectDB;