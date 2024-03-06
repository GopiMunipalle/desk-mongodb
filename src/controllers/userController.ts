import userModel from "../models/user";
import { Request,Response } from "express";
import bcrypt from 'bcrypt'
import Jwt  from "jsonwebtoken";
import {config} from 'dotenv'
import RequestWithUser from "../middlewares/customType";
config()

const SECRET_KEY=process.env.SECRET_KEY


const signUp=async(req:Request,res:Response)=>{
    try {
        const {name,email,password,number}=req.body
        // console.log(req.body)
        const hashedPassword=await bcrypt.hash(password,10)
        // console.log(hashedPassword)
        const user=await userModel.findOne({email:email})
        if(!user){
            const newUser=new userModel({
                name,
                email,
                password:hashedPassword,
                number
            })
            await newUser.save()
            return res.status(201).send({message:"User Created Successfully"})
        }
        return res.status(400).send({error:"User Exists Already"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error:"Internal Server Error"})
    }
}

const login=async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body

        const user=await userModel.findOne({email:email})
        if(!user){
            return res.status(404).send({error:"User not found"})
        }
        const validatePassword=await bcrypt.compare(password,user.password)
        if(!validatePassword){
            return res.status(400).send({error:"Incorrect Password"})
        }
        let payload={email:email}
        const jwtToken=Jwt.sign(payload,(SECRET_KEY as string),{expiresIn:'30d'})
        return res.status(200).send({jwtToken:jwtToken})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

const getLoginUser=async(req:RequestWithUser,res:Response)=>{
    try {
        const email=req.email
        const user=await userModel.findOne({email})
        console.log(user)
        if(!user){
            return res.status(404).send({error:"User not exists"})
        }
        return res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send({error:"Internal Server Error"})
    }
}


export default {signUp,login,getLoginUser}