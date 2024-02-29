import emailOtpController from "../controllers/emailOtpController";
import { Router } from "express";
const otpRouter=Router()

otpRouter.post('/sendOtp',emailOtpController.sendOtp)
otpRouter.get('/getOtp',emailOtpController.getOtp)
otpRouter.post('/verifyOtp',emailOtpController.verifyOtp)

export default otpRouter