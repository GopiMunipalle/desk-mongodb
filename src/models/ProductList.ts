import { Schema,Types,model } from "mongoose";

type productT={
    name:string,
    productId:number,
    quantity:number,
    status:string,
    price:number,
    discountPrice:number,
    image:[]
}

const productsSchema=new Schema<productT>({
    name:{
        type:String,
        required:true
    },
    productId:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:false
    },
    status:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    discountPrice:{
        type:Number,
        required:true
    },
    image:{
        type:[],
        required:false
    }
},{versionKey:false,timestamps:true})

const productModel=model('ProductList',productsSchema)
export default productModel