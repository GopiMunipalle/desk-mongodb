import emailModel from "../models/EmailOtp";
import userModel from "../models/user";
import { Request,Response } from "express";
import nodemailer from 'nodemailer'
import { config } from "dotenv";
config()

const transport=nodemailer.createTransport({
    service:process.env.SERVICE,
    auth:{
        user:process.env.USEREMAIL,
        pass:process.env.PASS
    }
})


const sendOtp=async(req:Request,res:Response)=>{
    try {
        const {email}=req.body
        let createdOtp=Math.floor(100000+Math.random()*600000).toString()
        let date=new Date().getTime()
        const user=await userModel.findOne({email:email})
        if(!user){
            return res.status(404).send({error:"User not Exists"})
        }
        const isOtpExist=await emailModel.findOne({email:email})
        if(!isOtpExist){
            const newOtpUser=await emailModel.create({
                email,
                otp:createdOtp,
                createdAt:date
            })
        }else{
            isOtpExist.otp=createdOtp
            isOtpExist.createdAt=new Date(date)
            await isOtpExist.save()
        }
        const mailOptions={
            from:process.env.USER,
            to:email,
            subject:'Otp Verification',
            text:`Your Otp is ${createdOtp}`
        }
        let info=await transport.sendMail(mailOptions)
        return res.status(200).send({message:`Otp sent to ${email}`,info})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

const getOtp=async(req:Request,res:Response)=>{
    try {
        const users=await emailModel.find()
        res.status(200).send(users)
    } catch (error) {
        console.log(error)
        res.status(500).send({error:"Internal Server Error"})
    }
}

const verifyOtp=async(req:Request,res:Response)=>{
    try {
        const {email,otp}=req.body
        const user=await emailModel.findOne({email:email})
        if(!user){
            return res.status(400).send({error:"User not found"})
        }
        const currentTime=new Date().getTime()
        const expirationTime=user.createdAt.getTime()+1*60*1000
        console.log('exp',expirationTime)
        console.log('current',currentTime)
        if(currentTime<=expirationTime){
            const verifyUserOtp=await emailModel.findOne({otp:otp})
            if(!verifyUserOtp){
                return res.status(400).send({error:"Invalid Otp"})
            }
            return res.status(200).send({message:"Otp Verification Successful"})
        }
        return res.status(400).send({message:"Otp timed out"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

export default {sendOtp,getOtp,verifyOtp}