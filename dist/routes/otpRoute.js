"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailOtpController_1 = __importDefault(require("../controllers/emailOtpController"));
const express_1 = require("express");
const otpRouter = (0, express_1.Router)();
otpRouter.post('/sendOtp', emailOtpController_1.default.sendOtp);
otpRouter.get('/getOtp', emailOtpController_1.default.getOtp);
otpRouter.post('/verifyOtp', emailOtpController_1.default.verifyOtp);
exports.default = otpRouter;
