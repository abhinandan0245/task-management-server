import { connect } from "mongoose";

export const connectDb = async () => {
  const DB_URI = process.env.DB_URI;

  if (!DB_URI) {
    console.log("DB_URI is missing!");
    return;
  }

  try {
    const response = await connect(DB_URI);
    console.log("Connected to database with host:", response.connection.host);
  } catch (error) {
    console.log(
      "Error occured while connecting to database, reason:",
      error?.message
    );
    process.exit(1);
  }
};
