import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);

    console.log(
      `MongoDB connection at: ${connection.connection.host}, established`
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
