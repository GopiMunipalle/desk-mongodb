import { Schema,model } from "mongoose";

type emailT={
    email:string,
    otp:string,
    createdAt:Date
}

const emailSchema=new Schema<emailT>({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
},{versionKey:false,timestamps:true})

const emailModel=model<emailT>("EmailOtp",emailSchema)

export default emailModel