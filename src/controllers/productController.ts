import productModel from "../models/ProductList";
import {Request,Response} from "express"
import fetch from 'node-fetch'

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

const AddProduct=async(req:Request,res:Response)=>{
    try {
        const {name,productId,quantity,status,price,discountPrice,image}=req.body
        const product=await productModel.findOne({productId:productId})
        if(!product){
            const newProduct=await productModel.create({
                name,
                productId,
                quantity,
                status,
                price,
                discountPrice,
                image:[image]
            })
            return res.status(201).send({message:"Product Added"})
        }
        return res.status(400).send({error:"Product id exists"})
    } catch (error) {
        console.log(error)
    }
}


export default {productList,AddProduct}