import mongoose from "mongoose";

export const connect_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to Database Successfully");
  } catch (error) {
    console.error(
      `Error occurred while connecting to MongoDB:
      '${error.message}'`
    );
    process.exit(1);
  }
};
