"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailOtp_1 = __importDefault(require("../models/EmailOtp"));
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const transport = nodemailer_1.default.createTransport({
    service: process.env.SERVICE,
    host: process.env.USERMAIL,
    port: 8081,
    auth: {
        user: process.env.USERMAIL,
        pass: process.env.PASS
    }
});
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        let createdOtp = Math.floor(100000 + Math.random() * 600000).toString();
        let date = new Date().getTime();
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ error: "User not Exists" });
        }
        const isOtpExist = yield EmailOtp_1.default.findOne({ email: email });
        if (!isOtpExist) {
            const newOtpUser = yield EmailOtp_1.default.create({
                email,
                otp: createdOtp,
                createdAt: date
            });
        }
        else {
            isOtpExist.otp = createdOtp;
            isOtpExist.createdAt = new Date(date);
            yield isOtpExist.save();
        }
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Otp Verification',
            text: `Your Otp is ${createdOtp}`
        };
        let info = yield transport.sendMail(mailOptions);
        return res.status(200).send({ message: `Otp sent to ${email}`, info });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const getOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield EmailOtp_1.default.find();
        res.status(200).send(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield EmailOtp_1.default.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ error: "User not found" });
        }
        const currentTime = new Date().getTime();
        const expirationTime = user.createdAt.getTime() + 1 * 60 * 1000;
        console.log('exp', expirationTime);
        console.log('current', currentTime);
        if (currentTime <= expirationTime) {
            const verifyUserOtp = yield EmailOtp_1.default.findOne({ otp: otp });
            if (!verifyUserOtp) {
                return res.status(400).send({ error: "Invalid Otp" });
            }
            return res.status(200).send({ message: "Otp Verification Successfull" });
        }
        return res.status(400).send({ message: "Otp timed out" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { sendOtp, getOtp, verifyOtp };
