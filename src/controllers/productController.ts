import productModel from "../models/ProductList";
import {Request,Response} from "express"
import fetch from 'node-fetch'
import uploadImages from "./fileController";
import RequestWithUser from "../middlewares/customType";
import userModel from "../models/user";

const productList=async(req:Request,res:Response)=>{
    try {
        const url='https://fakestoreapi.com/products'
        const response=await fetch(url)
        const data=await response.json()
        console.log(data)
        for (let product of data){
            let {id,title,price,image,rating}=product
            let status=''
            let discount=price-(price/5)
            if(id<=10){
                status="In Stock"
                discount=price-(price/10)
            }
            else{
                status="Out Of Stock"
                discount=price-(price/15)
            }
            await productModel.insertMany([{
                name:title,
                productId:id,
                quantity:rating.count,
                status:status,
                price:price,
                discountPrice:discount,
                image:[image]
            }])
        }
        return res.status(200).send({message:"Products Added"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

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
    console.log('files',files)
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

export default {productList,AddProduct,addImages,deleteImage}