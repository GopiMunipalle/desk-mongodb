import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import RequestWithUser from "./customType";
import {config} from 'dotenv'
config()
const SECRET_KEY=process.env.SECRET_KEY

export const singUpValidation=(req:Request,res:Response,next:NextFunction)=>{

        let errors:{[keys:string]:string}={}
        // let emailFormate=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        const {name,email,password,number}=req.body
        if(!name || name.trim().length==0){
            errors.name="Enter Name"
        }
        else if(name.length<4){
            errors.name="Name must be containing at least 4 characters"
        }
        else if(!email||email.trim().length==0){
            errors.email="email is Required"
        }
        else if(!password){
            errors.password="Enter Valid Password"
        }
        else if(!number){
            errors.number="Number must be containing 10 digits"
        }
        if(Object.keys(errors).length>0){
            return res.status(400).send(errors)
        }
        next()

}

export const loginValidation=(req:Request,res:Response,next:NextFunction)=>{

        let errors:{[keys:string]:string}={}
        // let emailFormate=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        const {email,password}=req.body

        if(!email||email.trim().length==0){
            errors.email="email is Required"
        }
        else if(!password){
            errors.password="Enter Valid Password"
        }
        
        if(Object.keys(errors).length>0){
            return res.status(400).send(errors)
        }
        next()

}

export const authMiddleware=(req:RequestWithUser,res:Response,next:NextFunction)=>{
    try {
        console.log('aaa')
        let jwtToken=null
        const authHeaders=req.headers['authorization']
        console.log(authHeaders,'dsfsf')
        if(!authHeaders){
            return res.status(400).send({error:"Provide Token"})
        }
        jwtToken=authHeaders.split(' ')[1]
        console.log(jwtToken)
        if(!jwtToken){
            return res.status(400).send({error:"Token not Provided"})
        }
        jwt.verify(jwtToken,(SECRET_KEY as string),(err,payload)=>{
            if(err){
                return res.status(400).send({error:"Invalid Token"})
            }
            req.email=(payload as JwtPayload).email
            console.log((payload as JwtPayload).email)
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({error:"Internal Server Error"})
    }
}


export const addProductMiddleware=(req:Request,res:Response,next:NextFunction)=>{

        const {name,productId,quantity,status,price,discountPrice}=req.body
        const errors=[]
        if(!name || name.trim().length==0){
            errors.push({error:"Name field is Required"})
        }
        else if(!productId  || productId.trim().length==0){
            errors.push({error:"Enter Valid Product id"})
        }
        else if(!quantity){
            errors.push({error:"Enter Quantity"})
        }
        else if(!status ||status.trim().length==0){
            errors.push({error:"Enter Product Status"})
        }
        else if(!price ){
            errors.push({error:"Enter product Price"})
        }
        else if(!discountPrice){
            errors.push({error:"Enter discount price"})
        }
        if(errors&&errors.length>0){
            return res.status(400).send(errors)
        }
        next()
}

