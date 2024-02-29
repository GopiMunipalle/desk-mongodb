"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
}, { versionKey: false, timestamps: true });
const emailModel = (0, mongoose_1.model)("EmailOtp", emailSchema);
exports.default = emailModel;
