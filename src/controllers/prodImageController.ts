import { Request,Response } from "express";
import imageModel from "../models/ProdImage";
import productModel from "../models/ProductList";

const uploadImage=async(req:Request,res:Response)=>{
    try {
        const {image,itemId,upload,delItemId}=req.body

        const product=await productModel.findOne({productId:itemId})

        if(!product){
            return res.status(404).send({error:"Product id not found"})
        }
        const newImage=await imageModel.create({
            productId:product.productId,
            image:image
        })
        if(!upload){
            await product.updateOne({
                $pull: { image: { _id:newImage._id } },
            });
            await imageModel.findOneAndDelete({_id:delItemId})
            return res.status(200).send({message:"deleted Successfully"})
        }
        await product.updateOne({
            $push: { image: { _id:newImage._id } },
        });
        console.log(upload)
        

        return res.status(200).send({message:"Product Image Uploaded"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

const getProductsWithImages=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        const images=await productModel.findById(id).populate('image')
        res.send(images)
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}


export default {uploadImage,getProductsWithImages}