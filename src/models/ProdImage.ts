import { Schema,model } from "mongoose";

type imageT={
    productId:string,
    image:[]
}

const imageSchema=new Schema<imageT>({
    productId:{
        type:String,
        required:true
    },
    image:{
        type:[],
        required:true
    }
},{versionKey:false,timestamps:true})

const imageModel=model<imageT>("ProdImage",imageSchema)
export default imageModel