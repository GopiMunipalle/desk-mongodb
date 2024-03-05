import nodemailer from 'nodemailer'
import { config } from "dotenv";
config()

const transport=nodemailer.createTransport({
    service:process.env.SERVICE,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

export default transport