import multer from "multer";
import { Request,Response,NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import stremifier from 'streamifier'
import productModel from "../models/ProductList";
config();

          
cloudinary.config({ 
  cloud_name: process.env.NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET_KEY
});



const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });



const uploadImagesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.files)
    if (!req.files) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }
    
    // let files=req.files
    let files=req.files as Express.Multer.File[]
    const uploadedImages = [];
    console.log(files)
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      console.log(result)
      // file.url = result.secure_url;
      // file.public_id = result.public_id;
      // uploadedImages.push(file);
    }
    // req.files = uploadedImages;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default uploadImagesMiddleware;


