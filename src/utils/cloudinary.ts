import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();


cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

export default cloudinary;