import productModel from "../models/ProductList";
import {Request,Response} from "express"
import uploadImages from "./fileController";
import RequestWithUser from "../middlewares/customType";
import userModel from "../models/user";

const AddProduct=async (req: RequestWithUser, res: Response) => {
  try {
    const {name,productId,quantity,status,price,discountPrice}=req.body
 
    var files = req.files as Express.Multer.File[];
 
    if (!files || files.length === 0) {
      return res.status(400).send({ error: "No files provided2" });
    }
    const fileUrls = await uploadImages(files);
    const email=req.email

    const user=await userModel.findOne({email:email})
    if(!user){
      return res.status(400).send({error:"Invalid User"})
    }
    const product=await productModel.create({
        name,
        productId,
        quantity,
        status,
        price,
        discountPrice,
        image:fileUrls
    })
    res.status(201).send({ message: "Files Uploaded", product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

const addImages = async (req:Request, res:Response) => {
  try {
    const {id}=req.params
    console.log('id',id)
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).send({ error: "No files provided3" });
    }
    const fileUrls = await uploadImages(files);
    console.log(fileUrls)

    const product = await productModel.findByIdAndUpdate(
      { _id:id },
      { $push: { image: { $each: fileUrls } } },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    console.log(product);
    return res.status(200).send({ message: "Images successfully added" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};


const deleteImage = async (req:RequestWithUser, res:Response) => {
  try {
    const { productId, url } = req.body;

    const product = await productModel.findByIdAndUpdate(
      { _id: productId },
      { $pull: { image: url } },
      { new: true } 
    );

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    console.log(product);
    return res.status(200).send({ message: "Image successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export default {AddProduct,addImages,deleteImage}