import mongoose from "mongoose"; // to connect mongodb
import { envConfig } from "./envConfig";

const url = envConfig?.MONGODB_URL!;
export default async function connectdb() {
  try {
    await mongoose.connect(url);
    console.log("connected to mongodb");
  } catch (error: any) {
    console.log(error.message, "error");
  }
}
