import { Schema,model } from "mongoose";

type productT={
    productId:number
}

const productSchema=new Schema<productT>({
    productId:{
        type:Number,
        required:true
    }
})

const counterModel=model<productT>("Counter",productSchema)
export default counterModel