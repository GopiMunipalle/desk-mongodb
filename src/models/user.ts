import {model,Schema} from 'mongoose'

type userT={
    name:string;
    email:string;
    password:string;
    number:string;
}

const userSchema=new Schema<userT>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:false
    }
},{versionKey:false,timestamps:true})

const userModel=model<userT>("User",userSchema)
export default userModel